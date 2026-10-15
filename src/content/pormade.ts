import type { CaseStudy } from "./projects";

/**
 * Estudo de caso Pormade: Gerador de propostas (Digitaly Tech).
 *
 * Fonte: o case completo publicado pelo Mateus (projeto "Pormade Gerador de
 * propostas"). Os entrevistados aparecem só pelo papel, sem nomes nem fotos.
 * Os indicadores são os publicados no case.
 * TODO: confirme o período exato do projeto.
 */
const dir = "/projetos/pormade";

export const pormade: CaseStudy = {
  slug: "pormade",
  title: "Pormade: Gerador de propostas",
  summary:
    "Um app que tirou do papel a operação comercial dos vendedores de campo da Pormade Portas: a proposta passou de 2 dias para 3 a 5 minutos.",
  year: "2020 – 2022", // TODO: ano exato do projeto
  context: "Digitaly Tech, para Pormade Portas",
  role: "Product Designer",
  platforms: "App mobile",
  metric: { value: "2 dias → 3 min", label: "tempo médio para gerar uma proposta" },
  cover: {
    src: "/projetos/capas/pormade.webp",
    alt: "Capa do projeto Pormade publicada pelo Mateus: celular com a tela Gerador de Propostas e as categorias de produtos, sobre fundo verde escuro com hexágonos.",
    width: 1920,
    height: 1080,
  },
  og: `${dir}/og.jpg`,
  draft: false,
  facts: [
    ["Área", "UX/UI Design"],
    ["Ferramentas", "Figma e Notion"],
    ["Tipo", "Desenvolvimento de plataforma digital"],
  ],
  problem: { paragraphs: [] },
  process: { paragraphs: [] },
  solution: { paragraphs: [] },
  result: { paragraphs: [] },
  gallery: [],
  links: [],
  chapters: [
    {
      id: "visao-geral",
      title: "Visão geral",
      paragraphs: [
        "O Gerador de Propostas é uma plataforma para transformar e acelerar a operação comercial dos vendedores de campo da Pormade Portas. Processos manuais e lentos, baseados em fichas físicas e blocos de papel, deram lugar a uma interface mobile ágil e de alta conversão.",
        "O app mitiga erros humanos de digitação, centraliza o catálogo (kits de portas prontas, folhas, papéis de parede e pisos) e reduz drasticamente o ciclo de fechamento de propostas, com uma experiência mobile fluida.",
      ],
      image: {
        src: `${dir}/visao-geral.webp`,
        alt: "Dois celulares com o app: a tela Gerador de Propostas com as categorias Kit Porta Pronta, Folha de Porta, Porta de Correr, Rodapé, Papel de Parede e Piso Vinílico, e a tela Cadastro de Cliente.",
        width: 580,
        height: 740,
      },
    },
    {
      id: "contexto",
      title: "Contexto e objetivo",
      paragraphs: [
        "A força de vendas em campo dependia inteiramente de processos manuais e fragmentados: planilhas físicas, cadernos e fichas de papel para catalogar produtos e preencher propostas. Isso gerava atrasos, aumentava o risco de erro na consolidação dos pedidos e tirava a visão clara do status de cada negociação.",
        "Objetivo da iniciativa: um modelo que agilizasse a geração da proposta para o engenheiro e evitasse erros de dados e perda de informação.",
      ],
      image: {
        src: `${dir}/contexto.webp`,
        alt: "Pilhas de pastas, cadernos e fichas de papel de solicitação sobre uma mesa, ilustrando o processo manual anterior.",
        width: 792,
        height: 641,
      },
    },
    {
      id: "discovery",
      title: "Discovery: matriz CSD",
      columnsStyle: "list",
      columns: [
        {
          title: "Certezas",
          items: [
            "Os processos são manuais e lentos.",
            "Vendedores usam planilhas e papel, e o status se perde.",
            "Erros de digitação são comuns e geram atrasos.",
            "Ver o status é difícil.",
          ],
        },
        {
          title: "Suposições",
          items: [
            "Uma plataforma digital resolverá os erros de digitação.",
            "O engenheiro aceitará a proposta digital mais rápido.",
            "Os vendedores adotarão a nova ferramenta.",
          ],
        },
        {
          title: "Dúvidas",
          items: [
            "Qual a melhor interface para o vendedor em campo?",
            "Como integrar com os sistemas legados?",
            "Quais os requisitos técnicos do engenheiro?",
            "Como medir o sucesso do app?",
          ],
        },
      ],
    },
    {
      id: "persona",
      title: "Persona",
      persona: {
        label: "Persona principal",
        name: "Vendedor de campo",
        context:
          "Visita canteiros de obras e engenheiros. Passa o dia preenchendo fichas de papel e digita tudo no sistema à noite, o que gera duplicidade de dados e deixa a resposta ao cliente lenta.",
        goals: ["Agilizar propostas", "Evitar papelada", "Ter visão clara dos pedidos"],
        pains: ["Erros", "Tempo perdido", "Papelada excessiva"],
      },
    },
    {
      id: "entrevistas",
      title: "Entrevistas com usuários reais",
      quotes: [
        {
          text: "A demora na consolidação dos pedidos e o risco de erros ao passar os dados do papel para o sistema. O status da negociação fica perdido.",
          who: "Vendedora sênior",
        },
        {
          text: "Fundamental. Precisamos de segurança nos dados e velocidade para o engenheiro. O tempo que perco hoje é inaceitável.",
          who: "Gerente de território",
        },
        {
          text: "Facilidade de uso e um catálogo de produtos claro. O vendedor não pode ter dúvida na hora de escolher a porta certa.",
          who: "Coordenador de vendas",
        },
      ],
      paragraphs: [
        "Síntese: facilidade de uso e validação técnica da proposta pelo engenheiro são os pontos mais críticos. Próximos passos definidos: validar o catálogo com vendedores mais experientes, testar a geração de proposta com engenheiros e garantir boa usabilidade e acessibilidade para vendedores mais velhos.",
      ],
      note: "Entrevistados identificados só pelo papel.",
    },
    {
      id: "jornada",
      title: "Jornada do usuário",
      stages: [
        { title: "Login e acesso", text: "Entrar com segurança para iniciar a proposta." },
        { title: "Início da proposta", text: "Definir o cliente e os detalhes da obra." },
        { title: "Catálogo de produtos", text: "Escolher os itens, com fotos." },
        { title: "Configuração detalhada", text: "Tamanho, cor e material." },
        { title: "Revisão e geração", text: "Revisar e compartilhar com o cliente pelo WhatsApp ou e-mail." },
      ],
      image: {
        src: `${dir}/jornada.webp`,
        alt: "Celular com a etapa Catálogo de Produtos: kits de porta com fotos, nomes e preços.",
        width: 420,
        height: 820,
      },
    },
    {
      id: "ideacao",
      title: "Ideação e fluxograma",
      bullets: [
        "Simplificação do processo: menos etapas manuais e redundantes, com uma UX ágil para gerar propostas rápidas e intuitivas.",
        "Validação técnica automatizada: um motor de regras verifica a proposta em tempo real, para que tudo chegue ao engenheiro tecnicamente viável.",
        "Integração com o sistema legado: conexão segura via API (Token ID) para sincronizar produtos, clientes e status, sem duplicidade nem erros de dados.",
      ],
      image: {
        src: `${dir}/fluxograma.webp`,
        alt: "Fluxograma: login via Token ID legado com acesso negado ou autorizado ao dashboard; a partir dele, nova proposta (início, catálogo, configuração detalhada, revisão e geração em PDF, compartilhamento) ou consulta de propostas geradas (visualização, edição, reenvio e status).",
        width: 780,
        height: 650,
      },
    },
    {
      id: "wireframes",
      title: "Wireframes",
      image: {
        src: `${dir}/wireframes.webp`,
        alt: "Wireframes das telas Gerador de Propostas, com a visão geral do layout, e Cadastro de Cliente.",
        width: 1640,
        height: 600,
      },
    },
    {
      id: "testes",
      title: "Teste de usabilidade A×B",
      columnsStyle: "stats",
      columns: [
        { title: "Versão final (validada)", items: ["95% de sucesso", "12 s em média"] },
        { title: "Iteração anterior", items: ["72% de sucesso", "25 s em média"] },
      ],
      paragraphs: [
        "A iteração anterior gerou respostas incorretas. A versão final, com categorias maiores e mais claras, teve o melhor desempenho e foi a validada.",
      ],
      image: {
        src: `${dir}/teste-usabilidade.webp`,
        alt: "Teste de usabilidade: a versão final validada, com taxa de sucesso de 95% e tempo médio de 12 segundos, ao lado da iteração anterior, com 72% e 25 segundos.",
        width: 1660,
        height: 690,
      },
    },
    {
      id: "interface",
      title: "Interface final",
      image: {
        src: `${dir}/telas-finais.webp`,
        alt: "Cinco telas finais: seleção de produtos, splash screen, cadastro, carrinho e propostas recentes.",
        width: 1620,
        height: 660,
        caption: "Seleção de produtos, splash, cadastro, carrinho e propostas recentes.",
      },
      prototype: "pormade",
    },
    {
      id: "design-system",
      title: "Design system",
      paragraphs: [
        "Verde floresta escuro como cor principal, verde-limão claro e vermelho coral de apoio, escala de cinzas e a fonte Inter; botões e ações com estados, formulários e ícones de navegação (início, carrinho, busca e entrega).",
      ],
      chips: ["Verde floresta escuro", "Verde-limão claro", "Vermelho coral", "Escala de cinzas", "Inter"],
      image: {
        src: `${dir}/design-system.webp`,
        alt: "Design system do Gerador de Propostas: cores principais, tipografia Inter, botões e ações, formulários e campos, ícones e navegação.",
        width: 1672,
        height: 941,
      },
    },
    {
      id: "okrs",
      title: "OKRs e KPIs",
      bullets: [
        "O1: consolidar a Pormade Portas como líder em vendas digitais, melhorando a eficiência operacional e a experiência do vendedor.",
        "KR 1.1: reduzir o tempo médio de geração de uma proposta até o compartilhamento (resultado: 720× mais rápido).",
        "KR 1.2: atingir 90% de adoção pelos vendedores de campo no primeiro mês (concluído: 91%).",
        "KR 1.3: mitigar erros humanos e técnicos nas propostas geradas (concluído).",
      ],
      image: {
        src: `${dir}/kpis.webp`,
        alt: "Indicadores: tempo médio de proposta de 2 dias no processo manual para 3 a 5 minutos no app, redução de mais de 99,8%; adoção de 91% contra meta de 90%; erros por 1.000 propostas de cerca de 350 para cerca de 50.",
        width: 820,
        height: 700,
      },
    },
  ],
  impact: {
    claim: "2 dias → 3 min",
    caption: "para gerar e compartilhar uma proposta (de 3 a 5 minutos no app).",
    chips: [
      "Redução de mais de 99,8%: 720× mais rápido",
      "91% de adoção pelos vendedores (meta: 90%)",
      "Erros por 1.000 propostas: ~350 → ~50",
    ],
    paragraphs: ["Menos papel, menos retrabalho e mais precisão: a proposta sai validada ainda na visita ao cliente."],
    note: "Indicadores publicados pelo Mateus no case do projeto.",
  },
  // TODO-revisar: títulos dos aprendizados escritos para este site, a partir do case
  learnings: [
    { title: "Digitalizar não é copiar o papel", text: "O ganho veio de cortar etapas e validar na hora, não de transcrever a ficha para a tela." },
    { title: "Testar com quem mais sofre", text: "Ouvir vendedores experientes levou a categorias maiores e a mais acessibilidade." },
    { title: "Validação dentro do app", text: "O motor de regras evitou que propostas inviáveis chegassem ao engenheiro e cortou os erros." },
  ],
};
