import { Link } from 'react-router-dom';
import type { Block } from '@/types';
import { Badge } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { useFavorites, useModifiedBlockIds } from '@/hooks/useSettings';
import { toggleFavorite } from '@/db/repo';
import { BlockThumbnail } from '@/components/viewer/BlockThumbnail';

const MODE_TONE = { A: 'emerald', B: 'emerald', C: 'slate' } as const;
const MODE_TEXT = { A: 'Imagem real', B: 'Par real', C: 'Simulação' } as const;

export function BlockListItem({ block }: { block: Block }) {
  const favorites = useFavorites();
  const modified = useModifiedBlockIds();
  const fav = favorites.has(block.id);
  return (
    <li className="flex items-stretch overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70">
      <Link to={`/b/${block.id}`} className="flex min-h-20 min-w-0 flex-1 items-center gap-3 py-2 pl-2 pr-3 hover:bg-slate-800/60">
        <BlockThumbnail block={block} className="w-24 shrink-0 rounded-lg border border-slate-800" />
        <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-100">{block.name}</p>
        <p className="truncate text-xs text-slate-400">{block.target}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge tone={MODE_TONE[block.images.mode]}>{MODE_TEXT[block.images.mode]}</Badge>
          <Badge tone="sky">{block.ergonomics.probe.split(' ')[0]}</Badge>
          {modified.has(block.id) && <Badge tone="amber">editado</Badge>}
        </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => void toggleFavorite(block.id)}
        aria-pressed={fav}
        aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className="flex w-12 shrink-0 items-center justify-center border-l border-slate-800 text-amber-300 hover:bg-slate-800"
      >
        <Icon name={fav ? 'starFilled' : 'star'} size={20} />
      </button>
    </li>
  );
}
