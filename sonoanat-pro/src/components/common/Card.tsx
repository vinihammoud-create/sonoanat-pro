import type React from 'react';
import { cx } from '@/utils/format';
import { Icon, type IconName } from './Icon';

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('rounded-xl border border-slate-800 bg-slate-900/70 p-4', className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({ icon, children, className }: { icon?: IconName; children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cx('mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-300', className)}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </h3>
  );
}

export function Badge({ children, tone = 'slate', className }: { children: React.ReactNode; tone?: 'slate' | 'amber' | 'sky' | 'emerald' | 'rose' | 'violet'; className?: string }) {
  const tones = {
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    sky: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
  } as const;
  return (
    <span className={cx('inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold', tones[tone], className)}>
      {children}
    </span>
  );
}

export function WarningBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-600/50 bg-amber-950/40 p-3">
      <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-amber-300">
        <Icon name="warning" size={16} />
        {title}
      </p>
      <div className="text-sm leading-relaxed text-amber-100/90">{children}</div>
    </div>
  );
}

export function EmptyState({ icon = 'info', title, children }: { icon?: IconName; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 p-8 text-center">
      <Icon name={icon} size={28} className="text-slate-500" />
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      {children && <div className="text-xs text-slate-400">{children}</div>}
    </div>
  );
}
