import { miniCases } from "./mini-cases";
import { premiumLeague } from "./premium-league";
import { podeRegularizar } from "./pode-regularizar";
import { horaDoLar } from "./hora-do-lar";
import { pormade } from "./pormade";

/**
 * Projetos.
 *
 * - `caseStudies`: estudos de caso com página própria em /projetos/[slug].
 * - `moreProjects`: carrossel "Mais projetos" (produto abre case resumido; branding abre um modal).
 *
 * `draft: true` mostra um aviso "rascunho" na página do case SÓ em
 * desenvolvimento (npm run dev). Revise o texto e mude para false.
 * Parágrafos que começam com "TODO" são pendências: não invente pesquisas ou
 * números, publique só o que você sustenta numa entrevista.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type CaseSection = {
  paragraphs: string[];
  image?: ProjectImage;
};

/**
 * Estrutura completa de um estudo de caso de UX (usada no Pormade).
 * Todos os campos são texto; os diagramas são desenhados em código a partir deles.
 */
export type DeepCase = {
  team: string;
  tools: string[];
  objectives: { business: string[]; user: string[] };
  discovery: string[];
  persona: { name: string; context: string; goals: string[]; pains: string[] };
  journey: { before: string[]; after: string[] };
  flow: { label: string; steps: string[] }[];
  wireframes: { title: string; note: string; blocks: ("bar" | "field" | "list" | "card" | "button" | "total")[] }[];
  testing: string[];
};

/** Capítulo livre de um estudo de caso (usado no Premium League). */
export type Chapter = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Colunas: "stats" mostra os itens grandes (números); "list", em lista. */
  columns?: { title: string; items: string[] }[];
  columnsStyle?: "stats" | "list";
  /** Etapas em sequência (jornada, passos). */
  stages?: { title: string; text?: string }[];
  persona?: { name: string; context?: string; goals: string[]; pains: string[]; label?: string };
  quotes?: { text: string; who: string }[];
  chips?: string[];
  image?: ProjectImage;
  images?: ProjectImage[];
  /** Ilustração desenhada em código. */
  art?: "design-system";
  /** Componente especial do capítulo. */
  custom?: "homepage-anatomy" | "app-screens" | "pl-design-system";
  /** Nota pequena ao fim do capítulo (fonte, ressalva). */
  note?: string;
  /** Protótipo animado ilustrativo exibido no capítulo. */
  prototype?: PrototypeId;
};

export type PrototypeId =
  | "premium-league"
  | "pormade"
  | "pode-regularizar"
  | "hora-do-lar-funcionario"
  | "hora-do-lar-empregador"
  | "akamai"
  | "angel-investor";

/** Bloco de impacto (Resultado) com destaque em largura total. */
export type Impact = {
  /** A frase ou número principal, em tamanho de cartaz. */
  claim: string;
  caption: string;
  chips: string[];
  paragraphs?: string[];
  /** Fonte ou ressalva. Começando com "TODO", só aparece em desenvolvimento. */
  note?: string;
};

/** Aprendizado em card numerado. */
export type Learning = { title: string; text: string };

export type CaseStudy = {
  slug: string;
  title: string;
  /** Uma linha: o que é. */
  summary: string;
  year: string;
  context: string;
  role: string;
  platforms: string;
  /** A métrica que resume o resultado. Vira o "objeto" quando não há imagem. */
  metric: { value: string; label: string };
  /** Sem imagem, a métrica aparece em tipo grande no lugar da foto. */
  cover: ProjectImage | null;
  /** Imagem de compartilhamento (1200×630). */
  og?: string;
  draft: boolean;
  problem: CaseSection;
  process: CaseSection;
  solution: CaseSection;
  result: CaseSection;
  gallery: ProjectImage[];
  links: { label: string; href: string }[];
  /** Estudo de caso completo no modelo Pormade (opcional). */
  deep?: DeepCase;
  /** Estudo de caso completo em capítulos livres (opcional). */
  chapters?: Chapter[];
  /** Fatos extras do resumo (rótulo, valor). */
  facts?: [string, string][];
  /** Resultado em destaque (todos os cases completos). */
  impact?: Impact;
  /** Aprendizados em cards numerados (todos os cases completos). */
  learnings?: Learning[];
};

