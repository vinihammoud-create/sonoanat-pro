import { describe, expect, it } from 'vitest';
import { resolveBlock } from '@/db/merge';
import { BLOCK_BY_ID } from '@/data/blocks';
import type { Overlay } from '@/types';
import { initialViewerState, viewerReducer } from '@/hooks/useViewerState';
import { DEFAULT_SETTINGS } from '@/types';
import { studioReducer, initialStudioState } from '@/components/studio/useStudioState';

const userOverlay: Overlay = { id: 'u', type: 'vein', label: 'V. teste', points: '0,0 10,0 10,10', label_pos: { x: 5, y: 5 } };

describe('merge built-in + override', () => {
  const builtin = BLOCK_BY_ID.get('femoral')!;

  it('sem override devolve o built-in inalterado', () => {
    const e = resolveBlock(builtin, undefined, []);
    expect(e.isModified).toBe(false);
    expect(e.overlays).toBe(builtin.overlays);
    expect(e.images.mode).toBe(builtin.images.mode);
  });

  it('override substitui overlays e imagens sem mutar o built-in', () => {
    const e = resolveBlock(builtin, { blockId: 'femoral', overlays: [userOverlay], images: { mode: 'A', baseImageId: 'x' }, updatedAt: 1 }, []);
    expect(e.isModified).toBe(true);
    expect(e.overlays).toEqual([userOverlay]);
    expect(e.images.baseImageId).toBe('x');
    expect(builtin.overlays.length).toBeGreaterThan(1);
  });
});

describe('viewer reducer', () => {
  it('começa limpo, alterna estruturas, todas/limpar, opacidade limitada e hold', () => {
    let s = initialViewerState(DEFAULT_SETTINGS);
    expect(s.shown.size).toBe(0);
    s = viewerReducer(s, { type: 'toggle', id: 'a' });
    expect(s.shown.has('a')).toBe(true);
    expect(s.selectedId).toBe('a');
    s = viewerReducer(s, { type: 'toggle', id: 'a' });
    expect(s.shown.has('a')).toBe(false);
    expect(s.selectedId).toBeNull();
    s = viewerReducer(s, { type: 'showAll', ids: ['a', 'b'] });
    expect(s.shown.size).toBe(2);
    s = viewerReducer(s, { type: 'clear' });
    expect(s.shown.size).toBe(0);
    s = viewerReducer(s, { type: 'select', id: 'b' });
    expect(s.shown.has('b')).toBe(true);
    s = viewerReducer(s, { type: 'setOpacity', value: 3 });
    expect(s.opacity).toBe(15);
    s = viewerReducer(s, { type: 'setOpacity', value: 500 });
    expect(s.opacity).toBe(100);
    s = viewerReducer(s, { type: 'setHidden', on: true });
    expect(s.hidden).toBe(true);
    s = viewerReducer(s, { type: 'toggleFlip' });
    expect(s.flipped).toBe(true);
  });
});

describe('studio reducer', () => {
  it('desenha polígono, conclui, edita e remove', () => {
    let s = initialStudioState([]);
    s = studioReducer(s, { type: 'setTool', tool: 'polygon' });
    s = studioReducer(s, { type: 'addPoint', point: { x: 10, y: 10 } });
    s = studioReducer(s, { type: 'addPoint', point: { x: 100, y: 10 } });
    s = studioReducer(s, { type: 'commitDraft' });
    expect(s.overlays).toHaveLength(0);
    expect(s.status).toMatch(/3 pontos/);
    s = studioReducer(s, { type: 'addPoint', point: { x: 100, y: 100.4 } });
    s = studioReducer(s, { type: 'setForm', patch: { label: 'N. mediano', type: 'nerve' } });
    s = studioReducer(s, { type: 'commitDraft' });
    expect(s.overlays).toHaveLength(1);
    expect(s.overlays[0].points).toBe('10,10 100,10 100,100');
    expect(s.overlays[0].id).toBe('user-n-mediano');
    expect(s.dirty).toBe(true);
    expect(s.editingId).toBe(s.overlays[0].id);
    s = studioReducer(s, { type: 'moveVertex', id: s.overlays[0].id, index: 0, point: { x: 20, y: 20 } });
    expect(s.overlays[0].points.startsWith('20,20')).toBe(true);
    s = studioReducer(s, { type: 'setLabelPos', id: s.overlays[0].id, point: { x: 50, y: 50 } });
    expect(s.overlays[0].label_pos).toEqual({ x: 50, y: 50 });
    s = studioReducer(s, { type: 'deleteOverlay', id: s.overlays[0].id });
    expect(s.overlays).toHaveLength(0);
    expect(s.editingId).toBeNull();
  });

  it('agulha aceita exatamente 2 pontos (o terceiro substitui o segundo)', () => {
    let s = initialStudioState([]);
    s = studioReducer(s, { type: 'setTool', tool: 'needle' });
    s = studioReducer(s, { type: 'addPoint', point: { x: 1, y: 1 } });
    s = studioReducer(s, { type: 'addPoint', point: { x: 2, y: 2 } });
    s = studioReducer(s, { type: 'addPoint', point: { x: 3, y: 3 } });
    expect(s.draft).toEqual([{ x: 1, y: 1 }, { x: 3, y: 3 }]);
    expect(s.form.type).toBe('needle');
    s = studioReducer(s, { type: 'commitDraft' });
    expect(s.overlays[0].type).toBe('needle');
  });
});
