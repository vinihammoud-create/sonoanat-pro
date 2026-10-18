import { useEffect, useState } from 'react';

async function toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as ArrayBuffer);
    r.onerror = () => reject(r.error ?? new Error('Falha ao ler o blob.'));
    r.readAsArrayBuffer(blob);
  });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await toArrayBuffer(blob));
  let out = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < buf.length; i += CHUNK) {
    out += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + CHUNK)));
  }
  return btoa(out);
}

export function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Cria uma object URL para o blob e a revoga ao desmontar/trocar. */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

export interface DecodedImage {
  width: number;
  height: number;
}

/** Lê dimensões de uma imagem (Blob) usando createImageBitmap ou <img> como fallback. */
export async function readImageSize(blob: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(blob);
      const size = { width: bmp.width, height: bmp.height };
      bmp.close();
      return size;
    } catch {
      // fallback abaixo
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível decodificar a imagem.'));
    };
    img.src = url;
  });
}

/**
 * Redimensiona a imagem para no máximo `maxEdge` px no lado maior e recodifica em WebP
 * (fallback PNG). Mantém o blob original se já for pequeno e de tipo permitido.
 */
export async function normalizeImage(file: Blob, maxEdge = 2000): Promise<{ blob: Blob; width: number; height: number; mime: string }> {
  const { width, height } = await readImageSize(file);
  const allowed = ['image/png', 'image/jpeg', 'image/webp'];
  if (Math.max(width, height) <= maxEdge && allowed.includes(file.type)) {
    return { blob: file, width, height, mime: file.type };
  }
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const bmp = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível.');
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.9));
  if (blob && blob.type === 'image/webp') return { blob, width: w, height: h, mime: 'image/webp' };
  const png = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!png) throw new Error('Falha ao recodificar a imagem.');
  return { blob: png, width: w, height: h, mime: 'image/png' };
}
