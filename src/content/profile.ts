/**
 * Dados pessoais do portfólio. Todo o texto do site sai daqui e de projects.ts.
 *
 * Procure por "TODO" antes de publicar: são campos que ainda precisam de
 * confirmação ou de conteúdo real (inclusive e-mail e links públicos).
 */

/** `display` é o texto exibido ao lado do rótulo (sem ele, usa a URL). */
export type Link = { label: string; href: string; display?: string };

export type SkillGroup = {
  name: string;
  /** Frase exibida no celular, onde não existe hover. */
  summary: string;
  items: { name: string; description: string }[];
};

export type Experience = {
  company: string;
  role: string;
  /** Período legível, ex.: "abr 2024 – jul 2026". */
  period: string;
  place: string;
  description: string;
  /** Resultado mensurável, quando existe. */
  result?: string;
  /** Competências exibidas como tags ao expandir. */
  tags: string[];
  /** Links de destaque (palestras, cases). */
  links?: { label: string; href: string }[];
};

export type Course = { kind: string; school: string; course: string; period?: string };

export type Testimonial = { quote: string; author: string; role: string };

export type Profile = {
  handle: string;
  /** Senioridade atual. Todos os títulos do site derivam daqui. */
  level: string;
  name: string;
  title: string;
  /** Frase curta para SEO e cartões: o que você faz, em até ~110 caracteres. */
  tagline: string;
  /** Apresentação em 1ª pessoa na primeira tela. */
  intro: string;
  /** O número grande do hero. */
  highlight: { value: string; label: string };
  /** Palavras soltas (com física) no hero. */
  keywords: string[];
  /** Descrição para buscadores e redes (até ~160 caracteres). */
  seoDescription: string;
  location: string;
  availability: string;
  /** O que você procura agora (Sobre e Contato). */
  goal: string;
  /** E-mail público de contato. */
  email: string;
  /** URL de produção, usada no sitemap, robots e Open Graph. */
  siteUrl: string;
  socials: Link[];
  /** Currículo em PDF servido de public/. `size` é lido por leitores de tela. */
  resume: { href: string; fileName: string; size: string };
  about: { statement: string; blocks: { title: string; text: string }[]; /** Frase pessoal, humana (fora do trabalho). */ personal: string };
  skills: SkillGroup[];
  tools: string[];
  experience: Experience[];
  education: Course[];
  /**
   * Depoimentos ficam DESLIGADOS. Publicar nome e fala de outra pessoa exige
   * autorização dela. TODO: com a autorização, preencha `testimonials` e mude
   * para true.
   */
  showTestimonials: boolean;
  testimonials: Testimonial[];
};

/**
 * Senioridade opcional. Vazio = não exibe nível (padrão). Ex.: "Pleno" vira
 * "Product Designer Pleno · UX Lead" em todo o site (título, SEO, Open Graph).
 */
const LEVEL: string = "";
const ROLE = LEVEL ? `Product Designer ${LEVEL} · UX Lead` : "Product Designer · UX Lead";

