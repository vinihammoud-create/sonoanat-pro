// Captura telas do app (preview) com Edge headless. Uso: node tools/screenshots.mjs <baseUrl> <outDir> [desktop]
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [, , baseUrl = 'http://localhost:4173', outDir = 'screens', mode = 'mobile'] = process.argv;
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext(
  mode === 'desktop'
    ? { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 }
    : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
);
const page = await context.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });

const shots = [
  ['home', '#/'],
  ['category-upper', '#/c/upper_extremity'],
  ['block-supraclavicular', '#/b/supraclavicular'],
  ['block-femoral', '#/b/femoral'],
  ['block-tap', '#/b/tap_block'],
  ['block-lung', '#/b/lung_ultrasound'],
  ['block-femoral-clinico', '#/b/femoral/clinico'],
  ['block-femoral-ergonomia', '#/b/femoral/ergonomia'],
  ['studio-supraclavicular', '#/studio/supraclavicular'],
];

for (const [name, hash] of shots) {
  await page.goto(`${baseUrl}/${hash}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  // espera imagens (inclusive as geradas) carregarem
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; }))));
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log('shot', name);
}
await browser.close();
