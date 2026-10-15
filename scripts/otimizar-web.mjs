/**
 * Converte as capturas full-page dos sites (PNG 1920px) para WebP.
 *
 *   node scripts/otimizar-web.mjs <pasta-das-capturas>
 *
 * Para cada captura gera em public/projetos/web/:
 *   <id>-1.webp, <id>-2.webp…  página inteira a 1600px de largura, em fatias
 *                              de no máximo 8000px de altura (o WebP não passa
 *                              de 16383px e fatias menores carregam aos poucos)
 *   <id>-thumb.webp            topo da página (hero) em 16:10, 800px
 * e grava src/content/web-capturas.json com as dimensões de cada fatia.
 * O <id> vem do nome do arquivo: screencapture-<dominio>-<pagina>-AAAA-MM-DD-…
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const root = process.argv[2];
const OUT = "public/projetos/web";
const WIDTH = 1600;
const SLICE = 8000;
mkdirSync(OUT, { recursive: true });

const manifest = {};
for (const f of readdirSync(root).filter((x) => x.endsWith(".png")).sort()) {
  let id = f.replace(/^screencapture-/, "").replace(/-\d{4}-\d{2}-\d{2}-.*$/, "");
  if (manifest[id]) id += "-b"; // mesma página capturada duas vezes
  const src = `${root}/${f}`;
  const resized = await sharp(src, { limitInputPixels: false }).resize({ width: WIDTH }).png().toBuffer();
  const { height } = await sharp(resized, { limitInputPixels: false }).metadata();
  const slices = [];
  for (let top = 0, i = 1; top < height; top += SLICE, i++) {
    const h = Math.min(SLICE, height - top);
    const info = await sharp(resized, { limitInputPixels: false })
      .extract({ left: 0, top, width: WIDTH, height: h })
      .webp({ quality: 80 })
      .toFile(`${OUT}/${id}-${i}.webp`);
    slices.push({ src: `/projetos/web/${id}-${i}.webp`, w: info.width, h: info.height, bytes: info.size });
  }
  await sharp(src, { limitInputPixels: false })
    .extract({ left: 0, top: 0, width: 1920, height: 1200 })
    .resize(800, 500)
    .webp({ quality: 80 })
    .toFile(`${OUT}/${id}-thumb.webp`);
  manifest[id] = { thumb: `/projetos/web/${id}-thumb.webp`, height, slices };
  console.log(id, height, slices.length);
}
writeFileSync("src/content/web-capturas.json", JSON.stringify(manifest, null, 1));
