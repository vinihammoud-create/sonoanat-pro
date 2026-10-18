import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { EffectiveBlock, LayerType } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { useViewerState } from '@/hooks/useViewerState';
import { SonoViewer } from '@/components/viewer/SonoViewer';
import { LayerToolbar } from '@/components/viewer/LayerToolbar';
import { StructureInspector } from '@/components/viewer/StructureInspector';
import { StructureList } from '@/components/viewer/StructureList';
import { AttributionLine } from './AttributionLine';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Icon } from '@/components/common/Icon';
import { resetBlock } from '@/db/repo';
import { Card, SectionTitle } from '@/components/common/Card';

export function SonoanatomyTab({ block }: { block: EffectiveBlock }) {
  const settings = useSettings();
  const { state, dispatch, select } = useViewerState(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  // Aplica preferências salvas quando chegam do IndexedDB (primeira carga).
  useEffect(() => {
    dispatch({ type: 'setOpacity', value: settings.defaultOpacity });
    dispatch({ type: 'setLabels', on: settings.defaultLabelsOn });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultOpacity, settings.defaultLabelsOn]);

  const presentTypes = useMemo(() => new Set<LayerType>(block.overlays.map((o) => o.type)), [block.overlays]);
  const selected = block.overlays.find((o) => o.id === state.selectedId) ?? null;

  return (
    <div>
      <div data-no-swipe>
        <SonoViewer block={block} state={state} onSelect={select} />
      </div>
      <StructureList
        overlays={block.overlays}
        selectedId={state.selectedId}
        visible={state.visible}
        onSelect={select}
        onEnsureVisible={(layer) => dispatch({ type: 'setLayer', layer, on: true })}
      />
      <StructureInspector overlay={selected} onClose={() => select(null)} />
      <LayerToolbar state={state} dispatch={dispatch} presentTypes={presentTypes} showPairSlider={block.images.mode === 'B'} />
      <AttributionLine attribution={block.images.attribution} mode={block.images.mode} />

      {block.gallery && block.gallery.length > 0 && (
        <Card className="mt-3">
          <SectionTitle icon="image">Imagens reais adicionais</SectionTitle>
          <ul className="grid grid-cols-2 gap-2">
            {block.gallery.map((g, i) => (
              <li key={i} className="overflow-hidden rounded-lg border border-slate-800">
                <img src={g.baseUrl} alt={g.attribution?.caption ?? ''} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-1.5">
                  {g.attribution?.caption && <p className="text-[11px] text-slate-300">{g.attribution.caption}</p>}
                  <AttributionLine attribution={g.attribution} mode="A" compact />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-3">
        <SectionTitle icon="info">Descrição sonoanatômica</SectionTitle>
        <p className="text-sm leading-relaxed text-slate-200">{block.summary}</p>
        <p className="mt-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Alvo: </span>
          {block.target}
        </p>
      </Card>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link to={`/studio/${block.id}`}>
          <Button variant="outline">
            <Icon name="studio" size={16} /> Abrir no Estúdio
          </Button>
        </Link>
        {block.isModified && (
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            <Icon name="reset" size={16} /> Restaurar padrão
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="Restaurar padrão?"
        message="As anotações e imagens que você salvou para este bloqueio serão apagadas e o conteúdo original voltará."
        confirmLabel="Restaurar"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          void resetBlock(block.id);
        }}
      />
    </div>
  );
}
