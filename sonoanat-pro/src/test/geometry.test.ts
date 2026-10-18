import { describe, expect, it } from 'vitest';
import { clientToViewBox, flipPointsString, parsePoints, pointInPolygon, pointsToString, viewBoxToClient } from '@/utils/geometry';
import { stableHash } from '@/utils/hash';

describe('geometria', () => {
  it('parse/serialize de pontos', () => {
    expect(parsePoints('10,20  30,40\n50,60')).toEqual([{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }]);
    expect(parsePoints('a,b 1,2')).toEqual([{ x: 1, y: 2 }]);
    expect(pointsToString([{ x: 1.4, y: 2.6 }])).toBe('1,3');
    expect(flipPointsString('100,50 900,50')).toBe('900,50 100,50');
  });

  it('ponto em polígono', () => {
    const sq = parsePoints('0,0 100,0 100,100 0,100');
    expect(pointInPolygon({ x: 50, y: 50 }, sq)).toBe(true);
    expect(pointInPolygon({ x: 150, y: 50 }, sq)).toBe(false);
  });

  it('clientToViewBox: caixa exata 4:3', () => {
    const rect = { left: 0, top: 0, width: 400, height: 300 };
    expect(clientToViewBox(rect, 200, 150)).toEqual({ x: 500, y: 375 });
    expect(clientToViewBox(rect, 0, 0)).toEqual({ x: 0, y: 0 });
    expect(clientToViewBox(rect, 400, 300)).toEqual({ x: 1000, y: 750 });
  });

  it('clientToViewBox: letterbox horizontal (caixa larga)', () => {
    const rect = { left: 100, top: 50, width: 800, height: 300 }; // escala 0.4 → 400x300 centrado com 200 px de margem lateral
    expect(clientToViewBox(rect, 300, 50)).toEqual({ x: 0, y: 0 });
    expect(clientToViewBox(rect, 700, 350)).toEqual({ x: 1000, y: 750 });
    expect(clientToViewBox(rect, 500, 200)).toEqual({ x: 500, y: 375 });
    // fora da imagem: clampa
    expect(clientToViewBox(rect, 100, 50)).toEqual({ x: 0, y: 0 });
  });

  it('clientToViewBox: letterbox vertical (caixa alta) e inverso', () => {
    const rect = { left: 0, top: 0, width: 400, height: 600 }; // escala 0.4 → 400x300 centrado com 150 px acima/abaixo
    expect(clientToViewBox(rect, 200, 300)).toEqual({ x: 500, y: 375 });
    expect(clientToViewBox(rect, 0, 150)).toEqual({ x: 0, y: 0 });
    const back = viewBoxToClient(rect, { x: 500, y: 375 });
    expect(back).toEqual({ x: 200, y: 300 });
  });

  it('stableHash independe da ordem das chaves', () => {
    expect(stableHash({ a: 1, b: [1, 2] })).toBe(stableHash({ b: [1, 2], a: 1 }));
    expect(stableHash({ a: 1 })).not.toBe(stableHash({ a: 2 }));
  });
});
