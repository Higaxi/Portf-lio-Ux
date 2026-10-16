"use client";

import type { ReactNode } from "react";
import type { PrototypeId } from "@/content/projects";
import { PrototypePlayer, type ProtoStep } from "./prototype-player";
import { RecreatedScreen, type ScreenId } from "./recreated-screens";
import {
  AkamaiPrototype,
  AngelInvestorPrototype,
  PormadePrototype,
  PremiumLeaguePrototype,
} from "./prototypes";

/*
 * Protótipos ilustrativos recriados dos cases Pode Regularizar e Hora do Lar.
 * Nomes, endereços e valores são fictícios. Animação só com transform e opacity.
 */

const ease = "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]";

function Screen({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div aria-hidden={!show} className={`absolute inset-0 flex flex-col ${ease} ${show ? "opacity-100" : "pointer-events-none translate-x-8 opacity-0"}`}>
      {children}
    </div>
  );
}

function Bar({ title, color }: { title: string; color: string }) {
  return (
    <div className="shrink-0 px-4 pb-3 pt-8 text-center font-semibold text-white" style={{ background: color }}>
      {title}
    </div>
  );
}

/* ---------- Pode Regularizar: dia do vendedor em campo ---------- */

const prSteps: ProtoStep[] = [
  { label: "Abrir a agenda do dia", ms: 2000 },
  { label: "Visita ao cliente", ms: 2000 },
  { label: "Cadastro do imóvel com foto", ms: 2600 },
  { label: "Validação técnica online", ms: 2200 },
  { label: "Status do processo", ms: 2400 },
];

