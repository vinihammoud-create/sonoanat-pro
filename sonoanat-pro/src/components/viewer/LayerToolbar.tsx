import type React from 'react';
import type { LayerType } from '@/types';
import { CORE_LAYERS, EXTRA_LAYERS, LAYER_STYLES } from '@/constants/layers';
import type { ViewerAction, ViewerState } from '@/hooks/useViewerState';
import { useHoldToHide } from '@/hooks/useHoldToHide';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Slider } from '@/components/common/Slider';
import { cx } from '@/utils/format';

export interface LayerToolbarProps {
  state: ViewerState;
  dispatch: React.Dispatch<ViewerAction>;
  /** Tipos presentes no bloco (para mostrar Fáscia/Órgão só quando existem). */
  presentTypes: ReadonlySet<LayerType>;
  showPairSlider?: boolean;
}

export function LayerToolbar({ state, dispatch, presentTypes, showPairSlider }: LayerToolbarProps) {
  const hold = useHoldToHide((on) => dispatch({ type: 'setHidden', on }));
  const extra = EXTRA_LAYERS.filter((t) => presentTypes.has(t));
  const layers = [...CORE_LAYERS, ...extra];

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Camadas">
        {layers.map((t) => {
          const st = LAYER_STYLES[t];
          const on = state.visible[t];
          const present = presentTypes.has(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => dispatch({ type: 'toggleLayer', layer: t })}
              title={st.longName + (present ? '' : ' (não presente neste bloqueio)')}
              className={cx(
                'inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors',
                on ? 'bg-slate-800 text-white' : 'bg-slate-950 text-slate-500',
                !present && 'opacity-50',
              )}
              style={{ borderColor: on ? st.stroke : '#1e293b' }}
            >
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: on ? st.stroke : '#334155' }} />
              {st.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" onClick={() => dispatch({ type: 'allOn' })}>
          Tudo ON
        </Button>
        <Button size="sm" onClick={() => dispatch({ type: 'allOff' })}>
          US puro
        </Button>
        <Button
          size="sm"
          variant="primary"
          className={cx('no-select', state.hidden && 'bg-amber-600')}
          aria-pressed={state.hidden}
          {...hold}
        >
          <Icon name={state.hidden ? 'eyeOff' : 'eye'} size={16} />
          {state.hidden ? 'Exibindo US puro' : 'Segure: US puro'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          aria-pressed={state.labelsOn}
          onClick={() => dispatch({ type: 'setLabels', on: !state.labelsOn })}
          className={cx(state.labelsOn && 'border-indigo-400/60 bg-indigo-500/20 text-indigo-100')}
        >
          <Icon name="tag" size={16} />
          Legendas: {state.labelsOn ? 'ON' : 'OFF'}
        </Button>
        <Button size="sm" variant="outline" aria-pressed={state.flipped} active={state.flipped} onClick={() => dispatch({ type: 'toggleFlip' })}>
          <Icon name="flip" size={16} />
          Espelhar
        </Button>
      </div>

      <div className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
        <Slider label="Opacidade" min={15} max={100} value={state.opacity} onChange={(v) => dispatch({ type: 'setOpacity', value: v })} />
        {showPairSlider && (
          <Slider label="Imagem anotada" min={0} max={100} value={state.pairOpacity} onChange={(v) => dispatch({ type: 'setPairOpacity', value: v })} />
        )}
      </div>
    </div>
  );
}
