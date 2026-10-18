import type { EffectiveBlock } from '@/types';
import { Badge, Card, SectionTitle } from '@/components/common/Card';
import type { IconName } from '@/components/common/Icon';

const TECHNIQUE: Record<string, string> = {
  'in-plane': 'Em plano (in-plane)',
  'out-of-plane': 'Fora de plano (out-of-plane)',
  both: 'Em plano ou fora de plano',
  none: 'Exame diagnóstico (sem agulha)',
};

export function ErgonomicsTab({ block }: { block: EffectiveBlock }) {
  const e = block.ergonomics;
  const items: Array<{ icon: IconName; title: string; body: string; extra?: React.ReactNode }> = [
    { icon: 'probe', title: 'Transdutor', body: e.probe },
    { icon: 'layers', title: 'Profundidade habitual', body: e.depthText, extra: <Badge tone="sky">preset {e.depthCm.toLocaleString('pt-BR')} cm</Badge> },
    { icon: 'move', title: 'Posicionamento do paciente', body: e.patientPosition },
    { icon: 'image', title: 'Posição e varredura do transdutor', body: e.probePosition, extra: <Badge tone="slate">{block.orientation.left} ← → {block.orientation.right}</Badge> },
    { icon: 'needle', title: 'Técnica de inserção da agulha', body: e.needleApproach, extra: <Badge tone="emerald">{TECHNIQUE[e.needleTechnique]}</Badge> },
  ];
  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => (
        <Card key={it.title}>
          <SectionTitle icon={it.icon}>{it.title}</SectionTitle>
          <p className="text-sm leading-relaxed text-slate-200">{it.body}</p>
          {it.extra && <div className="mt-2">{it.extra}</div>}
        </Card>
      ))}
      {e.tips && e.tips.length > 0 && (
        <Card>
          <SectionTitle icon="info">Dicas de ergonomia</SectionTitle>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-200">
            {e.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
