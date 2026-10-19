// Recorte por frações: node tools/crop-frac.mjs <in> <x0> <y0> <x1> <y1> <out.webp> [maxW]
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
const [, , input, x0, y0, x1, y1, output, maxW = '1400'] = process.argv;
await mkdir(path.dirname(output), { recursive: true });
const m = await sharp(input).metadata();
const left = Math.round(m.width * +x0), top = Math.round(m.height * +y0);
const width = Math.min(m.width - left, Math.round(m.width * (+x1 - +x0))), height = Math.min(m.height - top, Math.round(m.height * (+y1 - +y0)));
let img = sharp(input).extract({ left, top, width, height });
if (width > +maxW) img = img.resize({ width: +maxW });
const info = await img.webp({ quality: 85 }).toFile(output);
console.log(`ok ${output} ${info.width}x${info.height} (origem ${m.width}x${m.height})`);