export type ProjectCategory = "produto" | "branding" | "conceito" | "landing";

/**
 * Case resumido (página leve em /projetos/[slug]).
 * TODO-revisar: textos reconstruídos a partir das imagens e de informação
 * pública do segmento. Valide cada frase antes de publicar.
 */
export type MiniCase = {
  challenge: string;
  audience: string;
  process: string[];
  decisions: string[];
  delivery: string;
};

export type MoreProject = {
  slug: string;
  name: string;
  categories: ProjectCategory[];
  /** Uma linha descrevendo só o que a imagem mostra. */
  description: string;
  image: ProjectImage;
  /** Só projetos de produto têm case resumido. */
  case?: MiniCase;
};

export const categoryLabels: Record<ProjectCategory, string> = {
  produto: "Produto e UI",
  branding: "Branding",
  conceito: "Conceito",
  landing: "Landing page",
};

/** Capa publicada no Behance, ajustada para 16:9 (public/projetos/capas). */
const cover = (slug: string, alt: string, width = 1920, height = 1080): ProjectImage => ({
  src: `/projetos/capas/${slug}.webp`,
  alt,
  width,
  height,
});

const board = (slug: string, alt: string): ProjectImage => ({
  src: `/projetos/mais/${slug}.jpg`,
  alt,
  width: 1440,
  height: 810,
});

export const caseStudies: CaseStudy[] = [
  premiumLeague,
  horaDoLar,
  pormade,
  podeRegularizar,
];

