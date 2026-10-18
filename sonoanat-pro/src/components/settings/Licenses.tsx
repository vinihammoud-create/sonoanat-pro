import { TopBar } from '@/components/layout/TopBar';
import { Card, SectionTitle } from '@/components/common/Card';
import { BUILTIN_BLOCKS } from '@/data/blocks';
import { AttributionLine } from '@/components/block/AttributionLine';
import type { Attribution } from '@/types';

export function Licenses() {
  const entries: Array<{ blockName: string; attribution: Attribution }> = [];
  for (const b of BUILTIN_BLOCKS) {
    if (b.images.attribution) entries.push({ blockName: b.name, attribution: b.images.attribution });
    for (const g of b.gallery ?? []) if (g.attribution) entries.push({ blockName: b.name, attribution: g.attribution });
  }
  return (
    <div>
      <TopBar title="Licenças e fontes" showBack backTo="/settings" />
      <Card className="mb-3">
        <SectionTitle icon="image">Imagens de ultrassom reais</SectionTitle>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-300">Nenhuma imagem real de terceiros incluída nesta versão; todas as imagens são simulações geradas pelo app.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((e, i) => (
              <li key={i} className="border-t border-slate-800 pt-2 first:border-t-0 first:pt-0">
                <p className="text-sm font-semibold text-slate-200">{e.blockName}</p>
                <AttributionLine attribution={e.attribution} mode="A" compact />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-500">
          Imagens sob licença Creative Commons Attribution (CC BY) foram obtidas de artigos de acesso aberto indexados no PubMed Central / Europe PMC, sem modificação além de recorte e redimensionamento.
        </p>
      </Card>
      <Card>
        <SectionTitle icon="book">Bibliotecas de código aberto</SectionTitle>
        <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
          <li>React, React Router (MIT)</li>
          <li>Vite, vite-plugin-pwa, Workbox (MIT)</li>
          <li>Tailwind CSS (MIT)</li>
          <li>Dexie.js (Apache-2.0)</li>
          <li>react-zoom-pan-pinch (MIT)</li>
        </ul>
      </Card>
    </div>
  );
}
