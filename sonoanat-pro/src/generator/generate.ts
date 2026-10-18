import type { Overlay } from '@/types';
import { buildScene } from './scene';
import { renderScene, type Ctx2D } from './render';

interface CanvasLike {
  getContext(type: '2d'): unknown;
  toBlob?: (cb: (b: Blob | null) => void, type?: string, quality?: number) => void;
  convertToBlob?: (opts?: { type?: string; quality?: number }) => Promise<Blob>;
}

function makeCanvas(w: number, h: number): CanvasLike {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h) as unknown as CanvasLike;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c as unknown as CanvasLike;
}

async function toBlob(canvas: CanvasLike): Promise<Blob> {
  if (canvas.convertToBlob) {
    try {
      const b = await canvas.convertToBlob({ type: 'image/webp', quality: 0.9 });
      if (b.type === 'image/webp') return b;
    } catch {
      // fallback abaixo
    }
    return canvas.convertToBlob({ type: 'image/png' });
  }
  const tryType = (type: string, q?: number) =>
    new Promise<Blob | null>((res) => canvas.toBlob!((b) => res(b), type, q));
  const webp = await tryType('image/webp', 0.9);
  if (webp && webp.type === 'image/webp') return webp;
  const png = await tryType('image/png');
  if (!png) throw new Error('Falha ao gerar a imagem.');
  return png;
}

/** Gera a imagem B-mode sintética do bloqueio (determinística por blockId + overlays). */
export async function generateUltrasound(blockId: string, overlays: readonly Overlay[], depthCm: number): Promise<Blob> {
  const scene = buildScene(blockId, overlays, depthCm);
  const canvas = makeCanvas(scene.width, scene.height);
  const ctx = canvas.getContext('2d') as Ctx2D | null;
  if (!ctx) throw new Error('Canvas 2D indisponível neste dispositivo.');
  renderScene(ctx, scene);
  return toBlob(canvas);
}
