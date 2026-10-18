import { useMemo } from 'react';
import type { Block } from '@/types';
import { VIEWBOX } from '@/types';
import { LAYER_STYLES, layerZ } from '@/constants/layers';
import { useGeneratedImage } from '@/hooks/useGeneratedImage';

/** Miniatura 4:3 do bloqueio: imagem real (A/B) ou simulação (C) com overlays reduzidos. */
export function BlockThumbnail({ block, className }: { block: Block; className?: string }) {
  const real = block.images.mode !== 'C' && !!block.images.baseUrl;
  const generated = useGeneratedImage(block.id, block.overlays, block.ergonomics.depthCm, !real);
  const src = real ? block.images.baseUrl : generated.url;
  const shapes = useMemo(
    () => block.overlays.filter((o) => o.type !== 'needle' && o.type !== 'la_spread' && o.type !== 'fascia').sort((a, b) => layerZ(a.type) - layerZ(b.type)),
    [block.overlays],
  );
  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-black ${className ?? ''}`} aria-hidden="true">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="h-full w-full animate-pulse bg-slate-800" />}
      <svg viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-80">
        {shapes.map((o) => (
          <polygon key={o.id} points={o.points} fill={LAYER_STYLES[o.type].fill} stroke={LAYER_STYLES[o.type].stroke} strokeWidth={6} strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
}
