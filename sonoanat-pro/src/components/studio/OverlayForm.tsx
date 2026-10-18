import type React from 'react';
import { LAYER_TYPES, type LayerType } from '@/types';
import { LAYER_STYLES } from '@/constants/layers';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import type { StudioAction, StudioState } from './useStudioState';

export interface OverlayFormProps {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

const field = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none';

export function OverlayForm({ state, dispatch }: OverlayFormProps) {
  const editing = !!state.editingId;
  const drafting = state.tool === 'polygon' || state.tool === 'needle';
  const set = (patch: Partial<typeof state.form>) => dispatch({ type: 'setForm', patch });
  const minPts = LAYER_STYLES[state.form.type].isLine ? 2 : 3;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
        {editing ? 'Editar estrutura' : drafting ? `Nova estrutura · ${state.draft.length}/${minPts}+ pontos` : 'Estrutura'}
      </p>

      <label className="text-xs text-slate-300">
        Camada
        <select
          className={field}
          value={state.form.type}
          onChange={(e) => set({ type: e.target.value as LayerType })}
          disabled={state.tool === 'needle'}
        >
          {LAYER_TYPES.map((t) => (
            <option key={t} value={t}>
              {LAYER_STYLES[t].longName}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-slate-300">
        Rótulo
        <input className={field} value={state.form.label} onChange={(e) => set({ label: e.target.value })} placeholder="Ex.: N. mediano" maxLength={60} />
      </label>
      <label className="text-xs text-slate-300">
        Aspecto ecográfico
        <input className={field} value={state.form.echo} onChange={(e) => set({ echo: e.target.value })} placeholder="Ex.: hipoecoico em favo de mel" maxLength={200} />
      </label>
      <label className="text-xs text-slate-300">
        Nota clínica
        <textarea className={field} rows={2} value={state.form.note} onChange={(e) => set({ note: e.target.value })} placeholder="Relações anatômicas, dicas…" maxLength={600} />
      </label>
      <label className="text-xs text-slate-300">
        Alerta
        <input className={field} value={state.form.alert} onChange={(e) => set({ alert: e.target.value })} placeholder="Ex.: risco de punção vascular" maxLength={200} />
      </label>

      {state.status && <p className="text-xs text-amber-300">{state.status}</p>}

      <div className="flex flex-wrap gap-1.5">
        {drafting && (
          <>
            <Button size="sm" variant="primary" onClick={() => dispatch({ type: 'commitDraft' })} disabled={state.draft.length < minPts}>
              <Icon name="check" size={16} /> Concluir
            </Button>
            <Button size="sm" onClick={() => dispatch({ type: 'undoPoint' })} disabled={state.draft.length === 0}>
              <Icon name="undo" size={16} /> Desfazer ponto
            </Button>
            <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'clearDraft' })} disabled={state.draft.length === 0}>
              Limpar
            </Button>
          </>
        )}
        {editing && !drafting && (
          <>
            <Button size="sm" variant="primary" onClick={() => dispatch({ type: 'applyEdit' })}>
              <Icon name="check" size={16} /> Aplicar texto
            </Button>
            <Button size="sm" active={state.tool === 'label'} onClick={() => dispatch({ type: 'setTool', tool: state.tool === 'label' ? 'select' : 'label' })}>
              <Icon name="tag" size={16} /> Posicionar legenda
            </Button>
            <Button size="sm" variant="danger" onClick={() => state.editingId && dispatch({ type: 'deleteOverlay', id: state.editingId })}>
              <Icon name="trash" size={16} /> Remover
            </Button>
            <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'cancelEdit' })}>
              Fechar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
