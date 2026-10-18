import type { Overlay } from '@/types';
import { db } from '@/db/db';
import { generateUltrasound } from './generate';
import { sceneCacheKey } from './scene';

const inflight = new Map<string, Promise<Blob>>();

/** Obtém do cache (IndexedDB) ou renderiza e armazena a imagem procedural do bloqueio. */
export async function getOrRenderGenerated(blockId: string, overlays: readonly Overlay[], depthCm: number): Promise<Blob> {
  const key = sceneCacheKey(blockId, overlays);
  const pending = inflight.get(key);
  if (pending) return pending;
  const task = (async () => {
    try {
      const row = await db.generated.get(key);
      if (row) return row.blob;
    } catch {
      // IndexedDB indisponível (modo privado etc.): segue sem cache.
    }
    const blob = await generateUltrasound(blockId, overlays, depthCm);
    try {
      await db.transaction('rw', db.generated, async () => {
        await db.generated.where('blockId').equals(blockId).delete();
        await db.generated.put({ key, blockId, blob, createdAt: Date.now() });
      });
    } catch {
      // ignora falhas de cache
    }
    return blob;
  })();
  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}
