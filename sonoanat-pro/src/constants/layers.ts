import type { LayerType } from '@/types';

export interface LayerStyle {
  /** Cor do contorno. */
  stroke: string;
  /** Preenchimento (rgba). */
  fill: string;
  /** Nome curto pt-BR para o botão. */
  name: string;
  /** Nome longo pt-BR. */
  longName: string;
  /** Linha (polyline) em vez de polígono. */
  isLine: boolean;
}

/** Paleta padrão (valores exatos da especificação) + 2 camadas extras. */
export const LAYER_STYLES: Record<LayerType, LayerStyle> = {
  nerve:     { stroke: '#FACC15', fill: 'rgba(250, 204, 21, 0.38)',  name: 'Nervos',   longName: 'Nervos / Plexos',               isLine: false },
  artery:    { stroke: '#EF4444', fill: 'rgba(239, 68, 68, 0.45)',   name: 'Artérias', longName: 'Artérias',                      isLine: false },
  vein:      { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.42)',  name: 'Veias',    longName: 'Veias',                         isLine: false },
  muscle:    { stroke: '#C084FC', fill: 'rgba(168, 85, 247, 0.24)',  name: 'Músculos', longName: 'Músculos / Fáscias',            isLine: false },
  bone:      { stroke: '#F8FAFC', fill: 'rgba(226, 232, 240, 0.35)', name: 'Osso',     longName: 'Osso / Costela / Periósteo',    isLine: false },
  pleura:    { stroke: '#FB923C', fill: 'rgba(249, 115, 22, 0.38)',  name: 'Pleura',   longName: 'Pleura / Peritônio',            isLine: false },
  needle:    { stroke: '#22C55E', fill: 'none',                      name: 'Agulha',   longName: 'Trajeto da Agulha',             isLine: true },
  la_spread: { stroke: '#22D3EE', fill: 'rgba(6, 182, 212, 0.38)',   name: 'AL',       longName: 'Dispersão do Anestésico Local', isLine: false },
  fascia:    { stroke: '#E2E8F0', fill: 'none',                      name: 'Fáscia',   longName: 'Plano Fascial',                 isLine: true },
  organ:     { stroke: '#94A3B8', fill: 'rgba(148, 163, 184, 0.25)', name: 'Órgão',    longName: 'Órgão / Víscera',               isLine: false },
};

/** Os 8 tipos da especificação, na ordem dos botões. */
export const CORE_LAYERS: readonly LayerType[] = [
  'nerve', 'artery', 'vein', 'muscle', 'bone', 'pleura', 'needle', 'la_spread',
];

export const EXTRA_LAYERS: readonly LayerType[] = ['fascia', 'organ'];

/** Ordem de desenho (z): primeiro = mais ao fundo. Nervos e agulha ficam por cima para receber o toque. */
export const LAYER_ORDER: readonly LayerType[] = [
  'bone', 'organ', 'muscle', 'fascia', 'pleura', 'la_spread', 'vein', 'artery', 'nerve', 'needle',
];

export function layerZ(type: LayerType): number {
  return LAYER_ORDER.indexOf(type);
}
