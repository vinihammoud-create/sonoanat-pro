import type { Attribution, ImageMode } from '@/types';
import { Icon } from '@/components/common/Icon';

export function AttributionLine({ attribution, mode, compact }: { attribution?: Attribution; mode: ImageMode; compact?: boolean }) {
  if (mode === 'C' && !attribution) {
    return compact ? null : (
      <p className="mt-2 text-[11px] text-slate-500">
        Imagem: simulação B-mode gerada proceduralmente a partir do esquema anatômico (não é um exame real). Carregue uma foto real no Estúdio para substituí-la.
      </p>
    );
  }
  if (!attribution) return null;
  const who = [attribution.authors, attribution.journal, attribution.year].filter(Boolean).join(', ');
  return (
    <p className={`${compact ? 'mt-1 text-[10px]' : 'mt-2 text-[11px]'} leading-snug text-slate-400`}>
      <Icon name="link" size={11} className="mr-1 inline" />
      Imagem: {who ? `${who}. ` : ''}
      <a href={attribution.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
        {attribution.title}
      </a>
      {attribution.figure ? ` (${attribution.figure})` : ''} ·{' '}
      {attribution.licenseUrl ? (
        <a href={attribution.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {attribution.license}
        </a>
      ) : (
        attribution.license
      )}
    </p>
  );
}
