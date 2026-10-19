import type React from 'react';
import type { EffectiveBlock } from '@/types';

const TECHNIQUE: Record<string, string> = {
  'in-plane': 'em plano (in-plane)',
  'out-of-plane': 'fora de plano (out-of-plane)',
  both: 'em plano ou fora de plano',
  none: 'exame diagnóstico, sem agulha',
};

function Row({ label, tone = 'sky', children }: { label: string; tone?: 'sky' | 'rose' | 'amber' | 'emerald'; children: React.ReactNode }) {
  const color = { sky: 'text-sky-300', rose: 'text-rose-300', amber: 'text-amber-300', emerald: 'text-emerald-300' }[tone];
  return (
    <p className="text-[15px] leading-relaxed text-slate-100">
      <span className={`font-semibold ${color}`}>{label}: </span>
      {children}
    </p>
  );
}

/** Notas do bloqueio no estilo "ficha": indicações, posicionamento, volume, efeitos, complicações, dicas. */
export function NotesTab({ block }: { block: EffectiveBlock }) {
  const e = block.ergonomics;
  const c = block.clinical;
  const join = (xs: string[]) => xs.map((x, i) => (i === 0 ? x : x.charAt(0).toLowerCase() + x.slice(1))).join('; ') + '.';
  return (
    <div className="flex flex-col gap-4 py-1">
      <Row label="Indicações">{join(c.indications)}</Row>
      <Row label="Posicionamento">{e.patientPosition}</Row>
      <Row label="Transdutor">
        {e.probe}; profundidade {e.depthText}. {e.probePosition}
      </Row>
      <Row label="Agulha">
        {e.needleApproach} <span className="text-slate-400">({TECHNIQUE[e.needleTechnique]})</span>
      </Row>
      {c.doses.map((d, i) => (
        <Row key={i} label={d.title} tone={d.title.startsWith('Doses máximas') ? 'amber' : 'sky'}>
          {d.regimen}
        </Row>
      ))}
      {c.contraindications && c.contraindications.length > 0 && <Row label="Contraindicações" tone="rose">{join(c.contraindications)}</Row>}
      <div>
        <p className="mb-1 text-[15px] font-semibold text-rose-300">Pérolas e complicações:</p>
        <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-100">
          {c.pearls.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      {e.tips && e.tips.length > 0 && (
        <div>
          <p className="mb-1 text-[15px] font-semibold text-amber-300">Dicas de sonoanatomia:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-100">
            {e.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      <Row label="Como reconhecer" tone="emerald">{block.summary}</Row>
      <div>
        <p className="mb-1 text-[15px] font-semibold text-slate-300">Referências:</p>
        <ol className="list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-400">
          {c.references.map((r, i) => (
            <li key={i}>
              {r.citation}
              {r.doi && (
                <>
                  {' '}
                  <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">
                    doi:{r.doi}
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
      <p className="text-[11px] text-slate-500">Material educativo. Ajuste doses ao peso, à idade e às comorbidades; respeite as doses máximas e as diretrizes locais.</p>
    </div>
  );
}
