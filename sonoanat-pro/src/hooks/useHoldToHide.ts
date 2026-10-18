import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';

/**
 * Handlers para um botão "segure para esconder": esconde enquanto pressionado
 * (mouse, toque ou caneta) e reaparece ao soltar/cancelar/sair.
 */
export function useHoldToHide(setHidden: (on: boolean) => void) {
  const active = useRef(false);

  const release = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    setHidden(false);
  }, [setHidden]);

  useEffect(() => {
    // Segurança: se o ponteiro for solto fora do botão (ou a aba perder o foco), reexibe.
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, [release]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // alguns navegadores lançam se o ponteiro já foi liberado
      }
      active.current = true;
      setHidden(true);
    },
    [setHidden],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!active.current) {
          active.current = true;
          setHidden(true);
        }
      }
    },
    [setHidden],
  );

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        release();
      }
    },
    [release],
  );

  return {
    onPointerDown,
    onPointerUp: release,
    onPointerCancel: release,
    onPointerLeave: release,
    onKeyDown,
    onKeyUp,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}
