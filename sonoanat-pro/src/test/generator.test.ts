import { describe, expect, it } from 'vitest';
import { Rng } from '@/generator/prng';
import { buildScene, sceneCacheKey } from '@/generator/scene';
import { renderScene, type Ctx2D } from '@/generator/render';
import { BLOCK_BY_ID } from '@/data/blocks';

/** Contexto falso que registra todas as chamadas (determinismo verificável sem canvas). */
function recordingCtx(w = 1000, h = 750): { ctx: Ctx2D; log: string[] } {
  const log: string[] = [];
  const data = new Uint8ClampedArray(w * h * 4).fill(40);
  const imageData = { data, width: w, height: h, colorSpace: 'srgb' } as unknown as ImageData;
  const gradient = { addColorStop: (o: number, c: string) => log.push(`stop:${o}:${c}`) } as unknown as CanvasGradient;
  const target: Record<string, unknown> = {
    fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, font: '', textAlign: 'left', lineCap: 'butt',
    getImageData: () => imageData,
    putImageData: () => log.push('putImageData'),
    createLinearGradient: (...a: number[]) => { log.push(`lg:${a.join(',')}`); return gradient; },
    createRadialGradient: (...a: number[]) => { log.push(`rg:${a.join(',')}`); return gradient; },
  };
  const ctx = new Proxy(target, {
    get(t, prop: string) {
      if (prop in t) return t[prop];
      return (...args: unknown[]) => log.push(`${prop}:${args.map((a) => (typeof a === 'number' ? a.toFixed(2) : String(a))).join(',')}`);
    },
    set(t, prop: string, value) {
      t[prop] = value;
      log.push(`set:${prop}=${String(value)}`);
      return true;
    },
  }) as unknown as Ctx2D;
  return { ctx, log };
}

describe('gerador procedural', () => {
  it('PRNG é determinístico para a mesma seed', () => {
    const a = new Rng(12345);
    const b = new Rng(12345);
    const sa = Array.from({ length: 1000 }, () => a.next());
    const sb = Array.from({ length: 1000 }, () => b.next());
    expect(sa).toEqual(sb);
    expect(sa.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(new Rng(1).next()).not.toBe(new Rng(2).next());
  });

  it('buildScene é puro e determinístico', () => {
    const b = BLOCK_BY_ID.get('supraclavicular')!;
    const s1 = buildScene(b.id, b.overlays, b.ergonomics.depthCm);
    const s2 = buildScene(b.id, b.overlays, b.ergonomics.depthCm);
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2));
    expect(s1.bones.length).toBeGreaterThan(0);
    expect(s1.vessels.length).toBeGreaterThan(0);
    expect(s1.nerves.length).toBeGreaterThan(0);
  });

  it('chave de cache ignora agulha e AL, mas muda com os ecos', () => {
    const b = BLOCK_BY_ID.get('femoral')!;
    const k1 = sceneCacheKey(b.id, b.overlays);
    const noNeedle = b.overlays.filter((o) => o.type !== 'needle' && o.type !== 'la_spread');
    expect(sceneCacheKey(b.id, noNeedle)).toBe(k1);
    const moved = b.overlays.map((o) => (o.type === 'artery' ? { ...o, points: '10,10 20,10 20,20' } : o));
    expect(sceneCacheKey(b.id, moved)).not.toBe(k1);
  });

  it('renderScene produz a mesma sequência de chamadas para o mesmo bloco e sequências diferentes para blocos diferentes', () => {
    const a = BLOCK_BY_ID.get('interscalene')!;
    const b = BLOCK_BY_ID.get('tap_block')!;
    const r1 = recordingCtx();
    const r2 = recordingCtx();
    const r3 = recordingCtx();
    renderScene(r1.ctx, buildScene(a.id, a.overlays, a.ergonomics.depthCm));
    renderScene(r2.ctx, buildScene(a.id, a.overlays, a.ergonomics.depthCm));
    renderScene(r3.ctx, buildScene(b.id, b.overlays, b.ergonomics.depthCm));
    expect(r1.log.length).toBeGreaterThan(100);
    expect(r1.log).toEqual(r2.log);
    expect(r1.log).not.toEqual(r3.log);
    expect(r1.log.at(-1)).toMatch(/restore/);
  });

  it('renderiza todos os 20 bloqueios sem lançar', () => {
    for (const b of BLOCK_BY_ID.values()) {
      const { ctx } = recordingCtx();
      expect(() => renderScene(ctx, buildScene(b.id, b.overlays, b.ergonomics.depthCm))).not.toThrow();
    }
  });
});