export const profile: Profile = {
  level: LEVEL,
  handle: "higaxi",
  name: "Mateus Higashie",
  title: ROLE,
  tagline: "Dez anos desenhando produtos digitais, da pesquisa ao front-end, com IA no processo.",
  intro:
    "Desenho produtos digitais da pesquisa ao front-end. Liderei times de UX/UI, criei design systems e uso IA para entregar mais rápido e refazer menos.",
  highlight: { value: "10 anos", label: "criando produtos digitais" },
  keywords: ["UX", "UI", "IA", "Design System", "Research", "Liderança", "Produto", "Protótipos"],
  seoDescription:
    `Mateus Higashie, ${ROLE}. Liderança de UX/UI, design systems, pesquisa, protótipos de alta fidelidade e IA aplicada ao design.`,
  location: "São Paulo, SP",
  availability: "Disponível para freelance e tempo integral.",
  goal: "Meu próximo passo é evoluir para Senior Product Designer ou UX Lead, com foco em gestão de produto e IA no design, num time que valorize inovação e impacto real.",
  email: "higadesign19@gmail.com",
  // Domínio próprio via NEXT_PUBLIC_SITE_URL; sem ele, usa o domínio de produção que a Vercel injeta no build.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mateushigashie" },
    { label: "WhatsApp", href: "https://wa.me/5561984276250", display: "(61) 98427-6250" },
  ],
  resume: {
    href: "/curriculo/Mateus-Higashie-Curriculo.pdf",
    fileName: "Mateus-Higashie-Curriculo.pdf",
    size: "510 KB",
  },
  about: {
    personal: "TODO: uma ou duas frases suas, fora do trabalho (o que gosta de fazer, o que te move). Não publique nada que não seja seu.",
    statement: "Do operacional ao estratégico, sem perder o usuário de vista.",
    blocks: [
      {
        title: "O que eu faço",
        text: "Há dez anos crio produtos digitais de alta usabilidade, design systems escaláveis e soluções centradas no usuário. O objetivo é sempre o mesmo: entregar mais rápido e refazer menos.",
      },
      {
        title: "Como eu lidero",
        text: "Liderei times de design, criei fluxos e processos de design do zero, treinei designers e conduzi workshops e entrevistas de UX em português e inglês, alinhando produto, negócio e quem usa.",
      },
    ],
  },
  skills: [
    {
      name: "Produto e UX",
      summary: "Pesquisa, fluxo e decisão de produto antes do pixel.",
      items: [
        { name: "Product Design", description: "Do problema de negócio ao produto em uso, medido por resultado." },
        { name: "UX Research", description: "Entrevistas e pesquisas de usabilidade para decidir com evidência." },
        { name: "Design Thinking", description: "Workshops que transformam um problema difuso em hipóteses testáveis." },
        { name: "Testes de usabilidade", description: "Ver gente real usando antes de fechar a versão final." },
        { name: "Testes A/B", description: "Duas versões no ar, e o dado decide." },
        { name: "Scrum e Kanban", description: "Ciclos ágeis com times multidisciplinares." },
        { name: "Lean Six Sigma", description: "White e Yellow Belt: processo medido e melhorado." },
      ],
    },
    {
      name: "Interface e sistema",
      summary: "Telas consistentes porque nascem de um sistema.",
      items: [
        { name: "UI Design", description: "Interfaces de alta fidelidade prontas para o desenvolvimento." },
        { name: "Design System", description: "Componentes e regras que mantêm 10 plataformas coerentes." },
        { name: "Interaction Design", description: "Estados, transições e feedback que explicam o que aconteceu." },
        { name: "Wireframing", description: "Estrutura e hierarquia antes de cor e tipografia." },
        { name: "Prototyping", description: "Protótipos navegáveis de baixa a alta fidelidade." },
        { name: "Branding", description: "Identidade visual que dá coerência ao produto." },
      ],
    },
    {
      name: "Liderança e IA",
      summary: "Times que entregam melhor, com IA onde ela ajuda.",
      items: [
        { name: "UX Lead", description: "Liderança de time de UX/UI, qualidade das entregas e coordenação de demandas." },
        { name: "AI-driven Design", description: "IA aplicada para acelerar pesquisa, protótipo e entrega." },
        { name: "Comitê de IA", description: "Liderou o comitê interno de Inteligência Artificial na Tecnologia Única." },
        { name: "Mentoria", description: "Treinamento de designers e criação de processos de design do zero." },
        { name: "Design e desenvolvimento", description: "Comunicação entre design e código que reduziu em até 3x o retrabalho." },
        { name: "Front-end (apoio)", description: "HTML, CSS e JavaScript para prototipar e apoiar o time no código." },
      ],
    },
  ],
  tools: [
    "Figma",
    "Figma Make",
    "Claude AI",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Creative Cloud",
    "WordPress",
    "Elementor",
    "Unbounce",
    "Canva",
  ],
  experience: [
    {
      company: "Tecnologia Única",
      tags: ["UX Lead","Design System","IA","Prototipação","Front-end"],
      links: [
        { label: "Estudo de caso: Premium League", href: "/projetos/premium-league" },
      ],
      role: "Product Designer · UX Lead",
      period: "abr 2024 – jul 2026",
      place: "São Paulo",
      description:
        "Liderou o time de UX/UI e o comitê interno de IA. Criou soluções com IA, fluxos, protótipos e interfaces de alta fidelidade, apoiou o front-end e coordenou demandas com os clientes. Apresentou a palestra interna “UX/UI Design: por trás das câmeras” para todos os setores da empresa.",
      result:
        "Design system que reduziu em 30% o tempo de desenvolvimento de novos recursos, com consistência em 10 plataformas.",
    },
    {
      company: "Grupo Ivy",
      tags: ["Product Design","UI Design","Scrum","Kanban","Handoff"],
      role: "Product Designer",
      period: "jul 2022 – jan 2024",
      place: "Minas Gerais",
      description:
        "Protótipos e interfaces para plataformas e aplicativos, em ciclos Scrum e Kanban com times multidisciplinares.",
      result: "Linha de comunicação entre design e desenvolvimento que reduziu em até 3x o retrabalho dos devs.",
    },
    {
      company: "Digitaly Tech",
      tags: ["Liderança","UX Research","Testes A/B","QA de design"],
      links: [{ label: "Estudo de caso: Pormade", href: "/projetos/pormade" }],
      role: "Product Designer · Líder técnico de UX/UI",
      period: "dez 2020 – jul 2022",
      place: "São Paulo",
      description:
        "Coordenou o time de designers e a qualidade de todas as entregas de design, perto dos clientes. Antes, como Product Designer Pleno, conduziu pesquisas de usabilidade, interfaces e testes A/B.",
      result: "Gerador de propostas da Pormade: de 2 dias para 3 a 5 minutos por proposta, com 91% de adoção pelos vendedores.",
    },
    {
      company: "Camaleó Creative",
      tags: ["UI Design","Publicidade"],
      role: "Designer Pleno",
      period: "out 2020 – dez 2020",
      place: "Distrito Federal",
      description: "Conteúdo online e offline para publicidade e interfaces para aplicativos.",
    },
    {
      company: "Seotimize",
      tags: ["Landing pages","WordPress","Unbounce","Prototipação"],
      role: "Designer Gráfico · Diretor de Arte",
      period: "mar 2020 – nov 2020",
      place: "Distrito Federal",
      description:
        "Landing pages de conversão e geração de leads com WordPress e Unbounce, e protótipos de alta fidelidade para atendimento médico.",
    },
    {
      company: "Ahi Studio",
      tags: ["Social media","Vídeo","Animação 2D","UI para sites"],
      role: "Designer Gráfico",
      period: "fev 2018 – mar 2020",
      place: "Distrito Federal",
      description: "Social media, edição de vídeo, animação 2D e interfaces para sites.",
    },
  ],
  education: [
    { kind: "Tecnólogo", school: "Universidade Anhembi Morumbi", course: "Análise e Desenvolvimento de Sistemas", period: "2021 – 2024" },
    { kind: "Tecnólogo", school: "Universidade Anhembi Morumbi", course: "Design Gráfico", period: "2016 – 2018" },
    { kind: "Curso", school: "Leon Consultoria", course: "Liderança Organizacional", period: "2025" },
    { kind: "Certificação", school: "AgileIT Academy", course: "Scrum Fundamentals", period: "2022" },
    { kind: "Certificação", school: "FM2S", course: "Lean Six Sigma White e Yellow Belt", period: "2022" },
    { kind: "Curso livre", school: "Escola Seven e Escola Saga", course: "Game Design" },
    { kind: "Curso livre", school: "Senai", course: "Design Gráfico" },
    { kind: "Curso livre", school: "Udemy", course: "UX Rainbow, UX/UI de Aplicativos, Design Thinking, Figma e Engenharia de Prompts com IA" },
    { kind: "Curso livre", school: "DIO", course: "Figma UI" },
  ],
  showTestimonials: false,
  testimonials: [
    { quote: "TODO: trecho autorizado pelo autor.", author: "TODO: nome", role: "TODO: cargo e empresa" },
  ],
};
