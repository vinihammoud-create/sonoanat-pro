import type { Block } from '@/types';
import { Icon } from '@/components/common/Icon';

/** Miniatura 4:3 do bloqueio: imagem real limpa ou marcador neutro. */
export function BlockThumbnail({ block, className }: { block: Block; className?: string }) {
  const src = block.images.baseUrl;
  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-black ${className ?? ''}`} aria-hidden="true">
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600">
          <Icon name="image" size={22} />
        </div>
      )}
    </div>
  );
}
