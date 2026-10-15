import galerias from "./galerias.json";

/**
 * Cases de design gráfico (manuais de marca). Um modelo único para todos.
 *
 * Fonte: os manuais de marca publicados pelo Mateus. Os textos resumem o que
 * cada página do manual mostra; nada de métricas. As imagens ficam em
 * public/projetos/marca/<slug>/NN.webp (geradas por scripts/otimizar-galerias.mjs).
 * TODO: confirme cliente, ano e papel (designer gráfico ou diretor de arte) de cada um.
 */

export type GalleryImage = { src: string; thumb: string; width: number; height: number; alt: string };

export type BrandSection = {
  id: string;
  title: string;
  text: string;
  /** Números das páginas do manual (ex.: "07"). A primeira é a imagem principal. */
  pages: string[];
  swatches?: { hex: string; label: string }[];
  fonts?: string[];
};

export type BrandCase = {
  slug: string;
  name: string;
  /** Linha curta para o card e o topo do case. */
  summary: string;
  client: string;
  deliverable: string;
  role: string;
  year: string;
  /** Pasta em public/projetos. */
  dir: string;
  /** Imagem extra de contexto (opcional). */
  context?: { src: string; width: number; height: number; alt: string; caption: string };
  sections: BrandSection[];
  /** Rótulo de cada página do manual, para o texto alternativo da galeria. */
  pageLabels: Record<string, string>;
};

type Manifest = Record<string, { n: string; w: number; h: number; tw: number; th: number }[]>;
const manifest = galerias as Manifest;

/** Todas as páginas do manual, em ordem, com dimensões reais. */
export function manualPages(b: BrandCase): GalleryImage[] {
  return (manifest[b.dir] ?? []).map((p) => ({
    src: `/projetos/${b.dir}/${p.n}.webp`,
    thumb: `/projetos/${b.dir}/thumbs/${p.n}.webp`,
    width: p.w,
    height: p.h,
    alt: `${b.name}, manual de marca, página ${Number(p.n)}${b.pageLabels[p.n] ? `: ${b.pageLabels[p.n]}` : ""}.`,
  }));
}

export function pageImage(b: BrandCase, n: string): GalleryImage | undefined {
  return manualPages(b).find((p) => p.src.endsWith(`/${n}.webp`));
}

