/**
 * Capas do Behance ajustadas para 16:9 sem cortar o conteúdo principal:
 * a imagem cabe inteira e as laterais (ou faixas) são completadas com a cor
 * do fundo da própria capa. Saída em WebP para public/projetos/capas/.
 *
 *   node scripts/capas-behance.mjs <pasta-das-capas> <pasta-pormade> <pasta-podereg>
 */
import sharp from "sharp";

const [covers, pormade, podereg] = process.argv.slice(2);
const jobs = [
  ["pormade", `${pormade}/01.png`, 1920],
  ["pode-regularizar", `${podereg}/01.png`, 1600],
  ["angel-investor", `${covers}/angel-investor.png`, 1920],
  ["bloco-do-urso", `${covers}/bloco-do-urso.png`, 1920],
  ["nurotulo", `${covers}/nurotulo.png`, 1920],
  ["banco-digital", `${covers}/banco-digital.png`, 1920],
  ["ticket-log", `${covers}/ticket-log.png`, 1600],
  ["nasp", `${covers}/nasp.png`, 1280],
  ["bugatti", `${covers}/bugatti.png`, 1280],
  ["mortal-kombat", `${covers}/mortal-kombat.jpg`, 1280],
];

for (const [slug, src, W] of jobs) {
  const H = Math.round((W * 9) / 16);
  const img = sharp(src).removeAlpha();
  const { data } = await img.clone().extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  const background = { r: data[0], g: data[1], b: data[2] };
  const meta = await sharp(src).metadata();
  const ratio = meta.width / meta.height;
  let pipeline;
  if (Math.abs(ratio - 16 / 9) < 0.02) {
    pipeline = img.resize(W, H, { fit: "cover" });
  } else if (ratio > 16 / 9) {
    // Mais larga que 16:9: corta as laterais (fundo), mantendo o centro.
    pipeline = img.resize(W, H, { fit: "cover", position: "centre" });
  } else {
    // Mais alta: cabe inteira e completa as laterais com a cor do fundo.
    pipeline = img.resize(W, H, { fit: "contain", background });
  }
  const info = await pipeline.webp({ quality: 86 }).toFile(`public/projetos/capas/${slug}.webp`);
  console.log(slug, info.width, info.height, info.size);
}
