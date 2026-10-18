import type { Block } from '@/types';
import { normalizeText } from '@/utils/format';

interface IndexEntry {
  block: Block;
  /** Texto de alta prioridade (nome, alvo, tags). */
  primary: string;
  /** Texto secundário (indicações, resumo, estruturas). */
  secondary: string;
}

let cache: { source: readonly Block[]; entries: IndexEntry[] } | null = null;

function buildIndex(blocks: readonly Block[]): IndexEntry[] {
  return blocks.map((b) => ({
    block: b,
    primary: normalizeText([b.name, b.shortName, b.subtitle, b.target, ...(b.tags ?? [])].join(' | ')),
    secondary: normalizeText(
      [
        b.summary,
        ...b.clinical.indications,
        ...b.clinical.pearls,
        ...b.overlays.map((o) => o.label),
        b.ergonomics.probe,
        b.ergonomics.needleApproach,
      ].join(' | '),
    ),
  }));
}

export interface SearchHit {
  block: Block;
  score: number;
}

/** Busca sem acentos; todos os termos devem aparecer. Resultado ordenado por relevância. */
export function searchBlocks(blocks: readonly Block[], query: string): SearchHit[] {
  const q = normalizeText(query);
  if (q.length < 2) return [];
  if (!cache || cache.source !== blocks) cache = { source: blocks, entries: buildIndex(blocks) };
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const e of cache.entries) {
    let score = 0;
    let ok = true;
    for (const t of terms) {
      const inPrimary = e.primary.includes(t);
      const inSecondary = e.secondary.includes(t);
      if (!inPrimary && !inSecondary) { ok = false; break; }
      score += inPrimary ? 3 : 1;
      if (e.primary.startsWith(t)) score += 2;
    }
    if (ok) hits.push({ block: e.block, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.block.name.localeCompare(b.block.name, 'pt-BR'));
}
