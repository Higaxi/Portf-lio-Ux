import { miniCases } from "./mini-cases";
import { premiumLeague } from "./premium-league";

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
  learnings: string[];
};

/** Capítulo livre de um estudo de caso (usado no Premium League). */
export type Chapter = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  columns?: { title: string; items: string[] }[];
  quotes?: { text: string; who: string }[];
  chips?: string[];
  image?: ProjectImage;
  /** Ilustração desenhada em código. */
  art?: "design-system";
  /** Nota pequena ao fim do capítulo (fonte, ressalva). */
  note?: string;
  /** Protótipo animado ilustrativo exibido no capítulo. */
  prototype?: boolean;
};

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
};

export type ProjectCategory = "produto" | "branding";

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
};

const board = (slug: string, alt: string): ProjectImage => ({
  src: `/projetos/mais/${slug}.jpg`,
  alt,
  width: 1440,
  height: 810,
});

export const caseStudies: CaseStudy[] = [
  premiumLeague,
  {
    slug: "pormade",
    title: "Pormade: vendas sem papel",
    summary: "Um gerador de propostas mobile que tirou do papel o fluxo de vendas de uma fabricante de portas.",
    year: "2020 – 2022", // TODO: ano exato do projeto
    context: "Digitaly Tech, para Pormade Portas",
    role: "Product Designer · Líder técnico de UX/UI", // TODO: confirme seu papel neste projeto
    platforms: "App mobile",
    metric: { value: "dias → minutos", label: "para fechar uma venda" },
    cover: {
      src: "/projetos/pormade/capa.svg",
      alt: "Ilustração do gerador de propostas num tablet: etapas Cliente, Porta, Medidas, Acabamento e Resumo; a porta configurada com 80 por 210 centímetros e acabamento em madeira; o resumo com o total e o botão Enviar proposta. Ao lado, o texto dias para minutos.",
      width: 1600,
      height: 900,
    },
    og: "/projetos/pormade/og.png",
    draft: true,
    // TODO-revisar: texto reconstruído (problema e processo)
    problem: {
      paragraphs: [
        "A Pormade fabrica portas e vende por meio de vendedores em campo. Todo o fluxo de vendas acontecia em papel: a proposta era preenchida à mão, conferida e repassada, e fechar uma venda levava dias.",
        "Público: vendedores que montam propostas na frente do cliente, longe do escritório, e precisam de rapidez e de poucos erros.",
      ],
    },
    process: {
      paragraphs: [
        "Comecei entendendo com o cliente e com quem vende como a proposta era montada no papel, onde travava e o que mais gerava retrabalho.",
        "Transformei esse caminho em um fluxo digital, cortando etapas de conferência, e validei a estrutura em wireframes antes da interface.",
        "Fechei o protótipo de alta fidelidade, testei com os usuários e acompanhei o handoff e a qualidade das entregas como líder técnico de UX/UI.",
      ],
    },
    solution: {
      paragraphs: [
        "Um aplicativo mobile de alta usabilidade substituiu o processo manual de ponta a ponta, pensado para quem vende em campo.",
        "TODO: as telas e decisões de interface mais importantes (montagem da proposta, catálogo, envio ao cliente).",
      ],
    },
    result: {
      paragraphs: [
        "O tempo para fechar uma venda caiu de dias para minutos, com mudança direta na operação e na experiência dos vendedores em campo.",
      ],
    },
    gallery: [],
    links: [],
    // TODO-revisar: estudo de caso reconstruído. Os artefatos originais não foram
    // guardados; tudo abaixo é qualitativo e precisa da sua validação.
    deep: {
      team: "TODO: quem mais estava no time (desenvolvimento, produto, cliente)",
      tools: ["Figma", "Adobe Illustrator"], // TODO: confirme as ferramentas
      objectives: {
        business: [
          "Encurtar o tempo entre a visita ao cliente e a venda fechada.",
          "Reduzir erros e retrabalho na conferência de propostas.",
          "Dar visibilidade às propostas em andamento.",
        ],
        user: [
          "Montar uma proposta completa na frente do cliente, sem voltar ao escritório.",
          "Encontrar produtos e opções rapidamente, com o mínimo de digitação.",
          "Enviar a proposta na hora e saber em que etapa ela está.",
        ],
      },
      discovery: [
        "Conversas com o cliente e com as áreas envolvidas para entender o processo comercial e as regras de cada proposta.",
        "Conversas com vendedores sobre a rotina em campo: onde a proposta era preenchida, o que costumava faltar e o que obrigava a refazer.",
        "Mapeamento do caminho do papel, do preenchimento à aprovação, marcando esperas e pontos de conferência.",
        "Benchmarking de aplicativos de força de vendas e geradores de propostas.",
      ],
      persona: {
        name: "Vendedor em campo",
        context: "Visita clientes ao longo do dia, apresenta produtos e precisa sair da conversa com a proposta encaminhada. Usa o celular como principal ferramenta de trabalho fora do escritório.",
        goals: ["Fechar a venda enquanto o cliente ainda está interessado.", "Não errar medidas, modelos e valores."],
        pains: ["Formulários em papel longos e fáceis de preencher errado.", "Dias de espera entre a visita e a proposta aprovada."],
      },
      journey: {
        before: [
          "Visita ao cliente",
          "Proposta preenchida à mão",
          "Envio do papel ao escritório",
          "Conferência e correções",
          "Aprovação",
          "Proposta ao cliente: dias depois",
        ],
        after: [
          "Visita ao cliente",
          "Proposta montada no app",
          "Validação na hora",
          "Proposta enviada: minutos depois",
        ],
      },
      flow: [
        { label: "Entrada", steps: ["Login", "Início com propostas recentes"] },
        { label: "Proposta", steps: ["Dados do cliente", "Catálogo de produtos", "Opções e medidas", "Resumo com valores"] },
        { label: "Envio", steps: ["Revisão final", "Envio ao cliente", "Acompanhamento do status"] },
      ],
      wireframes: [
        { title: "Início", note: "Ação principal no topo e propostas recentes logo abaixo.", blocks: ["bar", "button", "list", "list", "list"] },
        { title: "Catálogo", note: "Busca e cards de produto com o mínimo de digitação.", blocks: ["bar", "field", "card", "card", "card"] },
        { title: "Resumo", note: "Itens, valores e total antes do envio.", blocks: ["bar", "list", "list", "total", "button"] },
      ],
      testing: [
        "Testes de usabilidade com o protótipo, observando vendedores montarem uma proposta do início ao fim.",
        "Ajustes de ordem dos passos e de rótulos onde houve hesitação, e nova rodada de validação com o cliente.",
        "Acompanhamento da implementação para manter a interface fiel ao que foi testado.",
      ],
      learnings: [
        "Digitalizar não é copiar o formulário: o ganho veio de cortar etapas, não de passar o papel para a tela.",
        "Desenhar para quem trabalha em campo pede leitura rápida, toque grande e o mínimo de digitação.",
        "Liderar a qualidade das entregas até o fim do desenvolvimento protege o resultado do projeto.",
      ],
    },
  },
];

const moreProjectsBase: Omit<MoreProject, "case">[] = [
  {
    slug: "angel-investor",
    name: "Angel Investor",
    categories: ["produto"],
    description: "App de comunidade de investidores: cadastro por telefone, feed, stories e chat.",
    image: board("angel-investor", "Telas do app Angel Investor Club: cadastro por número de telefone, feed da comunidade, stories e conversas, em roxo e branco."),
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
    image: board("nurotulo", "Antes e depois da marca NuRótulo e um celular com o app aberto na tela Explorar, com scanner, cartão saúde e categorias."),
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
    image: board("bloco-do-urso", "Telas do app Bloco do Urso em roxo e amarelo: notícias do primeiro dia, match entre foliões, área de metaverso e tela de abertura."),
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
];

export const moreProjects: MoreProject[] = moreProjectsBase.map((p) => ({
  ...p,
  case: miniCases[p.slug],
}));

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((p) => p.slug === slug);
}
