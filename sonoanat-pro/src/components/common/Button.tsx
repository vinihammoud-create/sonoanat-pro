import type React from 'react';
import { cx } from '@/utils/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  active?: boolean;
  block?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary: 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 font-semibold',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-600 border border-slate-700',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 active:bg-slate-700',
  danger: 'bg-rose-600/20 text-rose-200 border border-rose-600/50 hover:bg-rose-600/30',
  outline: 'bg-transparent text-slate-200 border border-slate-600 hover:bg-slate-800',
};

const SIZE: Record<Size, string> = {
  sm: 'min-h-9 px-2.5 text-xs rounded-md gap-1',
  md: 'min-h-11 px-3.5 text-sm rounded-lg gap-1.5',
  lg: 'min-h-12 px-5 text-base rounded-xl gap-2',
};

export function Button({ variant = 'secondary', size = 'md', active, block, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center whitespace-nowrap transition-colors select-none disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-amber-400',
        VARIANT[variant],
        SIZE[size],
        active && 'ring-2 ring-amber-400/70',
        block && 'w-full',
        className,
      )}
      {...rest}
    />
  );
}
