// scripts/generate-icons.mjs — Genera los iconos PWA (192 y 512) de ForestData.
// Uso: node scripts/generate-icons.mjs
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'icons');

const TREE_SVG = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a"/>
  <circle cx="256" cy="200" r="88" fill="#ffffff"/>
  <circle cx="176" cy="272" r="72" fill="#ffffff"/>
  <circle cx="336" cy="272" r="72" fill="#ffffff"/>
  <rect x="234" y="290" width="44" height="120" rx="14" fill="#14532d"/>
</svg>`;

for (const size of [192, 512]) {
  await sharp(Buffer.from(TREE_SVG(size)))
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, `icon-${size}.png`));
  console.log(`icon-${size}.png generado`);
}
