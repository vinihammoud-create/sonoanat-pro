import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/data/categories';
import { Icon } from '@/components/common/Icon';

export function CategoryGrid() {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Regiões</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link
              to={`/c/${c.id}`}
              className="group relative block min-h-28 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <img src={c.bannerUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="relative flex h-full min-h-28 flex-col justify-end p-3">
                <p className="text-base font-semibold text-white">{c.title}</p>
                <p className="text-xs text-slate-300">{c.subtitle}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-300">
                  {c.blockIds.length} técnicas <Icon name="chevronRight" size={12} />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
