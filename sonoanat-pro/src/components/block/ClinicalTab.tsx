import type { EffectiveBlock } from '@/types';
import { Card, SectionTitle, WarningBox } from '@/components/common/Card';

export function ClinicalTab({ block }: { block: EffectiveBlock }) {
  const c = block.clinical;
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <SectionTitle icon="check">Indicações</SectionTitle>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-200">
          {c.indications.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Card>

      {c.contraindications && c.contraindications.length > 0 && (
        <Card>
          <SectionTitle icon="close">Contraindicações e cautelas</SectionTitle>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-200">
            {c.contraindications.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <SectionTitle icon="pill">Anestésico local e doses</SectionTitle>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {c.doses.map((d, i) => (
              <tr key={i} className="border-t border-slate-800 first:border-t-0">
                <th scope="row" className="w-[38%] py-2 pr-2 text-left align-top text-xs font-semibold text-sky-300">
                  {d.title}
                </th>
                <td className="py-2 align-top leading-relaxed text-slate-200">{d.regimen}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-slate-500">
          Material educativo. Ajuste doses ao peso, à idade e às comorbidades; respeite as doses máximas e as diretrizes locais.
        </p>
      </Card>

      <WarningBox title="Pérolas e armadilhas">
        <ul className="list-disc space-y-1.5 pl-5">
          {c.pearls.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </WarningBox>

      <Card>
        <SectionTitle icon="book">Referências</SectionTitle>
        <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed text-slate-300">
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
              {!r.doi && r.url && (
                <>
                  {' '}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">
                    link
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
