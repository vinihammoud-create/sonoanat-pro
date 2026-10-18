import { describe, expect, it } from 'vitest';
import { searchBlocks } from '@/data/search';
import { BUILTIN_BLOCKS } from '@/data/blocks';
import { normalizeText } from '@/utils/format';

describe('busca', () => {
  it('normaliza acentos', () => {
    expect(normalizeText('Interescalênico É')).toBe('interescalenico e');
  });

  it('encontra por nome sem acento e por estrutura', () => {
    const r = searchBlocks(BUILTIN_BLOCKS, 'interescalenico');
    expect(r[0]?.block.id).toBe('interscalene');
    const corner = searchBlocks(BUILTIN_BLOCKS, 'corner pocket');
    expect(corner.map((h) => h.block.id)).toContain('supraclavicular');
    const safeno = searchBlocks(BUILTIN_BLOCKS, 'safeno');
    expect(safeno.map((h) => h.block.id)).toContain('adductor_canal');
  });

  it('exige todos os termos e ignora consultas curtas', () => {
    expect(searchBlocks(BUILTIN_BLOCKS, 'x')).toEqual([]);
    expect(searchBlocks(BUILTIN_BLOCKS, 'femoral zzzz')).toEqual([]);
  });
});
