import { useCallback, useReducer } from 'react';
import { LAYER_TYPES, type AppSettings, type LayerType } from '@/types';

export interface ViewerState {
  visible: Record<LayerType, boolean>;
  labelsOn: boolean;
  /** 15–100 (%). */
  opacity: number;
  /** true enquanto o botão "Segure: US puro" está pressionado. */
  hidden: boolean;
  flipped: boolean;
  selectedId: string | null;
  /** Opacidade da camada anotada no modo B, 0–100. */
  pairOpacity: number;
}

export type ViewerAction =
  | { type: 'toggleLayer'; layer: LayerType }
  | { type: 'setLayer'; layer: LayerType; on: boolean }
  | { type: 'allOn' }
  | { type: 'allOff' }
  | { type: 'setLabels'; on: boolean }
  | { type: 'setOpacity'; value: number }
  | { type: 'setHidden'; on: boolean }
  | { type: 'toggleFlip' }
  | { type: 'select'; id: string | null }
  | { type: 'setPairOpacity'; value: number }
  | { type: 'reset'; settings: AppSettings };

export function allLayers(on: boolean): Record<LayerType, boolean> {
  return Object.fromEntries(LAYER_TYPES.map((t) => [t, on])) as Record<LayerType, boolean>;
}

export function initialViewerState(settings: AppSettings): ViewerState {
  return {
    visible: allLayers(true),
    labelsOn: settings.defaultLabelsOn,
    opacity: Math.max(15, Math.min(100, settings.defaultOpacity)),
    hidden: false,
    flipped: settings.defaultFlipped,
    selectedId: null,
    pairOpacity: 0,
  };
}

export function viewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
  switch (action.type) {
    case 'toggleLayer':
      return { ...state, visible: { ...state.visible, [action.layer]: !state.visible[action.layer] } };
    case 'setLayer':
      return { ...state, visible: { ...state.visible, [action.layer]: action.on } };
    case 'allOn':
      return { ...state, visible: allLayers(true) };
    case 'allOff':
      return { ...state, visible: allLayers(false), selectedId: null };
    case 'setLabels':
      return { ...state, labelsOn: action.on };
    case 'setOpacity':
      return { ...state, opacity: Math.max(15, Math.min(100, Math.round(action.value))) };
    case 'setHidden':
      return state.hidden === action.on ? state : { ...state, hidden: action.on };
    case 'toggleFlip':
      return { ...state, flipped: !state.flipped };
    case 'select':
      return { ...state, selectedId: action.id };
    case 'setPairOpacity':
      return { ...state, pairOpacity: Math.max(0, Math.min(100, Math.round(action.value))) };
    case 'reset':
      return initialViewerState(action.settings);
    default:
      return state;
  }
}

export function useViewerState(settings: AppSettings) {
  const [state, dispatch] = useReducer(viewerReducer, settings, initialViewerState);
  const select = useCallback((id: string | null) => dispatch({ type: 'select', id }), []);
  return { state, dispatch, select };
}
