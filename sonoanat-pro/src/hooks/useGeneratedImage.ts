import { useEffect, useState } from 'react';
import type { Overlay } from '@/types';
import { getOrRenderGenerated } from '@/generator/cache';
import { sceneCacheKey } from '@/generator/scene';

export interface GeneratedImageState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

/** Retorna a object URL da imagem procedural (modo C), com cache e revogação automática. */
export function useGeneratedImage(blockId: string, overlays: readonly Overlay[], depthCm: number, enabled = true): GeneratedImageState {
  const key = enabled ? sceneCacheKey(blockId, overlays) : '';
  const [state, setState] = useState<GeneratedImageState>({ url: null, loading: enabled, error: null });

  useEffect(() => {
    if (!enabled) {
      setState({ url: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    let url: string | null = null;
    setState((s) => ({ ...s, loading: true, error: null }));
    const run = () =>
      getOrRenderGenerated(blockId, overlays, depthCm)
        .then((blob) => {
          if (cancelled) return;
          url = URL.createObjectURL(blob);
          setState({ url, loading: false, error: null });
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          setState({ url: null, loading: false, error: e instanceof Error ? e.message : 'Falha ao gerar a imagem.' });
        });
    // Deixa a UI pintar antes de renderizar o canvas.
    const t = setTimeout(run, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, blockId, depthCm]);

  return state;
}
