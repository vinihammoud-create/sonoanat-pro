import { useEffect, useRef } from 'react';
import type React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { useEffectiveBlock } from '@/hooks/useEffectiveBlock';
import { BLOCK_TABS, Tabs, isBlockTab, type BlockTab } from './Tabs';
import { SonoanatomyTab } from './SonoanatomyTab';
import { ErgonomicsTab } from './ErgonomicsTab';
import { ClinicalTab } from './ClinicalTab';
import { EmptyState } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { useFavorites } from '@/hooks/useSettings';
import { toggleFavorite } from '@/db/repo';
import { CATEGORY_BY_ID } from '@/data/categories';

export function BlockPage() {
  const { blockId, tab } = useParams();
  const navigate = useNavigate();
  const { block, notFound } = useEffectiveBlock(blockId);
  const active: BlockTab = isBlockTab(tab) ? tab : 'sonoanatomia';
  const favorites = useFavorites();
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    document.title = block ? `${block.shortName} · SonoAnat Pro` : 'SonoAnat Pro';
    return () => {
      document.title = 'SonoAnat Pro';
    };
  }, [block]);

  const setTab = (t: BlockTab) => navigate(`/b/${blockId}/${t}`, { replace: true });

  if (notFound || !block) {
    return (
      <div>
        <TopBar title="Bloqueio" showBack backTo="/" />
        <EmptyState icon="warning" title="Bloqueio não encontrado" />
      </div>
    );
  }

  const idx = BLOCK_TABS.findIndex((t) => t.id === active);
  const onTouchStart = (e: React.TouchEvent) => {
    swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    // Não troca de aba quando o gesto começa dentro do viewer (pan/zoom).
    if ((e.target as Element).closest('[data-no-swipe]')) return;
    const next = BLOCK_TABS[dx < 0 ? idx + 1 : idx - 1];
    if (next) setTab(next.id);
  };

  const category = CATEGORY_BY_ID.get(block.categoryId);
  const fav = favorites.has(block.id);

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TopBar
        title={block.shortName}
        subtitle={category?.title}
        showBack
        backTo={`/c/${block.categoryId}`}
        right={
          <>
            <button
              type="button"
              onClick={() => void toggleFavorite(block.id)}
              aria-pressed={fav}
              aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-amber-300 hover:bg-slate-800"
            >
              <Icon name={fav ? 'starFilled' : 'star'} size={20} />
            </button>
            <Link to={`/studio/${block.id}`} aria-label="Abrir no Estúdio" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800">
              <Icon name="studio" size={20} />
            </Link>
          </>
        }
      />
      <h2 className="mb-0.5 text-lg font-semibold leading-tight">{block.name}</h2>
      <p className="mb-3 text-xs text-slate-400">{block.subtitle}</p>
      <Tabs active={active} onChange={setTab} />
      {active === 'sonoanatomia' && <SonoanatomyTab block={block} />}
      {active === 'ergonomia' && <ErgonomicsTab block={block} />}
      {active === 'clinico' && <ClinicalTab block={block} />}
    </div>
  );
}
