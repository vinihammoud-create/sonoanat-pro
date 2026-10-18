import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App';
import { pwaStore } from '@/components/pwa/pwaStore';

const updateSW = registerSW({
  immediate: true,
  onOfflineReady() {
    pwaStore.set({ offlineReady: true });
  },
  onNeedRefresh() {
    pwaStore.set({ needRefresh: true });
  },
});
pwaStore.set({ updateSW });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
