import type { Block, BlockOverride, EffectiveBlock, ImageRow } from '@/types';

/** Aplica o override do usuário (se houver) sobre o bloco built-in. */
export function resolveBlock(builtin: Block, override: BlockOverride | undefined, userImages: ImageRow[]): EffectiveBlock {
  const overlays = override?.overlays ?? builtin.overlays;
  const images = override?.images ?? builtin.images;
  return {
    ...builtin,
    overlays,
    images,
    isModified: !!override,
    userImages,
  };
}

/** Encontra a imagem do usuário referenciada por um ImageSet. */
export function findUserImage(userImages: ImageRow[], id: string | undefined): ImageRow | undefined {
  if (!id) return undefined;
  return userImages.find((r) => r.id === id);
}
