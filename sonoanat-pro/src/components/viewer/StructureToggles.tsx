import type React from 'react';
import { useMemo } from 'react';
import type { LayerType, Overlay } from '@/types';
import { LAYER_STYLES, layerZ } from '@/constants/layers';
import type { ViewerAction, ViewerState } from '@/hooks/useViewerState';
import { useHoldToHide } from '@/hooks/useHoldToHide';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Slider } from '@/components/common/Slider';
import { cx } from '@/utils/format';

export interface StructureTogglesProps {
  overlays: readonly Overlay[];
  state: ViewerState;
  dispatch: React.Dispatch<ViewerAction>;
  showPairSlider?: boolean;
}

/** Ordem da lista: trajeto da agulha e AL primeiro (como no AnSo), depois as estruturas. */
const LIST_ORDER: LayerType[] = ['needle', 'la_spread', 'nerve', 'artery', 'vein', 'muscle', 'fascia', 'bone', 'pleura', 'organ'];

/**
 * Lista de estruturas: toque em uma linha e ela aparece colorida sobre a imagem; toque de novo e some.
 * A imagem começa limpa.
 */
export function StructureToggles({ overlays, state, dispatch, showPairSlider }: StructureTogglesProps) {
  const hold = useHoldToHide((on) => dispatch({ type: 'setHidden', on }));
  const rows = useMemo(
    () => overlays.slice().sort((a, b) => LIST_ORDER.indexOf(a.type) - LIST_ORDER.indexOf(b.type) || layerZ(a.type) - layerZ(b.type)),
    [overlays],
  );
  const allIds = useMemo(() => overlays.map((o) => o.id), [overlays]);
  const allOn = state.shown.size === overlays.length && overlays.length > 0;

  return (
    <div className="flex flex-col">
      <ul className="divide-y divide-slate-700/70 border-y border-slate-700/70">
        <li>
          <button
            type="button"
            aria-pressed={allOn}
            onClick={() => dispatch(allOn ? { type: 'clear' } : { type: 'showAll', ids: allIds })}
            className={cx('flex min-h-12 w-full items-center gap-3 px-2 text-left text-[15px] font-semibold transition-colors hover:bg-slate-800/70', allOn ? 'text-amber-300' : 'text-slate-100')}
          >
            <span className="flex h-4 w-4 items-center justify-center">
              <Icon name={allOn ? 'eyeOff' : 'eye'} size={16} />
            </span>
            {allOn ? 'Ocultar todas' : 'Mostrar todas'}
          </button>
        </li>
        {rows.map((o) => {
          const st = LAYER_STYLES[o.type];
          const on = state.shown.has(o.id);
          return (
            <li key={o.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => dispatch({ type: 'toggle', id: o.id })}
                className={cx(
                  'flex min-h-12 w-full items-center gap-3 px-2 text-left text-[15px] transition-colors hover:bg-slate-800/70',
                  on ? 'bg-slate-800/80 text-white' : 'text-slate-200',
                )}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full transition-transform"
                  style={{ background: st.stroke, boxShadow: on ? `0 0 0 3px ${st.stroke}55` : 'none', transform: on ? 'scale(1.15)' : 'scale(1)' }}
                />
                <span className="flex-1 leading-tight">{o.label}</span>
                {on && <Icon name="check" size={16} className="shrink-0 text-slate-300" />}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Button size="sm" variant="primary" className={cx('no-select', state.hidden && 'bg-amber-600')} aria-pressed={state.hidden} disabled={state.shown.size === 0} {...hold}>
          <Icon name={state.hidden ? 'eyeOff' : 'eye'} size={16} />
          {state.hidden ? 'Exibindo US puro' : 'Segure: US puro'}
        </Button>
        <Button size="sm" variant="outline" aria-pressed={state.labelsOn} active={state.labelsOn} onClick={() => dispatch({ type: 'setLabels', on: !state.labelsOn })}>
          <Icon name="tag" size={16} />
          Nomes
        </Button>
        <Button size="sm" variant="outline" aria-pressed={state.flipped} active={state.flipped} onClick={() => dispatch({ type: 'toggleFlip' })}>
          <Icon name="flip" size={16} />
          Espelhar
        </Button>
      </div>

      <details className="mt-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
        <summary className="cursor-pointer select-none py-1 font-semibold">Ajustes</summary>
        <div className="mt-1 flex flex-col gap-1">
          <Slider label="Opacidade das marcações" min={15} max={100} value={state.opacity} onChange={(v) => dispatch({ type: 'setOpacity', value: v })} />
          {showPairSlider && (
            <Slider label="Imagem anotada pelos autores" min={0} max={100} value={state.pairOpacity} onChange={(v) => dispatch({ type: 'setPairOpacity', value: v })} />
          )}
        </div>
      </details>
    </div>
  );
}
