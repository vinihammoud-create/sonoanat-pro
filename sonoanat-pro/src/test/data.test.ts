import { describe, expect, it } from 'vitest';
import { BUILTIN_BLOCKS, BLOCK_BY_ID } from '@/data/blocks';
import { CATEGORIES } from '@/data/categories';
import { validateBlock } from '@/data/validate';
import { LAYER_STYLES } from '@/constants/layers';
import { VIEWBOX } from '@/types';
import { bbox, parsePoints } from '@/utils/geometry';

const LEGACY_IDS = [
  'interscalene', 'supraclavicular', 'infraclavicular', 'axillary', 'wrist_block', 'cervical_plexus',
  'adductor_canal', 'femoral', 'peng', 'popliteal_sciatic', 'fascia_iliaca', 'lateral_femoral_cutaneous', 'ankle_block',
  'tap_block', 'esp_block', 'pecs_block', 'quadratus_lumborum',
  'gastric_ultrasound', 'lung_ultrasound', 'vascular_access',
];

describe('banco de bloqueios', () => {
  it('contém os 20 bloqueios legados, com ids únicos', () => {
    const ids = BUILTIN_BLOCKS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice().sort()).toEqual(LEGACY_IDS.slice().sort());
  });

  it('categorias referenciam apenas bloqueios existentes e cobrem todos', () => {
    const all = new Set<string>();
    for (const c of CATEGORIES) {
      for (const id of c.blockIds) {
        expect(BLOCK_BY_ID.has(id), `categoria ${c.id} referencia ${id}`).toBe(true);
        expect(BLOCK_BY_ID.get(id)!.categoryId).toBe(c.id);
        all.add(id);
      }
    }
    expect(all.size).toBe(BUILTIN_BLOCKS.length);
  });

  it.each(BUILTIN_BLOCKS.map((b) => [b.id, b] as const))('%s é válido', (_id, b) => {
    const issues = validateBlock(b);
    expect(issues, JSON.stringify(issues)).toEqual([]);
    expect(b.overlays.length).toBeGreaterThanOrEqual(4);
    const needles = b.overlays.filter((o) => o.type === 'needle');
    if (b.ergonomics.needleTechnique === 'none') expect(needles.length).toBe(0);
    else expect(needles.length).toBeGreaterThanOrEqual(1);
    for (const o of b.overlays) {
      const pts = parsePoints(o.points);
      const isLine = LAYER_STYLES[o.type].isLine;
      expect(pts.length).toBeGreaterThanOrEqual(isLine ? 2 : 3);
      if (o.type === 'needle') expect(pts.length).toBe(2);
      expect(o.label_pos.x).toBeGreaterThanOrEqual(0);
      expect(o.label_pos.x).toBeLessThanOrEqual(VIEWBOX.w);
      expect(o.label_pos.y).toBeGreaterThanOrEqual(0);
      expect(o.label_pos.y).toBeLessThanOrEqual(VIEWBOX.h);
      if (!isLine) {
        const bb = bbox(pts);
        expect(o.label_pos.x, `${b.id}/${o.id} label_pos.x fora do bbox`).toBeGreaterThanOrEqual(bb.minX - 5);
        expect(o.label_pos.x, `${b.id}/${o.id} label_pos.x fora do bbox`).toBeLessThanOrEqual(bb.maxX + 5);
        expect(o.label_pos.y, `${b.id}/${o.id} label_pos.y fora do bbox`).toBeGreaterThanOrEqual(bb.minY - 5);
        expect(o.label_pos.y, `${b.id}/${o.id} label_pos.y fora do bbox`).toBeLessThanOrEqual(bb.maxY + 5);
      }
    }
    if (b.images.mode !== 'C') expect(b.images.attribution, `${b.id}: imagem real exige atribuição`).toBeTruthy();
  });

  it('os dados built-in são imutáveis', () => {
    const b = BUILTIN_BLOCKS[0];
    expect(() => {
      (b.overlays as unknown as unknown[]).push({});
    }).toThrow();
  });
});
