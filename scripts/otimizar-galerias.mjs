/**
 * Otimiza as imagens dos manuais de marca e da galeria de social media.
 *
 *   node scripts/otimizar-galerias.mjs <pasta-brand>
 *
 * Para cada pasta de origem gera, em public/projetos/<destino>/:
 *   NN.webp        até 1800 px de largura (lightbox e seções do case)
 *   thumbs/NN.webp até 640 px de largura (grades e miniaturas)
 * e grava src/content/galerias.json com largura e altura de cada imagem.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const root = process.argv[2];
const sets = [
  ["gamerschool", "marca/gamerside"],
  ["nurotulo", "marca/nurotulo"],
  ["startingstars", "marca/starting-stars"],
  ["ivy", "marca/grupo-ivy"],
  ["social", "social"],
];

const manifest = {};
for (const [src, dest] of sets) {
  const out = `public/projetos/${dest}`;
  mkdirSync(`${out}/thumbs`, { recursive: true });
  const files = readdirSync(`${root}/${src}`).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  manifest[dest] = [];
  for (const f of files) {
    const n = f.replace(/\.[^.]+$/, "");
    const big = await sharp(`${root}/${src}/${f}`, { limitInputPixels: false })
      .resize({ width: 1800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`${out}/${n}.webp`);
    const thumb = await sharp(`${root}/${src}/${f}`, { limitInputPixels: false })
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`${out}/thumbs/${n}.webp`);
    manifest[dest].push({ n, w: big.width, h: big.height, tw: thumb.width, th: thumb.height });
  }
  console.log(dest, files.length);
}
writeFileSync("src/content/galerias.json", JSON.stringify(manifest, null, 1));
