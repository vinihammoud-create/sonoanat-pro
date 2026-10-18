import { memo } from 'react';
import type { Overlay } from '@/types';
import { LAYER_STYLES } from '@/constants/layers';
import { VIEWBOX } from '@/types';
import { parsePoints, pointsToString } from '@/utils/geometry';

export interface OverlayShapeProps {
  overlay: Overlay;
  labelsOn: boolean;
  selected: boolean;
  flipped: boolean;
  /** Apenas desenho (sem interação), usado no Estúdio para o overlay em edição. */
  dimmed?: boolean;
}

function flipPts(points: string, flipped: boolean): string {
  if (!flipped) return points;
  return pointsToString(parsePoints(points).map((p) => ({ x: VIEWBOX.w - p.x, y: p.y })));
}

export const OverlayShape = memo(function OverlayShape({ overlay, labelsOn, selected, flipped, dimmed }: OverlayShapeProps) {
  const style = LAYER_STYLES[overlay.type];
  const pts = flipPts(overlay.points, flipped);
  const lx = flipped ? VIEWBOX.w - overlay.label_pos.x : overlay.label_pos.x;
  const ly = overlay.label_pos.y;
  const isNeedle = overlay.type === 'needle';
  const isFascia = overlay.type === 'fascia';
  const strokeWidth = selected ? 6 : 3;
  const labelW = Math.min(360, Math.max(56, overlay.label.length * 7.6 + 14));
  const labelX = Math.max(labelW / 2 + 4, Math.min(VIEWBOX.w - labelW / 2 - 4, lx));
  const labelY = Math.max(14, Math.min(VIEWBOX.h - 10, ly));

  return (
    <g
      data-overlay-id={overlay.id}
      className="cursor-pointer"
      style={{ opacity: dimmed ? 0.35 : 1 }}
      role="button"
      aria-label={overlay.label}
      tabIndex={-1}
    >
      {selected && !isNeedle && !isFascia && (
        <polygon points={pts} fill="none" stroke="#ffffff" strokeWidth={10} strokeOpacity={0.35} strokeLinejoin="round" />
      )}
      {isNeedle ? (
        <>
          <polyline points={pts} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={strokeWidth + 4} strokeLinecap="round" />
          <polyline
            points={pts}
            fill="none"
            stroke={style.stroke}
            strokeWidth={strokeWidth + 1}
            strokeDasharray="14 8"
            strokeLinecap="round"
            className="animate-dash-needle"
          />
          <NeedleTip points={pts} color={style.stroke} />
        </>
      ) : isFascia ? (
        <>
          <polyline points={pts} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={strokeWidth + 3} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={pts} fill="none" stroke={style.stroke} strokeWidth={strokeWidth} strokeDasharray="10 6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <polygon
          points={pts}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          className={overlay.type === 'artery' ? 'animate-pulse-artery' : undefined}
        />
      )}
      {labelsOn && (
        <g transform={`translate(${labelX},${labelY})`} pointerEvents="none">
          <rect x={-labelW / 2} y={-11} width={labelW} height={22} rx={5} fill="rgba(2, 6, 23, 0.85)" stroke={style.stroke} strokeWidth={1.2} />
          <text x={0} y={4.5} textAnchor="middle" fill="#F8FAFC" fontSize={13} fontWeight={600} fontFamily="ui-sans-serif, system-ui, sans-serif">
            {overlay.label}
          </text>
        </g>
      )}
    </g>
  );
});

function NeedleTip({ points, color }: { points: string; color: string }) {
  const pts = parsePoints(points);
  if (pts.length < 2) return null;
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const L = 18;
  const p1 = { x: b.x - L * Math.cos(ang - 0.45), y: b.y - L * Math.sin(ang - 0.45) };
  const p2 = { x: b.x - L * Math.cos(ang + 0.45), y: b.y - L * Math.sin(ang + 0.45) };
  return <polygon points={`${b.x},${b.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`} fill={color} stroke="#000" strokeOpacity={0.5} strokeWidth={1} />;
}
