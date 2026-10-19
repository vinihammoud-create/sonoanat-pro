import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { useEffectiveBlock } from '@/hooks/useEffectiveBlock';
import { Tabs, normalizeTab, type BlockTab, type RailItem } from './Tabs';
import { SonoanatomyTab } from './SonoanatomyTab';
import { NotesTab } from './NotesTab';
import { ProbeView } from '@/components/viewer/ProbeView';
import { EmptyState } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { useFavorites } from '@/hooks/useSettings';
import { toggleFavorite } from '@/db/repo';
import { CATEGORY_BY_ID } from '@/data/categories';
import { cx } from '@/utils/format';

const ORDER: BlockTab[] = ['sonoanatomia', 'ergonomia', 'notas'];

export function BlockPage() {
  const { blockId, tab } = useParams();
  const navigate = useNavigate();
  const { block, notFound } = useEffectiveBlock(blockId);
  const active = normalizeTab(tab);
  const favorites = useFavorites();
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [probeIndex, setProbeIndex] = useState(0);

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

  const probes = block.probeImages ?? [];
  const items: RailItem[] = [
    { id: 'sonoanatomia', label: 'Sonoanatomia', icon: 'layers', count: block.images.baseUrl ? 1 + (block.gallery?.length ?? 0) : 0 },
    { id: 'ergonomia', label: 'Ergonomia', icon: 'probe', count: probes.length },
    { id: 'notas', label: 'Notas', icon: 'book' },
  ];

  const idx = ORDER.indexOf(active);
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
    if ((e.target as Element).closest('[data-no-swipe]')) return;
    const next = ORDER[dx < 0 ? idx + 1 : idx - 1];
    if (next) setTab(next);
  };

  const category = CATEGORY_BY_ID.get(block.categoryId);
  const fav = favorites.has(block.id);

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TopBar
        title={block.name}
        subtitle={`${category?.title ?? ''} · ${block.subtitle}`}
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
            <Link to={`/studio/${block.id}`} aria-label="Editar no Estúdio" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800">
              <Icon name="studio" size={20} />
            </Link>
          </>
        }
      />
      <div className="md:flex md:gap-4">
        <Tabs items={items} active={active} onChange={setTab} />
        <div className="min-w-0 flex-1">
          {active === 'sonoanatomia' && <SonoanatomyTab block={block} />}
          {active === 'ergonomia' && (
            <div>
              {probes.length > 1 && (
                <div className="mb-2 flex gap-1.5">
                  {probes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProbeIndex(i)}
                      className={cx('min-h-9 rounded-lg border px-3 text-xs font-semibold', probeIndex === i ? 'border-slate-100 bg-slate-100 text-slate-950' : 'border-slate-700 text-slate-300')}
                    >
                      Foto {i + 1}
                    </button>
                  ))}
                </div>
              )}
              <ProbeView block={block} image={probes[Math.min(probeIndex, Math.max(0, probes.length - 1))]} />
            </div>
          )}
          {active === 'notas' && <NotesTab block={block} />}
        </div>
      </div>
    </div>
  );
}
