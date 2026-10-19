import type { Overlay } from '@/types';
import { LAYER_STYLES } from '@/constants/layers';
import { Icon } from '@/components/common/Icon';

export interface StructureInspectorProps {
  overlay: Overlay | null;
  onClose: () => void;
}

/** Descrição da estrutura ativa: aspecto ecográfico, nota e alerta. */
export function StructureInspector({ overlay, onClose }: StructureInspectorProps) {
  if (!overlay) return null;
  const st = LAYER_STYLES[overlay.type];
  return (
    <div className="mt-3 animate-slide-up rounded-xl border bg-slate-900/90 p-3 text-sm" style={{ borderColor: st.stroke }} aria-live="polite">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: st.stroke }} />
          <p className="font-semibold text-slate-100">{overlay.label}</p>
          <span className="text-[11px] text-slate-400">{st.longName}</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar" className="-m-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800">
          <Icon name="close" size={16} />
        </button>
      </div>
      {overlay.echo && (
        <p className="mt-1.5 text-slate-300">
          <span className="font-semibold text-slate-200">Na imagem: </span>
          {overlay.echo}
        </p>
      )}
      {overlay.note && <p className="mt-1 text-slate-300">{overlay.note}</p>}
      {overlay.alert && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-950/60 px-2 py-1.5 text-amber-200">
          <Icon name="warning" size={16} className="mt-0.5 shrink-0" />
          <span>{overlay.alert}</span>
        </p>
      )}
    </div>
  );
}
