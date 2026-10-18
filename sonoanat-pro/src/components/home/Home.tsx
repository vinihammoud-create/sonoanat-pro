import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { CategoryGrid } from './CategoryGrid';
import { SearchResults } from './SearchResults';
import { BUILTIN_BLOCKS } from '@/data/blocks';
import { searchBlocks } from '@/data/search';
import { Icon } from '@/components/common/Icon';
import { useFavorites } from '@/hooks/useSettings';
import { BlockListItem } from '@/components/category/BlockListItem';

export function Home() {
  const [query, setQuery] = useState('');
  const hits = useMemo(() => searchBlocks(BUILTIN_BLOCKS, query), [query]);
  const favorites = useFavorites();
  const favBlocks = BUILTIN_BLOCKS.filter((b) => favorites.has(b.id));
  const searching = query.trim().length >= 2;

  return (
    <div>
      <TopBar
        title="SonoAnat Pro"
        subtitle="Sonoanatomia e bloqueios guiados por ultrassom"
        right={
          <>
            <Link to="/backup" aria-label="Backup" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800">
              <Icon name="backup" size={20} />
            </Link>
            <Link to="/settings" aria-label="Configurações" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800">
              <Icon name="settings" size={20} />
            </Link>
          </>
        }
      />
      <label className="mb-4 flex min-h-12 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 focus-within:border-amber-400">
        <Icon name="search" size={18} className="shrink-0 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar bloqueio, nervo, estrutura…"
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          aria-label="Buscar"
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca" className="text-slate-400">
            <Icon name="close" size={16} />
          </button>
        )}
      </label>

      {searching ? (
        <SearchResults hits={hits} query={query} />
      ) : (
        <>
          {favBlocks.length > 0 && (
            <section className="mb-5">
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-300">
                <Icon name="starFilled" size={14} /> Favoritos
              </h2>
              <ul className="flex flex-col gap-2">
                {favBlocks.map((b) => (
                  <BlockListItem key={b.id} block={b} />
                ))}
              </ul>
            </section>
          )}
          <CategoryGrid />
          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">
            Material educativo para profissionais. Confira sempre doses máximas por peso e as diretrizes locais.{' '}
            <Link to="/licenses" className="underline">
              Licenças e fontes
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
