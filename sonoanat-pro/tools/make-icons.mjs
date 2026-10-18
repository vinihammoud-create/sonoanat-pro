// Gera os ícones PNG do PWA a partir de public/favicon.svg (requer sharp).
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = await readFile(path.join(root, 'public', 'favicon.svg'));

const targets = [
  { file: 'pwa-192x192.png', size: 192, pad: 0 },
  { file: 'pwa-512x512.png', size: 512, pad: 0 },
  { file: 'apple-touch-icon-180x180.png', size: 180, pad: 0 },
  // maskable: conteúdo dentro da "safe zone" central (80%), fundo sólido.
  { file: 'pwa-maskable-512x512.png', size: 512, pad: 64 },
];

for (const t of targets) {
  const inner = t.size - t.pad * 2;
  const icon = await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: t.size, height: t.size, channels: 4, background: '#020617' } })
    .composite([{ input: icon, left: t.pad, top: t.pad }])
    .png()
    .toFile(path.join(root, 'public', t.file));
  console.log('ok', t.file);
}
