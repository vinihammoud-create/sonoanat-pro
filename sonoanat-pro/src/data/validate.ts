import { LAYER_TYPES, VIEWBOX } from '@/types';
import type { BackupFile, Block, BlockOverride, ImageSet, Overlay } from '@/types';
import { LAYER_STYLES } from '@/constants/layers';
import { parsePoints } from '@/utils/geometry';

export interface ValidationIssue {
  path: string;
  message: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function validateOverlay(ov: unknown, path = 'overlay'): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!isObj(ov)) return [{ path, message: 'overlay deve ser um objeto' }];
  if (!isStr(ov.id) || ov.id.trim() === '') issues.push({ path: `${path}.id`, message: 'id obrigatório' });
  if (!isStr(ov.type) || !(LAYER_TYPES as readonly string[]).includes(ov.type)) {
    issues.push({ path: `${path}.type`, message: `type inválido: ${String(ov.type)}` });
  }
  if (!isStr(ov.label) || ov.label.trim() === '') issues.push({ path: `${path}.label`, message: 'label obrigatório' });
  if (!isStr(ov.points)) {
    issues.push({ path: `${path}.points`, message: 'points deve ser string' });
  } else {
    const pts = parsePoints(ov.points);
    const raw = ov.points.trim().split(/\s+/).filter(Boolean).length;
    if (pts.length !== raw) issues.push({ path: `${path}.points`, message: 'há pares x,y inválidos' });
    const isLine = isStr(ov.type) && ov.type in LAYER_STYLES && LAYER_STYLES[ov.type as keyof typeof LAYER_STYLES].isLine;
    const min = isLine ? 2 : 3;
    if (pts.length < min) issues.push({ path: `${path}.points`, message: `mínimo de ${min} pontos` });
    for (const p of pts) {
      if (p.x < 0 || p.x > VIEWBOX.w || p.y < 0 || p.y > VIEWBOX.h) {
        issues.push({ path: `${path}.points`, message: `ponto fora do viewBox: ${p.x},${p.y}` });
        break;
      }
    }
  }
  if (!isObj(ov.label_pos) || !isNum(ov.label_pos.x) || !isNum(ov.label_pos.y)) {
    issues.push({ path: `${path}.label_pos`, message: 'label_pos {x,y} obrigatório' });
  } else if (ov.label_pos.x < 0 || ov.label_pos.x > VIEWBOX.w || ov.label_pos.y < 0 || ov.label_pos.y > VIEWBOX.h) {
    issues.push({ path: `${path}.label_pos`, message: 'label_pos fora do viewBox' });
  }
  for (const k of ['note', 'echo', 'alert'] as const) {
    if (ov[k] !== undefined && !isStr(ov[k])) issues.push({ path: `${path}.${k}`, message: 'deve ser string' });
  }
  return issues;
}

export function validateOverlays(list: unknown, path = 'overlays'): ValidationIssue[] {
  if (!Array.isArray(list)) return [{ path, message: 'overlays deve ser array' }];
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  list.forEach((ov, i) => {
    issues.push(...validateOverlay(ov, `${path}[${i}]`));
    if (isObj(ov) && isStr(ov.id)) {
      if (ids.has(ov.id)) issues.push({ path: `${path}[${i}].id`, message: `id duplicado: ${ov.id}` });
      ids.add(ov.id);
    }
  });
  return issues;
}

export function validateImageSet(img: unknown, path = 'images'): ValidationIssue[] {
  if (!isObj(img)) return [{ path, message: 'images deve ser objeto' }];
  const issues: ValidationIssue[] = [];
  if (img.mode !== 'A' && img.mode !== 'B' && img.mode !== 'C') issues.push({ path: `${path}.mode`, message: 'mode deve ser A, B ou C' });
  for (const k of ['baseUrl', 'annotatedUrl', 'baseImageId', 'annotatedImageId'] as const) {
    if (img[k] !== undefined && !isStr(img[k])) issues.push({ path: `${path}.${k}`, message: 'deve ser string' });
  }
  if (img.mode === 'A' && !img.baseUrl && !img.baseImageId) issues.push({ path, message: 'modo A exige baseUrl ou baseImageId' });
  if (img.mode === 'B' && (!(img.baseUrl || img.baseImageId) || !(img.annotatedUrl || img.annotatedImageId))) {
    issues.push({ path, message: 'modo B exige imagem base e anotada' });
  }
  if (img.attribution !== undefined) {
    if (!isObj(img.attribution) || !isStr(img.attribution.license) || !isStr(img.attribution.sourceUrl) || !isStr(img.attribution.title)) {
      issues.push({ path: `${path}.attribution`, message: 'attribution exige title, license e sourceUrl' });
    }
  }
  return issues;
}

