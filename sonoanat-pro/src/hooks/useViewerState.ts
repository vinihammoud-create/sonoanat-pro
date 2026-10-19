import { useCallback, useReducer } from 'react';
import type { AppSettings } from '@/types';

export interface ViewerState {
  /** Ids das estruturas atualmente exibidas sobre a imagem (começa vazio = imagem limpa). */
  shown: ReadonlySet<string>;
  labelsOn: boolean;
  /** 15–100 (%). */
  opacity: number;
  /** true enquanto o botão "Segure: US puro" está pressionado. */
  hidden: boolean;
  flipped: boolean;
  /** Estrutura cuja descrição aparece no rodapé. */
  selectedId: string | null;
  /** Opacidade da imagem anotada no modo B, 0–100. */
  pairOpacity: number;
}

export type ViewerAction =
  | { type: 'toggle'; id: string }
  | { type: 'showAll'; ids: string[] }
  | { type: 'clear' }
  | { type: 'setLabels'; on: boolean }
  | { type: 'setOpacity'; value: number }
  | { type: 'setHidden'; on: boolean }
  | { type: 'toggleFlip' }
  | { type: 'select'; id: string | null }
  | { type: 'setPairOpacity'; value: number }
  | { type: 'reset'; settings: AppSettings };

export function initialViewerState(settings: AppSettings): ViewerState {
  return {
    shown: new Set(),
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
    case 'toggle': {
      const shown = new Set(state.shown);
      if (shown.has(action.id)) {
        shown.delete(action.id);
        return { ...state, shown, selectedId: state.selectedId === action.id ? null : state.selectedId };
      }
      shown.add(action.id);
      return { ...state, shown, selectedId: action.id };
    }
    case 'showAll':
      return { ...state, shown: new Set(action.ids) };
    case 'clear':
      return { ...state, shown: new Set(), selectedId: null };
    case 'setLabels':
      return { ...state, labelsOn: action.on };
    case 'setOpacity':
      return { ...state, opacity: Math.max(15, Math.min(100, Math.round(action.value))) };
    case 'setHidden':
      return state.hidden === action.on ? state : { ...state, hidden: action.on };
    case 'toggleFlip':
      return { ...state, flipped: !state.flipped };
    case 'select': {
      if (action.id === null) return { ...state, selectedId: null };
      // Selecionar pela imagem também garante que a estrutura esteja visível.
      const shown = state.shown.has(action.id) ? state.shown : new Set([...state.shown, action.id]);
      return { ...state, shown, selectedId: action.id };
    }
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
