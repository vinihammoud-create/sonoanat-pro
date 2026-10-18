import { useSyncExternalStore } from 'react';

export interface PwaState {
  offlineReady: boolean;
  needRefresh: boolean;
  updateSW: ((reload?: boolean) => Promise<void>) | null;
}

let state: PwaState = { offlineReady: false, needRefresh: false, updateSW: null };
const subs = new Set<() => void>();

function emit() {
  subs.forEach((s) => s());
}

export const pwaStore = {
  get: () => state,
  set(partial: Partial<PwaState>) {
    state = { ...state, ...partial };
    emit();
  },
  subscribe(cb: () => void) {
    subs.add(cb);
    return () => {
      subs.delete(cb);
    };
  },
};

export function usePwaState(): PwaState {
  return useSyncExternalStore(pwaStore.subscribe, pwaStore.get, pwaStore.get);
}
