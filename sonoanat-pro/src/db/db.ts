import Dexie, { type EntityTable } from 'dexie';
import type { BlockOverride, FavoriteRow, GeneratedImageRow, ImageRow, SettingRow } from '@/types';

export class SonoDB extends Dexie {
  overrides!: EntityTable<BlockOverride, 'blockId'>;
  images!: EntityTable<ImageRow, 'id'>;
  generated!: EntityTable<GeneratedImageRow, 'key'>;
  settings!: EntityTable<SettingRow, 'key'>;
  favorites!: EntityTable<FavoriteRow, 'blockId'>;

  constructor(name = 'sonoanat-pro') {
    super(name);
    this.version(1).stores({
      overrides: '&blockId, updatedAt',
      images: '&id, blockId, [blockId+role]',
      generated: '&key, blockId',
      settings: '&key',
      favorites: '&blockId, addedAt',
    });
  }
}

export const db = new SonoDB();
