import type { EffectiveBlock } from '@/types';
import { useObjectUrl } from '@/db/blobs';
import { findUserImage } from '@/db/merge';
import { Icon } from '@/components/common/Icon';

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

/** Imagem real de fundo do viewer (built-in ou carregada pelo usuário). */
export function BaseLayer({ block, flipped, pairOpacity, hideAnnotated, overrideBaseUrl }: BaseLayerProps) {
  const { images, userImages } = block;
  const baseRow = findUserImage(userImages, images.baseImageId);
  const annotatedRow = findUserImage(userImages, images.annotatedImageId);
  const baseUserUrl = useObjectUrl(baseRow?.blob);
  const annotatedUserUrl = useObjectUrl(annotatedRow?.blob);

  const baseUrl = overrideBaseUrl ?? baseUserUrl ?? images.baseUrl ?? null;
  const annotatedUrl = images.mode === 'B' ? annotatedUserUrl ?? images.annotatedUrl ?? null : null;
  const flipStyle = flipped ? { transform: 'scaleX(-1)' } : undefined;

  return (
    <div className="absolute inset-0 bg-black" style={flipStyle} aria-hidden="true">
      {baseUrl ? (
        <img src={baseUrl} alt="" draggable={false} className="h-full w-full select-none object-contain" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 text-slate-500">
          <Icon name="image" size={36} />
          <p className="text-xs">Imagem real em preparação</p>
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
