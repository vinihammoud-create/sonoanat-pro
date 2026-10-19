import { Icon, type IconName } from '@/components/common/Icon';
import { cx } from '@/utils/format';

/** Vistas de um bloqueio (trilho estilo AnSo): sonoanatomia, ergonomia (fotos do paciente/probe) e notas. */
export type BlockTab = 'sonoanatomia' | 'ergonomia' | 'notas';

export interface RailItem {
  id: BlockTab;
  label: string;
  icon: IconName;
  /** Quantidade de imagens disponíveis (mostrada como pontinhos). */
  count?: number;
}

export function isBlockTab(v: string | undefined): v is BlockTab {
  return v === 'sonoanatomia' || v === 'ergonomia' || v === 'notas';
}

/** Aceita os nomes antigos de aba em links salvos. */
export function normalizeTab(v: string | undefined): BlockTab {
  if (v === 'clinico') return 'notas';
  return isBlockTab(v) ? v : 'sonoanatomia';
}

export function Tabs({ items, active, onChange }: { items: RailItem[]; active: BlockTab; onChange: (t: BlockTab) => void }) {
  return (
    <div role="tablist" aria-label="Vistas do bloqueio" className="mb-3 flex gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 md:flex-col md:w-20">
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[11px] font-semibold transition-colors md:min-h-16',
            active === t.id ? 'bg-slate-100 text-slate-950' : 'text-slate-300 hover:bg-slate-800',
          )}
        >
          <span className="relative">
            <Icon name={t.icon} size={20} />
            {t.count !== undefined && t.count > 0 && (
              <span className="absolute -right-2 -top-1 flex gap-0.5">
                {Array.from({ length: Math.min(t.count, 4) }).map((_, i) => (
                  <span key={i} className={cx('h-1.5 w-1.5 rounded-full', active === t.id ? 'bg-slate-900' : 'bg-slate-400')} />
                ))}
              </span>
            )}
          </span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
