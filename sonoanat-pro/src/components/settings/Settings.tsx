import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card, SectionTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Slider } from '@/components/common/Slider';
import { Icon } from '@/components/common/Icon';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSettings } from '@/hooks/useSettings';
import { resetAll, setSetting, storageEstimate } from '@/db/repo';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { formatBytes } from '@/utils/format';
import { BUILTIN_BLOCKS } from '@/data/blocks';

export function Settings() {
  const settings = useSettings();
  const { canInstall, installed, install } = useInstallPrompt();
  const [confirm, setConfirm] = useState(false);
  const [storage, setStorage] = useState<{ usage: number; quota: number } | null>(null);
  const [installMsg, setInstallMsg] = useState<string | null>(null);

  useEffect(() => {
    void storageEstimate().then(setStorage);
  }, []);

  const realImages = BUILTIN_BLOCKS.filter((b) => b.images.mode !== 'C').length;

  return (
    <div>
      <TopBar title="Configurações" showBack backTo="/" />

      <Card className="mb-3">
        <SectionTitle icon="install">Instalar no dispositivo</SectionTitle>
        {installed ? (
          <p className="text-sm text-emerald-300">O app já está instalado e funciona offline.</p>
        ) : canInstall ? (
          <Button
            variant="primary"
            onClick={() =>
              void install().then((r) => setInstallMsg(r === 'accepted' ? 'Instalado! Procure o ícone na tela inicial.' : r === 'dismissed' ? 'Instalação cancelada.' : null))
            }
          >
            <Icon name="install" size={16} /> Instalar SonoAnat Pro
          </Button>
        ) : (
          <p className="text-sm text-slate-300">
            No Android/Chrome use o menu ⋮ → <em>Instalar aplicativo</em>. No iPhone/Safari toque em Compartilhar → <em>Adicionar à Tela de Início</em>.
          </p>
        )}
        {installMsg && <p className="mt-2 text-xs text-slate-400">{installMsg}</p>}
      </Card>

      <Card className="mb-3">
        <SectionTitle icon="layers">Padrões do visualizador</SectionTitle>
        <Slider label="Opacidade inicial" min={15} max={100} value={settings.defaultOpacity} onChange={(v) => void setSetting('defaultOpacity', v)} />
        <label className="mt-2 flex items-center gap-2 text-sm text-slate-200">
          <input type="checkbox" checked={settings.defaultLabelsOn} onChange={(e) => void setSetting('defaultLabelsOn', e.target.checked)} />
          Legendas ligadas ao abrir
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm text-slate-200">
          <input type="checkbox" checked={settings.defaultFlipped} onChange={(e) => void setSetting('defaultFlipped', e.target.checked)} />
          Imagem espelhada ao abrir
        </label>
      </Card>

      <Card className="mb-3">
        <SectionTitle icon="info">Sobre</SectionTitle>
        <p className="text-sm text-slate-300">
          SonoAnat Pro v{__APP_VERSION__} · {BUILTIN_BLOCKS.length} técnicas · {realImages} com imagem real.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Atlas educativo de sonoanatomia para anestesia regional. Não substitui treinamento supervisionado nem o julgamento clínico.
        </p>
        <p className="mt-2 text-xs">
          <Link to="/licenses" className="text-sky-300 underline">
            Licenças, fontes das imagens e bibliotecas
          </Link>
        </p>
        {storage && storage.quota > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Armazenamento local: {formatBytes(storage.usage)} de {formatBytes(storage.quota)}.
          </p>
        )}
      </Card>

      <Card>
        <SectionTitle icon="trash">Dados do usuário</SectionTitle>
        <p className="mb-3 text-sm text-slate-300">Apaga anotações, imagens carregadas, favoritos e preferências. Os conteúdos originais do app não são afetados.</p>
        <Button variant="danger" onClick={() => setConfirm(true)}>
          <Icon name="trash" size={16} /> Apagar todos os dados do usuário
        </Button>
      </Card>

      <ConfirmDialog
        open={confirm}
        title="Apagar todos os dados?"
        message="Esta ação não pode ser desfeita. Exporte um backup antes, se quiser guardar suas anotações."
        confirmLabel="Apagar"
        danger
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          void resetAll();
        }}
      />
    </div>
  );
}
