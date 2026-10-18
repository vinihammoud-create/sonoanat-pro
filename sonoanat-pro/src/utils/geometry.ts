import { VIEWBOX } from '@/types';

export type Point = { x: number; y: number };

/** Converte "x,y x,y ..." em pontos. Ignora entradas inválidas. */
export function parsePoints(points: string): Point[] {
  return points
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const [xs, ys] = pair.split(',');
      return { x: Number(xs), y: Number(ys) };
    })
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}

export function pointsToString(pts: Point[]): string {
  return pts.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(' ');
}

/** Espelha horizontalmente dentro do viewBox. */
export function flipPointsString(points: string): string {
  return pointsToString(parsePoints(points).map((p) => ({ x: VIEWBOX.w - p.x, y: p.y })));
}

export function bbox(pts: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  if (pts.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

export function centroid(pts: Point[]): Point {
  if (pts.length === 0) return { x: 0, y: 0 };
  const s = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: s.x / pts.length, y: s.y / pts.length };
}

/** Teste ponto-em-polígono (ray casting). */
export function pointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Distância ponto-segmento. */
export function distanceToSegment(p: Point, a: Point, b: Point): number {
  const l2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  if (l2 === 0) return distance(p, a);
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return distance(p, { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
}

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Converte coordenadas de cliente (clientX/clientY) para o espaço do viewBox 1000x750,
 * considerando letterbox (object-fit: contain / preserveAspectRatio meet) dentro de `rect`.
 */
export function clientToViewBox(rect: RectLike, clientX: number, clientY: number): Point {
  const s = Math.min(rect.width / VIEWBOX.w, rect.height / VIEWBOX.h);
  const dw = VIEWBOX.w * s;
  const dh = VIEWBOX.h * s;
  const ox = rect.left + (rect.width - dw) / 2;
  const oy = rect.top + (rect.height - dh) / 2;
  const x = (clientX - ox) / s;
  const y = (clientY - oy) / s;
  return {
    x: Math.max(0, Math.min(VIEWBOX.w, x)),
    y: Math.max(0, Math.min(VIEWBOX.h, y)),
  };
}

/** Inverso de clientToViewBox (útil para posicionar handles). */
export function viewBoxToClient(rect: RectLike, p: Point): Point {
  const s = Math.min(rect.width / VIEWBOX.w, rect.height / VIEWBOX.h);
  const dw = VIEWBOX.w * s;
  const dh = VIEWBOX.h * s;
  const ox = rect.left + (rect.width - dw) / 2;
  const oy = rect.top + (rect.height - dh) / 2;
  return { x: ox + p.x * s, y: oy + p.y * s };
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
