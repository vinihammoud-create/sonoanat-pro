/** Dimensões do viewBox de todos os overlays (coordenadas internas). */
export const VIEWBOX = { w: 1000, h: 750 } as const;

/** Os 8 tipos obrigatórios da especificação + 2 extras (fáscia, órgão). */
export type LayerType =
  | 'nerve'
  | 'artery'
  | 'vein'
  | 'muscle'
  | 'bone'
  | 'pleura'
  | 'needle'
  | 'la_spread'
  | 'fascia'
  | 'organ';

export const LAYER_TYPES: readonly LayerType[] = [
  'nerve', 'artery', 'vein', 'muscle', 'bone', 'pleura', 'needle', 'la_spread', 'fascia', 'organ',
] as const;

export interface Overlay {
  /** Único dentro do bloqueio, ex.: "sc-artery". */
  id: string;
  type: LayerType;
  /** Rótulo pt-BR mostrado na imagem. */
  label: string;
  /** "x,y x,y ..." em coordenadas 1000x750. needle e fascia = polyline (>= 2 pontos); demais = polígono (>= 3). */
  points: string;
  /** Posição do rótulo em coordenadas 1000x750. */
  label_pos: { x: number; y: number };
  /** Nota clínica / descrição. */
  note?: string;
  /** Aspecto ecográfico (ex.: "hipoecoico, favo de mel"). */
  echo?: string;
  /** Alerta clínico (mostrado em destaque). */
  alert?: string;
}

export type NeedleTechnique = 'in-plane' | 'out-of-plane' | 'both' | 'none';

export interface Ergonomics {
  /** Ex.: "Linear de alta frequência (10–15 MHz)". */
  probe: string;
  /** Profundidade típica em cm (define a régua e o gerador). */
  depthCm: number;
  /** Texto livre da profundidade, ex.: "2,0 a 3,5 cm". */
  depthText: string;
  patientPosition: string;
  probePosition: string;
  needleApproach: string;
  needleTechnique: NeedleTechnique;
  tips?: string[];
}

export interface Dose {
  title: string;
  regimen: string;
}

export interface Reference {
  citation: string;
  doi?: string;
  url?: string;
}

export interface Clinical {
  indications: string[];
  doses: Dose[];
  /** Pérolas e armadilhas. */
  pearls: string[];
  contraindications?: string[];
  references: Reference[];
}

export interface Attribution {
  title: string;
  authors?: string;
  journal?: string;
  year?: string;
  /** Ex.: "CC BY 4.0". */
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
  pmcid?: string;
  figure?: string;
  /** Descrição curta do que a imagem mostra (legenda original resumida). */
  caption?: string;
}

/** A = imagem base + SVG; B = par base/anotada; C = gerador procedural. */
export type ImageMode = 'A' | 'B' | 'C';

export interface ImageSet {
  mode: ImageMode;
  /** URL pública (built-in) da imagem base, modos A e B. */
  baseUrl?: string;
  /** URL pública (built-in) da imagem anotada, modo B. */
  annotatedUrl?: string;
  /** Id de imagem do usuário (tabela images), modos A e B. */
  baseImageId?: string;
  annotatedImageId?: string;
  attribution?: Attribution;
}

export interface Orientation {
  left: string;
  right: string;
}

export interface Block {
  id: string;
  categoryId: string;
  name: string;
  shortName: string;
  subtitle: string;
  /** Alvo anatômico. */
  target: string;
  /** Descrição sonoanatômica em prosa. */
  summary: string;
  orientation: Orientation;
  ergonomics: Ergonomics;
  clinical: Clinical;
  overlays: Overlay[];
  images: ImageSet;
  /** Imagens reais adicionais (galeria), com atribuição. */
  gallery?: ImageSet[];
  tags?: string[];
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  bannerUrl: string;
  blockIds: string[];
}

/* ------------------------------------------------------------------ */
/* Dados do usuário (IndexedDB)                                        */
/* ------------------------------------------------------------------ */

export interface BlockOverride {
  blockId: string;
  /** Substitui integralmente os overlays built-in quando presente. */
  overlays?: Overlay[];
  /** Substitui o conjunto de imagens built-in quando presente. */
  images?: ImageSet;
  updatedAt: number;
}

export type ImageRole = 'base' | 'annotated';

export interface ImageRow {
  id: string;
  blockId: string;
  role: ImageRole;
  blob: Blob;
  mime: string;
  width: number;
  height: number;
  attribution?: Attribution;
  createdAt: number;
}

export interface GeneratedImageRow {
  /** blockId|GEN_VERSION|hash(overlays) */
  key: string;
  blockId: string;
  blob: Blob;
  createdAt: number;
}

export interface SettingRow {
  key: string;
  value: unknown;
}

export interface FavoriteRow {
  blockId: string;
  addedAt: number;
}

/** Bloco com overrides do usuário aplicados e imagens do usuário anexadas. */
export interface EffectiveBlock extends Block {
  isModified: boolean;
  userImages: ImageRow[];
}

export interface BackupImage extends Omit<ImageRow, 'blob'> {
  dataBase64: string;
}

export interface BackupFile {
  app: 'sonoanat-pro';
  schemaVersion: 1;
  exportedAt: string;
  overrides: BlockOverride[];
  images: BackupImage[];
  settings: SettingRow[];
  favorites: FavoriteRow[];
}

export interface AppSettings {
  defaultOpacity: number;
  defaultLabelsOn: boolean;
  defaultFlipped: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  defaultOpacity: 85,
  defaultLabelsOn: true,
  defaultFlipped: false,
};
