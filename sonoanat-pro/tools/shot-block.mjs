// Captura o fluxo de um bloqueio: imagem limpa, estrutura ativada, aba do transdutor.
// Uso: node tools/shot-block.mjs <baseUrl> <outDir> <blockId> [rótulo da estrutura]
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [, , baseUrl, outDir, blockId, label] = process.argv;
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto(`${baseUrl}/#/b/${blockId}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.evaluate(() => document.querySelector('[role="status"]')?.remove());
await page.screenshot({ path: path.join(outDir, `${blockId}-1-limpa.png`), fullPage: true });
if (label) {
  await page.getByRole('button', { name: label, exact: false }).first().tap();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `${blockId}-2-estrutura.png`), fullPage: true });
}
await page.getByRole('button', { name: 'Mostrar todas' }).tap();
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, `${blockId}-3-todas.png`), fullPage: false });
await page.getByRole('tab', { name: 'Ergonomia' }).tap();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, `${blockId}-4-probe.png`), fullPage: true });
console.log('ok');
await browser.close();
