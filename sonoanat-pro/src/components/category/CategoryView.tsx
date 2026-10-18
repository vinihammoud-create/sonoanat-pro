import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { CATEGORY_BY_ID } from '@/data/categories';
import { blocksOfCategory } from '@/data/blocks';
import { BlockListItem } from './BlockListItem';
import { EmptyState } from '@/components/common/Card';

export function CategoryView() {
  const { categoryId = '' } = useParams();
  const category = CATEGORY_BY_ID.get(categoryId);
  if (!category) {
    return (
      <div>
        <TopBar title="Região" showBack backTo="/" />
        <EmptyState icon="warning" title="Região não encontrada" />
      </div>
    );
  }
  const blocks = blocksOfCategory(category.id);
  return (
    <div>
      <TopBar title={category.title} subtitle={category.subtitle} showBack backTo="/" />
      <div className="relative mb-4 h-36 overflow-hidden rounded-xl border border-slate-800">
        <img src={category.bannerUrl} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
      </div>
      <ul className="flex flex-col gap-2">
        {blocks.map((b) => (
          <BlockListItem key={b.id} block={b} />
        ))}
      </ul>
    </div>
  );
}
