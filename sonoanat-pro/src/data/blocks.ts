import type { Block } from '@/types';
import { CATEGORIES } from './categories';

import { interscalene } from './blocks/upper/interscalene';
import { supraclavicular } from './blocks/upper/supraclavicular';
import { infraclavicular } from './blocks/upper/infraclavicular';
import { axillary } from './blocks/upper/axillary';
import { wristBlock } from './blocks/upper/wrist_block';
import { cervicalPlexus } from './blocks/upper/cervical_plexus';

import { femoral } from './blocks/lower/femoral';
import { fasciaIliaca } from './blocks/lower/fascia_iliaca';
import { peng } from './blocks/lower/peng';
import { lateralFemoralCutaneous } from './blocks/lower/lateral_femoral_cutaneous';
import { adductorCanal } from './blocks/lower/adductor_canal';
import { poplitealSciatic } from './blocks/lower/popliteal_sciatic';
import { ankleBlock } from './blocks/lower/ankle_block';

import { tapBlock } from './blocks/trunk/tap_block';
import { espBlock } from './blocks/trunk/esp_block';
import { pecsBlock } from './blocks/trunk/pecs_block';
import { quadratusLumborum } from './blocks/trunk/quadratus_lumborum';

import { gastricUltrasound } from './blocks/pocus/gastric_ultrasound';
import { lungUltrasound } from './blocks/pocus/lung_ultrasound';
import { vascularAccess } from './blocks/pocus/vascular_access';

function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const v of Object.values(obj as Record<string, unknown>)) deepFreeze(v);
  }
  return obj;
}

const ALL: Block[] = [
  interscalene, supraclavicular, infraclavicular, axillary, wristBlock, cervicalPlexus,
  femoral, fasciaIliaca, peng, lateralFemoralCutaneous, adductorCanal, poplitealSciatic, ankleBlock,
  tapBlock, espBlock, pecsBlock, quadratusLumborum,
  gastricUltrasound, lungUltrasound, vascularAccess,
];

/** Ordena conforme a ordem das categorias e dos blockIds de cada categoria. */
const ORDER = new Map<string, number>();
CATEGORIES.forEach((c, ci) => c.blockIds.forEach((id, bi) => ORDER.set(id, ci * 100 + bi)));
ALL.sort((a, b) => (ORDER.get(a.id) ?? 9999) - (ORDER.get(b.id) ?? 9999));

export const BUILTIN_BLOCKS: readonly Block[] = deepFreeze(ALL);
export const BLOCK_BY_ID: ReadonlyMap<string, Block> = new Map(BUILTIN_BLOCKS.map((b) => [b.id, b]));

export function blocksOfCategory(categoryId: string): Block[] {
  return BUILTIN_BLOCKS.filter((b) => b.categoryId === categoryId);
}
