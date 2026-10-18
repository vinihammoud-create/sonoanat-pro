import type React from 'react';
import { LAYER_STYLES } from '@/constants/layers';
import { Icon } from '@/components/common/Icon';
import { parsePoints } from '@/utils/geometry';
import { cx } from '@/utils/format';
import type { StudioAction, StudioState } from './useStudioState';

export function OverlayList({ state, dispatch }: { state: StudioState; dispatch: React.Dispatch<StudioAction> }) {
  if (state.overlays.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-700 p-3 text-center text-xs text-slate-500">Nenhuma estrutura. Use "Polígono" ou "Agulha" e toque na imagem.</p>;
  }
  const iconBtn = 'flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 disabled:opacity-30';
  return (
    <ul className="flex flex-col gap-1">
      {state.overlays.map((o, i) => {
        const st = LAYER_STYLES[o.type];
        const active = o.id === state.editingId;
        return (
          <li key={o.id} className={cx('flex items-center gap-2 rounded-lg border px-2 py-1', active ? 'border-amber-400/70 bg-slate-800' : 'border-slate-800 bg-slate-900/60')}>
            <button type="button" className="flex min-h-9 min-w-0 flex-1 items-center gap-2 text-left" onClick={() => dispatch({ type: 'startEdit', id: o.id })}>
              <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: st.stroke }} />
              <span className="truncate text-sm text-slate-100">{o.label}</span>
              <span className="shrink-0 text-[11px] text-slate-500">{parsePoints(o.points).length} pts</span>
            </button>
            <button type="button" className={iconBtn} aria-label="Mover para trás" disabled={i === 0} onClick={() => dispatch({ type: 'moveOverlay', id: o.id, dir: -1 })}>
              ↑
            </button>
            <button type="button" className={iconBtn} aria-label="Mover para frente" disabled={i === state.overlays.length - 1} onClick={() => dispatch({ type: 'moveOverlay', id: o.id, dir: 1 })}>
              ↓
            </button>
            <button type="button" className={cx(iconBtn, 'text-rose-300')} aria-label="Remover" onClick={() => dispatch({ type: 'deleteOverlay', id: o.id })}>
              <Icon name="trash" size={16} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
