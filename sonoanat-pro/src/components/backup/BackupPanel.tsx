import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/common/Button';
import { Card, SectionTitle } from '@/components/common/Card';
import { Icon } from '@/components/common/Icon';
import { exportBackupBlob, importBackup, type ImportMode, type ImportResult } from '@/db/backup';
import { formatBytes, formatDateStamp } from '@/utils/format';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';

export function BackupPanel() {
  const [mode, setMode] = useState<ImportMode>('merge');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const counts = useLiveQuery(async () => ({
    overrides: await db.overrides.count(),
    images: await db.images.count(),
    favorites: await db.favorites.count(),
  }), []);

  const doExport = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const blob = await exportBackupBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sonoanat-backup-${formatDateStamp(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setMessage({ kind: 'ok', text: `Backup exportado (${formatBytes(blob.size)}).` });
    } catch (e) {
      setMessage({ kind: 'err', text: e instanceof Error ? e.message : 'Falha ao exportar.' });
    } finally {
      setBusy(false);
    }
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const text = await file.text();
      const r: ImportResult = await importBackup(text, mode);
      setMessage({ kind: 'ok', text: `Importado: ${r.overrides} bloqueio(s) editado(s), ${r.images} imagem(ns), ${r.favorites} favorito(s), ${r.settings} configuração(ões).` });
    } catch (e) {
      setMessage({ kind: 'err', text: e instanceof Error ? e.message : 'Falha ao importar.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <TopBar title="Backup" subtitle="Exportar e importar seus dados" showBack backTo="/" />
      <Card className="mb-3">
        <SectionTitle icon="download">Exportar</SectionTitle>
        <p className="mb-3 text-sm text-slate-300">
          Gera um arquivo .json com suas anotações, imagens carregadas, favoritos e preferências.
          {counts && (
            <span className="block text-xs text-slate-500">
              Atualmente: {counts.overrides} bloqueio(s) editado(s), {counts.images} imagem(ns), {counts.favorites} favorito(s).
            </span>
          )}
        </p>
        <Button variant="primary" onClick={() => void doExport()} disabled={busy}>
          <Icon name="download" size={16} /> Exportar backup (.json)
        </Button>
      </Card>

      <Card>
        <SectionTitle icon="upload">Importar</SectionTitle>
        <fieldset className="mb-3 flex flex-col gap-1.5 text-sm text-slate-200">
          <label className="flex items-center gap-2">
            <input type="radio" name="mode" checked={mode === 'merge'} onChange={() => setMode('merge')} />
            Mesclar com os dados atuais
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="mode" checked={mode === 'replace'} onChange={() => setMode('replace')} />
            Substituir tudo (apaga os dados atuais)
          </label>
        </fieldset>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-600 px-3.5 text-sm text-slate-100 hover:bg-slate-800">
          <Icon name="upload" size={16} /> Escolher arquivo .json
          <input type="file" accept="application/json,.json" className="hidden" disabled={busy} onChange={(e) => void doImport(e.target.files?.[0])} />
        </label>
      </Card>

      {message && (
        <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.kind === 'ok' ? 'bg-emerald-900/40 text-emerald-200' : 'bg-rose-900/40 text-rose-200'}`} role="status">
          {message.text}
        </p>
      )}
    </div>
  );
}
