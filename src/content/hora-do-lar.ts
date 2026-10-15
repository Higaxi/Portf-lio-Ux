import type { CaseStudy } from "./projects";

/**
 * Estudo de caso Hora do Lar.
 *
 * Fatos: o que o Mateus fez (homepage nova, atualização do app de ponto do
 * funcionário e app do empregador criado do zero) e o contexto público do
 * produto (site oficial). Afirmações de marketing do site NÃO são resultado
 * do projeto e não aparecem como tal.
 * TODO: período e vínculo (Tecnologia Única ou freelance?) e métricas, se houver.
 * TODO-revisar: aprendizados e a leitura de usabilidade de cada bloco da home.
 */
const dir = "/projetos/hora-do-lar";

export const horaDoLar: CaseStudy = {
  slug: "hora-do-lar",
  title: "Hora do Lar",
  summary:
    "Homepage redesenhada, app de ponto atualizado e um app novo para o empregador, numa plataforma que simplifica a gestão de empregados domésticos.",
  year: "TODO", // TODO: período do projeto
  context: "TODO: Tecnologia Única ou freelance?", // TODO: vínculo do projeto
  role: "Product Designer", // TODO: confirme o papel
  platforms: "Site, app do funcionário e app do empregador",
  metric: { value: "Site + 2 apps", label: "homepage, app do funcionário e app do empregador" },
  cover: {
    src: `${dir}/capa.webp`,
    alt: "Capa do case Hora do Lar: o topo da homepage nova num notebook e três telas do app do funcionário em celulares, sobre fundo laranja e roxo da marca, com o título Site novo + 2 apps.",
    width: 1920,
    height: 1080,
  },
  og: `${dir}/og.jpg`,
  draft: true,
  problem: { paragraphs: [] },
  process: { paragraphs: [] },
  solution: { paragraphs: [] },
  result: { paragraphs: [] },
  gallery: [],
  links: [],
  chapters: [
    {
      id: "contexto",
      title: "Contexto",
      paragraphs: [
        "O Hora do Lar é uma plataforma web com app para a gestão de empregados domésticos: folha, ponto, cálculos trabalhistas, documentos, integração com o eSocial Doméstico e emissão da guia DAE, com suporte humanizado pelo WhatsApp.",
      ],
      chips: [
        "Folha de pagamento",
        "Ponto por biometria facial, QR Code ou manual",
        "Salário, férias, 13º e rescisão",
        "Documentos",
        "eSocial Doméstico",
        "Guia DAE",
        "Suporte via WhatsApp",
      ],
      note: "Funcionalidades descritas no site público do produto.",
    },
    {
      id: "publico",
      title: "Para quem",
      columnsStyle: "list",
      columns: [
        {
          title: "Empregador doméstico",
          items: [
            "Não é especialista em legislação trabalhista.",
            "Precisa calcular salário, férias e rescisão e cumprir o eSocial sem errar.",
            "A dor, nas palavras do próprio site: ficar perdido com cálculos trabalhistas, férias e eSocial.",
          ],
        },
        {
          title: "Empregada doméstica",
          items: ["Registra o ponto pelo celular.", "Acompanha horas trabalhadas, horas extras, atrasos e faltas."],
        },
      ],
    },
    {
      id: "escopo",
      title: "O que eu fiz",
      bullets: [
        "Atualizei toda a homepage, com mais usabilidade e alinhada ao novo manual de marca.",
        "Atualizei o app do funcionário, usado para bater o ponto.",
        "Criei o app do empregador, que não existia antes, projetado do zero.",
      ],
    },
    {
      id: "anatomia",
      title: "Anatomia da homepage",
      paragraphs: [
        "A home responde às dúvidas na ordem em que elas aparecem para um empregador leigo: o que é, se resolve o meu problema, se é difícil, quanto custa, se é confiável e o que mais preciso saber.",
      ],
      custom: "homepage-anatomy",
      note: "Recortes da homepage publicada. Nomes e fotos dos depoimentos foram desfocados.",
    },
    {
      id: "app-funcionario",
      title: "App do funcionário",
      custom: "app-screens",
      bullets: [
        "Marcar o ponto é a ação principal: botão laranja no topo, com entrada, intervalo, retorno e saída em sequência.",
        "Resumo do mês a um toque, com horas trabalhadas contra a meta mensal.",
        "Saldo, extrato de horas extras, descontos, atrasos e faltas visíveis, sem precisar pedir ao empregador.",
        "Navegação inferior fixa: Ponto, Notificações, Aprovações e Menu (ajuste de ponto, documentos, desligamento e configuração).",
      ],
      prototype: "hora-do-lar-funcionario",
    },
    {
      id: "app-empregador",
      title: "App do empregador (novo)",
      paragraphs: [
        "O empregador não tinha app. Projetei do zero um app para as tarefas que ele precisa resolver no dia a dia: aprovar ajustes de ponto, acompanhar as horas e emitir recibos e documentos, com notificações quando algo depende dele.",
      ],
      prototype: "hora-do-lar-empregador",
      note: "O site ainda apresenta o app do empregador como “em breve”.",
    },
  ],
  impact: {
    claim: "Site + 2 apps",
    caption: "Do primeiro contato com a marca ao dia a dia de quem emprega e de quem trabalha.",
    chips: [
      "Homepage nova no ar, alinhada ao manual de marca",
      "App de ponto do funcionário atualizado",
      "App do empregador projetado do zero",
    ],
    note: "TODO-revisar: se tiver métricas (conversão da home, uso do app, chamados no suporte), acrescente aqui.",
  },
  learnings: [
    { title: "Falar a língua de quem é leigo", text: "Sem juridiquês: a home parte da dúvida real do empregador, não do termo técnico." },
    { title: "Ordem também é argumento", text: "Cada bloco da home responde à próxima pergunta de quem está decidindo." },
    { title: "Dois lados, dois apps", text: "Empregador e empregada têm tarefas diferentes; cada um ganhou o seu app." },
  ],
};

