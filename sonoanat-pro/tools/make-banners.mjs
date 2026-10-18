// Gera banners próprios (SVG → WebP) para as 4 regiões, sem material de terceiros.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'images', 'banners');
await mkdir(out, { recursive: true });

// Silhuetas simples (paths em 400x200) por região + um "campo de ultrassom" estilizado.
const regions = {
  upper: {
    hue: '#f59e0b',
    path: 'M70 60 q20 -40 60 -30 l40 10 q30 5 60 40 l50 60 l-18 12 l-48 -52 l-10 60 l-120 0 l-14 -100 z',
    label: 'Membro superior',
  },
  lower: {
    hue: '#22d3ee',
    path: 'M150 20 l60 0 l10 80 l25 90 l-25 6 l-35 -70 l-5 70 l-30 0 l-10 -100 z',
    label: 'Membro inferior',
  },
  trunk: {
    hue: '#c084fc',
    path: 'M120 30 l160 0 l-10 60 l15 90 l-170 0 l15 -90 z',
    label: 'Tórax e abdome',
  },
  pocus: {
    hue: '#34d399',
    path: 'M200 25 a60 60 0 1 1 -0.1 0 z M165 95 q35 -20 70 0 l10 85 l-90 0 z',
    label: 'POCUS',
  },
};

function svgFor(key) {
  const r = regions[key];
  const waves = Array.from({ length: 7 }, (_, i) => {
    const y = 30 + i * 26;
    return `<path d="M0 ${y} Q100 ${y - 10} 200 ${y} T400 ${y}" fill="none" stroke="${r.hue}" stroke-opacity="${0.08 + i * 0.03}" stroke-width="1.5"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="1200" height="600">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#020617"/></linearGradient>
      <radialGradient id="beam" cx="0.5" cy="0" r="0.9"><stop offset="0" stop-color="${r.hue}" stop-opacity="0.35"/><stop offset="1" stop-color="${r.hue}" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="400" height="200" fill="url(#bg)"/>
    <path d="M120 0 L280 0 L400 200 L0 200 Z" fill="url(#beam)"/>
    ${waves}
    <path d="${r.path}" fill="${r.hue}" fill-opacity="0.22" stroke="${r.hue}" stroke-width="2" stroke-linejoin="round"/>
    <g stroke="#e2e8f0" stroke-opacity="0.5" stroke-width="1">${[1, 2, 3, 4, 5].map((i) => `<line x1="385" y1="${i * 30}" x2="395" y2="${i * 30}"/>`).join('')}</g>
  </svg>`;
}

for (const key of Object.keys(regions)) {
  await sharp(Buffer.from(svgFor(key))).webp({ quality: 82 }).toFile(path.join(out, `${key}.webp`));
  console.log('ok', key);
}
