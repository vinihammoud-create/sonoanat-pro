import type { Category } from '@/types';

export const CATEGORIES: readonly Category[] = Object.freeze([
  {
    id: 'upper_extremity',
    title: 'Membro Superior',
    subtitle: 'Plexo braquial e nervos periféricos',
    bannerUrl: 'images/banners/upper.webp',
    blockIds: ['interscalene', 'supraclavicular', 'infraclavicular', 'axillary', 'wrist_block', 'cervical_plexus'],
  },
  {
    id: 'lower_extremity',
    title: 'Membro Inferior',
    subtitle: 'Bloqueios lombares, sacrais e distais',
    bannerUrl: 'images/banners/lower.webp',
    blockIds: ['femoral', 'fascia_iliaca', 'peng', 'lateral_femoral_cutaneous', 'adductor_canal', 'popliteal_sciatic', 'ankle_block'],
  },
  {
    id: 'trunk_abdomen',
    title: 'Parede Torácica e Abdominal',
    subtitle: 'Bloqueios de plano fascial',
    bannerUrl: 'images/banners/trunk.webp',
    blockIds: ['tap_block', 'esp_block', 'pecs_block', 'quadratus_lumborum'],
  },
  {
    id: 'pocus_sonoanatomy',
    title: 'Sonoanatomia Clínica & POCUS',
    subtitle: 'Antro gástrico, pulmão e acesso vascular',
    bannerUrl: 'images/banners/pocus.webp',
    blockIds: ['gastric_ultrasound', 'lung_ultrasound', 'vascular_access'],
  },
]);

export const CATEGORY_BY_ID: ReadonlyMap<string, Category> = new Map(CATEGORIES.map((c) => [c.id, c]));