/**
 * Anatomia da homepage: os blocos na ordem em que aparecem na home publicada,
 * com o porquê de cada um. TODO-revisar: a leitura de usabilidade é desta
 * análise; confira se bate com as decisões do projeto.
 */
export type HomeBlock = {
  id: string;
  title: string;
  image: { src: string; width: number; height: number; alt: string };
  what: string;
  why: string;
  principle: string;
};

export const homepageBlocks: HomeBlock[] = [
  {
    id: "hero",
    title: "Hero",
    image: { src: `${dir}/home/hero.webp`, width: 1800, height: 838, alt: "Topo da homepage: título sobre a jornada com empregados domésticos, subtítulo, botão Comece agora e atalhos para App Store e Google Play." },
    what: "Título que diz o que é e para quem, subtítulo com folha, ponto e obrigações trabalhistas, um único botão laranja (Comece agora) e os atalhos para baixar o app.",
    why: "Quem chega precisa entender a promessa em segundos e ter uma ação óbvia acima da dobra.",
    principle: "Hierarquia visual e uma ação principal (menos escolhas, decisão mais rápida).",
  },
  {
    id: "numeros",
    title: "Faixa de números",
    image: { src: `${dir}/home/numeros.webp`, width: 1800, height: 173, alt: "Faixa laranja logo abaixo do topo com três números: 10+ anos de experiência, +15 mil clientes atendidos e 4.7 de avaliação no Google." },
    what: "Logo abaixo do topo, três números em destaque: anos de experiência, clientes atendidos e a nota de avaliação no Google.",
    why: "Antes de qualquer argumento, mostra que outras pessoas já confiam no serviço. Em poucos segundos, quem chega sabe que não é um produto novo e sem histórico.",
    principle: "Prova social e credibilidade imediata.",
  },
  {
    id: "dor",
    title: "Dor e benefícios",
    image: { src: `${dir}/home/dor-beneficios.webp`, width: 1800, height: 889, alt: "Bloco com a pergunta Você já ficou perdido com cálculos trabalhistas, férias e eSocial, uma lista de benefícios com checks e o botão Simplifique sua gestão agora." },
    what: "A pergunta “Você já ficou perdido com cálculos trabalhistas, férias e eSocial?”, seguida de uma lista com checks: cálculos automáticos, ponto pelo app, suporte humanizado, conformidade com o eSocial e app para empregador e empregado.",
    why: "Espelha a dúvida real de um empregador leigo e mostra, numa lista escaneável, que cada medo tem resposta.",
    principle: "Correspondência com o mundo real (a linguagem do usuário) e reconhecimento em vez de memorização.",
  },
  {
    id: "como-funciona",
    title: "Como funciona",
    image: { src: `${dir}/home/como-funciona.webp`, width: 1800, height: 875, alt: "Bloco Como funciona, é simples, com quatro passos numerados e o tempo estimado de cada um." },
    what: "Quatro passos numerados, com tempo estimado (“3 minutinhos”, “2 minutos”) e a promessa “sem juridiquês”.",
    why: "Reduz a ansiedade e a percepção de esforço antes de pedir o cadastro.",
    principle: "Redução da carga cognitiva e visibilidade do processo.",
  },
  {
    id: "planos",
    title: "Planos",
    image: { src: `${dir}/home/planos.webp`, width: 1800, height: 1280, alt: "Bloco de planos com seletor Básico e Vida Fácil, descontos do plano anual em destaque e três colunas, mensal, semestral e anual, com itens incluídos e não incluídos." },
    what: "Seletor entre Básico e Vida Fácil, descontos do anual em destaque e os períodos lado a lado, com o que está e o que não está incluído e um selo no anual.",
    why: "Comparar lado a lado evita erro na escolha, e o destaque do anual funciona como âncora.",
    principle: "Comparação direta, ancoragem e prevenção de erros.",
  },
  {
    id: "depoimentos",
    title: "Depoimentos",
    image: { src: `${dir}/home/depoimentos.webp`, width: 1800, height: 625, alt: "Bloco Mais motivos para assinar, com depoimentos de clientes e avaliações em estrelas; nomes desfocados." },
    what: "Depoimentos de clientes com avaliação em estrelas, em carrossel.",
    why: "Trabalhista é um tema sensível: ver outras pessoas na mesma situação dá confiança para assinar.",
    principle: "Prova social.",
  },
  {
    id: "faq",
    title: "Dúvidas frequentes",
    image: { src: `${dir}/home/faq.webp`, width: 1800, height: 827, alt: "Bloco Dúvidas Populares com perguntas em acordeão em duas colunas." },
    what: "Perguntas em acordeão, em duas colunas: se é uma consultoria, como regularizar a empregada, como funcionam a plataforma e o app.",
    why: "Responde às objeções que ainda restam sem poluir a página: cada resposta abre só quando é pedida.",
    principle: "Ajuda e documentação, com divulgação progressiva.",
  },
  {
    id: "blog",
    title: "Blog",
    image: { src: `${dir}/home/blog.webp`, width: 1800, height: 796, alt: "Bloco Últimas notícias do Blog com artigos sobre salário mínimo, eSocial e rescisão." },
    what: "Últimos artigos sobre salário, eSocial e rescisão.",
    why: "Conteúdo educativo mantém a marca útil mesmo para quem ainda não vai assinar, e reforça a autoridade no assunto.",
    principle: "Ajuda contínua e autoridade.",
  },
  {
    id: "rodape",
    title: "Rodapé",
    image: { src: `${dir}/home/rodape.webp`, width: 1800, height: 764, alt: "Rodapé com links do blog, materiais de apoio, calculadoras, download do aplicativo e redes sociais." },
    what: "Atalhos para o blog, materiais de apoio e calculadoras, download do app e redes sociais. O botão do WhatsApp fica fixo em toda a página (aparece já na faixa de números).",
    why: "Quem rolou até o fim ainda encontra uma saída útil, e o suporte humanizado está sempre a um toque.",
    principle: "Consistência e controle do usuário (sempre há para onde ir).",
  },
];
