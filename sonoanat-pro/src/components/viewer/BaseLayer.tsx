import type { EffectiveBlock } from '@/types';
import { useGeneratedImage } from '@/hooks/useGeneratedImage';
import { useObjectUrl } from '@/db/blobs';
import { findUserImage } from '@/db/merge';

export interface BaseLayerProps {
  block: EffectiveBlock;
  flipped: boolean;
  /** 0–1, opacidade da imagem anotada (modo B). */
  pairOpacity: number;
  /** Força esconder a imagem anotada (ex.: "segure: US puro"). */
  hideAnnotated?: boolean;
  /** Substitui a imagem base (Estúdio: pré-visualização de upload). */
  overrideBaseUrl?: string | null;
}

/** Imagem de fundo do viewer: real (A/B) ou procedural (C). */
export function BaseLayer({ block, flipped, pairOpacity, hideAnnotated, overrideBaseUrl }: BaseLayerProps) {
  const { images, userImages } = block;
  const baseRow = findUserImage(userImages, images.baseImageId);
  const annotatedRow = findUserImage(userImages, images.annotatedImageId);
  const baseUserUrl = useObjectUrl(baseRow?.blob);
  const annotatedUserUrl = useObjectUrl(annotatedRow?.blob);

  const hasReal = images.mode !== 'C' && (!!images.baseUrl || !!baseUserUrl || !!overrideBaseUrl);
  const generated = useGeneratedImage(block.id, block.overlays, block.ergonomics.depthCm, !hasReal && !overrideBaseUrl);

  const baseUrl = overrideBaseUrl ?? (images.mode === 'C' ? generated.url : baseUserUrl ?? images.baseUrl ?? generated.url);
  const annotatedUrl = images.mode === 'B' ? annotatedUserUrl ?? images.annotatedUrl ?? null : null;
  const flipStyle = flipped ? { transform: 'scaleX(-1)' } : undefined;

  return (
    <div className="absolute inset-0 bg-black" style={flipStyle} aria-hidden="true">
      {baseUrl ? (
        <img src={baseUrl} alt="" draggable={false} className="h-full w-full select-none object-contain" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
          {generated.error ? `Erro: ${generated.error}` : 'Gerando imagem…'}
        </div>
      )}
      {annotatedUrl && (
        <img
          src={annotatedUrl}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-150"
          style={{ opacity: hideAnnotated ? 0 : pairOpacity }}
        />
      )}
    </div>
  );
}
