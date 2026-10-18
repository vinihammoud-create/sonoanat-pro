import type { Scene, ScenePoly } from './scene';
import { Rng } from './prng';
import { pointInPolygon, type Point } from '@/utils/geometry';

/** Subconjunto de CanvasRenderingContext2D usado pelo renderizador (permite ctx falso nos testes). */
export interface Ctx2D {
  fillStyle: string | CanvasGradient;
  strokeStyle: string | CanvasGradient;
  lineWidth: number;
  globalAlpha: number;
  font: string;
  textAlign: CanvasTextAlign;
  lineCap: CanvasLineCap;
  save(): void;
  restore(): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  ellipse(x: number, y: number, rx: number, ry: number, rot: number, a0: number, a1: number): void;
  arc(x: number, y: number, r: number, a0: number, a1: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  fill(): void;
  stroke(): void;
  clip(): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number): void;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
  getImageData(x: number, y: number, w: number, h: number): ImageData;
  putImageData(data: ImageData, x: number, y: number): void;
}

function tracePoly(ctx: Ctx2D, pts: Point[], close = true): void {
  if (pts.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  if (close) ctx.closePath();
}

function gray(v: number, a = 1): string {
  const c = Math.max(0, Math.min(255, Math.round(v)));
  return a >= 1 ? `rgb(${c},${c},${c})` : `rgba(${c},${c},${c},${a})`;
}

/** Linha "fascial" ondulada e brilhante dentro de um polígono (clipado). */
function fascialStreak(ctx: Ctx2D, rng: Rng, x0: number, x1: number, y: number, amp: number, alpha: number, width: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y);
  const n = 6;
  for (let i = 1; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const cy = y + rng.gauss() * amp;
    ctx.quadraticCurveTo(x - (x1 - x0) / (2 * n), cy, x, y + rng.gauss() * amp * 0.5);
  }
  ctx.strokeStyle = gray(225, alpha);
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawBackground(ctx: Ctx2D, s: Scene): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, s.width, s.height);
  // Campo de imagem: gradiente de atenuação em profundidade.
  const g = ctx.createLinearGradient(0, 0, 0, s.height);
  g.addColorStop(0, gray(78));
  g.addColorStop(0.25, gray(66));
  g.addColorStop(0.65, gray(48));
  g.addColorStop(1, gray(26));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s.width, s.height);
}

function drawSkinAndFat(ctx: Ctx2D, s: Scene, rng: Rng): void {
  // Pele: faixa superficial brilhante.
  const skin = ctx.createLinearGradient(0, 0, 0, 40);
  skin.addColorStop(0, gray(210));
  skin.addColorStop(0.5, gray(150));
  skin.addColorStop(1, gray(90));
  ctx.fillStyle = skin;
  ctx.fillRect(0, 0, s.width, 40);
  // Gordura subcutânea: hipoecoica com septos conjuntivos.
  ctx.fillStyle = gray(58);
  ctx.fillRect(0, 40, s.width, s.fatDepth - 40);
  const nSepta = 8 + Math.round((s.fatDepth - 70) / 10);
  for (let i = 0; i < nSepta; i++) {
    const y = rng.range(48, s.fatDepth - 8);
    const x0 = rng.range(-50, s.width * 0.8);
    const len = rng.range(120, 420);
    fascialStreak(ctx, rng, x0, x0 + len, y, 4, rng.range(0.25, 0.55), rng.range(1.2, 2.4));
  }
  // Limite profundo da gordura (fáscia superficial).
  fascialStreak(ctx, rng, -20, s.width + 20, s.fatDepth, 3, 0.7, 2.2);
}

