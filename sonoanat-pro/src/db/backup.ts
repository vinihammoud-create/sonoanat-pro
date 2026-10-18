import { db } from './db';
import type { BackupFile, BackupImage, ImageRow } from '@/types';
import { validateBackup } from '@/data/validate';
import { base64ToBlob, blobToBase64 } from './blobs';

export const MAX_BACKUP_BYTES = 200 * 1024 * 1024;

export async function buildBackup(): Promise<BackupFile> {
  const [overrides, images, settings, favorites] = await Promise.all([
    db.overrides.toArray(),
    db.images.toArray(),
    db.settings.toArray(),
    db.favorites.toArray(),
  ]);
  const encoded: BackupImage[] = [];
  for (const im of images) {
    const { blob, ...rest } = im;
    encoded.push({ ...rest, dataBase64: await blobToBase64(blob) });
  }
  return {
    app: 'sonoanat-pro',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    overrides,
    images: encoded,
    settings,
    favorites,
  };
}

export async function exportBackupBlob(): Promise<Blob> {
  const data = await buildBackup();
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}

export type ImportMode = 'merge' | 'replace';

export interface ImportResult {
  overrides: number;
  images: number;
  favorites: number;
  settings: number;
}

export async function importBackup(input: string | BackupFile, mode: ImportMode): Promise<ImportResult> {
  let data: unknown;
  if (typeof input === 'string') {
    if (input.length > MAX_BACKUP_BYTES) throw new Error('Arquivo de backup grande demais (limite 200 MB).');
    try {
      data = JSON.parse(input);
    } catch {
      throw new Error('O arquivo não é um JSON válido.');
    }
  } else {
    data = input;
  }
  const issues = validateBackup(data);
  if (issues.length) {
    throw new Error(`Backup inválido: ${issues.slice(0, 5).map((i) => `${i.path}: ${i.message}`).join('; ')}`);
  }
  const backup = data as BackupFile;
  const images: ImageRow[] = backup.images.map((im) => {
    const { dataBase64, ...rest } = im;
    return { ...rest, blob: base64ToBlob(dataBase64, im.mime) };
  });
  await db.transaction('rw', db.overrides, db.images, db.generated, db.settings, db.favorites, async () => {
    if (mode === 'replace') {
      await Promise.all([db.overrides.clear(), db.images.clear(), db.generated.clear(), db.settings.clear(), db.favorites.clear()]);
    } else {
      // Em modo mesclar, as imagens de blocos importados substituem as existentes desses blocos.
      const blockIds = new Set(images.map((i) => i.blockId));
      for (const id of blockIds) await db.images.where('blockId').equals(id).delete();
      const overrideIds = backup.overrides.map((o) => o.blockId);
      await db.generated.where('blockId').anyOf(overrideIds).delete();
    }
    await db.overrides.bulkPut(backup.overrides);
    await db.images.bulkPut(images);
    await db.settings.bulkPut(backup.settings);
    await db.favorites.bulkPut(backup.favorites);
  });
  return {
    overrides: backup.overrides.length,
    images: images.length,
    favorites: backup.favorites.length,
    settings: backup.settings.length,
  };
}
