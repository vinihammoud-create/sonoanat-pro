import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';

export interface TopBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  right?: React.ReactNode;
}

export function TopBar({ title, subtitle, showBack, backTo, right }: TopBarProps) {
  const navigate = useNavigate();
  const goBack = () => {
    if (backTo) navigate(backTo);
    else if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-3 flex min-h-14 items-center gap-2 border-b border-slate-800 bg-slate-950/90 px-2 backdrop-blur">
      {showBack ? (
        <button
          type="button"
          onClick={goBack}
          aria-label="Voltar"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-200 hover:bg-slate-800"
        >
          <Icon name="back" size={22} />
        </button>
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center text-amber-400">
          <Icon name="logo" size={24} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-1 pr-1">{right}</div>}
    </header>
  );
}