export function validateBlock(b: unknown, path = 'block'): ValidationIssue[] {
  if (!isObj(b)) return [{ path, message: 'block deve ser objeto' }];
  const issues: ValidationIssue[] = [];
  for (const k of ['id', 'categoryId', 'name', 'shortName', 'subtitle', 'target', 'summary'] as const) {
    if (!isStr(b[k]) || b[k].trim() === '') issues.push({ path: `${path}.${k}`, message: 'obrigatório' });
  }
  if (!isObj(b.orientation) || !isStr(b.orientation.left) || !isStr(b.orientation.right)) {
    issues.push({ path: `${path}.orientation`, message: 'orientation {left,right} obrigatório' });
  }
  if (!isObj(b.ergonomics)) {
    issues.push({ path: `${path}.ergonomics`, message: 'obrigatório' });
  } else {
    const e = b.ergonomics;
    for (const k of ['probe', 'depthText', 'patientPosition', 'probePosition', 'needleApproach'] as const) {
      if (!isStr(e[k]) || e[k].trim() === '') issues.push({ path: `${path}.ergonomics.${k}`, message: 'obrigatório' });
    }
    if (!isNum(e.depthCm) || e.depthCm <= 0 || e.depthCm > 20) issues.push({ path: `${path}.ergonomics.depthCm`, message: 'depthCm entre 0 e 20' });
    if (!['in-plane', 'out-of-plane', 'both', 'none'].includes(String(e.needleTechnique))) {
      issues.push({ path: `${path}.ergonomics.needleTechnique`, message: 'needleTechnique inválido' });
    }
  }
  if (!isObj(b.clinical)) {
    issues.push({ path: `${path}.clinical`, message: 'obrigatório' });
  } else {
    const c = b.clinical;
    if (!Array.isArray(c.indications) || c.indications.length === 0) issues.push({ path: `${path}.clinical.indications`, message: 'ao menos 1 indicação' });
    if (!Array.isArray(c.doses) || c.doses.length === 0) issues.push({ path: `${path}.clinical.doses`, message: 'ao menos 1 dose' });
    if (!Array.isArray(c.pearls) || c.pearls.length === 0) issues.push({ path: `${path}.clinical.pearls`, message: 'ao menos 1 pérola' });
    if (!Array.isArray(c.references) || c.references.length === 0) issues.push({ path: `${path}.clinical.references`, message: 'ao menos 1 referência' });
  }
  issues.push(...validateOverlays(b.overlays, `${path}.overlays`));
  issues.push(...validateImageSet(b.images, `${path}.images`));
  return issues;
}

export function validateOverride(o: unknown, path = 'override'): ValidationIssue[] {
  if (!isObj(o)) return [{ path, message: 'override deve ser objeto' }];
  const issues: ValidationIssue[] = [];
  if (!isStr(o.blockId)) issues.push({ path: `${path}.blockId`, message: 'obrigatório' });
  if (!isNum(o.updatedAt)) issues.push({ path: `${path}.updatedAt`, message: 'obrigatório' });
  if (o.overlays !== undefined) issues.push(...validateOverlays(o.overlays, `${path}.overlays`));
  if (o.images !== undefined) issues.push(...validateImageSet(o.images, `${path}.images`));
  return issues;
}

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);

export function validateBackup(data: unknown): ValidationIssue[] {
  if (!isObj(data)) return [{ path: 'backup', message: 'arquivo não é um objeto JSON' }];
  const issues: ValidationIssue[] = [];
  if (data.app !== 'sonoanat-pro') issues.push({ path: 'app', message: 'não é um backup do SonoAnat Pro' });
  if (data.schemaVersion !== 1) issues.push({ path: 'schemaVersion', message: 'versão de esquema não suportada' });
  if (!Array.isArray(data.overrides)) issues.push({ path: 'overrides', message: 'deve ser array' });
  else data.overrides.forEach((o, i) => issues.push(...validateOverride(o, `overrides[${i}]`)));
  if (!Array.isArray(data.images)) issues.push({ path: 'images', message: 'deve ser array' });
  else {
    data.images.forEach((im, i) => {
      if (!isObj(im)) { issues.push({ path: `images[${i}]`, message: 'deve ser objeto' }); return; }
      if (!isStr(im.id) || !isStr(im.blockId)) issues.push({ path: `images[${i}]`, message: 'id e blockId obrigatórios' });
      if (im.role !== 'base' && im.role !== 'annotated') issues.push({ path: `images[${i}].role`, message: 'role inválido' });
      if (!isStr(im.mime) || !ALLOWED_MIME.has(im.mime)) issues.push({ path: `images[${i}].mime`, message: 'mime não permitido' });
      if (!isStr(im.dataBase64) || im.dataBase64.length === 0) issues.push({ path: `images[${i}].dataBase64`, message: 'obrigatório' });
    });
  }
  if (!Array.isArray(data.settings)) issues.push({ path: 'settings', message: 'deve ser array' });
  if (!Array.isArray(data.favorites)) issues.push({ path: 'favorites', message: 'deve ser array' });
  return issues;
}

/** Type guards de conveniência. */
export const isValidOverlay = (ov: unknown): ov is Overlay => validateOverlay(ov).length === 0;
export const isValidBlock = (b: unknown): b is Block => validateBlock(b).length === 0;
export const isValidOverride = (o: unknown): o is BlockOverride => validateOverride(o).length === 0;
export const isValidImageSet = (i: unknown): i is ImageSet => validateImageSet(i).length === 0;
export const isValidBackup = (d: unknown): d is BackupFile => validateBackup(d).length === 0;
