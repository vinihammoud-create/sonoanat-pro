import { useReducer } from 'react';
import type { LayerType, Overlay } from '@/types';
import { LAYER_STYLES } from '@/constants/layers';
import { centroid, parsePoints, pointsToString, type Point } from '@/utils/geometry';

export type StudioTool = 'select' | 'polygon' | 'needle' | 'label';

export interface OverlayFormValues {
  type: LayerType;
  label: string;
  note: string;
  echo: string;
  alert: string;
}

export interface StudioState {
  overlays: Overlay[];
  /** Pontos do desenho em andamento. */
  draft: Point[];
  form: OverlayFormValues;
  /** Overlay existente em edição (vértices arrastáveis). */
  editingId: string | null;
  selectedId: string | null;
  tool: StudioTool;
  dirty: boolean;
  /** Mensagem de status curta para a UI. */
  status: string | null;
}

export type StudioAction =
  | { type: 'load'; overlays: Overlay[] }
  | { type: 'setTool'; tool: StudioTool }
  | { type: 'addPoint'; point: Point }
  | { type: 'undoPoint' }
  | { type: 'clearDraft' }
  | { type: 'setForm'; patch: Partial<OverlayFormValues> }
  | { type: 'commitDraft' }
  | { type: 'startEdit'; id: string }
  | { type: 'applyEdit' }
  | { type: 'cancelEdit' }
  | { type: 'moveVertex'; id: string; index: number; point: Point }
  | { type: 'setLabelPos'; id: string; point: Point }
  | { type: 'deleteOverlay'; id: string }
  | { type: 'moveOverlay'; id: string; dir: -1 | 1 }
  | { type: 'select'; id: string | null }
  | { type: 'markSaved' }
  | { type: 'status'; message: string | null };

export const EMPTY_FORM: OverlayFormValues = { type: 'nerve', label: '', note: '', echo: '', alert: '' };

export function initialStudioState(overlays: Overlay[]): StudioState {
  return { overlays, draft: [], form: EMPTY_FORM, editingId: null, selectedId: null, tool: 'select', dirty: false, status: null };
}

function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'estrutura';
}

function uniqueId(base: string, existing: Overlay[]): string {
  const ids = new Set(existing.map((o) => o.id));
  let id = `user-${base}`;
  let n = 2;
  while (ids.has(id)) id = `user-${base}-${n++}`;
  return id;
}

function clean(v: string): string | undefined {
  const t = v.trim();
  return t ? t : undefined;
}

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'load':
      return initialStudioState(action.overlays);
    case 'setTool': {
      const draft = action.tool === 'polygon' || action.tool === 'needle' ? state.draft : [];
      return { ...state, tool: action.tool, draft, status: null };
    }
    case 'addPoint': {
      const p = { x: Math.round(action.point.x), y: Math.round(action.point.y) };
      if (state.tool === 'needle') {
        const draft = state.draft.length >= 2 ? [state.draft[0], p] : [...state.draft, p];
        return { ...state, draft, form: state.form.type === 'needle' ? state.form : { ...state.form, type: 'needle' } };
      }
      if (state.tool === 'polygon') return { ...state, draft: [...state.draft, p] };
      return state;
    }
    case 'undoPoint':
      return { ...state, draft: state.draft.slice(0, -1) };
    case 'clearDraft':
      return { ...state, draft: [] };
    case 'setForm':
      return { ...state, form: { ...state.form, ...action.patch } };
    case 'commitDraft': {
      const isLine = LAYER_STYLES[state.form.type].isLine;
      const min = isLine ? 2 : 3;
      if (state.draft.length < min) return { ...state, status: `Marque pelo menos ${min} pontos.` };
      const label = state.form.label.trim() || LAYER_STYLES[state.form.type].longName;
      const c = centroid(state.draft);
      const label_pos = isLine ? { x: Math.round(c.x), y: Math.max(16, Math.round(c.y) - 20) } : { x: Math.round(c.x), y: Math.round(c.y) };
      const ov: Overlay = {
        id: uniqueId(slug(label), state.overlays),
        type: state.form.type,
        label,
        points: pointsToString(state.draft),
        label_pos,
        note: clean(state.form.note),
        echo: clean(state.form.echo),
        alert: clean(state.form.alert),
      };
      return {
        ...state,
        overlays: [...state.overlays, ov],
        draft: [],
        form: { ...EMPTY_FORM, type: state.form.type },
        selectedId: ov.id,
        editingId: ov.id,
        tool: 'select',
        dirty: true,
        status: `"${label}" adicionada. Arraste os vértices ou posicione a legenda.`,
      };
    }
    case 'startEdit': {
      const ov = state.overlays.find((o) => o.id === action.id);
      if (!ov) return state;
      return {
        ...state,
        editingId: ov.id,
        selectedId: ov.id,
        draft: [],
        tool: 'select',
        form: { type: ov.type, label: ov.label, note: ov.note ?? '', echo: ov.echo ?? '', alert: ov.alert ?? '' },
        status: null,
      };
    }
    case 'applyEdit': {
      if (!state.editingId) return state;
      const overlays = state.overlays.map((o) =>
        o.id === state.editingId
          ? { ...o, type: state.form.type, label: state.form.label.trim() || o.label, note: clean(state.form.note), echo: clean(state.form.echo), alert: clean(state.form.alert) }
          : o,
      );
      return { ...state, overlays, dirty: true, status: 'Alterações aplicadas (lembre de salvar).' };
    }
    case 'cancelEdit':
      return { ...state, editingId: null, selectedId: null, form: { ...EMPTY_FORM, type: state.form.type }, status: null };
    case 'moveVertex': {
      const overlays = state.overlays.map((o) => {
        if (o.id !== action.id) return o;
        const pts = parsePoints(o.points);
        if (!pts[action.index]) return o;
        pts[action.index] = { x: Math.round(action.point.x), y: Math.round(action.point.y) };
        return { ...o, points: pointsToString(pts) };
      });
      return { ...state, overlays, dirty: true };
    }
    case 'setLabelPos': {
      const overlays = state.overlays.map((o) => (o.id === action.id ? { ...o, label_pos: { x: Math.round(action.point.x), y: Math.round(action.point.y) } } : o));
      return { ...state, overlays, dirty: true, tool: 'select', status: 'Legenda reposicionada.' };
    }
    case 'deleteOverlay': {
      const overlays = state.overlays.filter((o) => o.id !== action.id);
      const clearing = state.editingId === action.id;
      return {
        ...state,
        overlays,
        dirty: true,
        editingId: clearing ? null : state.editingId,
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        form: clearing ? { ...EMPTY_FORM, type: state.form.type } : state.form,
        status: 'Estrutura removida.',
      };
    }
    case 'moveOverlay': {
      const i = state.overlays.findIndex((o) => o.id === action.id);
      const j = i + action.dir;
      if (i < 0 || j < 0 || j >= state.overlays.length) return state;
      const overlays = state.overlays.slice();
      [overlays[i], overlays[j]] = [overlays[j], overlays[i]];
      return { ...state, overlays, dirty: true };
    }
    case 'select':
      return { ...state, selectedId: action.id };
    case 'markSaved':
      return { ...state, dirty: false, status: 'Salvo neste dispositivo.' };
    case 'status':
      return { ...state, status: action.message };
    default:
      return state;
  }
}

export function useStudioState(overlays: Overlay[]) {
  return useReducer(studioReducer, overlays, initialStudioState);
}
