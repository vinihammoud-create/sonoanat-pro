import type { SearchHit } from '@/data/search';
import { BlockListItem } from '@/components/category/BlockListItem';
import { EmptyState } from '@/components/common/Card';

export function SearchResults({ hits, query }: { hits: SearchHit[]; query: string }) {
  if (hits.length === 0) {
    return <EmptyState icon="search" title={`Nada encontrado para "${query}"`}>Tente outro termo: nome do bloqueio, nervo ou estrutura.</EmptyState>;
  }
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {hits.length} resultado{hits.length > 1 ? 's' : ''}
      </h2>
      <ul className="flex flex-col gap-2">
        {hits.map((h) => (
          <BlockListItem key={h.block.id} block={h.block} />
        ))}
      </ul>
    </section>
  );
}
