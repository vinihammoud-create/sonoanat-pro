import { VIEWBOX } from '@/types';
import type { LayerType, Overlay } from '@/types';
import { bbox, parsePoints, type Point } from '@/utils/geometry';
import { fnv1a32, stableHash } from '@/utils/hash';

/** Incrementar quando o algoritmo de renderização mudar (invalida cache). */
export const GENERATOR_VERSION = 3;

export interface ScenePoly {
  id: string;
  type: LayerType;
  pts: Point[];
  box: { minX: number; minY: number; maxX: number; maxY: number };
  isLine: boolean;
}

export interface Scene {
  blockId: string;
  seed: number;
  width: number;
  height: number;
  depthCm: number;
  pxPerCm: number;
  /** Profundidade da gordura subcutânea em px. */
  fatDepth: number;
  muscles: ScenePoly[];
  organs: ScenePoly[];
  fascias: ScenePoly[];
  bones: ScenePoly[];
  vessels: ScenePoly[];
  nerves: ScenePoly[];
  pleurae: ScenePoly[];
}

const LINE_TYPES: ReadonlySet<LayerType> = new Set(['needle', 'fascia']);

/** Tipos que influenciam a imagem base (needle e la_spread são apenas overlays). */
export const ECHO_TYPES: readonly LayerType[] = ['muscle', 'organ', 'fascia', 'bone', 'artery', 'vein', 'nerve', 'pleura'];

function toPoly(o: Overlay): ScenePoly {
  const pts = parsePoints(o.points);
  return { id: o.id, type: o.type, pts, box: bbox(pts), isLine: LINE_TYPES.has(o.type) };
}

/** Chave de cache: só depende do que realmente altera a imagem. */
export function sceneCacheKey(blockId: string, overlays: readonly Overlay[]): string {
  const relevant = overlays
    .filter((o) => (ECHO_TYPES as readonly string[]).includes(o.type))
    .map((o) => [o.type, o.points]);
  return `${blockId}|v${GENERATOR_VERSION}|${stableHash(relevant)}`;
}

/** Constrói a cena (puro, sem canvas) de forma determinística. */
export function buildScene(blockId: string, overlays: readonly Overlay[], depthCm: number): Scene {
  const polys = overlays.filter((o) => (ECHO_TYPES as readonly string[]).includes(o.type)).map(toPoly);
  const d = Math.max(1, Math.min(20, depthCm || 4));
  // Gordura subcutânea: até a estrutura mais superficial (mín. 70 px, máx. 150 px).
  const topMost = polys.length ? Math.min(...polys.map((p) => p.box.minY)) : 120;
  const fatDepth = Math.max(70, Math.min(150, topMost - 10));
  return {
    blockId,
    seed: fnv1a32(`${blockId}|v${GENERATOR_VERSION}`),
    width: VIEWBOX.w,
    height: VIEWBOX.h,
    depthCm: d,
    pxPerCm: VIEWBOX.h / d,
    fatDepth,
    muscles: polys.filter((p) => p.type === 'muscle'),
    organs: polys.filter((p) => p.type === 'organ'),
    fascias: polys.filter((p) => p.type === 'fascia'),
    bones: polys.filter((p) => p.type === 'bone'),
    vessels: polys.filter((p) => p.type === 'artery' || p.type === 'vein'),
    nerves: polys.filter((p) => p.type === 'nerve'),
    pleurae: polys.filter((p) => p.type === 'pleura'),
  };
}
