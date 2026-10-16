import type { FlowScreen } from "@/content/projects";
import { FlowCallouts } from "./flow-callouts";
import { AppScreens } from "./app-screens";

export const recreatedLabel = "Telas redesenhadas em alta resolução a partir do app original.";

const plScreens: FlowScreen[] = [
  {
    screen: "pl-antes",
    title: "Antes",
    alt: "Versão anterior da escalação, em roxo: cabeçalho Campeonato Inglês com Salvar time, preço e patrimônio pequenos, campo com onze marcadores amarelos de mais iguais e reservas também como marcadores.",
    callouts: [
      { x: 92, y: 15, text: "Ações espremidas no topo, sem rótulo, competindo com o título." },
      { x: 8, y: 34, text: "Onze marcadores iguais: nada mostra quem está escalado, quanto custa ou de que time é." },
      { x: 8, y: 56, text: "Reservas como marcadores, sem nome nem preço." },
    ],
  },
  {
    screen: "pl-escalacao",
    title: "Depois",
    alt: "Nova escalação em azul: métricas de preço do time, fechamento do mercado e patrimônio no topo, seletor 4-3-3, campo com cards de jogadores com preço, camisa, confirmação e nome, banco de reservas, ações e navegação inferior.",
    callouts: [
      { x: 94, y: 13.5, text: "Preço do time, fechamento do mercado e patrimônio lado a lado, em destaque no topo." },
      { x: 94, y: 38, text: "Cada posição vira um card: preço, camisa com escudo, confirmação e nome." },
      { x: 94, y: 61, text: "Banco de reservas visível na mesma tela, com os mesmos cards." },
      { x: 62, y: 72, text: "Ações agrupadas e o capitão escolhido à direita." },
      { x: 94, y: 95, text: "Navegação inferior com Campeonatos, Notificações e Minha conta." },
    ],
  },
];

/** Antes × depois da escalação, com as mudanças numeradas. */
export function PlAntesDepois() {
  return (
    <div>
      <p className="label mb-4">{recreatedLabel}</p>
      <div className="mx-auto max-w-[44rem]">
        <FlowCallouts screens={plScreens} accent="#1e49ff" />
      </div>
    </div>
  );
}

const hlScreens: FlowScreen[] = [
  {
    screen: "hl-ponto-0",
    title: "Marcar o ponto",
    alt: "Tela Marcar o ponto: logo hora do lar, Oi Funcionário!, data, abas Marcar o ponto (ativa) e Resumo do mês, lista Entrada, Intervalo, Retorno intervalo e Saída com --:--, botão laranja Registrar Entrada e navegação inferior.",
    callouts: [
      { x: 6, y: 21, text: "As duas tarefas do dia ficam sempre visíveis no topo: marcar o ponto e ver o resumo." },
      { x: 94, y: 33, text: "A próxima marcação vira o botão principal, logo abaixo do item correspondente." },
      { x: 94, y: 44, text: "Cada marcação mostra o horário registrado ou --:--, na ordem do dia." },
    ],
  },
  {
    screen: "hl-resumo",
    title: "Resumo do mês",
    alt: "Tela Resumo do mês: card Horas trabalhadas 0.00/168.00 horas com anel de progresso, botão Buscar mês, extrato de horas extras, saldo, resumo de descontos, atrasos e faltas.",
    callouts: [
      { x: 94, y: 30, text: "Horas trabalhadas contra a meta do mês, com anel de progresso." },
      { x: 94, y: 51, text: "Saldo, atrasos e faltas em texto escaneável, com ícone de status além da cor." },
      { x: 94, y: 90, text: "Navegação inferior com quatro destinos: Ponto, Notificações, Aprovações e Menu." },
    ],
  },
  {
    screen: "hl-menu",
    title: "Menu",
    alt: "Menu do app: Ajuste de ponto, Documentos mensais, Documentos periódicos, Desligamento e Configuração, cada um com ícone e seta.",
    callouts: [{ x: 94, y: 33, text: "Tarefas menos frequentes ficam no menu, em itens grandes com ícone e seta." }],
  },
];

/** App do funcionário: as 3 telas redesenhadas e as capturas originais. */
export function HlAppFuncionario() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="label mb-4">{recreatedLabel}</p>
        <FlowCallouts screens={hlScreens} accent="#f26b1d" />
      </div>
      <AppScreens />
    </div>
  );
}
