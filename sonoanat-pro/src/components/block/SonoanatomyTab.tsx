import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { EffectiveBlock } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { useViewerState } from '@/hooks/useViewerState';
import { SonoViewer } from '@/components/viewer/SonoViewer';
import { StructureToggles } from '@/components/viewer/StructureToggles';
import { StructureInspector } from '@/components/viewer/StructureInspector';
import { AttributionLine } from './AttributionLine';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Icon } from '@/components/common/Icon';
import { resetBlock } from '@/db/repo';

/** Vista de sonoanatomia: imagem real limpa + lista de estruturas para ligar/desligar. */
export function SonoanatomyTab({ block }: { block: EffectiveBlock }) {
  const settings = useSettings();
  const { state, dispatch, select } = useViewerState(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    dispatch({ type: 'setOpacity', value: settings.defaultOpacity });
    dispatch({ type: 'setLabels', on: settings.defaultLabelsOn });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultOpacity, settings.defaultLabelsOn]);

  const selected = block.overlays.find((o) => o.id === state.selectedId) ?? null;

  return (
    <div className="md:grid md:grid-cols-[minmax(0,1fr)_280px] md:gap-4">
      <div>
        <div data-no-swipe>
          <SonoViewer block={block} state={state} onSelect={select} />
        </div>
        <AttributionLine attribution={block.images.attribution} mode={block.images.mode} />
        <div className="hidden md:block">
          <StructureInspector overlay={selected} onClose={() => select(null)} />
        </div>
      </div>
      <div className="mt-3 md:mt-0">
        <StructureToggles overlays={block.overlays} state={state} dispatch={dispatch} showPairSlider={block.images.mode === 'B'} />
        <div className="md:hidden">
          <StructureInspector overlay={selected} onClose={() => select(null)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/studio/${block.id}`}>
            <Button variant="ghost" size="sm">
              <Icon name="studio" size={16} /> Editar / minha imagem
            </Button>
          </Link>
          {block.isModified && (
            <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
              <Icon name="reset" size={16} /> Restaurar padrão
            </Button>
          )}
        </div>
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