const moreProjectsBase: Omit<MoreProject, "case">[] = [
  {
    slug: "angel-investor",
    name: "Angel Investor",
    categories: ["produto"],
    description: "App de comunidade de investidores: cadastro por telefone, feed, stories e chat.",
    image: cover("angel-investor", "Capa do Angel Investor Club: celular com a tela de abertura, fotos de pessoas da comunidade e o botão Iniciar, sobre fundo preto."),
  },
  {
    slug: "akamai",
    name: "Akamai",
    categories: ["produto"],
    description: "App de painel de segurança com gráficos de tráfego e ataques, e um mini design system.",
    image: board("akamai", "App mobile Akamai Mobile Control Center: login, gráficos de pizza e barras de ataques e tráfego, e um quadro de tipografia, cores, botões, formulários e gráficos."),
  },
  {
    slug: "app-de-viagens",
    name: "App de Viagens",
    categories: ["produto"],
    description: "Locação de veículo, pacotes e pontos turísticos, com a paleta do projeto.",
    image: board("app-de-viagens", "Telas de um app de viagens em verde: início com favoritos, locação de veículo, pacotes turísticos e pontos turísticos, e a paleta de sete cores."),
  },
  {
    slug: "nurotulo",
    name: "NuRótulo",
    categories: ["produto", "branding"],
    description: "Rebranding com antes e depois e o app de explorar produtos, com scanner e cartão saúde.",
    image: cover("nurotulo", "Capa do app NuRótulo: celular com a tela de login, sobre fundo verde-azulado."),
  },
  {
    slug: "polaris",
    name: "Polaris",
    categories: ["produto"],
    description: "Dashboard web com indicadores, comparativos e tela de login.",
    image: board("polaris", "Dashboard Polaris em notebooks: indicadores de desempenho, gráfico comparativo de vendas e tela de login."),
  },
  {
    slug: "bloco-do-urso",
    name: "Bloco do Urso",
    categories: ["produto"],
    description: "App de bloco de carnaval: notícias do evento, match entre foliões e metaverso.",
    image: cover("bloco-do-urso", "Capa do app Bloco do Urso: celular com a tela de abertura rosa e o logotipo do bloco, sobre fundo roxo."),
  },
  {
    slug: "virtualmed-clin",
    name: "VirtualMed Clin",
    categories: ["produto", "branding"],
    description: "Marca e site de atendimento médico online.",
    image: board("virtualmed-clin", "Site da VirtualMed Clin num tablet, com a chamada para atendimento médico online, e a marca aplicada em bottons e letreiro."),
  },
  {
    slug: "wineen",
    name: "Wineen",
    categories: ["branding"],
    description: "Identidade visual entre ecologia e esporte: logotipo, camiseta e ecobag.",
    image: board("wineen", "Marca Wineen com folhas no logotipo, aplicada em camiseta de atleta, letreiro em fundo verde e ecobag."),
  },
  {
    slug: "gamerside",
    name: "Gamerside",
    categories: ["branding"],
    description: "Marca gamer aplicada em mousepad, copo e periféricos.",
    image: board("gamerside", "Símbolo da Gamerside em mousepad, copo de papel e mesa gamer com controle e fone, em roxo."),
  },
  {
    slug: "startingstar",
    name: "Startingstar",
    categories: ["branding"],
    description: "Marca e site de squads de desenvolvimento, com cartões de visita e mascote astronauta.",
    image: board("startingstar", "Cartões de visita da Startingstar com mascote astronauta e o site de squads de desenvolvimento aberto num monitor."),
  },
  {
    slug: "sixseeds",
    name: "Sixseeds",
    categories: ["branding"],
    description: "Identidade visual aplicada em papelaria, camisetas e ecobag.",
    image: board("sixseeds", "Marca Sixseeds em rosa e azul-marinho aplicada em envelope, cartões, caderno, camisetas e ecobag."),
  },
  {
    slug: "eight2s4",
    name: "eight2s4",
    categories: ["branding"],
    description: "Marca de cibersegurança aplicada em moletom e em site responsivo.",
    image: board("eight2s4", "Marca eight2s4 estampada em moletom preto e o site de cibersegurança aberto num celular e num monitor."),
  },
  {
    slug: "grupo-ivy",
    name: "Grupo Ivy",
    categories: ["branding"],
    description: "Materiais de marca: display, ecobag e bottons.",
    image: board("grupo-ivy", "Materiais do Grupo Ivy em rosa e preto: display de mesa, ecobag azul com o logotipo e bottons."),
  },
  {
    slug: "banco-digital",
    name: "Banco digital",
    categories: ["conceito"],
    description: "Conceito de app de banco digital: tela de entrada com acesso à conta e abertura de conta.",
    image: cover("banco-digital", "Celular com a tela de entrada de um app de banco digital, com os botões Entrar na conta e Abrir uma conta, sobre fundo lilás."),
  },
  {
    slug: "ticket-log",
    name: "Ticket Log",
    categories: ["conceito"],
    description: "Conceito de app para a marca Ticket Log.",
    image: cover("ticket-log", "Logotipo verde da Ticket Log sobre fundo escuro.", 1600, 900),
  },
  {
    slug: "nasp",
    name: "Nasp Engenharia",
    categories: ["landing"],
    description: "Website institucional para uma empresa de engenharia.",
    image: cover("nasp", "Capa do projeto: logotipo da Nasp Engenharia e o título Website institucional, em UI/UX Design, sobre fundo escuro.", 1280, 720),
  },
  {
    slug: "bugatti",
    name: "Bugatti Store",
    categories: ["conceito"],
    description: "Conceito de loja da Bugatti: tela de abertura com o carro e chamada para explorar.",
    image: cover("bugatti", "Tela de abertura conceitual da Bugatti com o carro, o título Bugatti e o botão Discover more, sobre fundo escuro com hexágonos.", 1280, 720),
  },
  {
    slug: "mortal-kombat",
    name: "Mortal Kombat",
    categories: ["conceito"],
    description: "Conceito de app com fichas de personagem e atributos de combate.",
    image: cover("mortal-kombat", "Duas telas conceituais com a ficha do personagem Baraka e barras de dano, vida, combo e especial.", 1280, 720),
  },
];

export const moreProjects: MoreProject[] = moreProjectsBase.map((p) => ({
  ...p,
  case: miniCases[p.slug],
}));

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((p) => p.slug === slug);
}
