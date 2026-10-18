import { useCallback, useEffect, useState } from 'react';
import { useBlocker, useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { useEffectiveBlock } from '@/hooks/useEffectiveBlock';
import { useStudioState } from './useStudioState';
import { StudioStage } from './StudioStage';
import { OverlayForm } from './OverlayForm';
import { OverlayList } from './OverlayList';
import { ImagePairUploader } from './ImagePairUploader';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { EmptyState, SectionTitle } from '@/components/common/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { clearOverlayOverride, resetBlock, saveOverlays } from '@/db/repo';
import { validateOverlays } from '@/data/validate';
import { BLOCK_BY_ID } from '@/data/blocks';
import { cx } from '@/utils/format';

export function AnnotationStudio() {
  const { blockId } = useParams();
  const { block, notFound } = useEffectiveBlock(blockId);
  const [state, dispatch] = useStudioState(block?.overlays ?? []);
  const [labelsOn, setLabelsOn] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'reset' | 'discard' | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Carrega os overlays efetivos quando o bloco (ou o override) muda e não há edição pendente.
  useEffect(() => {
    if (!block) return;
    if (loadedFor !== block.id || !state.dirty) {
      dispatch({ type: 'load', overlays: block.overlays });
      setLoadedFor(block.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block?.id, block?.overlays]);

  const blocker = useBlocker(state.dirty);
  const onPreview = useCallback((url: string | null) => setPreview(url), []);

  if (notFound || !block) {
    return (
      <div>
        <TopBar title="Estúdio" showBack backTo="/" />
        <EmptyState icon="warning" title="Bloqueio não encontrado" />
      </div>
    );
  }

  const save = async () => {
    const issues = validateOverlays(state.overlays);
    if (issues.length) {
      dispatch({ type: 'status', message: `Não foi possível salvar: ${issues[0].path}: ${issues[0].message}` });
      return;
    }
    await saveOverlays(block.id, state.overlays);
    dispatch({ type: 'markSaved' });
  };

  const copyTs = async () => {
    const text = JSON.stringify(state.overlays, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      dispatch({ type: 'status', message: 'Overlays copiados para a área de transferência (JSON).' });
    } catch {
      dispatch({ type: 'status', message: 'Não foi possível copiar automaticamente.' });
    }
  };

  const builtin = BLOCK_BY_ID.get(block.id);
  const toolBtn = (tool: typeof state.tool, label: string, icon: Parameters<typeof Icon>[0]['name']) => (
    <Button size="sm" active={state.tool === tool} variant={state.tool === tool ? 'primary' : 'secondary'} onClick={() => dispatch({ type: 'setTool', tool })}>
      <Icon name={icon} size={16} /> {label}
    </Button>
  );

  return (
    <div>
      <TopBar
        title="Estúdio de anotação"
        subtitle={block.shortName}
        showBack
        backTo={`/b/${block.id}`}
        right={
          <Button size="sm" variant="primary" disabled={!state.dirty} onClick={() => void save()}>
            <Icon name="check" size={16} /> Salvar
          </Button>
        }
      />

      <div className="mb-2 flex flex-wrap gap-1.5">
        {toolBtn('select', 'Selecionar', 'move')}
        {toolBtn('polygon', 'Polígono', 'edit')}
        {toolBtn('needle', 'Agulha', 'needle')}
        <Button size="sm" variant="outline" active={labelsOn} onClick={() => setLabelsOn((v) => !v)}>
          <Icon name="tag" size={16} /> Legendas
        </Button>
      </div>
      <p className={cx('mb-2 text-xs', state.dirty ? 'text-amber-300' : 'text-slate-500')}>
        {state.tool === 'polygon' && 'Toque na imagem para marcar os vértices; conclua com 3+ pontos.'}
        {state.tool === 'needle' && 'Toque 2 pontos: entrada e ponta da agulha.'}
        {state.tool === 'label' && 'Toque onde a legenda deve ficar.'}
        {state.tool === 'select' && (state.editingId ? 'Arraste os círculos para ajustar os vértices.' : 'Toque numa estrutura para editá-la.')}
        {state.dirty && ' · Alterações não salvas.'}
      </p>

      <StudioStage block={block} state={state} dispatch={dispatch} previewBaseUrl={preview} labelsOn={labelsOn} />

      <div className="mt-3 flex flex-col gap-3">
        <OverlayForm state={state} dispatch={dispatch} />
        <div>
          <SectionTitle icon="layers">Estruturas ({state.overlays.length})</SectionTitle>
          <OverlayList state={state} dispatch={dispatch} />
        </div>
        <ImagePairUploader block={block} onPreview={onPreview} />

        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="primary" disabled={!state.dirty} onClick={() => void save()}>
            <Icon name="check" size={16} /> Salvar anotações
          </Button>
          <Button size="sm" variant="ghost" disabled={!state.dirty} onClick={() => setConfirm('discard')}>
            Descartar alterações
          </Button>
          <Button size="sm" variant="outline" onClick={() => void copyTs()}>
            <Icon name="download" size={16} /> Copiar JSON
          </Button>
          {(block.isModified || state.dirty) && (
            <Button size="sm" variant="danger" onClick={() => setConfirm('reset')}>
              <Icon name="reset" size={16} /> Restaurar padrão
            </Button>
          )}
        </div>
        {builtin && block.isModified && (
          <p className="text-[11px] text-slate-500">
            Este bloqueio tem anotações próprias salvas neste dispositivo. O conteúdo original ({builtin.overlays.length} estruturas) continua disponível em "Restaurar padrão".
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirm === 'discard'}
        title="Descartar alterações?"
        message="As edições não salvas serão perdidas."
        confirmLabel="Descartar"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          dispatch({ type: 'load', overlays: block.overlays });
        }}
      />
      <ConfirmDialog
        open={confirm === 'reset'}
        title="Restaurar padrão?"
        message="Apaga as anotações e imagens salvas para este bloqueio e volta ao conteúdo original."
        confirmLabel="Restaurar"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          void (block.userImages.length ? resetBlock(block.id) : clearOverlayOverride(block.id)).then(() => {
            const b = BLOCK_BY_ID.get(block.id);
            if (b) dispatch({ type: 'load', overlays: b.overlays });
          });
        }}
      />
      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Sair sem salvar?"
        message="Há alterações não salvas no Estúdio."
        confirmLabel="Sair"
        danger
        onCancel={() => blocker.state === 'blocked' && blocker.reset()}
        onConfirm={() => blocker.state === 'blocked' && blocker.proceed()}
      />
    </div>
  );
}