export const brandCases: BrandCase[] = [
  {
    slug: "gamerside",
    name: "Gamerside",
    summary: "Manual de marca da Gamerschool, a marca filha da Gamerside voltada a ensinar e-sports nas escolas.",
    client: "Gamerside (marca filha: Gamerschool)",
    deliverable: "Manual de marca",
    role: "TODO: designer gráfico ou diretor de arte?",
    year: "TODO",
    dir: "marca/gamerside",
    context: {
      src: "/projetos/mais/gamerside.jpg",
      width: 1440,
      height: 810,
      alt: "Marca-mãe Gamerside aplicada em mousepad, copo e periféricos, em roxo.",
      caption: "A marca-mãe, Gamerside.",
    },
    pageLabels: {
      "01": "capa",
      "03": "a essência da marca",
      "04": "sobre a marca",
      "05": "serviços",
      "06": "inspiração",
      "07": "logotipos",
      "08": "fundos",
      "09": "construção da marca",
      "10": "paleta de cores",
      "11": "tipografia",
      "12": "formas de uso",
      "13": "margem de respiro",
      "14": "redução",
      "15": "uso incorreto",
      "16": "fundos e cores",
      "17": "fundos e cores de uso incorreto",
      "18": "uso da logo em criativos",
      "19": "montagem de criativos",
      "20": "aplicações",
      "21": "mockup em notebook",
      "22": "mockup em caneca",
      "23": "mockup em fachada",
      "24": "mockup em papelaria",
      "25": "mockup em sacola",
      "26": "encerramento",
    },
    sections: [
      {
        id: "desafio",
        title: "O desafio",
        text: "A Gamerschool ensina e-sports nas escolas, preparando jovens para competir em torneios ou seguir carreira na área, e acredita que os jogos desenvolvem resolução de problemas, trabalho em equipe, liderança e reflexos. A marca precisava falar com esse público jovem sem perder a credibilidade de uma escola.",
        pages: ["04", "03"],
      },
      {
        id: "conceito",
        title: "Conceito e inspiração",
        text: "O universo gamer em luz azul e roxa, com fotos de jogadores, controles e óculos de realidade virtual. O chapéu de formatura sobre o símbolo une os dois mundos: jogo e escola.",
        pages: ["06", "08"],
      },
      {
        id: "logotipo",
        title: "Logotipo e construção",
        text: "O símbolo combina o chapéu de formatura com as letras GS e um par de óculos. O manual define as versões (símbolo, logotipo horizontal e vertical) e a construção sobre grid.",
        pages: ["07", "09", "12"],
      },
      {
        id: "paleta",
        title: "Paleta de cores",
        text: "Quatro cores apresentadas como personagens em pixel art. Cada uma tem um significado no manual: energia e entusiasmo, nobreza e sabedoria, confiança e tranquilidade, equilíbrio e estabilidade.",
        pages: ["10"],
        swatches: [
          { hex: "#FF914D", label: "Laranja: energia, entusiasmo, comunicação e espontaneidade" },
          { hex: "#062F93", label: "Nobreza, sabedoria e esclarecimento" },
          { hex: "#662D91", label: "Expansão, unidade, confiança e tranquilidade" },
          { hex: "#5E92FA", label: "Azul claro: equilíbrio, harmonia e estabilidade" },
        ],
      },
      {
        id: "tipografia",
        title: "Tipografia",
        text: "Montserrat Extrabold para títulos e Poppins Medium para textos, com duas fontes de personalidade para destaques: Schollkid, de traço escolar, e Monstroux.",
        pages: ["11"],
        fonts: ["Montserrat Extrabold", "Poppins Medium", "Schollkid Regular", "Monstroux Solid"],
      },
      {
        id: "regras",
        title: "Regras de uso",
        text: "Margem de respiro calculada a partir do círculo interno da marca (1P), tamanho mínimo de redução, usos incorretos e combinações de fundo e cor permitidas e proibidas.",
        pages: ["13", "14", "15", "16", "17"],
      },
      {
        id: "criativos",
        title: "Criativos",
        text: "Um gabarito para posicionar a logo nos criativos e uma grade para montar as peças, para que tudo o que a equipe produza saia consistente.",
        pages: ["18", "19", "20"],
      },
      {
        id: "aplicacoes",
        title: "Aplicações",
        text: "A marca aplicada em notebook, caneca, fachada, papelaria e sacola.",
        pages: ["21", "22", "23", "24", "25"],
      },
    ],
  },
  {
    slug: "nurotulo-marca",
    name: "NuRótulo: identidade visual",
    summary: "Manual de marca de uma empresa de tecnologia cujo propósito é a inclusão alimentar.",
    client: "NuRótulo",
    deliverable: "Manual de marca",
    role: "TODO: designer gráfico ou diretor de arte?",
    year: "TODO",
    dir: "marca/nurotulo",
    pageLabels: {
      "01": "capa",
      "03": "seu novo app",
      "04": "sobre nós",
      "05": "serviços",
      "06": "inspiração do logotipo",
      "07": "grids",
      "08": "grids",
      "09": "arejamento",
      "10": "a marca",
      "11": "a marca",
      "12": "distorções",
      "13": "tipografia",
      "14": "tipografia Lava Pro Rough",
      "15": "tipografia League Gothic",
      "16": "tipografia Raleway",
      "17": "cores primárias",
      "18": "cores secundárias",
      "19": "fundos e cores",
      "20": "fundos e cores que não podem",
      "21": "uso da logo em criativos",
      "22": "montagem de criativos",
      "23": "regras de uso dos stories",
      "24": "regras de uso dos stories",
      "25": "variações para publicações",
      "26": "como fazer o próprio material",
      "27": "como fazer o próprio material",
      "28": "fonte e filtro",
      "29": "elementos",
      "30": "elementos",
      "31": "aplicações",
      "36": "encerramento",
    },
    sections: [
      {
        id: "desafio",
        title: "O desafio",
        text: "A NuRótulo é uma empresa de tecnologia cujo propósito é a inclusão alimentar: ajudar milhões de pessoas com restrições alimentares a encontrar produtos seguros. A marca chegava a um novo momento, com app próprio, e precisava de uma identidade padronizada.",
        pages: ["04", "05"],
      },
      {
        id: "conceito",
        title: "Conceito",
        text: "O logotipo nasce do código de barras, o elemento que todo rótulo tem. Dele vêm os atributos que o manual associa à marca: autoridade, inovação, tecnologia, segurança, praticidade e fácil entendimento.",
        pages: ["06", "03"],
      },
      {
        id: "logotipo",
        title: "Logotipo e construção",
        text: "As barras formam as letras NU. O manual traz o grid de construção, a área de arejamento (2P) e as versões da marca.",
        pages: ["07", "08", "09", "10", "11"],
      },
      {
        id: "paleta",
        title: "Paleta de cores",
        text: "Azul e verdes como cores primárias, para criatividade, saúde e frescor; vermelhos, laranja e amarelo como secundárias, para alegria e calor nos detalhes.",
        pages: ["17", "18"],
        swatches: [
          { hex: "#35BEEC", label: "Primária: azul" },
          { hex: "#7DED91", label: "Primária: verde claro" },
          { hex: "#29AC6F", label: "Primária: verde" },
          { hex: "#009D90", label: "Primária: verde-azulado" },
          { hex: "#A62221", label: "Secundária: vermelho" },
          { hex: "#A1372A", label: "Secundária: vermelho terroso" },
          { hex: "#FF914D", label: "Secundária: laranja" },
          { hex: "#FFEC96", label: "Secundária: amarelo" },
          { hex: "#171B27", label: "Secundária: escuro" },
        ],
      },
      {
        id: "tipografia",
        title: "Tipografia",
        text: "Better Together Script e Blacktear para títulos com personalidade, Lava Pro Rough para chamadas, League Gothic para subtítulos e Raleway para textos longos.",
        pages: ["13", "14", "15", "16"],
        fonts: ["Better Together Script", "Blacktear", "Lava Pro Rough", "League Gothic", "Raleway"],
      },
      {
        id: "regras",
        title: "Regras de uso",
        text: "Distorções proibidas e combinações de fundo e cor permitidas e proibidas.",
        pages: ["12", "19", "20"],
      },
      {
        id: "criativos",
        title: "Redes sociais e criativos",
        text: "O manual vai além da marca: ensina a montar criativos, os formatos de stories e publicações e como a própria equipe pode produzir material (enquadramento, luz, fonte e filtro), com um conjunto de ícones de alérgenos.",
        pages: ["23", "25", "26", "29"],
      },
      {
        id: "aplicacoes",
        title: "Aplicações",
        text: "A marca aplicada em camisetas, sacolas, moletom e embalagens.",
        pages: ["32", "33", "34", "35"],
      },
    ],
  },
  {
    slug: "starting-star",
    name: "Starting Star",
    summary: "Manual de identidade visual de uma empresa de tecnologia: outsourcing, consultoria e desenvolvimento de software.",
    client: "Starting Star",
    deliverable: "Manual de identidade visual",
    role: "TODO: designer gráfico ou diretor de arte?",
    year: "TODO",
    dir: "marca/starting-stars",
    pageLabels: {
      "01": "capa",
      "02": "sobre a marca",
      "03": "serviços",
      "04": "serviços",
      "05": "a essência da marca",
      "06": "inspiração",
      "07": "moodboard",
      "08": "construção da marca",
      "09": "cores da marca",
      "10": "fonte da marca",
      "11": "uso dos logotipos",
      "12": "margem de respiro",
      "13": "redução",
      "14": "variações P&B",
      "15": "formas de uso",
      "16": "uso incorreto",
      "17": "fundos e cores",
      "18": "fundos e cores de uso incorreto",
      "19": "como as cores foram pensadas",
      "20": "uso da logo em criativos",
      "21": "montagem de criativos",
      "22": "aplicação em caneca",
      "23": "aplicação em papelaria",
      "24": "aplicação em fachada",
      "25": "encerramento",
    },
    sections: [
      {
        id: "desafio",
        title: "O desafio",
        text: "Uma empresa de tecnologia (outsourcing, consultoria e desenvolvimento de software) precisava de uma marca moderna, dinâmica e inovadora, com cores ousadas, tipografia legível e um símbolo simples o bastante para funcionar em qualquer plataforma.",
        pages: ["02", "03"],
      },
      {
        id: "conceito",
        title: "Conceito e inspiração",
        text: "A estrela em movimento, como um lançamento: começar e decolar. O moodboard reúne tecnologia, equipes e o espaço.",
        pages: ["06", "07"],
      },
      {
        id: "logotipo",
        title: "Logotipo e construção",
        text: "Símbolo de estrela formado por traços angulares, com logotipo em caixa alta. O manual define construção, versões e variações em preto e branco.",
        pages: ["08", "11", "15", "14"],
      },
      {
        id: "paleta",
        title: "Paleta de cores",
        text: "Três cores: preto para elegância e seriedade, magenta para inovação e energia, branco para clareza. O manual explica a escolha de cada uma.",
        pages: ["09", "19"],
        swatches: [
          { hex: "#161616", label: "Preto" },
          { hex: "#EF0454", label: "Magenta" },
          { hex: "#FFFFFF", label: "Branco" },
        ],
      },
      {
        id: "tipografia",
        title: "Tipografia",
        text: "Uma família só, a Poppins, em quatro pesos: Thin, Regular, Medium e ExtraBold.",
        pages: ["10"],
        fonts: ["Poppins Thin", "Poppins", "Poppins Medium", "Poppins ExtraBold"],
      },
      {
        id: "regras",
        title: "Regras de uso",
        text: "Margem de respiro, redução mínima, usos incorretos e fundos e cores permitidos e proibidos.",
        pages: ["12", "13", "16", "17", "18"],
      },
      {
        id: "aplicacoes",
        title: "Aplicações",
        text: "Gabarito para criativos e a marca aplicada em caneca, papelaria e fachada.",
        pages: ["22", "23", "24", "20"],
      },
    ],
  },
  {
    slug: "grupo-ivy-marca",
    name: "Grupo Ivy",
    summary: "Manual de marca 2023 de um grupo de consultoria, tecnologia, criação e marketing.",
    client: "Grupo Ivy",
    deliverable: "Manual de marca (2023)",
    role: "TODO: designer gráfico ou diretor de arte?",
    year: "2023",
    dir: "marca/grupo-ivy",
    pageLabels: {
      "01": "capa",
      "02": "conteúdo da apresentação",
      "03": "sobre o Grupo Ivy",
      "04": "nossa inspiração",
      "05": "o que é a Ivy",
      "06": "no que acreditamos",
      "08": "a história do logotipo",
      "09": "atributos do logotipo",
      "10": "distorções",
      "12": "paleta de cores",
      "13": "paleta de cores",
      "14": "paleta de cores secundárias",
      "15": "paleta de cores",
      "16": "outros pontos importantes",
      "17": "fundos e cores",
      "18": "fundos e cores que não podem",
      "20": "tipografia Montserrat",
      "21": "tipografia Poppins",
      "22": "tipografia Bebas Neue",
      "23": "pontos a considerar",
      "25": "uso de fotografia",
      "26": "regras básicas de fotografia",
      "28": "aplicação de logotipo",
      "35": "contato",
      "36": "encerramento",
    },
    sections: [
      {
        id: "desafio",
        title: "O desafio",
        text: "O Grupo Ivy reúne consultoria, terceirização de TI, automação, robótica, propaganda e marketing. Depois de dois nomes e duas identidades, a marca precisava de um manual que consolidasse a fase nova, mais minimalista e séria.",
        pages: ["03", "05"],
      },
      {
        id: "conceito",
        title: "A história do logotipo",
        text: "O manual conta a evolução: em 2021, uma marca ainda voltada ao grupo; em 2022, uma identidade forte e jovem; em 2023, a marca totalmente reformada, minimalista e mais séria.",
        pages: ["08", "09"],
      },
      {
        id: "paleta",
        title: "Paleta de cores",
        text: "Cinza claro, azul-ardósia, preto e rosa como principais; rosa escuro, roxo e verde-água como secundárias.",
        pages: ["13", "14"],
        swatches: [
          { hex: "#E9E9E9", label: "Principal: cinza claro" },
          { hex: "#3E485D", label: "Principal: azul-ardósia" },
          { hex: "#000000", label: "Principal: preto" },
          { hex: "#DE4F80", label: "Principal: rosa" },
          { hex: "#C83B6B", label: "Secundária: rosa escuro" },
          { hex: "#512A83", label: "Secundária: roxo" },
          { hex: "#44B59D", label: "Secundária: verde-água" },
        ],
      },
      {
        id: "tipografia",
        title: "Tipografia",
        text: "Montserrat e Poppins para textos e títulos; Bebas Neue, geométrica e impactante, reservada a títulos e destaques porque perde legibilidade em tamanhos pequenos.",
        pages: ["20", "21", "22"],
        fonts: ["Montserrat", "Poppins", "Bebas Neue"],
      },
      {
        id: "regras",
        title: "Regras de uso",
        text: "Distorções proibidas, fundos e cores permitidos e proibidos, hierarquia e harmonia, e regras de fotografia (composição, tom e esquema de cores).",
        pages: ["10", "17", "18", "26"],
      },
      {
        id: "aplicacoes",
        title: "Aplicações",
        text: "A marca aplicada em camisetas, boné, sacola, site, cadernos e papelaria.",
        pages: ["28", "29", "32", "34"],
      },
    ],
  },
];

export function getBrandCase(slug: string): BrandCase | undefined {
  return brandCases.find((b) => b.slug === slug);
}
