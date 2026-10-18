import { useEffect, useState } from 'react';
import type { Attribution, EffectiveBlock } from '@/types';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Badge } from '@/components/common/Card';
import { clearImageOverride, saveImagePair } from '@/db/repo';
import { formatBytes } from '@/utils/format';

export interface ImagePairUploaderProps {
  block: EffectiveBlock;
  onPreview: (url: string | null) => void;
}

const field = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none';
const ACCEPT = 'image/png,image/jpeg,image/webp';

export function ImagePairUploader({ block, onPreview }: ImagePairUploaderProps) {
  const [base, setBase] = useState<File | null>(null);
  const [annotated, setAnnotated] = useState<File | null>(null);
  const [attr, setAttr] = useState<{ title: string; authors: string; license: string; sourceUrl: string }>({ title: '', authors: '', license: '', sourceUrl: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!base) {
      onPreview(null);
      return;
    }
    const url = URL.createObjectURL(base);
    onPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [base, onPreview]);

  const save = async () => {
    if (!base) return;
    setBusy(true);
    setMsg(null);
    try {
      const attribution: Attribution | undefined = attr.title.trim()
        ? { title: attr.title.trim(), authors: attr.authors.trim() || undefined, license: attr.license.trim() || 'uso próprio', sourceUrl: attr.sourceUrl.trim() || '#' }
        : undefined;
      const set = await saveImagePair(block.id, { base, annotated: annotated ?? undefined, attribution });
      setBase(null);
      setAnnotated(null);
      setMsg(`Imagem salva (modo ${set.mode}). Agora desenhe as estruturas sobre a foto.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Falha ao salvar a imagem.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await clearImageOverride(block.id);
      setMsg('Imagens do usuário removidas; voltou ao conjunto padrão.');
    } finally {
      setBusy(false);
    }
  };

  const userHasImages = block.userImages.length > 0;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-300">
        <Icon name="image" size={16} /> Imagem real
        <Badge tone={block.images.mode === 'C' ? 'slate' : 'emerald'}>modo {block.images.mode}</Badge>
        {userHasImages && <Badge tone="amber">do usuário</Badge>}
      </p>
      <p className="text-xs text-slate-400">
        Carregue uma foto de ultrassom (PNG/JPG/WebP). Opcionalmente, uma segunda versão já anotada para alternar com o slider (modo B).
      </p>
      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-600 px-3 text-sm hover:bg-slate-800">
        <Icon name="upload" size={16} /> {base ? `${base.name} (${formatBytes(base.size)})` : 'Imagem base (US puro)'}
        <input type="file" accept={ACCEPT} className="hidden" onChange={(e) => setBase(e.target.files?.[0] ?? null)} />
      </label>
      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-600 px-3 text-sm hover:bg-slate-800">
        <Icon name="upload" size={16} /> {annotated ? `${annotated.name} (${formatBytes(annotated.size)})` : 'Imagem anotada (opcional, modo B)'}
        <input type="file" accept={ACCEPT} className="hidden" onChange={(e) => setAnnotated(e.target.files?.[0] ?? null)} />
      </label>
      <details className="text-xs text-slate-300">
        <summary className="cursor-pointer py-1">Atribuição / fonte (opcional)</summary>
        <div className="mt-1 flex flex-col gap-1.5">
          <input className={field} placeholder="Título / descrição" value={attr.title} onChange={(e) => setAttr({ ...attr, title: e.target.value })} />
          <input className={field} placeholder="Autores" value={attr.authors} onChange={(e) => setAttr({ ...attr, authors: e.target.value })} />
          <input className={field} placeholder="Licença (ex.: CC BY 4.0, uso próprio)" value={attr.license} onChange={(e) => setAttr({ ...attr, license: e.target.value })} />
          <input className={field} placeholder="URL da fonte" value={attr.sourceUrl} onChange={(e) => setAttr({ ...attr, sourceUrl: e.target.value })} />
        </div>
      </details>
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" variant="primary" disabled={!base || busy} onClick={() => void save()}>
          <Icon name="check" size={16} /> Salvar imagem no bloqueio
        </Button>
        {base && (
          <Button size="sm" variant="ghost" onClick={() => { setBase(null); setAnnotated(null); }}>
            Cancelar
          </Button>
        )}
        {userHasImages && (
          <Button size="sm" variant="danger" disabled={busy} onClick={() => void remove()}>
            <Icon name="trash" size={16} /> Remover imagens do usuário
          </Button>
        )}
      </div>
      {msg && <p className="text-xs text-amber-300">{msg}</p>}
    </div>
  );
}
