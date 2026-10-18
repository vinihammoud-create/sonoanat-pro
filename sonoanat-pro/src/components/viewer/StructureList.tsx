import type { LayerType, Overlay } from '@/types';
import { LAYER_STYLES, layerZ } from '@/constants/layers';
import { cx } from '@/utils/format';

export interface StructureListProps {
  overlays: readonly Overlay[];
  selectedId: string | null;
  visible: Record<LayerType, boolean>;
  onSelect: (id: string | null) => void;
  onEnsureVisible: (layer: LayerType) => void;
}

/** Lista "Localizar estrutura": toque num chip para destacar a estrutura na imagem. */
export function StructureList({ overlays, selectedId, visible, onSelect, onEnsureVisible }: StructureListProps) {
  const sorted = overlays.slice().sort((a, b) => layerZ(b.type) - layerZ(a.type));
  return (
    <div className="mt-2">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Localizar estrutura</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {sorted.map((o) => {
          const st = LAYER_STYLES[o.type];
          const active = o.id === selectedId;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                if (!visible[o.type]) onEnsureVisible(o.type);
                onSelect(active ? null : o.id);
              }}
              className={cx(
                'inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors',
                active ? 'bg-slate-100 text-slate-950' : 'bg-slate-900 text-slate-200 hover:bg-slate-800',
              )}
              style={{ borderColor: st.stroke }}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: st.stroke }} />
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
