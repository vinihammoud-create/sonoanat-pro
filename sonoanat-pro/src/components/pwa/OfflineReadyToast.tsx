import { useEffect, useState } from 'react';
import { pwaStore, usePwaState } from './pwaStore';
import { Button } from '@/components/common/Button';

export function OfflineReadyToast() {
  const { offlineReady, needRefresh, updateSW } = usePwaState();
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!offlineReady) return;
    setShowOffline(true);
    const t = setTimeout(() => {
      setShowOffline(false);
      pwaStore.set({ offlineReady: false });
    }, 4500);
    return () => clearTimeout(t);
  }, [offlineReady]);

  if (!showOffline && !needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md animate-slide-up rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur safe-pb"
    >
      {needRefresh ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-100">Nova versão disponível.</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => pwaStore.set({ needRefresh: false })}>
              Depois
            </Button>
            <Button size="sm" onClick={() => updateSW?.(true)}>
              Atualizar
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-emerald-300">Pronto para uso offline.</p>
      )}
    </div>
  );
}
