import type { CaseStudy } from "./projects";

/**
 * Estudo de caso Pode Regularizar (freelance).
 *
 * Fonte: o case publicado pelo próprio Mateus (slides do projeto). Os
 * indicadores de resultado são os que ele publicou. Os entrevistados aparecem
 * só pelo papel, sem nomes nem fotos.
 * TODO-revisar: os títulos dos aprendizados foram escritos para este site.
 */
const dir = "/projetos/pode-regularizar";

export const podeRegularizar: CaseStudy = {
  slug: "pode-regularizar",
  title: "Pode Regularizar",
  summary:
    "Um app que tirou do papel a regularização de imóveis (REURB) em São Paulo e virou a ferramenta de trabalho do vendedor porta a porta.",
  year: "TODO", // TODO: ano do projeto
  context: "Freelance",
  role: "Product Designer · Product Discovery e UX Design",
  platforms: "App mobile",
  metric: { value: "12 → 23", label: "clientes atendidos por mês" },
  cover: {
    src: "/projetos/capas/pode-regularizar.webp",
    alt: "Capa do projeto Pode Regularizar publicada pelo Mateus: celular sobre uma mesa com a lista de imóveis cadastrados e o título Atualização do app.",
    width: 1400,
    height: 788,
  },
  og: `${dir}/og.jpg`,
  draft: true,
  facts: [
    ["Tipo", "Freelance · plataforma digital"],
    ["Ferramentas", "Figma, Notion e Miro"],
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
        "O Pode Regularizar é uma plataforma para consolidar e acelerar a regularização de imóveis em São Paulo (REURB). O trabalho foi transformar processos manuais e burocráticos numa ferramenta ágil para vendedores porta a porta.",
        "Os objetivos: mitigar erros, centralizar cadastros e acompanhamentos, reduzir o tempo de proposta de dias para minutos com precisão, e dar ao vendedor controle de metas e bonificações numa experiência mobile fluida.",
      ],
    },
    {
      id: "diagnostico",
      title: "Diagnóstico",
      bullets: [
        "Instabilidade técnica: o app antigo só funcionava em alguns modelos de celular, o que impedia padronizar o trabalho em campo.",
        "Fluxos fragmentados: etapas desconexas geravam perda de dados e retrabalho.",
        "Foco inicial errado: a demanda era só repaginar o visual, mas a imersão mostrou que o problema era estrutural, de UX.",
      ],
      paragraphs: [
        "Depois da análise e de conversas com o Diretor de TI, a rota mudou: em vez de maquiar telas, transformar o app numa ferramenta de trabalho indispensável. Abordagem mão na massa, com foco total nas dores do vendedor porta a porta.",
      ],
      chips: ["Agenda", "Metas em tempo real", "IA para autoatendimento", "Venda online facilitada"],
      note: "Pilares identificados no diagnóstico.",
    },
    {
      id: "discovery",
      title: "Discovery: matriz CSD",
      columnsStyle: "list",
      columns: [
        {
          title: "Certezas",
          items: [
            "Processos de regularização são lentos e burocráticos.",
            "Clientes perdem documentos com facilidade.",
            "Erros cadastrais são comuns e geram atrasos longos.",
            "Ver o status do processo é difícil.",
          ],
        },
        {
          title: "Suposições",
          items: [
            "Uma plataforma digital resolve os erros de digitação.",
            "Engenharia e prefeitura aceitarão uma proposta digital mais rápido.",
            "Os vendedores vão adotar a nova ferramenta por causa das dores atuais.",
          ],
        },
        {
          title: "Dúvidas",
          items: [
            "Qual a melhor interface para muitos formulários?",
            "Como integrar com sistemas legados e portais governamentais?",
            "Quais são os requisitos técnicos das prefeituras?",
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
        name: "Despachante e vendedor de campo",
        context: "Atende clientes, passa o dia preenchendo formulários e lida com a burocracia dos órgãos públicos.",
        goals: ["Agilizar o preenchimento de formulários", "Evitar retrabalho", "Ter visão clara dos andamentos"],
        pains: ["Retrabalho", "Lentidão dos sistemas governamentais", "Dificuldade de comunicação com os órgãos"],
      },
    },
    {
      id: "entrevistas",
      title: "Entrevistas com usuários reais",
      paragraphs: ["Três entrevistas, com perfis diferentes da operação:"],
      quotes: [
        {
          text: "A maior dificuldade é a demora para consolidar os formulários e o risco de erro ao passar os dados do papel para o sistema.",
          who: "Vendedora e despachante sênior",
        },
        {
          text: "A proposta digital é fundamental: precisamos de agilidade nos dados e velocidade para atender o cliente.",
          who: "Vendedor júnior",
        },
        {
          text: "O app deve priorizar facilidade de uso e um cadastro claro: o vendedor não pode ter dúvida na hora de preencher.",
          who: "Coordenador de vendas",
        },
      ],
      note: "Falas resumidas a partir das entrevistas publicadas no case.",
    },
    {
      id: "jornada",
      title: "Jornada do vendedor",
      stages: [
        { title: "Descoberta e contato" },
        { title: "Agendamento e preparação" },
        { title: "Coleta de campo" },
        { title: "Consolidação e validação" },
        { title: "Finalização e regularização" },
      ],
      columnsStyle: "list",
      columns: [
        { title: "Dores", items: ["Retrabalho", "Erros cadastrais", "Lentidão"] },
        { title: "Oportunidades", items: ["Automatizar o preenchimento", "Validação técnica online, antecipada"] },
      ],
      paragraphs: [
        "Insight: o agendamento é o ponto de partida. Centralizar agenda e documentação no app elimina o papel.",
      ],
    },
    {
      id: "ideacao",
      title: "Brainstorm, ideação e fluxograma",
      bullets: [
        "Automação inteligente da REURB, com preenchimento automático.",
        "Upload direto de fotos e documentos de campo, garantindo a integridade dos dados.",
        "Validação técnica online, antecipada, pelo próprio app.",
        "Dashboard integrado via API com órgãos públicos, para status em tempo real.",
      ],
      image: {
        src: `${dir}/fluxograma.webp`,
        alt: "Fluxograma do app: a partir do Pode Regularizar saem Meus clientes, Banco de clientes, Métricas via CRM, Indicação de vendedor, Ajuda ao cliente e Agenda; a decisão Possui cadastro leva a Cadastro de imóvel ou à busca de cliente estagnado, até Processos de regularização e Agendamento de visita presencial.",
        width: 1075,
        height: 735,
        caption: "Fluxograma das áreas do app.",
      },
    },
    {
      id: "wireframes",
      title: "Wireframes e teste A/B",
      images: [
        {
          src: `${dir}/wireframes.webp`,
          alt: "Wireframes de baixa fidelidade das telas Home, Banco de clientes e Meus clientes.",
          width: 1020,
          height: 430,
          caption: "Wireframes: Home, Banco de clientes e Meus clientes.",
        },
        {
          src: `${dir}/teste-ab.webp`,
          alt: "Teste A/B do dashboard: versão A com resumo mensal e gráfico, versão B com o cumprimento da meta em destaque no topo, marcada como vencedora.",
          width: 1020,
          height: 500,
          caption: "Teste A/B do dashboard.",
        },
      ],
      columnsStyle: "list",
      columns: [
        { title: "Versão A", items: ["O usuário demorou a identificar a meta, os compromissos do dia e a sua evolução."] },
        { title: "Versão B (escolhida)", items: ["O usuário entendeu rapidamente onde estava cada item."] },
      ],
      prototype: "pode-regularizar",
    },
    {
      id: "design-system",
      title: "Design system",
      paragraphs: [
        "Laranja como cor primária e verde como secundária, com azul e rosa de apoio; tipografia Montserrat e Roboto; botões, campos, ícones, indicadores (barra de meta e estrelas) e cards de agenda e de resumo.",
      ],
      chips: ["#F07E26 laranja", "#00D39B verde", "#7F80B0 azul", "#FFB282 rosa", "Montserrat", "Roboto"],
      image: {
        src: `${dir}/design-system.webp`,
        alt: "Design system do Pode Regularizar: guia de cores, tipografia, botões, campos, ícones, indicadores e cards de agenda e de resumo.",
        width: 1100,
        height: 788,
      },
    },
    {
      id: "interface",
      title: "Interface final",
      image: {
        src: `${dir}/telas-finais.webp`,
        alt: "Quatro telas finais: resumo mensal com meta e gráfico, banco de clientes, meus clientes com status e prazos, e detalhes do cliente com documentos enviados e pendentes.",
        width: 1000,
        height: 480,
        caption: "Resumo mensal, banco de clientes, meus clientes e detalhes do cliente.",
      },
    },
    {
      id: "metas",
      title: "Metas (OKRs)",
      columnsStyle: "stats",
      columns: [
        { title: "Ciclo de regularização", items: ["90 → 30 dias"] },
        { title: "Uso de papel", items: ["100% eliminado"] },
        { title: "Conversão de imóveis irregulares", items: ["+40%"] },
      ],
      note: "Metas definidas no projeto, não resultados medidos.",
    },
  ],
  impact: {
    claim: "≈ 50%",
    caption: "menos tempo no atendimento a domicílio.",
    chips: [
      "Retrabalho perto de 0%",
      "Qualidade de entrega 3,0 → 4,5 estrelas",
      "12 → 23 clientes atendidos por mês",
      "Agenda adotada já no primeiro mês",
    ],
    paragraphs: [
      "O retrabalho caiu com a IA ajudando o vendedor porta a porta, e a validação técnica antecipada elevou a qualidade das entregas.",
    ],
    note: "Indicadores publicados pelo Mateus no case do projeto.",
  },
  learnings: [
    { title: "Ouvir antes de repaginar", text: "O pedido era visual; a imersão mostrou que o problema era estrutural." },
    { title: "A agenda é a porta de entrada", text: "Centralizar agenda e documentos no app foi o que eliminou o papel." },
    { title: "Testar a hierarquia cedo", text: "O teste A/B mostrou que meta e compromissos do dia precisam estar no topo." },
  ],
};
