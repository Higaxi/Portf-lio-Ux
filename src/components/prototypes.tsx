"use client";

import Image from "next/image";

import type { ReactNode } from "react";
import { PrototypePlayer, type ProtoStep } from "./prototype-player";
import { RecreatedScreen, type ScreenId } from "./recreated-screens";

/*
 * Protótipos ilustrativos recriados a partir do que sabemos de cada projeto
 * (slides, imagens de apresentação e descrições). Telas simplificadas; nomes
 * e valores fictícios. Animação só com transform e opacity.
 */

const ease = "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]";

/** Tela que entra e sai conforme o passo. */
function Screen({ show, children, from = "right" }: { show: boolean; children: ReactNode; from?: "right" | "up" }) {
  const hidden = from === "right" ? "translate-x-8" : "translate-y-6";
  return (
    <div aria-hidden={!show} className={`absolute inset-0 flex flex-col ${ease} ${show ? "opacity-100" : `pointer-events-none opacity-0 ${hidden}`}`}>
      {children}
    </div>
  );
}

/* ---------- Premium League: fluxo de escalação (telas redesenhadas) ---------- */

const plSteps: ProtoStep[] = [
  { label: "Abrir o app", ms: 1800 },
  { label: "Escalação vazia: hora de montar o time", ms: 2000 },
  { label: "Montar o time: jogadores entram nas posições", ms: 2400 },
  { label: "Escalação automática (PRO) completa o time", ms: 2600 },
  { label: "Escalação salva", ms: 2200 },
];
const plIds: ScreenId[] = ["pl-splash", "pl-escalacao-vazia", "pl-escalacao-parcial", "pl-escalacao-auto", "pl-escalacao-salva"];

export function PremiumLeaguePrototype() {
  return (
    <PrototypePlayer title="Protótipo do fluxo de escalação do Premium League" steps={plSteps} accent="#1e49ff" render={(st) => <ScreenSteps ids={plIds} step={st} />} />
  );
}

/* ---------- Pormade: fluxo do vendedor em campo ---------- */

const pmSteps: ProtoStep[] = [
  { label: "Cadastro do cliente e da obra", ms: 2200 },
  { label: "Catálogo: escolher a categoria", ms: 2000 },
  { label: "Configurar tamanho, cor e material", ms: 2400 },
  { label: "Revisar o carrinho e gerar a proposta", ms: 2200 },
  { label: "Compartilhar pelo WhatsApp ou e-mail", ms: 1800 },
  { label: "Proposta enviada", ms: 2200 },
];
const pmClock = ["0:30", "1:10", "2:05", "2:50", "3:10", "3:20"];
const pmGreen = "#2e5f2e";
const pmLime = "#8bc34a";
const pmCategories = ["Kit Porta Pronta", "Folha de Porta", "Porta de Correr", "Rodapé", "Papel de Parede", "Piso Vinílico"];

function DoorIcon({ i }: { i: number }) {
  // Ícones de linha simples, no estilo das telas reais (traço verde).
  const paths = [
    "M6 3h12v18H6z M14 12h1",
    "M8 3h8v18H8z M13 12h1",
    "M4 3h10v18H4z M14 3h6v18h-6",
    "M3 16l18-6 M3 20l18-6",
    "M7 3h10v14l-5 4H7z",
    "M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18",
  ];
  return (
    <svg viewBox="0 0 24 24" className="mx-auto size-7" fill="none" stroke={pmGreen} strokeWidth="1.6" aria-hidden="true">
      <path d={paths[i]} />
    </svg>
  );
}

