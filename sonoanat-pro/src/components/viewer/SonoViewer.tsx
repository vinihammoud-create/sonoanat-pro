import { useState } from 'react';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';
import type { EffectiveBlock } from '@/types';
import type { ViewerState } from '@/hooks/useViewerState';
import { BaseLayer } from './BaseLayer';
import { OverlaySvg } from './OverlaySvg';
import { OrientationMarkers } from './OrientationMarkers';
import { Icon } from '@/components/common/Icon';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3.5;

export interface SonoViewerProps {
  block: EffectiveBlock;
  state: ViewerState;
  onSelect: (id: string | null) => void;
}

const MODE_LABEL: Record<string, string> = { A: 'imagem real', B: 'par real', C: 'simulação' };

function ZoomButtons() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const btn = 'flex h-9 w-9 items-center justify-center rounded-md bg-slate-950/80 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800 active:bg-slate-700';
  return (
    <div className="absolute right-1.5 top-9 z-10 flex flex-col gap-1">
      <button type="button" className={btn} aria-label="Aproximar" onClick={() => zoomIn(0.5)}>
        <Icon name="zoomIn" size={18} />
      </button>
      <button type="button" className={btn} aria-label="Afastar" onClick={() => zoomOut(0.5)}>
        <Icon name="zoomOut" size={18} />
      </button>
      <button type="button" className={btn} aria-label="Zoom 100%" onClick={() => resetTransform()}>
        <Icon name="reset" size={18} />
      </button>
    </div>
  );
}

/** Viewer 4:3 com imagem base + overlays SVG sincronizados, zoom (100–350%) e pan. */
export function SonoViewer({ block, state, onSelect }: SonoViewerProps) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-black no-select">
      <TransformWrapper
        minScale={MIN_ZOOM}
        maxScale={MAX_ZOOM}
        centerOnInit
        limitToBounds
        doubleClick={{ mode: 'toggle', step: 1.2 }}
        wheel={{ step: 0.2 }}
        pinch={{ step: 5 }}
        panning={{ velocityDisabled: true }}
        onTransform={(_ref, s) => setZoom(s.scale)}
      >
        <ZoomButtons />
        <OrientationMarkers
          orientation={block.orientation}
          flipped={state.flipped}
          depthCm={block.ergonomics.depthCm}
          zoom={zoom}
          modeLabel={MODE_LABEL[block.images.mode]}
        />
        <TransformComponent wrapperClass="!w-full" contentClass="!w-full">
          <div className="relative aspect-[4/3] w-full">
            <BaseLayer block={block} flipped={state.flipped} pairOpacity={state.pairOpacity / 100} hideAnnotated={state.hidden} />
            <OverlaySvg
              overlays={block.overlays}
              visible={state.visible}
              labelsOn={state.labelsOn}
              opacity={state.opacity / 100}
              hidden={state.hidden}
              flipped={state.flipped}
              selectedId={state.selectedId}
              onSelect={onSelect}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
