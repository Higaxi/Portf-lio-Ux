import capturas from "./web-capturas.json";

/**
 * Web design: landing pages e sites (capturas de nov/2020).
 * As imagens ficam em public/projetos/web (scripts/otimizar-web.mjs).
 * TODO (interno, não exibir): feitos na Seotimize, segundo o LinkedIn.
 * Sem links externos: muitos sites podem estar fora do ar; o domínio aparece só como texto.
 */

type Capture = { thumb: string; height: number; slices: { src: string; w: number; h: number }[] };
const caps = capturas as Record<string, Capture>;

export type WebPage = {
  label: string;
  domain: string;
  thumb: string;
  /** Altura total a 1600px de largura. */
  height: number;
  slices: { src: string; w: number; h: number }[];
};

export type WebClient = {
  slug: string;
  name: string;
  segment: string;
  pages: WebPage[];
};

const page = (id: string, label: string, domain: string): WebPage => ({
  label,
  domain,
  thumb: caps[id].thumb,
  height: caps[id].height,
  slices: caps[id].slices,
});

const clients: WebClient[] = [
  {
    slug: "raquel-pegoraro",
    name: "Raquel Pegoraro",
    segment: "Nutrição",
    pages: [
      page("l-raquelnutricionista-br", "Início", "l.raquelnutricionista.com.br"),
      page("l-raquelnutricionista-br-emagrecimento", "Emagrecimento", "l.raquelnutricionista.com.br/emagrecimento"),
      page("l-raquelnutricionista-br-nutricao-esportiva", "Nutrição esportiva", "l.raquelnutricionista.com.br/nutricao-esportiva"),
      page("l-raquelnutricionista-br-transtornos-alimentares", "Transtornos alimentares", "l.raquelnutricionista.com.br/transtornos-alimentares"),
    ],
  },
  {
    slug: "lr-centro",
    name: "LR Centro de Reabilitação & Performance",
    segment: "Esporte e reabilitação",
    pages: [
      page("lrcentroesportivo-br", "Site", "lrcentroesportivo.com.br"),
      page("l-lrcentroesportivo-br", "Landing page", "l.lrcentroesportivo.com.br"),
      page("l-lrcentroesportivo-br-fisio", "Fisioterapia", "l.lrcentroesportivo.com.br/fisio"),
      page("l-lrcentroesportivo-br-recovery-completo", "Recovery completo", "l.lrcentroesportivo.com.br/recovery-completo"),
    ],
  },
  {
    slug: "neuromaster",
    name: "Neuromaster",
    segment: "Saúde: neurologia e sono",
    pages: [
      page("lp-neuromaster-br", "Landing page", "lp.neuromaster.com.br"),
      page("lp-neuromaster-br-b", "Landing page (versão 2)", "lp.neuromaster.com.br"),
      page("lp-neuromaster-br-instituto-do-sono", "Instituto do Sono", "lp.neuromaster.com.br/instituto-do-sono"),
    ],
  },
  {
    slug: "renove",
    name: "Renove Dermatologia",
    segment: "Saúde: dermatologia",
    pages: [
      page("l-renovedermatologia-br", "Início", "l.renovedermatologia.com.br"),
      page("l-renovedermatologia-br-procedimentos", "Procedimentos", "l.renovedermatologia.com.br/procedimentos"),
    ],
  },
  {
    slug: "planalto-central",
    name: "Planalto Central Imóveis",
    segment: "Imobiliário",
    pages: [
      page("l-planaltocentralimoveis-br", "Administração e locação", "l.planaltocentralimoveis.com.br"),
      page("l-planaltocentralimoveis-br-venda", "Venda", "l.planaltocentralimoveis.com.br/venda"),
    ],
  },
  {
    slug: "gofind",
    name: "GoFind",
    segment: "Tecnologia e varejo",
    pages: [
      page("l-gofind-online", "Início", "l.gofind.online"),
      page("l-gofind-online-localizador", "Localizador", "l.gofind.online/localizador"),
    ],
  },
  { slug: "despertar", name: "Espaço Despertar", segment: "Psicologia", pages: [page("despertarpsicologia-br", "Início", "despertarpsicologia.com.br")] },
  { slug: "luminas", name: "Centro Clínico Luminas", segment: "Psicologia", pages: [page("luminaspsicologia-br", "Início", "luminaspsicologia.com.br")] },
  { slug: "ginoclin", name: "Ginoclin", segment: "Saúde: ginecologia", pages: [page("ginoclin-med-br", "Início", "ginoclin.med.br")] },
  { slug: "hominem", name: "Hominem", segment: "Saúde: saúde masculina", pages: [page("hominem-br", "Início", "hominem.com.br")] },
  { slug: "checkup-urologico", name: "Check-up Urológico", segment: "Saúde: urologia", pages: [page("l-checkup-urologico-br", "Início", "l.checkup-urologico.com.br")] },
  { slug: "otorrino-asa-norte", name: "Otorrino Asa Norte", segment: "Saúde: otorrinolaringologia", pages: [page("otorrinoasanorte-br", "Início", "otorrinoasanorte.com.br")] },
  { slug: "fonoaudiologia-foz", name: "Fonoaudiologia Foz", segment: "Saúde: audição", pages: [page("lp-fonoaudiologiafoz-br", "Início", "lp.fonoaudiologiafoz.com.br")] },
  { slug: "procedimentos-faciais", name: "Procedimentos Faciais", segment: "Estética", pages: [page("procedimentosfaciais-br", "Início", "procedimentosfaciais.com.br")] },
  { slug: "clinica-nutrit", name: "Clínica Nutrit", segment: "Nutrição", pages: [page("l-clinicanutrit-br", "Início", "l.clinicanutrit.com.br")] },
  { slug: "espaco-senior", name: "Espaço Sênior", segment: "Cuidado de idosos", pages: [page("l-espacoseniordf-br", "Início", "l.espacoseniordf.com.br")] },
  { slug: "rodrigo-azevedo", name: "Rodrigo Azevedo Advocacia", segment: "Jurídico", pages: [page("l-advrodrigoazevedo-br", "Início", "l.advrodrigoazevedo.com.br")] },
  { slug: "erica-cintra", name: "Érica Cintra", segment: "Gestão de clínicas", pages: [page("l-ericacintra-br", "Início", "l.ericacintra.com.br")] },
  { slug: "movement-me", name: "Movement Me", segment: "Agência de marketing", pages: [page("l-movementme", "Início", "l.movementme.com")] },
];

/** Clientes com mais páginas primeiro (ordem estável para os demais). */
export const webClients: WebClient[] = [...clients].sort((a, b) => b.pages.length - a.pages.length);

export const webLabel = "Landing page · 2020";
