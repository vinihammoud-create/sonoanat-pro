import { db } from './db';
import type { AppSettings, Attribution, BlockOverride, ImageRow, ImageSet, Overlay } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { validateImageSet, validateOverlays } from '@/data/validate';
import { normalizeImage } from './blobs';

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOverride(blockId: string): Promise<BlockOverride | undefined> {
  return db.overrides.get(blockId);
}

export async function listUserImages(blockId: string): Promise<ImageRow[]> {
  return db.images.where('blockId').equals(blockId).toArray();
}

/** Salva o conjunto completo de overlays do bloco como override do usuário. */
export async function saveOverlays(blockId: string, overlays: Overlay[]): Promise<void> {
  const issues = validateOverlays(overlays);
  if (issues.length) throw new Error(`Overlays inválidos: ${issues.map((i) => `${i.path}: ${i.message}`).join('; ')}`);
  await db.transaction('rw', db.overrides, db.generated, async () => {
    const existing = await db.overrides.get(blockId);
    await db.overrides.put({ ...(existing ?? {}), blockId, overlays, updatedAt: Date.now() });
    await db.generated.where('blockId').equals(blockId).delete();
  });
}

/** Remove apenas o override de overlays (mantém imagens do usuário). */
export async function clearOverlayOverride(blockId: string): Promise<void> {
  await db.transaction('rw', db.overrides, db.generated, async () => {
    const existing = await db.overrides.get(blockId);
    if (!existing) return;
    if (existing.images) {
      const { overlays: _o, ...rest } = existing;
      void _o;
      await db.overrides.put({ ...rest, updatedAt: Date.now() });
    } else {
      await db.overrides.delete(blockId);
    }
    await db.generated.where('blockId').equals(blockId).delete();
  });
}

export interface SaveImagePairInput {
  base: Blob;
  annotated?: Blob;
  attribution?: Attribution;
}

/** Salva imagem base (+ anotada opcional) do usuário e configura o modo A/B. */
export async function saveImagePair(blockId: string, input: SaveImagePairInput): Promise<ImageSet> {
  const base = await normalizeImage(input.base);
  const annotated = input.annotated ? await normalizeImage(input.annotated) : null;
  const now = Date.now();
  const baseRow: ImageRow = {
    id: newId(), blockId, role: 'base', blob: base.blob, mime: base.mime,
    width: base.width, height: base.height, attribution: input.attribution, createdAt: now,
  };
  const annotatedRow: ImageRow | null = annotated
    ? { id: newId(), blockId, role: 'annotated', blob: annotated.blob, mime: annotated.mime, width: annotated.width, height: annotated.height, createdAt: now }
    : null;
  const images: ImageSet = {
    mode: annotatedRow ? 'B' : 'A',
    baseImageId: baseRow.id,
    annotatedImageId: annotatedRow?.id,
    attribution: input.attribution,
  };
  const issues = validateImageSet(images);
  if (issues.length) throw new Error(issues.map((i) => i.message).join('; '));
  await db.transaction('rw', db.overrides, db.images, async () => {
    await db.images.where('blockId').equals(blockId).delete();
    await db.images.add(baseRow);
    if (annotatedRow) await db.images.add(annotatedRow);
    const existing = await db.overrides.get(blockId);
    await db.overrides.put({ ...(existing ?? {}), blockId, images, updatedAt: now });
  });
  return images;
}

/** Remove as imagens do usuário do bloco (volta ao conjunto built-in). */
export async function clearImageOverride(blockId: string): Promise<void> {
  await db.transaction('rw', db.overrides, db.images, async () => {
    await db.images.where('blockId').equals(blockId).delete();
    const existing = await db.overrides.get(blockId);
    if (!existing) return;
    if (existing.overlays) {
      const { images: _i, ...rest } = existing;
      void _i;
      await db.overrides.put({ ...rest, updatedAt: Date.now() });
    } else {
      await db.overrides.delete(blockId);
    }
  });
}

/** Restaura o bloco ao padrão built-in: apaga override, imagens e cache. */
export async function resetBlock(blockId: string): Promise<void> {
  await db.transaction('rw', db.overrides, db.images, db.generated, async () => {
    await db.overrides.delete(blockId);
    await db.images.where('blockId').equals(blockId).delete();
    await db.generated.where('blockId').equals(blockId).delete();
  });
}

/** Apaga todos os dados do usuário. */
export async function resetAll(): Promise<void> {
  await db.transaction('rw', db.overrides, db.images, db.generated, db.settings, db.favorites, async () => {
    await Promise.all([db.overrides.clear(), db.images.clear(), db.generated.clear(), db.settings.clear(), db.favorites.clear()]);
  });
}

export async function toggleFavorite(blockId: string): Promise<boolean> {
  return db.transaction('rw', db.favorites, async () => {
    const existing = await db.favorites.get(blockId);
    if (existing) {
      await db.favorites.delete(blockId);
      return false;
    }
    await db.favorites.add({ blockId, addedAt: Date.now() });
    return true;
  });
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.settings.toArray();
  const out: AppSettings = { ...DEFAULT_SETTINGS };
  for (const r of rows) {
    if (r.key === 'defaultOpacity' && typeof r.value === 'number') out.defaultOpacity = r.value;
    if (r.key === 'defaultLabelsOn' && typeof r.value === 'boolean') out.defaultLabelsOn = r.value;
    if (r.key === 'defaultFlipped' && typeof r.value === 'boolean') out.defaultFlipped = r.value;
  }
  return out;
}

export async function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
  await db.settings.put({ key, value });
}

export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
  const e = await navigator.storage.estimate();
  return { usage: e.usage ?? 0, quota: e.quota ?? 0 };
}
