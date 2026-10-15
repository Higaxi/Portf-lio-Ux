import galerias from "./galerias.json";
import type { GalleryImage } from "./brand-cases";

/** Pranchas de social media (01–07) e de web design (08–17). */
const labels: Record<string, { kind: "Social media" | "Web design"; title: string }> = {
  "01": { kind: "Social media", title: "Harmonia" },
  "02": { kind: "Social media", title: "Destak do Samba" },
  "03": { kind: "Social media", title: "FG Contadores Associados" },
  "04": { kind: "Social media", title: "Obucco" },
  "05": { kind: "Social media", title: "Inácio Rios" },
  "06": { kind: "Social media", title: "Mega Fitness" },
  "07": { kind: "Social media", title: "Samba com Atitude" },
  "08": { kind: "Web design", title: "Landing pages: móveis e empresas" },
  "09": { kind: "Web design", title: "Landing pages: clínicas" },
  "10": { kind: "Web design", title: "Landing pages: psicologia e dermatologia" },
  "11": { kind: "Web design", title: "Landing pages: nutrição" },
  "12": { kind: "Web design", title: "Landing pages: clínica do sono e neurologia" },
  "13": { kind: "Web design", title: "Landing pages: ginecologia, audição e imóveis" },
  "14": { kind: "Web design", title: "Landing pages: saúde e reabilitação" },
  "15": { kind: "Web design", title: "Landing pages: urologia e reabilitação" },
  "16": { kind: "Web design", title: "Landing pages: marketing e advocacia" },
  "17": { kind: "Web design", title: "Landing pages: performance e cuidado de idosos" },
};

type Manifest = Record<string, { n: string; w: number; h: number; tw: number; th: number }[]>;

export type SocialItem = GalleryImage & { kind: string; title: string; thumbWidth: number; thumbHeight: number };

export const socialItems: SocialItem[] = ((galerias as Manifest).social ?? []).map((p) => {
  const l = labels[p.n] ?? { kind: "Social media", title: `Prancha ${p.n}` };
  return {
    src: `/projetos/social/${p.n}.webp`,
    thumb: `/projetos/social/thumbs/${p.n}.webp`,
    width: p.w,
    height: p.h,
    thumbWidth: p.tw,
    thumbHeight: p.th,
    alt: `${l.kind}: ${l.title}.`,
    kind: l.kind,
    title: l.title,
  };
});
