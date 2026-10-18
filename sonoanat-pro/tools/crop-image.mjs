// Recorta um painel de uma figura e salva em WebP.
// Uso: node tools/crop-image.mjs <entrada> <x> <y> <w> <h> <saida.webp> [larguraMax=1600]
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [, , input, x, y, w, h, output, maxW = '1600'] = process.argv;
if (!input || !output) {
  console.error('uso: node tools/crop-image.mjs <entrada> <x> <y> <w> <h> <saida.webp> [larguraMax]');
  process.exit(1);
}
await mkdir(path.dirname(output), { recursive: true });
const meta = await sharp(input).metadata();
const region = { left: Math.max(0, +x), top: Math.max(0, +y), width: Math.min(+w, meta.width - +x), height: Math.min(+h, meta.height - +y) };
let img = sharp(input).extract(region);
if (region.width > +maxW) img = img.resize({ width: +maxW });
const info = await img.webp({ quality: 86 }).toFile(output);
console.log(`ok ${output} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB (origem ${meta.width}x${meta.height})`);
