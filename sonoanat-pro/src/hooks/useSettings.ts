import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { DEFAULT_SETTINGS, type AppSettings } from '@/types';

export function useSettings(): AppSettings {
  const rows = useLiveQuery(() => db.settings.toArray(), [], undefined);
  const out: AppSettings = { ...DEFAULT_SETTINGS };
  if (!rows) return out;
  for (const r of rows) {
    if (r.key === 'defaultOpacity' && typeof r.value === 'number') out.defaultOpacity = r.value;
    if (r.key === 'defaultLabelsOn' && typeof r.value === 'boolean') out.defaultLabelsOn = r.value;
    if (r.key === 'defaultFlipped' && typeof r.value === 'boolean') out.defaultFlipped = r.value;
  }
  return out;
}

export function useFavorites(): Set<string> {
  const rows = useLiveQuery(() => db.favorites.toArray(), [], []);
  return new Set((rows ?? []).map((r) => r.blockId));
}

export function useModifiedBlockIds(): Set<string> {
  const rows = useLiveQuery(() => db.overrides.toArray(), [], []);
  return new Set((rows ?? []).map((r) => r.blockId));
}