export function PodeRegularizarPrototype() {
  const orange = "#f07e26";
  const blue = "#1b4fd8";
  const green = "#00a37a";
  return (
    <PrototypePlayer
      title="Protótipo do fluxo do vendedor no Pode Regularizar"
      steps={prSteps}
      accent={orange}
      render={(s) => (
        <>
          <Screen show={s === 0}>
            <div className="px-4 pb-2 pt-9">
              <p className="text-[10px] text-[#6b7280]">Cumprimento da meta</p>
              <span className="mt-1 block h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                <span className="block h-full w-3/4 rounded-full" style={{ background: green }} />
              </span>
            </div>
            <p className="px-4 pt-2 font-semibold">Compromissos do dia</p>
            <ul className="flex flex-col gap-2 p-3">
              {["09:30 · Visita agendada", "12:30 · Visita agendada", "16:00 · Retorno de documentos"].map((t, i) => (
                <li key={t} className={`rounded-lg border px-3 py-3 ${i === 0 ? "border-[#f07e26] bg-[#fff4ec]" : "border-[#e5e7eb]"}`}>
                  <span className="font-semibold" style={{ color: i === 0 ? blue : undefined }}>
                    {t}
                  </span>
                  <span className="block text-[10px] text-[#6b7280]">Av. Exemplo, 123</span>
                </li>
              ))}
            </ul>
          </Screen>
          <Screen show={s === 1}>
            <Bar title="Visita" color={blue} />
            <div className="flex flex-col gap-2 p-3">
              <div className="rounded-lg bg-[#f6f6f8] p-3">
                <b>Cliente exemplo</b>
                <span className="block text-[10px] text-[#6b7280]">Imóvel a regularizar · REURB</span>
              </div>
              {["Documentos pessoais", "Comprovante de endereço", "Documentos do imóvel"].map((t) => (
                <div key={t} className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-3 py-2.5">
                  <span>{t}</span>
                  <span className="text-[10px] font-semibold" style={{ color: orange }}>
                    Pendente
                  </span>
                </div>
              ))}
              <span className="mt-2 rounded-full py-2.5 text-center font-semibold text-white" style={{ background: orange }}>
                Cadastrar imóvel
              </span>
            </div>
          </Screen>
          <Screen show={s === 2}>
            <Bar title="Cadastro de imóvel" color={blue} />
            <div className="flex flex-col gap-2 p-3">
              <div className="relative h-28 overflow-hidden rounded-lg bg-[#dbe4f3]">
                <span className={`absolute inset-0 bg-[#7d93b8] ${ease} ${s === 2 ? "opacity-100" : "opacity-0"}`} />
                <span
                  className={`absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-[10px] ${ease} ${s === 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                  style={{ transitionDelay: "500ms" }}
                >
                  Foto enviada
                </span>
              </div>
              {[
                ["Endereço", "Rua Exemplo, 45"],
                ["Área construída", "84 m²"],
                ["Matrícula", "Preenchida automaticamente"],
              ].map(([k, v], i) => (
                <div key={k} className="rounded-lg border border-[#e5e7eb] px-3 py-2">
                  <span className="block text-[9px] text-[#6b7280]">{k}</span>
                  <span className={`block ${ease}`} style={{ opacity: s === 2 ? 1 : 0, transitionDelay: `${700 + i * 250}ms` }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Screen>
          <Screen show={s === 3}>
            <Bar title="Validação técnica" color={blue} />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
              <span
                className={`flex size-16 items-center justify-center rounded-full text-[28px] text-white ${ease} ${s === 3 ? "scale-100" : "scale-50"}`}
                style={{ background: green }}
              >
                ✓
              </span>
              <b className="text-[14px]">Dados validados</b>
              <span className="text-[#6b7280]">Antes de seguir para a engenharia e a prefeitura</span>
            </div>
          </Screen>
          <Screen show={s === 4}>
            <Bar title="Meus clientes" color={blue} />
            <ul className="flex flex-col gap-2 p-3">
              {[
                ["Cliente exemplo", "Em análise", blue],
                ["Cliente B", "Documentos pendentes", orange],
                ["Cliente C", "Concluído", green],
              ].map(([n, st, c]) => (
                <li key={n} className="rounded-lg border border-[#e5e7eb] px-3 py-2.5">
                  <b>{n}</b>
                  <span className="block text-[10px] font-semibold" style={{ color: c }}>
                    Status: {st}
                  </span>
                </li>
              ))}
            </ul>
          </Screen>
        </>
      )}
    />
  );
}

/* ---------- Hora do Lar (telas redesenhadas) ---------- */

function Steps({ ids, step }: { ids: ScreenId[]; step: number }) {
  return (
    <>
      {ids.map((id, i) => (
        <Screen key={id} show={i === step}>
          <RecreatedScreen id={id} />
        </Screen>
      ))}
    </>
  );
}

const fnSteps: ProtoStep[] = [
  { label: "Marcar a entrada", ms: 2000 },
  { label: "Início do intervalo", ms: 1800 },
  { label: "Retorno do intervalo", ms: 1800 },
  { label: "Marcar a saída", ms: 1800 },
  { label: "Resumo do mês", ms: 2600 },
];
const fnIds: ScreenId[] = ["hl-ponto-1", "hl-ponto-2", "hl-ponto-3", "hl-ponto-4", "hl-resumo"];

export function HoraDoLarFuncionarioPrototype() {
  return <PrototypePlayer title="Protótipo do app do funcionário do Hora do Lar" steps={fnSteps} accent="#f26b1d" render={(st) => <Steps ids={fnIds} step={st} />} />;
}

const emSteps: ProtoStep[] = [
  { label: "Pedido de ajuste de ponto", ms: 2200 },
  { label: "Aprovar o ajuste", ms: 1800 },
  { label: "Resumo de horas do mês", ms: 2400 },
  { label: "Emitir o recibo", ms: 2200 },
  { label: "Notificação de documento pronto", ms: 2200 },
];
const emIds: ScreenId[] = ["hl-emp-aprovar", "hl-emp-aprovado", "hl-emp-resumo", "hl-emp-documentos", "hl-emp-notificacao"];

export function HoraDoLarEmpregadorPrototype() {
  return <PrototypePlayer title="Protótipo do app do empregador do Hora do Lar" steps={emSteps} accent="#f26b1d" render={(st) => <Steps ids={emIds} step={st} />} />;
}

/** Seleciona o protótipo pelo id usado nos dados dos cases. */
export function CasePrototype({ id }: { id: PrototypeId }) {
  switch (id) {
    case "premium-league":
      return <PremiumLeaguePrototype />;
    case "pormade":
      return <PormadePrototype />;
    case "pode-regularizar":
      return <PodeRegularizarPrototype />;
    case "hora-do-lar-funcionario":
      return <HoraDoLarFuncionarioPrototype />;
    case "hora-do-lar-empregador":
      return <HoraDoLarEmpregadorPrototype />;
    case "akamai":
      return <AkamaiPrototype />;
    case "angel-investor":
      return <AngelInvestorPrototype />;
  }
}
