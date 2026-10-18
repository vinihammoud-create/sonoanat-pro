import { useCallback, useMemo, useRef } from 'react';
import type React from 'react';
import type { LayerType, Overlay } from '@/types';
import { VIEWBOX } from '@/types';
import { layerZ } from '@/constants/layers';
import { OverlayShape } from './OverlayShape';

export interface OverlaySvgProps {
  overlays: readonly Overlay[];
  visible: Record<LayerType, boolean>;
  labelsOn: boolean;
  /** 0–1 */
  opacity: number;
  hidden: boolean;
  flipped: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Conteúdo extra (ex.: rascunho do Estúdio). */
  children?: React.ReactNode;
  /** Handler de toque bruto (Estúdio); quando definido, a seleção por toque é desabilitada. */
  onStagePointer?: (e: React.PointerEvent<SVGElement>) => void;
}

const TAP_MS = 350;
const TAP_PX = 10;

export function OverlaySvg({ overlays, visible, labelsOn, opacity, hidden, flipped, selectedId, onSelect, children, onStagePointer }: OverlaySvgProps) {
  const down = useRef<{ x: number; y: number; t: number } | null>(null);

  const sorted = useMemo(
    () => overlays.filter((o) => visible[o.type]).slice().sort((a, b) => layerZ(a.type) - layerZ(b.type)),
    [overlays, visible],
  );

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    down.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = down.current;
      down.current = null;
      if (onStagePointer) return;
      if (!d) return;
      const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
      if (moved > TAP_PX || performance.now() - d.t > TAP_MS) return;
      const target = (e.target as Element | null)?.closest?.('[data-overlay-id]') as HTMLElement | null;
      const id = target?.dataset.overlayId ?? null;
      onSelect(id === selectedId ? null : id);
    },
    [onSelect, onStagePointer, selectedId],
  );

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      onPointerDown={onStagePointer ? undefined : onPointerDown}
      onPointerUp={onStagePointer ? undefined : onPointerUp}
      style={{ touchAction: 'none' }}
      aria-label="Camadas anatômicas"
    >
      <g style={{ opacity: hidden ? 0 : opacity, transition: 'opacity 120ms ease' }}>
        {sorted.map((o) => (
          <OverlayShape key={o.id} overlay={o} labelsOn={labelsOn} selected={o.id === selectedId} flipped={flipped} />
        ))}
      </g>
      {children}
      {onStagePointer && (
        <rect x={0} y={0} width={VIEWBOX.w} height={VIEWBOX.h} fill="transparent" onPointerDown={onStagePointer} />
      )}
    </svg>
  );
}
