import { useCallback, useMemo, useRef } from 'react';
import type React from 'react';
import type { Overlay } from '@/types';
import { VIEWBOX } from '@/types';
import { layerZ } from '@/constants/layers';
import { OverlayShape } from './OverlayShape';

export interface OverlaySvgProps {
  overlays: readonly Overlay[];
  /** Ids exibidos; os demais ficam ocultos (imagem limpa). */
  shown: ReadonlySet<string>;
  labelsOn: boolean;
  /** 0–1 */
  opacity: number;
  hidden: boolean;
  flipped: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const TAP_MS = 350;
const TAP_PX = 10;

export function OverlaySvg({ overlays, shown, labelsOn, opacity, hidden, flipped, selectedId, onSelect }: OverlaySvgProps) {
  const down = useRef<{ x: number; y: number; t: number } | null>(null);

  const sorted = useMemo(
    () => overlays.filter((o) => shown.has(o.id)).slice().sort((a, b) => layerZ(a.type) - layerZ(b.type)),
    [overlays, shown],
  );

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    down.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = down.current;
      down.current = null;
      if (!d) return;
      const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
      if (moved > TAP_PX || performance.now() - d.t > TAP_MS) return;
      const target = (e.target as Element | null)?.closest?.('[data-overlay-id]') as HTMLElement | null;
      const id = target?.dataset.overlayId ?? null;
      onSelect(id === selectedId ? null : id);
    },
    [onSelect, selectedId],
  );

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ touchAction: 'none' }}
      aria-label="Estruturas anatômicas"
    >
      <g style={{ opacity: hidden ? 0 : opacity, transition: 'opacity 120ms ease' }}>
        {sorted.map((o) => (
          <OverlayShape key={o.id} overlay={o} labelsOn={labelsOn} selected={o.id === selectedId} flipped={flipped} />
        ))}
      </g>
    </svg>
  );
}
