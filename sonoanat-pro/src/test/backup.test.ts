// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db/db';
import { buildBackup, importBackup } from '@/db/backup';
import { saveOverlays, toggleFavorite, setSetting, resetBlock, getOverride } from '@/db/repo';
import { base64ToBlob, blobToBase64 } from '@/db/blobs';
import type { ImageRow, Overlay } from '@/types';

const overlay: Overlay = { id: 'u-1', type: 'nerve', label: 'N. teste', points: '100,100 200,100 200,200 100,200', label_pos: { x: 150, y: 150 }, note: 'n' };

async function clearAll() {
  await db.transaction('rw', db.overrides, db.images, db.generated, db.settings, db.favorites, async () => {
    await Promise.all([db.overrides.clear(), db.images.clear(), db.generated.clear(), db.settings.clear(), db.favorites.clear()]);
  });
}

describe('backup', () => {
  beforeEach(clearAll);

  it('base64 round-trip preserva bytes', async () => {
    const bytes = new Uint8Array(70000).map((_, i) => (i * 7) % 256);
    const b64 = await blobToBase64(new Blob([bytes], { type: 'image/png' }));
    const back = new Uint8Array(await base64ToBlob(b64, 'image/png').arrayBuffer());
    expect(back).toEqual(bytes);
  });

  it('export → import (replace) reproduz overrides, imagens, favoritos e settings', async () => {
    await saveOverlays('femoral', [overlay]);
    await toggleFavorite('femoral');
    await setSetting('defaultOpacity', 42);
    const img: ImageRow = {
      id: 'img-1', blockId: 'femoral', role: 'base', blob: new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/png' }),
      mime: 'image/png', width: 2, height: 2, createdAt: 1,
    };
    await db.images.add(img);
    await db.overrides.update('femoral', { images: { mode: 'A', baseImageId: 'img-1' } });

    const backup = await buildBackup();
    expect(backup.app).toBe('sonoanat-pro');
    expect(backup.overrides).toHaveLength(1);
    expect(backup.images).toHaveLength(1);

    await clearAll();
    expect(await db.overrides.count()).toBe(0);

    const json = JSON.stringify(backup);
    const r = await importBackup(json, 'replace');
    expect(r).toEqual({ overrides: 1, images: 1, favorites: 1, settings: 1 });
    const ov = await getOverride('femoral');
    expect(ov?.overlays).toEqual([overlay]);
    expect(ov?.images?.baseImageId).toBe('img-1');
    const row = await db.images.get('img-1');
    expect(await blobToBase64(row!.blob)).toBe(await blobToBase64(img.blob));
    expect((await db.favorites.toArray()).map((f) => f.blockId)).toEqual(['femoral']);
    expect((await db.settings.get('defaultOpacity'))?.value).toBe(42);
  });

  it('import rejeita arquivos inválidos', async () => {
    await expect(importBackup('{"app":"outro"}', 'merge')).rejects.toThrow(/Backup inválido/);
    await expect(importBackup('não é json', 'merge')).rejects.toThrow(/JSON/);
  });

  it('merge mantém dados existentes e resetBlock limpa o bloco', async () => {
    await saveOverlays('tap_block', [overlay]);
    const backup = await buildBackup();
    await saveOverlays('femoral', [overlay]);
    await importBackup(JSON.stringify(backup), 'merge');
    expect(await db.overrides.count()).toBe(2);
    await resetBlock('femoral');
    expect(await db.overrides.count()).toBe(1);
    expect(await getOverride('tap_block')).toBeTruthy();
  });
});
