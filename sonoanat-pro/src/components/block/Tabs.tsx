import { Icon, type IconName } from '@/components/common/Icon';
import { cx } from '@/utils/format';

export type BlockTab = 'sonoanatomia' | 'ergonomia' | 'clinico';
export const BLOCK_TABS: ReadonlyArray<{ id: BlockTab; label: string; icon: IconName }> = [
  { id: 'sonoanatomia', label: 'Sonoanatomia', icon: 'layers' },
  { id: 'ergonomia', label: 'Ergonomia & Probe', icon: 'probe' },
  { id: 'clinico', label: 'Doses & Guia', icon: 'pill' },
];

export function isBlockTab(v: string | undefined): v is BlockTab {
  return v === 'sonoanatomia' || v === 'ergonomia' || v === 'clinico';
}

export function Tabs({ active, onChange }: { active: BlockTab; onChange: (t: BlockTab) => void }) {
  return (
    <div role="tablist" aria-label="Seções do bloqueio" className="mb-3 grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
      {BLOCK_TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[11px] font-semibold transition-colors sm:flex-row sm:gap-1.5 sm:text-xs',
            active === t.id ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800',
          )}
        >
          <Icon name={t.icon} size={16} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
