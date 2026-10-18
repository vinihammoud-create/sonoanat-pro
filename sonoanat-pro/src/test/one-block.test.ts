/// <reference types="node" />
/**
 * Validação de UM arquivo de bloqueio, sem depender de src/data/blocks.ts.
 * Uso: BLOCK_FILE=src/data/blocks/upper/axillary.ts npx vitest run src/test/one-block.test.ts
 */
import { describe, expect, it } from 'vitest';
import type { Block } from '@/types';
import { validateBlock } from '@/data/validate';
import { LAYER_STYLES } from '@/constants/layers';
import { bbox, centroid, parsePoints, pointInPolygon } from '@/utils/geometry';

const rel = process.env.BLOCK_FILE;

describe('arquivo de bloqueio', () => {
  it.skipIf(!rel)('BLOCK_FILE definido', () => {
    expect(rel, 'defina BLOCK_FILE=src/data/blocks/<cat>/<id>.ts').toBeTruthy();
  });

  it.skipIf(!rel)('exporta um Block válido e clinicamente consistente', async () => {
    if (!rel) return;
    const mod = (await import(/* @vite-ignore */ `/${rel}`)) as Record<string, unknown>;
    const blocks = Object.values(mod).filter((v) => v && typeof v === 'object' && 'overlays' in (v as object)) as Block[];
    expect(blocks.length, 'o arquivo deve exportar exatamente 1 Block').toBe(1);
    const b = blocks[0];

    const issues = validateBlock(b);
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);

    const expectedId = rel.split('/').pop()!.replace(/\.ts$/, '');
    expect(b.id).toBe(expectedId);

    expect(b.overlays.length, 'mínimo de 4 overlays').toBeGreaterThanOrEqual(4);

    const needles = b.overlays.filter((o) => o.type === 'needle');
    if (b.ergonomics.needleTechnique === 'none') {
      expect(needles.length, 'bloco sem agulha não deve ter overlay needle').toBe(0);
    } else {
      expect(needles.length, 'bloco com agulha precisa de 1 overlay needle').toBeGreaterThanOrEqual(1);
      for (const n of needles) expect(parsePoints(n.points).length, 'agulha = 2 pontos').toBe(2);
    }

    const warnings: string[] = [];
    for (const o of b.overlays) {
      const pts = parsePoints(o.points);
      const isLine = LAYER_STYLES[o.type].isLine;
      const lp = o.label_pos;
      if (!isLine) {
        const bb = bbox(pts);
        const inside = lp.x >= bb.minX - 5 && lp.x <= bb.maxX + 5 && lp.y >= bb.minY - 5 && lp.y <= bb.maxY + 5;
        if (!inside) warnings.push(`${o.id}: label_pos fora do bbox do polígono`);
        else if (!pointInPolygon(lp, pts)) warnings.push(`${o.id}: label_pos dentro do bbox mas fora do polígono (ok se for intencional)`);
        const c = centroid(pts);
        if (Math.hypot(c.x - lp.x, c.y - lp.y) > 400) warnings.push(`${o.id}: label_pos muito longe do centroide`);
        const area = Math.abs(
          pts.reduce((acc, p, i) => {
            const q = pts[(i + 1) % pts.length];
            return acc + (p.x * q.y - q.x * p.y);
          }, 0) / 2,
        );
        expect(area, `${o.id}: polígono degenerado (área ~0)`).toBeGreaterThan(200);
      }
      if (!o.note && !o.echo) warnings.push(`${o.id}: sem note/echo`);
      if ((o.type === 'nerve' || o.type === 'artery' || o.type === 'pleura') && !o.alert) warnings.push(`${o.id}: ${o.type} sem alert`);
    }
    if (warnings.length) console.warn(`[${b.id}] avisos:\n - ${warnings.join('\n - ')}`);

    // texto clínico mínimo
    expect(b.clinical.doses.some((d) => d.title.startsWith('Doses máximas')) || b.ergonomics.needleTechnique === 'none',
      'incluir MAX_DOSE_ROW (de ../shared) em blocos com AL').toBe(true);
    expect(b.summary.length).toBeGreaterThan(80);
    expect(b.ergonomics.probePosition.length).toBeGreaterThan(30);
  });
});
