import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { BLOCK_BY_ID } from '@/data/blocks';
import { resolveBlock } from '@/db/merge';
import type { EffectiveBlock } from '@/types';

export interface EffectiveBlockState {
  block: EffectiveBlock | null;
  /** true enquanto a primeira consulta ao IndexedDB não retornou. */
  loading: boolean;
  notFound: boolean;
}

/** Bloco built-in + override do usuário (reativo via Dexie liveQuery). */
export function useEffectiveBlock(blockId: string | undefined): EffectiveBlockState {
  const builtin = blockId ? BLOCK_BY_ID.get(blockId) : undefined;
  const result = useLiveQuery(
    async () => {
      if (!blockId || !builtin) return null;
      const [override, images] = await Promise.all([
        db.overrides.get(blockId),
        db.images.where('blockId').equals(blockId).toArray(),
      ]);
      return resolveBlock(builtin, override, images);
    },
    [blockId],
    undefined,
  );
  if (!builtin) return { block: null, loading: false, notFound: true };
  if (result === undefined) return { block: resolveBlock(builtin, undefined, []), loading: true, notFound: false };
  return { block: result, loading: false, notFound: false };
}
