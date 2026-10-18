import { Outlet, ScrollRestoration } from 'react-router-dom';
import { OfflineReadyToast } from '@/components/pwa/OfflineReadyToast';

export function AppShell() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 safe-pt">
      <div className="mx-auto w-full max-w-md px-4 pb-8 safe-pb md:max-w-2xl lg:max-w-3xl">
        <Outlet />
      </div>
      <OfflineReadyToast />
      <ScrollRestoration />
    </div>
  );
}
