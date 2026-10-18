import type { Orientation } from '@/types';

export interface OrientationMarkersProps {
  orientation: Orientation;
  flipped: boolean;
  depthCm: number;
  zoom: number;
  modeLabel?: string;
}

export function OrientationMarkers({ orientation, flipped, depthCm, zoom, modeLabel }: OrientationMarkersProps) {
  const left = flipped ? orientation.right : orientation.left;
  const right = flipped ? orientation.left : orientation.right;
  const pill = 'rounded-md bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-100 ring-1 ring-slate-700 sm:text-xs';
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <span className={`absolute left-1.5 top-1.5 ${pill}`}>{left}</span>
      <span className={`absolute right-1.5 top-1.5 ${pill}`}>{right}</span>
      <span className={`absolute bottom-1.5 left-1.5 ${pill} text-slate-300`}>
        Prof. {depthCm.toLocaleString('pt-BR')} cm{modeLabel ? ` · ${modeLabel}` : ''}
      </span>
      {zoom > 1.01 && <span className={`absolute bottom-1.5 right-1.5 ${pill} text-amber-300`}>{Math.round(zoom * 100)}%</span>}
    </div>
  );
}
