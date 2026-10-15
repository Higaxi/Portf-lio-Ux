import type { CaseStudy } from "./projects";

/**
 * Estudo de caso Premium League (Tecnologia Única).
 *
 * Fonte principal: a palestra interna do Mateus sobre o projeto
 * (slides de processo, diagnóstico, entrevistas e antes/depois) e o site
 * público do produto. Os números de downloads, times e campeonatos são do
 * produto (site oficial), não resultado do projeto.
 *
 * TODO-revisar: os trechos marcados abaixo foram escritos para ligar os fatos
 * dos slides; confira se descrevem bem o que aconteceu.
 */
const dir = "/projetos/premium-league";

export const premiumLeague: CaseStudy = {
  slug: "premium-league",
  title: "Premium League",
  summary:
    "Redesign de um fantasy game de futebol com o novo design system: as entrevistas mostraram que o problema não era o produto, era a experiência.",
  year: "2024 – 2026",
  context: "Tecnologia Única",
  role: "Product Designer · UX Lead",
  platforms: "App mobile e desktop",
  // TODO-revisar: contagem feita comparando a lista de oportunidades da
  // palestra com a lista do plano PRO no site (anúncios, escalação automática,
  // mínimo para valorizar, estatísticas e notificações).
  metric: { value: "5 de 8", label: "oportunidades das entrevistas hoje fazem parte do plano PRO" },
  cover: {
    src: `${dir}/capa.svg`,
    alt: "Ilustração da nova tela de escalação do Premium League num celular: campo verde com a formação 4-3-3, cards de jogadores com preço, banco de reservas e navegação inferior, sobre fundo azul da marca; atrás, desfocada, a versão antiga roxa.",
    width: 1600,
    height: 900,
  },
  og: `${dir}/og.png`,
  draft: true,
  facts: [
    ["Método", "Double Diamond"],
    ["Ferramentas", "Figma"], // TODO: confirme as ferramentas
  ],
  problem: {
    paragraphs: [
      "O Premium League é um fantasy game de futebol da Tecnologia Única: o jogador monta o time, escala a rodada e disputa ligas em campeonatos como Brasileirão, Libertadores, Champions e as ligas inglesa, espanhola e alemã, no app e no desktop.",
    ],
  },
  process: { paragraphs: [] },
  solution: { paragraphs: [] },
  result: { paragraphs: [] },
  gallery: [],
  links: [
    { label: "Conhecer o produto", href: "https://premiumleague.io/" },
  ],
  chapters: [
    {
      id: "contexto",
      title: "Contexto",
      paragraphs: [
        "O Premium League é um fantasy game de futebol da Tecnologia Única: o jogador monta o time, escala a rodada e disputa ligas em campeonatos como Brasileirão, Libertadores, Champions e as ligas inglesa, espanhola e alemã, no app e no desktop.",
      ],
      columns: [
        { title: "O produto, segundo o site oficial", items: ["+100 mil downloads", "+200 mil times criados", "+10 campeonatos"] },
      ],
      note: "Números públicos do produto, não resultados deste projeto.",
    },
    {
      id: "objetivo",
      title: "Objetivo",
      paragraphs: [
        "Implementar o novo design system no Premium League e, no caminho, identificar os principais problemas e oportunidades de melhoria do produto.",
      ],
    },
    {
      id: "diagnostico",
      title: "Diagnóstico inicial",
      paragraphs: [
        "A análise heurística das telas, antes de falar com os usuários, apontava para uma reformulação total:",
      ],
      bullets: [
        "Falta de padronização dos elementos visuais",
        "Baixa hierarquia visual",
        "Baixa acessibilidade",
        "Espaçamentos inconsistentes",
        "Sobrecarga de informações",
        "Imagens de baixa qualidade",
        "Atritos em vários fluxos",
      ],
    },
    {
      id: "descoberta",
      title: "Descoberta",
      paragraphs: ["O processo seguiu o Double Diamond. Na primeira etapa, descobrir:"],
      bullets: [
        "Mapeamento dos principais problemas relatados em pesquisas anteriores",
        "Benchmarking com produtos similares",
        "Análise dos fluxos do app e do desktop",
        "Entrevistas com usuários",
      ],
    },
    {
      id: "virada",
      title: "A virada de chave",
      paragraphs: [
        "As entrevistas mudaram o rumo do projeto: os usuários adoram o Premium League. O problema não era o conceito, era a experiência. Em vez de reformular tudo, o foco passou a ser tratar a experiência e atender o que os jogadores pediam.",
      ],
      quotes: [
        {
          text: "Cara, eu vou falar para você, o app é tão bom. Acho que só o acesso do Facebook. Vocês estão de parabéns, o aplicativo é sensacional.",
          who: "Usuário entrevistado",
        },
        { text: "Nunca tive dificuldade, tudo bem ilustradinho, tudo certinho ali.", who: "Usuário entrevistado" },
      ],
    },
    {
      id: "definicao",
      title: "Definição",
      paragraphs: [
        "Com os dados da descoberta, as soluções foram definidas em brainstorm com o time, junto com as métricas e os KPIs para acompanhar o resultado. As oportunidades levantadas nas entrevistas:",
      ],
      chips: [
        "Notificações e lembretes em tempo real",
        "Estatísticas dos jogadores na escalação",
        "Compartilhar a escalação no WhatsApp",
        "Escalação automática",
        "Retirar propagandas",
        "Retrospectiva da temporada",
        "Avatar personalizado nas ligas",
        "Mínimo para valorizar",
      ],
    },
    {
      id: "ideacao",
      title: "Ideação e testes",
      prototype: "premium-league",
      bullets: [
        "Interfaces mobile e desktop",
        "Testes de usabilidade com usuários reais",
        "Ajustes a partir dos testes",
        "Documentação de regras de negócio e interações",
        "Protótipo final de alta fidelidade, validado e documentado, e handoff com o time de desenvolvimento",
      ],
    },
    {
      id: "design-system",
      title: "Design system",
      paragraphs: [
        "O redesign foi a porta de entrada do novo design system da Tecnologia Única: componentes, regras e documentação compartilhados entre design e desenvolvimento.",
        "O mesmo sistema passou a dar consistência visual e de usabilidade a 10 plataformas digitais e reduziu em 30% o tempo de desenvolvimento de novos recursos.",
      ],
      art: "design-system",
      note: "Ilustração do conceito, desenhada para este estudo; não é uma captura do sistema real.",
    },
    {
      id: "antes-depois",
      title: "Antes e depois",
      image: {
        src: `${dir}/antes-depois.webp`,
        alt: "Tela de escalação antes e depois. Antes: fundo roxo, campo com marcadores de mais e pouca hierarquia. Depois: topo azul com preço do time, fechamento do mercado e patrimônio; campo com cards de jogadores com preço e escudo; banco de reservas; ações e navegação inferior.",
        width: 1400,
        height: 788,
        caption: "Tela de escalação, antes e depois.",
      },
      bullets: [
        "Preço do time, fechamento do mercado e patrimônio lado a lado no topo",
        "Cada posição mostra o jogador, o escudo e o preço, em vez de um marcador vazio",
        "Banco de reservas visível na mesma tela",
        "Ações da escalação agrupadas e navegação inferior com Campeonatos, Notificações e Minha conta",
      ],
    },
  ],
  impact: {
    claim: "Pesquisa → produto",
    caption: "Oportunidades mapeadas nas entrevistas hoje fazem parte do plano PRO.",
    chips: [
      "Sem propagandas",
      "Escalação automática",
      "Mínimo para valorizar",
      "Novos dados e estatísticas",
      "Todas as notificações do time",
      "Design system: −30% no tempo de desenvolvimento",
      "10 plataformas consistentes",
    ],
    paragraphs: [
      "A pesquisa virou funcionalidade, e a funcionalidade virou parte da oferta paga, numa decisão de produto tomada com o time e o negócio.",
    ],
    note: "Plano PRO conferido no site público do produto. O resultado do design system é do sistema como um todo.",
  },
  // TODO-revisar: aprendizados escritos a partir da narrativa da palestra
  learnings: [
    { title: "Ouvir antes de redesenhar", text: "O diagnóstico pedia reformulação total; as entrevistas mostraram o que preservar." },
    { title: "Pesquisa vira roadmap", text: "Oportunidades bem registradas nas entrevistas chegaram ao produto e à oferta paga." },
    { title: "Sistema provado em produto real", text: "Implantar o design system num produto em uso é o melhor argumento para levá-lo aos outros." },
  ],
};
