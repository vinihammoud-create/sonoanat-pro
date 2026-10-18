import { useCallback, useRef } from 'react';
import type React from 'react';
import type { EffectiveBlock } from '@/types';
import { VIEWBOX } from '@/types';
import { LAYER_STYLES, layerZ } from '@/constants/layers';
import { BaseLayer } from '@/components/viewer/BaseLayer';
import { OverlayShape } from '@/components/viewer/OverlayShape';
import { OrientationMarkers } from '@/components/viewer/OrientationMarkers';
import { clientToViewBox, parsePoints, type Point } from '@/utils/geometry';
import type { StudioAction, StudioState } from './useStudioState';

export interface StudioStageProps {
  block: EffectiveBlock;
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
  /** Pré-visualização de imagem ainda não salva. */
  previewBaseUrl?: string | null;
  labelsOn: boolean;
}

const TAP_PX = 8;

export function StudioStage({ block, state, dispatch, previewBaseUrl, labelsOn }: StudioStageProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const down = useRef<{ x: number; y: number } | null>(null);

  const toViewBox = useCallback((clientX: number, clientY: number): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    return clientToViewBox(svg.getBoundingClientRect(), clientX, clientY);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    down.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = down.current;
      down.current = null;
      if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > TAP_PX) return;
      const p = toViewBox(e.clientX, e.clientY);
      if (!p) return;
      if (state.tool === 'polygon' || state.tool === 'needle') {
        dispatch({ type: 'addPoint', point: p });
      } else if (state.tool === 'label' && state.editingId) {
        dispatch({ type: 'setLabelPos', id: state.editingId, point: p });
      } else if (state.tool === 'select') {
        const target = (e.target as Element | null)?.closest?.('[data-overlay-id]') as HTMLElement | null;
        const id = target?.dataset.overlayId ?? null;
        if (id) dispatch({ type: 'startEdit', id });
        else dispatch({ type: 'cancelEdit' });
      }
    },
    [dispatch, state.editingId, state.tool, toViewBox],
  );

  const editing = state.editingId ? state.overlays.find((o) => o.id === state.editingId) : undefined;
  const editingPts = editing ? parsePoints(editing.points) : [];
  const sorted = state.overlays.slice().sort((a, b) => layerZ(a.type) - layerZ(b.type));
  const draftStyle = LAYER_STYLES[state.form.type];
  const drafting = state.tool === 'polygon' || state.tool === 'needle';

  const startDrag = (index: number) => (e: React.PointerEvent<SVGCircleElement>) => {
    if (!editing) return;
    e.stopPropagation();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const p = toViewBox(ev.clientX, ev.clientY);
      if (p) dispatch({ type: 'moveVertex', id: editing.id, index, point: p });
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const cursor = drafting ? 'crosshair' : state.tool === 'label' ? 'cell' : 'default';

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-amber-500/40 bg-black no-select">
      <OrientationMarkers orientation={block.orientation} flipped={false} depthCm={block.ergonomics.depthCm} zoom={1} modeLabel="estúdio" />
      <div className="relative aspect-[4/3] w-full">
        <BaseLayer block={block} flipped={false} pairOpacity={0} overrideBaseUrl={previewBaseUrl} />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          style={{ touchAction: 'none', cursor }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-label="Área de anotação"
        >
          <rect x={0} y={0} width={VIEWBOX.w} height={VIEWBOX.h} fill="transparent" />
          <g style={{ opacity: 0.9 }}>
            {sorted.map((o) => (
              <OverlayShape
                key={o.id}
                overlay={o}
                labelsOn={labelsOn}
                selected={o.id === state.editingId}
                flipped={false}
                dimmed={drafting || (!!state.editingId && o.id !== state.editingId)}
              />
            ))}
          </g>

          {editing && (
            <g>
              {editingPts.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill="#0f172a"
                  stroke={LAYER_STYLES[editing.type].stroke}
                  strokeWidth={3}
                  style={{ cursor: 'grab' }}
                  onPointerDown={startDrag(i)}
                />
              ))}
              {state.tool === 'label' && (
                <g transform={`translate(${editing.label_pos.x},${editing.label_pos.y})`} pointerEvents="none">
                  <circle r={14} fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="4 3" />
                </g>
              )}
            </g>
          )}

          {state.draft.length > 0 && (
            <g pointerEvents="none">
              {state.tool === 'polygon' && state.draft.length >= 3 && (
                <polygon points={state.draft.map((p) => `${p.x},${p.y}`).join(' ')} fill={draftStyle.fill === 'none' ? 'rgba(255,255,255,0.1)' : draftStyle.fill} stroke="none" />
              )}
              <polyline
                points={state.draft.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={draftStyle.stroke}
                strokeWidth={3}
                strokeDasharray="8 6"
                strokeLinejoin="round"
              />
              {state.tool === 'polygon' && state.draft.length >= 3 && (
                <line
                  x1={state.draft[state.draft.length - 1].x}
                  y1={state.draft[state.draft.length - 1].y}
                  x2={state.draft[0].x}
                  y2={state.draft[0].y}
                  stroke={draftStyle.stroke}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  strokeDasharray="3 6"
                />
              )}
              {state.draft.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={i === 0 ? 10 : 7} fill={i === 0 ? draftStyle.stroke : '#0f172a'} stroke={draftStyle.stroke} strokeWidth={2.5} />
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