function drawMuscle(ctx: Ctx2D, p: ScenePoly, rng: Rng, base: number): void {
  ctx.save();
  tracePoly(ctx, p.pts);
  ctx.clip();
  ctx.fillStyle = gray(base);
  ctx.fillRect(p.box.minX - 2, p.box.minY - 2, p.box.maxX - p.box.minX + 4, p.box.maxY - p.box.minY + 4);
  const h = p.box.maxY - p.box.minY;
  const n = Math.max(3, Math.round(h / 22));
  for (let i = 0; i < n; i++) {
    const y = p.box.minY + ((i + 0.5) * h) / n + rng.gauss() * 3;
    fascialStreak(ctx, rng, p.box.minX - 10, p.box.maxX + 10, y, 5, rng.range(0.18, 0.4), rng.range(1, 2));
  }
  ctx.restore();
  // Epimísio: contorno brilhante.
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(215, 0.55);
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

function drawOrgan(ctx: Ctx2D, p: ScenePoly, rng: Rng): void {
  ctx.save();
  tracePoly(ctx, p.pts);
  ctx.clip();
  ctx.fillStyle = gray(95);
  ctx.fillRect(p.box.minX - 2, p.box.minY - 2, p.box.maxX - p.box.minX + 4, p.box.maxY - p.box.minY + 4);
  // Textura parenquimatosa: pontos finos.
  const area = (p.box.maxX - p.box.minX) * (p.box.maxY - p.box.minY);
  const n = Math.min(900, Math.round(area / 350));
  for (let i = 0; i < n; i++) {
    const x = rng.range(p.box.minX, p.box.maxX);
    const y = rng.range(p.box.minY, p.box.maxY);
    ctx.fillStyle = gray(rng.range(110, 170), 0.5);
    ctx.fillRect(x, y, rng.range(1, 3), rng.range(1, 2));
  }
  ctx.restore();
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(200, 0.5);
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawFascia(ctx: Ctx2D, p: ScenePoly): void {
  tracePoly(ctx, p.pts, false);
  ctx.strokeStyle = gray(235, 0.85);
  ctx.lineWidth = 3;
  ctx.stroke();
  tracePoly(ctx, p.pts, false);
  ctx.strokeStyle = gray(255, 0.5);
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBone(ctx: Ctx2D, s: Scene, p: ScenePoly): void {
  // Sombra acústica: do topo do osso até o fundo, dentro da extensão horizontal.
  const left = p.box.minX;
  const right = p.box.maxX;
  const top = p.box.minY;
  ctx.save();
  tracePoly(ctx, p.pts);
  ctx.clip();
  ctx.fillStyle = gray(6);
  ctx.fillRect(left - 2, top - 2, right - left + 4, s.height);
  ctx.restore();
  // Abaixo do polígono até o fundo (sombra total com bordas suaves).
  const g = ctx.createLinearGradient(left, 0, right, 0);
  g.addColorStop(0, gray(6, 0.0));
  g.addColorStop(0.06, gray(6, 0.92));
  g.addColorStop(0.94, gray(6, 0.92));
  g.addColorStop(1, gray(6, 0.0));
  ctx.fillStyle = g;
  ctx.fillRect(left, p.box.maxY - 1, right - left, s.height - p.box.maxY + 1);
  // Córtex: borda superior brilhante e espessa.
  ctx.save();
  tracePoly(ctx, p.pts);
  ctx.clip();
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(245);
  ctx.lineWidth = 9;
  ctx.stroke();
  ctx.restore();
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(255, 0.9);
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawVessel(ctx: Ctx2D, s: Scene, p: ScenePoly, rng: Rng): void {
  const isArtery = p.type === 'artery';
  // Reforço acústico posterior.
  const w = p.box.maxX - p.box.minX;
  const g = ctx.createLinearGradient(0, p.box.maxY, 0, p.box.maxY + w * 0.9);
  g.addColorStop(0, gray(255, 0.16));
  g.addColorStop(1, gray(255, 0));
  ctx.fillStyle = g;
  ctx.fillRect(p.box.minX + w * 0.1, p.box.maxY - 2, w * 0.8, Math.min(w * 0.9, s.height - p.box.maxY));
  // Lúmen anecoico.
  tracePoly(ctx, p.pts);
  ctx.fillStyle = gray(isArtery ? 4 : 8);
  ctx.fill();
  // Parede.
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(isArtery ? 230 : 170, isArtery ? 0.9 : 0.6);
  ctx.lineWidth = isArtery ? 4 : 2;
  ctx.stroke();
  if (!isArtery) {
    // Veia: ecos de fluxo lento esparsos.
    ctx.save();
    tracePoly(ctx, p.pts);
    ctx.clip();
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = gray(rng.range(30, 60), 0.6);
      ctx.fillRect(rng.range(p.box.minX, p.box.maxX), rng.range(p.box.minY, p.box.maxY), 2, 1);
    }
    ctx.restore();
  }
}

function drawNerve(ctx: Ctx2D, p: ScenePoly, rng: Rng): void {
  ctx.save();
  tracePoly(ctx, p.pts);
  ctx.clip();
  ctx.fillStyle = gray(70);
  ctx.fillRect(p.box.minX - 2, p.box.minY - 2, p.box.maxX - p.box.minX + 4, p.box.maxY - p.box.minY + 4);
  // Fascículos: favo de mel (elipses hipoecoicas com perineuro brilhante).
  const w = p.box.maxX - p.box.minX;
  const h = p.box.maxY - p.box.minY;
  const r = Math.max(4, Math.min(w, h) / 7);
  let placed = 0;
  let tries = 0;
  while (placed < 40 && tries < 400) {
    tries++;
    const c = { x: rng.range(p.box.minX + r, p.box.maxX - r), y: rng.range(p.box.minY + r, p.box.maxY - r) };
    if (!pointInPolygon(c, p.pts)) continue;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, r * rng.range(0.7, 1.1), r * rng.range(0.6, 1.0), rng.range(0, Math.PI), 0, Math.PI * 2);
    ctx.fillStyle = gray(rng.range(28, 48));
    ctx.fill();
    ctx.strokeStyle = gray(rng.range(170, 215), 0.85);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    placed++;
  }
  ctx.restore();
  // Epineuro.
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(225, 0.9);
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

function drawPleura(ctx: Ctx2D, s: Scene, p: ScenePoly, rng: Rng): void {
  const w = p.box.maxX - p.box.minX;
  const h = p.box.maxY - p.box.minY;
  const isWedge = h > 60; // linha B ilustrativa
  if (isWedge) {
    ctx.save();
    tracePoly(ctx, p.pts);
    ctx.clip();
    const g = ctx.createLinearGradient(0, p.box.minY, 0, p.box.maxY);
    g.addColorStop(0, gray(255, 0.95));
    g.addColorStop(1, gray(255, 0.35));
    ctx.fillStyle = g;
    ctx.fillRect(p.box.minX, p.box.minY, w, h);
    ctx.restore();
    return;
  }
  // Pulmão aerado abaixo: campo mais brilhante com speckle grosseiro.
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.box.minX, p.box.maxY, w, s.height - p.box.maxY);
  ctx.clip();
  ctx.fillStyle = gray(60);
  ctx.fillRect(p.box.minX, p.box.maxY, w, s.height - p.box.maxY);
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = gray(rng.range(70, 140), 0.7);
    ctx.fillRect(rng.range(p.box.minX, p.box.maxX), rng.range(p.box.maxY, s.height), rng.range(2, 6), rng.range(1, 3));
  }
  // Linhas A: repetições da linha pleural a múltiplos da sua profundidade.
  const depth = (p.box.minY + p.box.maxY) / 2;
  for (let k = 1; k <= 3; k++) {
    const y = depth * (k + 1);
    if (y > s.height) break;
    ctx.fillStyle = gray(255, 0.45 / k);
    ctx.fillRect(p.box.minX + 10, y - 2, w - 20, 4);
  }
  ctx.restore();
  // Linha pleural: muito brilhante.
  tracePoly(ctx, p.pts);
  ctx.fillStyle = gray(250);
  ctx.fill();
  tracePoly(ctx, p.pts);
  ctx.strokeStyle = gray(255);
  ctx.lineWidth = 2;
  ctx.stroke();
}

function applySpeckle(ctx: Ctx2D, s: Scene, rng: Rng): void {
  const img = ctx.getImageData(0, 0, s.width, s.height);
  const d = img.data;
  const w = s.width;
  const h = Math.floor(d.length / 4 / w);
  for (let y = 0; y < h; y += 2) {
    const atten = 1 - 0.3 * (y / s.height);
    for (let x = 0; x < w; x += 2) {
      const n = 0.72 + 0.56 * rng.next();
      const lateral = 1 - 0.18 * Math.abs(x - w / 2) / (w / 2);
      const f = n * atten * lateral;
      for (let dy = 0; dy < 2; dy++) {
        const yy = y + dy;
        if (yy >= h) break;
        for (let dx = 0; dx < 2; dx++) {
          const xx = x + dx;
          if (xx >= w) break;
          const i = (yy * w + xx) * 4;
          const v = Math.min(255, d[i] * f + (rng.next() - 0.5) * 18);
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

function drawRulerAndMarks(ctx: Ctx2D, s: Scene): void {
  const x = s.width - 34;
  ctx.strokeStyle = gray(200);
  ctx.fillStyle = gray(210);
  ctx.font = '16px monospace';
  ctx.textAlign = 'right';
  ctx.lineWidth = 2;
  const maxCm = Math.floor(s.depthCm);
  for (let cm = 0; cm <= maxCm; cm++) {
    const y = cm * s.pxPerCm;
    if (y > s.height - 2) break;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 18, y);
    ctx.stroke();
    if (cm > 0) ctx.fillText(`${cm}`, x - 6, y + 6);
    // meio centímetro
    const yh = y + s.pxPerCm / 2;
    if (yh < s.height) {
      ctx.beginPath();
      ctx.moveTo(x + 8, yh);
      ctx.lineTo(x + 18, yh);
      ctx.stroke();
    }
  }
  ctx.textAlign = 'left';
  ctx.fillText('cm', x - 30, 20);
  // Marcador do transdutor (índice) no canto superior esquerdo.
  ctx.beginPath();
  ctx.arc(14, 14, 6, 0, Math.PI * 2);
  ctx.fillStyle = gray(240);
  ctx.fill();
}

/** Desenha a cena em ordem fixa (determinística para o mesmo seed). */
export function renderScene(ctx: Ctx2D, s: Scene): void {
  const rng = new Rng(s.seed);
  ctx.save();
  drawBackground(ctx, s);
  drawSkinAndFat(ctx, s, rng);
  s.muscles.forEach((m) => drawMuscle(ctx, m, rng, 52 + (rng.next() * 10)));
  s.organs.forEach((o) => drawOrgan(ctx, o, rng));
  s.fascias.forEach((f) => drawFascia(ctx, f));
  s.bones.forEach((b) => drawBone(ctx, s, b));
  s.pleurae.forEach((p) => drawPleura(ctx, s, p, rng));
  s.vessels.forEach((v) => drawVessel(ctx, s, v, rng));
  s.nerves.forEach((n) => drawNerve(ctx, n, rng));
  applySpeckle(ctx, s, rng);
  drawRulerAndMarks(ctx, s);
  ctx.restore();
}
