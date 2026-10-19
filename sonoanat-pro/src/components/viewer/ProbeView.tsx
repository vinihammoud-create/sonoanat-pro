import type { EffectiveBlock, ImageSet } from '@/types';
import { AttributionLine } from '@/components/block/AttributionLine';
import { Icon } from '@/components/common/Icon';

/** Foto real do paciente/transdutor, com as instruções objetivas de posicionamento. */
export function ProbeView({ block, image }: { block: EffectiveBlock; image?: ImageSet }) {
  const e = block.ergonomics;
  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
        {image?.baseUrl ? (
          <img src={image.baseUrl} alt={image.attribution?.caption ?? 'Posição do transdutor'} className="max-h-[70vh] w-full object-contain" />
        ) : (
          <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 bg-slate-900 text-slate-500">
            <Icon name="probe" size={36} />
            <p className="text-xs">Foto da posição do transdutor em preparação</p>
          </div>
        )}
      </div>
      {image?.attribution?.caption && <p className="mt-2 text-sm leading-relaxed text-slate-200">{image.attribution.caption}</p>}
      <AttributionLine attribution={image?.attribution} mode="A" compact />
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-slate-100">
        <p>
          <span className="font-semibold text-sky-300">Transdutor: </span>
          {e.probe}; profundidade {e.depthText}. {e.probePosition}
        </p>
        <p>
          <span className="font-semibold text-sky-300">Paciente: </span>
          {e.patientPosition}
        </p>
        <p>
          <span className="font-semibold text-sky-300">Agulha: </span>
          {e.needleApproach}
        </p>
      </div>
    </div>
  );
}
