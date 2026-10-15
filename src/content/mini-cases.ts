import type { MiniCase } from "./projects";

/**
 * Cases resumidos dos projetos de produto da grade "Mais projetos".
 *
 * TODO-revisar: TODOS os textos abaixo foram reconstruídos a partir das
 * imagens de apresentação e de informação pública do segmento. Os artefatos
 * originais (pesquisas, entrevistas, testes) não foram guardados, então:
 * - não há números de pesquisa, quantidade de entrevistados nem métricas;
 * - o processo descreve as etapas, sem afirmar artefatos específicos;
 * - leia cada frase e corrija o que não aconteceu desse jeito.
 * Um recrutador vai perguntar sobre isso em entrevista.
 */
export const miniCases: Record<string, MiniCase> = {
  // TODO-revisar: texto reconstruído
  "angel-investor": {
    challenge:
      "Dar a uma comunidade de investidores-anjo um lugar próprio para conversar, acompanhar novidades e entrar no grupo sem atrito.",
    audience:
      "Investidores e empreendedores que já participam da comunidade e usam o celular como canal principal de conversa.",
    process: [
      "Conversei com o cliente para entender como a comunidade se organizava e o que ela esperava do app.",
      "Mapeei os fluxos de entrada, feed e conversa, e validei a estrutura em wireframes antes da interface.",
      "Fechei o protótipo de alta fidelidade e acompanhei o handoff para o desenvolvimento.",
    ],
    decisions: [
      "Cadastro pelo número de telefone, com o código do país já preenchido: menos campos na primeira tela.",
      "Fotos de pessoas recortadas em formas roxas dão rosto à comunidade desde a abertura.",
      "Feed com stories no topo e um botão flutuante de criar, como nos apps que o público já usa.",
      "Navegação inferior com quatro destinos fixos: explorar, conversas, início e ajustes.",
    ],
    delivery: "Protótipo de alta fidelidade com abertura, cadastro, feed, lista de conversas e chat.",
    flow: [
      { src: "/projetos/angel-investor/abertura.webp", width: 384, height: 842, title: "Abertura", alt: "Tela de abertura do Angel Investor Club com quatro fotos de pessoas em formas roxas e o botão Iniciar.", callouts: [ { x: 50, y: 40, text: "Fotos de pessoas em formas roxas dão rosto à comunidade logo na entrada." }, { x: 50, y: 88, text: "Uma única ação, Iniciar, em botão largo." } ] },
      { src: "/projetos/angel-investor/cadastro.webp", width: 531, height: 1146, title: "Cadastro", alt: "Tela de cadastro com campo de telefone com a bandeira do Brasil e o botão Cadastre o seu número.", callouts: [ { x: 55, y: 78, text: "Cadastro só pelo telefone, com o código do país já preenchido." }, { x: 50, y: 88, text: "O botão diz exatamente o que vai acontecer." } ] },
      { src: "/projetos/angel-investor/feed.webp", width: 528, height: 1155, title: "Feed", alt: "Feed da comunidade com stories no topo, publicações com foto e um botão flutuante de adicionar.", callouts: [ { x: 50, y: 7, text: "Stories no topo, padrão que o público já conhece." }, { x: 50, y: 86, text: "Botão flutuante para publicar." }, { x: 70, y: 95, text: "Navegação inferior com quatro destinos fixos." } ] },
      { src: "/projetos/angel-investor/conversas.webp", width: 528, height: 1155, title: "Conversas", alt: "Lista de conversas com busca no topo, fotos dos membros e contadores de mensagens não lidas.", callouts: [ { x: 45, y: 6, text: "Busca por mensagem antes da lista." }, { x: 88, y: 32, text: "Contador de não lidas em roxo, sem depender só da cor: o número aparece." } ] },
      { src: "/projetos/angel-investor/chat.webp", width: 528, height: 1071, title: "Chat", alt: "Conversa com mensagens em balões brancos e roxos e um link com imagem dentro da conversa.", callouts: [ { x: 72, y: 45, text: "Links e imagens aparecem com prévia dentro da conversa." } ] },
    ],
    resultsTodo: "TODO: se tiver resultados reais (adesão, uso do chat, publicações), acrescente aqui.",
  },
  // TODO-revisar: texto reconstruído
  akamai: {
    challenge:
      "Levar para o celular um painel de segurança web, para que o cliente acompanhe ataques e tráfego sem abrir o computador.",
    audience:
      "Equipes técnicas que monitoram aplicações protegidas por firewall de aplicação web (WAF) e precisam de leitura rápida dos números.",
    process: [
      "Entendi com o cliente quais indicadores eram consultados com mais frequência e em que situação.",
      "Priorizei as métricas por tela, desenhei os fluxos de filtro por contrato e período e testei a leitura dos gráficos em wireframes.",
      "Montei um mini design system para manter as telas consistentes e facilitar o handoff.",
    ],
    decisions: [
      "Seleção de contrato e período no topo de cada tela: o filtro vem antes do dado.",
      "Gráficos de pizza para proporção de tipos de ataque e barras horizontais para volume, cada um no papel em que é mais legível.",
      "Percentuais grandes nos cards de resumo, para leitura em poucos segundos.",
      "Mini design system com tipografia, cores, ícones, botões, formulários, calendários e gráficos.",
    ],
    delivery: "Telas de login, resumo, ataques, tráfego e hostnames, mais o quadro de componentes.",
    flow: [
      { src: "/projetos/akamai/login.webp", width: 438, height: 966, title: "Login", alt: "Tela de login do Akamai Mobile Control Center em azul, com seletor de idioma, e-mail, senha e botão Fazer login.", callouts: [ { x: 78, y: 8, text: "Seletor de idioma antes de tudo." }, { x: 50, y: 55, text: "Login direto: dois campos e uma ação." } ] },
      { src: "/projetos/akamai/waf-resumo.webp", width: 423, height: 1050, title: "Resumo do WAF", alt: "Tela Web Application Firewall com contrato e período no topo, barras de tráfego, gráfico de pizza dos grupos de ataque e percentuais de ações aplicadas.", callouts: [ { x: 50, y: 8, text: "Contrato e período no topo: o filtro vem antes do dado." }, { x: 30, y: 22, text: "Barras para comparar volumes." }, { x: 30, y: 62, text: "Pizza para a proporção entre tipos de ataque." }, { x: 55, y: 92, text: "Percentuais grandes para leitura em segundos." } ] },
      { src: "/projetos/akamai/trafego.webp", width: 423, height: 900, title: "Tráfego", alt: "Tela Tráfego Geral com barras coloridas por métrica e atalhos para WAF Attack Geral, Hostname e Top URLs.", callouts: [ { x: 50, y: 45, text: "Uma cor por métrica, com o valor escrito ao lado." }, { x: 50, y: 88, text: "Atalhos para as outras áreas no fim da tela." } ] },
    ],
    designSystem: { src: "/projetos/akamai/design-system.webp", width: 1329, height: 978, alt: "Mini design system do app: tipografia, cores, ícones e logotipos, botões, top bar, formulários, barra de navegação, calendários, gráficos, imagens, barra de pesquisa, avatares e campos de exibição." },
    resultsTodo: "TODO: se tiver resultados reais (adoção, tempo de consulta, feedback do cliente), acrescente aqui.",
  },
  // TODO-revisar: texto reconstruído
  "app-de-viagens": {
    challenge:
      "Reunir num só app as etapas de uma viagem: alugar um carro, reservar hospedagem e descobrir o que visitar.",
    audience: "Viajantes a lazer que planejam o passeio pelo celular, muitas vezes já perto do destino.",
    process: [
      "Fiz benchmarking de apps de locação e de turismo para entender os padrões que o público já conhece.",
      "Organizei a arquitetura em três serviços com o mesmo padrão de busca e validei os fluxos em wireframes.",
      "Defini a paleta e a interface em alta fidelidade.",
    ],
    decisions: [
      "As três buscas (veículo, pacote, ponto turístico) usam o mesmo formulário: local, data e hora, e um botão verde de pesquisar.",
      "Saudação com o nome e atalho para pontos turísticos próximos na tela inicial.",
      "Preço por diária em destaque nos cards de veículo, com acesso a opções similares.",
      "Paleta de verdes ligada à natureza, com cinzas neutros para o conteúdo.",
    ],
    delivery: "Telas de início, locação de veículo, pacotes turísticos e pontos turísticos, com a paleta documentada.",
  },
  // TODO-revisar: texto reconstruído
  nurotulo: {
    challenge:
      "Renovar a marca e o app de um serviço que ajuda pessoas com restrições alimentares a encontrar produtos e lugares adequados.",
    audience: "Pessoas com alergias, intolerâncias ou dietas específicas que precisam conferir ingredientes antes de comprar.",
    process: [
      "Analisei a marca anterior com o cliente para entender o que manter e o que mudar.",
      "Redesenhei a identidade e, em seguida, a tela de exploração do app, validando a hierarquia em wireframes.",
      "Levei a nova marca para o app e para os materiais de divulgação.",
    ],
    decisions: [
      "Atalhos de scanner, cartão saúde e serviços no topo da tela Explorar: as tarefas mais rápidas primeiro.",
      "Categorias por tipo de lugar (mercado, lanchonete, restaurante, farmácia) em ícones grandes.",
      "Uma marca mais simples e legível em tamanho pequeno, como no ícone do app.",
    ],
    delivery: "Nova identidade visual, tela de exploração do app e materiais de divulgação.",
  },
  // TODO-revisar: texto reconstruído
  polaris: {
    challenge:
      "Dar a gestores uma visão única de indicadores comerciais e financeiros, com comparação entre regiões.",
    audience: "Gestores que acompanham metas e precisam comparar desempenho rapidamente.",
    process: [
      "Levantei com o cliente os indicadores e as comparações mais usadas no dia a dia.",
      "Desenhei a navegação lateral e a hierarquia do dashboard em wireframes antes da interface.",
      "Entreguei a interface em alta fidelidade, com a tela de login.",
    ],
    decisions: [
      "Resumo de desempenho no topo, com posição e percentuais, antes dos detalhes.",
      "Abas por objetivo (financeiro, comercial, marketing, logística) e filtro de período diário, semanal ou histórico.",
      "Comparativo em barras e tabela de tendência com setas e cores, sem depender só da cor.",
    ],
    delivery: "Dashboard web com navegação lateral, resumo, comparativos e login.",
  },
  // TODO-revisar: texto reconstruído
  "bloco-do-urso": {
    challenge: "Criar um app para um bloco de carnaval que vá além da programação: notícias, conexão entre foliões e transmissão.",
    audience: "Foliões que acompanham o bloco pelo celular, durante e depois do evento.",
    process: [
      "Conversei com o cliente sobre a experiência que o bloco queria oferecer além da rua.",
      "Mapeei as áreas do app, organizei a navegação e testei os fluxos principais em wireframes.",
      "Desenhei a interface em alta fidelidade com a identidade do bloco.",
    ],
    decisions: [
      "Roxo e amarelo da marca do bloco em todo o app, com o mascote como personagem.",
      "Match entre foliões com ações claras de recusar e curtir, em ícones grandes.",
      "Abas no topo para alternar entre transmissão, início e ao vivo.",
    ],
    delivery: "Telas de abertura, notícias, match entre foliões e área de metaverso.",
  },
  // TODO-revisar: texto reconstruído
  "virtualmed-clin": {
    challenge: "Apresentar um serviço de atendimento médico online de forma clara e confiável, da marca ao site.",
    audience: "Famílias que buscam consulta médica rápida sem sair de casa.",
    process: [
      "Entendi com o cliente o serviço e o público, e construí a marca a partir disso.",
      "Estruturei a página principal em wireframes, com a proposta de valor e a chamada para ação.",
      "Prototipei o site em alta fidelidade e apliquei a marca em materiais.",
    ],
    decisions: [
      "Proposta de valor em uma frase grande na abertura, com login separado no canto.",
      "Botão laranja de alto contraste sobre o azul para a ação principal.",
      "Símbolo que une a cruz médica e o cursor: saúde e atendimento digital no mesmo sinal.",
    ],
    delivery: "Identidade visual, site de apresentação do serviço e aplicações da marca.",
  },
};