export function PormadePrototype() {
  return (
    <PrototypePlayer
      title="Protótipo do fluxo do vendedor no Gerador de Propostas"
      steps={pmSteps}
      accent={pmGreen}
      render={(s) => (
        <>
          <div className="absolute inset-x-0 top-0 z-10 flex items-end justify-between bg-white px-4 pb-2 pt-8" style={{ borderBottom: `3px solid ${pmLime}` }}>
            <span className="leading-none">
              <b className="block text-[15px]" style={{ color: pmGreen }}>
                Pormade
              </b>
              <span className="text-[9px] text-[#6b7280]">Portas</span>
            </span>
            <span className="tabular rounded-full px-2 py-0.5 text-[10px] text-white" style={{ background: pmGreen }} title="Tempo do fluxo (ilustrativo)">
              ⏱ {pmClock[s]} min
            </span>
          </div>
          <div className="absolute inset-0 top-[66px] bg-[#f6f7f5]">
            <Screen show={s === 0}>
              <p className="px-4 pt-3 font-semibold">Cadastro de cliente</p>
              <div className="flex flex-col gap-2 p-3">
                {[
                  ["Nome completo", "Construtora Exemplo"],
                  ["DDD + Telefone", "(00) 0000-0000"],
                  ["Obra", "Residencial Exemplo, bloco B"],
                ].map(([k, v], i) => (
                  <div key={k} className="rounded-lg border border-[#d9dcd5] bg-white px-3 py-2">
                    <span className="block text-[9px] text-[#6b7280]">{k}</span>
                    <span className={ease} style={{ opacity: s === 0 ? 1 : 0, transitionDelay: `${300 + i * 300}ms` }}>
                      {v}
                    </span>
                  </div>
                ))}
                <span className="mt-1 rounded-lg py-2.5 text-center font-semibold text-white" style={{ background: pmGreen }}>
                  Confirmar cadastro
                </span>
              </div>
            </Screen>
            <Screen show={s === 1}>
              <div className="m-3 rounded-xl bg-white p-3">
                <p className="text-center text-[13px]" style={{ color: pmGreen }}>
                  Gerador de
                </p>
                <p className="text-center text-[15px] font-bold">Propostas</p>
                <ul className="mt-3 grid grid-cols-3 gap-2">
                  {pmCategories.map((c, i) => (
                    <li key={c} className={`rounded-lg border p-2 text-center text-[8px] leading-tight ${i === 0 ? "ring-2" : ""}`} style={{ borderColor: "#d9dcd5", ["--tw-ring-color" as string]: pmGreen }}>
                      <DoorIcon i={i} />
                      <span className="mt-1 block">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Screen>
            <Screen show={s === 2}>
              <p className="px-4 pt-3 font-semibold">Kit Porta Pronta</p>
              <div className="flex flex-col gap-3 p-3">
                <span className="mx-auto block h-28 w-16 rounded-sm bg-[#b98a5f] ring-4 ring-white" />
                {[
                  ["Tamanho", s === 2 ? "80 × 210 cm" : "70 × 210 cm"],
                  ["Material", "Madeira"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-lg border border-[#d9dcd5] bg-white px-3 py-2">
                    <span className="text-[#6b7280]">{k}</span>
                    <b>{v}</b>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-[#6b7280]">Cor</span>
                  {["#c8a27a", "#8a5a33", "#e9e4dc", "#3a3a3a"].map((c, i) => (
                    <span key={c} className={`size-7 rounded-full ${i === 1 ? "ring-2 ring-offset-2" : ""}`} style={{ background: c, ["--tw-ring-color" as string]: pmGreen }} />
                  ))}
                </div>
              </div>
            </Screen>
            <Screen show={s >= 3}>
              <p className="px-4 pt-3 font-semibold">Carrinho</p>
              <ul className="flex flex-col p-3 text-[11px]">
                {["Kit Porta Pronta · 80 × 210", "Rodapé · 12 m", "Piso Vinílico · 18 m²"].map((a) => (
                  <li key={a} className="flex justify-between border-b border-[#e4e7e1] py-2">
                    <span>{a}</span>
                    <span className="text-[#6b7280]">1</span>
                  </li>
                ))}
              </ul>
              <div className="relative mt-auto grid grid-cols-2 gap-2 p-3">
                <span className="rounded-lg bg-[#f2766a] py-2.5 text-center font-semibold text-white">Cancelar</span>
                <span className={`rounded-lg py-2.5 text-center font-semibold text-white ${ease} ${s === 3 ? "scale-95" : ""}`} style={{ background: pmGreen }}>
                  Gerar proposta
                </span>
              </div>
              <div className={`absolute inset-x-3 bottom-16 rounded-xl bg-white p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] ${ease} ${s === 4 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <p className="mb-2 font-semibold">Compartilhar proposta</p>
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <span className="rounded-lg bg-[#25d366] py-2 font-semibold text-white">WhatsApp</span>
                  <span className="rounded-lg border border-[#d9dcd5] py-2">E-mail</span>
                </div>
              </div>
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 ${ease} ${s === 5 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <span className={`flex size-16 items-center justify-center rounded-full text-[28px] text-white ${ease} ${s === 5 ? "scale-100" : "scale-50"}`} style={{ background: pmGreen }}>
                  ✓
                </span>
                <b className="text-[14px]">Proposta enviada</b>
                <span className="text-[#6b7280]">em minutos, ainda na visita</span>
              </div>
            </Screen>
          </div>
        </>
      )}
    />
  );
}

/* ---------- Akamai e Angel Investor: telas redesenhadas em código ---------- */

function ScreenSteps({ ids, step }: { ids: ScreenId[]; step: number }) {
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

const akSteps: ProtoStep[] = [
  { label: "Entrar no painel", ms: 2000 },
  { label: "Resumo do firewall: tráfego e ataques", ms: 3000 },
  { label: "Tráfego geral por métrica", ms: 2800 },
];
const akIds: ScreenId[] = ["akamai-login", "akamai-waf", "akamai-trafego"];

export function AkamaiPrototype() {
  return <PrototypePlayer title="Protótipo do painel de segurança" steps={akSteps} accent="#0f3a6b" render={(s) => <ScreenSteps ids={akIds} step={s} />} />;
}

const aiSteps: ProtoStep[] = [
  { label: "Abertura com a comunidade", ms: 2000 },
  { label: "Cadastro pelo número de telefone", ms: 2200 },
  { label: "Feed com stories e publicações", ms: 2600 },
  { label: "Lista de conversas", ms: 2200 },
  { label: "Conversa com outro membro", ms: 2600 },
];
const aiImgs = ["abertura", "cadastro", "feed", "conversas", "chat"].map((n) => `/projetos/angel-investor/${n}.webp`);

export function AngelInvestorPrototype() {
  return (
    <PrototypePlayer title="Protótipo do app da comunidade de investidores" steps={aiSteps} accent="#6c4cf1" render={(s) => (
        <>
          {aiImgs.map((src, i) => (
            <Screen key={src} show={i === s}>
              <Image src={src} alt="" fill sizes="280px" className="object-cover object-top" />
            </Screen>
          ))}
        </>
      )} />
  );
}
