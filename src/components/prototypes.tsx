"use client";

import type { ReactNode } from "react";
import { PrototypePlayer, type ProtoStep } from "./prototype-player";

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

function Bar({ title, color = "#1e3bff", dark = false }: { title: string; color?: string; dark?: boolean }) {
  return (
    <div className="shrink-0 px-4 pb-3 pt-8 text-center font-semibold" style={{ background: color, color: dark ? "#111827" : "#fff" }}>
      {title}
    </div>
  );
}

function Tap({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute right-3 top-1/2 size-7 -translate-y-1/2 rounded-full bg-black/25 ${ease} ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
    />
  );
}

/* ---------- Premium League: fluxo de escalação ---------- */

const plSteps: ProtoStep[] = [
  { label: "Abrir o campeonato", ms: 2000 },
  { label: "Montar o time: jogadores entram nas posições", ms: 2600 },
  { label: "Escalação automática completa o time", ms: 2600 },
  { label: "Escalação salva", ms: 1800 },
  { label: "Compartilhar no WhatsApp", ms: 2400 },
];

const formation = [
  [50, 18],
  [22, 22],
  [78, 22],
  [30, 45],
  [50, 48],
  [70, 45],
  [14, 70],
  [38, 72],
  [62, 72],
  [86, 70],
  [50, 90],
];

export function PremiumLeaguePrototype() {
  return (
    <PrototypePlayer
      title="Protótipo do fluxo de escalação do Premium League"
      steps={plSteps}
      accent="#1e3bff"
      render={(s) => (
        <>
          <Screen show={s === 0}>
            <Bar title="Campeonatos" />
            <ul className="flex flex-col gap-2 p-3">
              {["Brasileirão", "Libertadores", "Champions", "Campeonato Inglês"].map((c, i) => (
                <li key={c} className={`relative rounded-lg border px-3 py-3 ${i === 0 ? "border-[#1e3bff] bg-[#eef1ff]" : "border-[#e5e7eb]"}`}>
                  <span className="font-semibold">{c}</span>
                  <span className="block text-[10px] text-[#6b7280]">Mercado aberto</span>
                  {i === 0 ? <Tap on={s === 0} /> : null}
                </li>
              ))}
            </ul>
          </Screen>

          <Screen show={s >= 1 && s <= 3}>
            <Bar title="Escalação" />
            <div className="flex justify-between px-3 py-2 text-[10px] text-[#6b7280]">
              <span>Preço do time <b className="block text-[12px] text-[#111827]">${(s === 1 ? 40 : 110).toFixed(2).replace(".", ",")}</b></span>
              <span className="text-right">Patrimônio <b className="block text-[12px] text-[#111827]">$120,00</b></span>
            </div>
            <div className="relative mx-3 flex-1 overflow-hidden rounded-lg bg-[#22a447]">
              <div aria-hidden="true" className="absolute inset-2 rounded border-2 border-white/70" />
              <div aria-hidden="true" className="absolute inset-x-2 top-1/2 h-0.5 bg-white/70" />
              {formation.map(([x, y], i) => {
                const filled = s >= 2 || (s === 1 && i < 4);
                return (
                  <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                    <span className={`absolute inset-0 m-auto flex size-6 items-center justify-center rounded-full bg-[#facc15] text-[14px] font-bold text-[#111827] ${ease} ${filled ? "scale-50 opacity-0" : "opacity-100"}`}>+</span>
                    <span
                      className={`flex flex-col items-center ${ease} ${filled ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
                      style={{ transitionDelay: s === 2 ? `${i * 70}ms` : "0ms" }}
                    >
                      <span className="rounded bg-[#111827] px-1 text-[8px] font-bold text-white">$10</span>
                      <span className="mt-0.5 block h-5 w-6 rounded-sm" style={{ background: ["#d62828", "#ffffff", "#1f2937"][i % 3] }} />
                    </span>
                  </span>
                );
              })}
            </div>
            <div className="relative p-3">
              <span className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 font-semibold text-white ${ease} ${s === 2 ? "scale-95 bg-[#1530d6]" : "bg-[#1e3bff]"}`}>
                Escalação automática <span className="rounded bg-[#facc15] px-1 text-[9px] text-[#111827]">PRO</span>
              </span>
            </div>
            <div
              role="presentation"
              className={`absolute inset-x-4 bottom-20 rounded-lg bg-[#111827] px-3 py-3 text-center font-semibold text-white ${ease} ${s === 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              ✓ Escalação salva
            </div>
          </Screen>

          <Screen show={s === 4} from="up">
            <Bar title="Compartilhar escalação" />
            <div className="flex flex-1 flex-col justify-end bg-[#f3f4f6] p-3">
              <div className="rounded-xl bg-white p-3">
                <p className="mb-3 font-semibold">Enviar para</p>
                <ul className="grid grid-cols-3 gap-3 text-center text-[10px]">
                  {[
                    ["WhatsApp", "#25d366"],
                    ["Instagram", "#c13584"],
                    ["Copiar link", "#9ca3af"],
                  ].map(([n, c], i) => (
                    <li key={n} className="flex flex-col items-center gap-1">
                      <span className={`size-11 rounded-full ${ease} ${i === 0 && s === 4 ? "scale-110" : ""}`} style={{ background: c }} />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Screen>
        </>
      )}
    />
  );
}

/* ---------- Pormade: fluxo do vendedor em campo ---------- */

const pmSteps: ProtoStep[] = [
  { label: "Selecionar o cliente", ms: 2000 },
  { label: "Escolher a porta no catálogo", ms: 2200 },
  { label: "Ajustar medidas e acabamento", ms: 2400 },
  { label: "Proposta gerada com o total", ms: 2200 },
  { label: "Enviar ao cliente", ms: 1800 },
  { label: "Proposta enviada", ms: 2200 },
];
const pmClock = ["0:20", "1:05", "2:10", "3:00", "3:30", "3:45"];

export function PormadePrototype() {
  const wood = "#c8743a";
  return (
    <PrototypePlayer
      title="Protótipo do fluxo do vendedor no gerador de propostas"
      steps={pmSteps}
      accent={wood}
      render={(s) => (
        <>
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[#141210] px-4 pb-2 pt-8 text-white">
            <span className="font-semibold">Nova proposta</span>
            <span className="tabular rounded-full bg-white/15 px-2 py-0.5 text-[10px]" title="Tempo do fluxo (ilustrativo)">
              ⏱ {pmClock[s]} min
            </span>
          </div>
          <div className="absolute inset-0 top-[62px]">
            <Screen show={s === 0}>
              <p className="px-4 pt-3 font-semibold">Cliente</p>
              <ul className="flex flex-col gap-2 p-3">
                {["Construtora Exemplo", "Loja Modelo", "Residencial Teste"].map((c, i) => (
                  <li key={c} className={`relative rounded-lg border px-3 py-3 ${i === 0 ? "border-[#c8743a] bg-[#fbf3ec]" : "border-[#e5e7eb]"}`}>
                    {c}
                    {i === 0 ? <Tap on /> : null}
                  </li>
                ))}
              </ul>
            </Screen>
            <Screen show={s === 1}>
              <p className="px-4 pt-3 font-semibold">Catálogo de portas</p>
              <ul className="grid grid-cols-2 gap-2 p-3">
                {["#b98a5f", "#e9e4dc", "#8a5a33", "#3a3a3a"].map((c, i) => (
                  <li key={c} className={`rounded-lg border p-2 ${i === 0 ? "border-[#c8743a] ring-2 ring-[#c8743a]" : "border-[#e5e7eb]"}`}>
                    <span className="mx-auto block h-20 w-12 rounded-sm" style={{ background: c }} />
                    <span className="mt-1 block text-center text-[10px]">Modelo {i + 1}</span>
                  </li>
                ))}
              </ul>
            </Screen>
            <Screen show={s === 2}>
              <p className="px-4 pt-3 font-semibold">Medidas e acabamento</p>
              <div className="flex flex-col gap-3 p-3">
                {[
                  ["Largura", s === 2 ? "80 cm" : "70 cm"],
                  ["Altura", "210 cm"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-3 py-2">
                    <span className="text-[#6b7280]">{k}</span>
                    <span className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#f3f4f6]">−</span>
                      <b>{v}</b>
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#f3f4f6]">+</span>
                    </span>
                  </div>
                ))}
                <p className="text-[#6b7280]">Acabamento</p>
                <div className="flex gap-2">
                  {["#c8a27a", "#8a5a33", "#e9e4dc", "#3a3a3a"].map((c, i) => (
                    <span key={c} className={`size-8 rounded-full ${i === 1 ? "ring-2 ring-[#111827] ring-offset-2" : ""}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
            </Screen>
            <Screen show={s >= 3}>
              <p className="px-4 pt-3 font-semibold">Resumo da proposta</p>
              <ul className="flex flex-col p-3 text-[11px]">
                {[
                  ["Porta · Modelo 1", "1 un."],
                  ["80 × 210 cm · madeira", ""],
                  ["Batente e fechadura", "1 kit"],
                  ["Instalação", "incluída"],
                ].map(([a, b]) => (
                  <li key={a} className="flex justify-between border-b border-[#eee] py-2">
                    <span>{a}</span>
                    <span className="text-[#6b7280]">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between px-3">
                <span className="text-[#6b7280]">Total</span>
                <b className="text-[18px]">R$ 4.380,00</b>
              </div>
              <div className="relative mt-auto p-3">
                <span className={`flex items-center justify-center rounded-full px-3 py-3 font-semibold text-white ${ease} ${s === 4 ? "scale-95" : ""}`} style={{ background: wood }}>
                  Enviar ao cliente
                </span>
              </div>
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 ${ease} ${s === 5 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <span className={`flex size-16 items-center justify-center rounded-full bg-[#16a34a] text-[28px] text-white ${ease} ${s === 5 ? "scale-100" : "scale-50"}`}>✓</span>
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

/* ---------- Akamai / Exbiz: painel de segurança ---------- */

const akSteps: ProtoStep[] = [
  { label: "Entrar no painel", ms: 1800 },
  { label: "Resumo de tráfego com barras", ms: 2400 },
  { label: "Tipos de ataque no gráfico de pizza", ms: 2400 },
  { label: "Ações aplicadas aos ataques", ms: 2200 },
];

export function AkamaiPrototype() {
  const blue = "#0b3a75";
  return (
    <PrototypePlayer
      title="Protótipo do painel de segurança"
      steps={akSteps}
      accent={blue}
      render={(s) => (
        <>
          <Screen show={s === 0}>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-5" style={{ background: blue }}>
              <span className="text-[18px] font-bold text-white">Mobile Control Center</span>
              <span className="h-9 w-full rounded bg-white/90" />
              <span className="h-9 w-full rounded bg-white/90" />
              <span className="h-9 w-full rounded bg-[#5b9bd5] text-center font-semibold leading-9 text-white">Entrar</span>
            </div>
          </Screen>
          <Screen show={s >= 1}>
            <Bar title="Web Application Firewall" color={blue} />
            <div className="flex items-center justify-between px-3 py-2 text-[10px] text-[#6b7280]">
              <span>Contrato 0000-00</span>
              <span>01/07 a 30/07</span>
            </div>
            <div className={`flex flex-col gap-2 px-3 ${ease} ${s === 1 ? "opacity-100" : "opacity-40"}`}>
              {[
                ["Edge hits", 0.86, "#2563eb"],
                ["Page requests", 0.64, "#f97316"],
                ["Bandwidth", 0.74, "#8b5cf6"],
              ].map(([k, v, c]) => (
                <div key={k as string}>
                  <span className="text-[10px]">{k as string}</span>
                  <span className="mt-0.5 block h-3 overflow-hidden rounded bg-[#e5e7eb]">
                    <span
                      className="block h-full origin-left rounded transition-transform duration-1000 ease-out"
                      style={{ background: c as string, transform: `scaleX(${s >= 1 ? (v as number) : 0})` }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <div className={`mx-auto mt-4 ${ease} ${s >= 2 ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
              <svg viewBox="0 0 42 42" className="size-28 -rotate-90" aria-hidden="true">
                {[
                  [56, "#2563eb", 0],
                  [24, "#f97316", 56],
                  [12, "#8b5cf6", 80],
                  [8, "#22c55e", 92],
                ].map(([p, c, off]) => (
                  <circle key={c as string} cx="21" cy="21" r="15.9" fill="none" stroke={c as string} strokeWidth="8" strokeDasharray={`${p} ${100 - (p as number)}`} strokeDashoffset={-(off as number)} />
                ))}
              </svg>
            </div>
            <div className={`mt-3 grid grid-cols-2 gap-2 px-3 ${ease} ${s === 3 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
              <span className="rounded-lg bg-[#f3f4f6] p-2"><b className="block text-[16px]">65%</b>Deny</span>
              <span className="rounded-lg bg-[#f3f4f6] p-2"><b className="block text-[16px]">35%</b>Alert</span>
            </div>
          </Screen>
        </>
      )}
    />
  );
}

/* ---------- Angel Investor: onboarding, feed e conversa ---------- */

const aiSteps: ProtoStep[] = [
  { label: "Abertura com a comunidade", ms: 1800 },
  { label: "Cadastro pelo número de telefone", ms: 2200 },
  { label: "Feed com stories e publicações", ms: 2600 },
  { label: "Conversa com outro membro", ms: 2600 },
];

export function AngelInvestorPrototype() {
  const purple = "#6d3cf5";
  return (
    <PrototypePlayer
      title="Protótipo do app da comunidade de investidores"
      steps={aiSteps}
      accent={purple}
      render={(s) => (
        <>
          <Screen show={s <= 1}>
            <div className="flex flex-1 flex-col items-center gap-3 p-4 pt-10">
              <span className="text-[16px] font-bold" style={{ color: purple }}>Angel Investor Club</span>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="size-16 rounded-full" style={{ background: i % 2 ? "#c4b5fd" : purple }} />
                ))}
              </div>
              <p className="text-center text-[11px] font-semibold">Investimos em pessoas, transformamos vidas.</p>
              <div className={`w-full ${ease} ${s === 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                <span className="block rounded-lg border border-[#d1d5db] px-3 py-2 text-[#6b7280]">+55 (11) 9 ____-____</span>
              </div>
              <span className={`mt-auto w-full rounded-full py-2.5 text-center font-semibold text-white ${ease} ${s === 1 ? "scale-95" : ""}`} style={{ background: purple }}>
                {s === 1 ? "Cadastre o seu número" : "Iniciar"}
              </span>
            </div>
          </Screen>
          <Screen show={s === 2}>
            <div className="flex gap-2 overflow-hidden px-3 pb-2 pt-9">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="size-10 shrink-0 rounded-full ring-2" style={{ background: "#ddd6fe", ["--tw-ring-color" as string]: purple }} />
              ))}
            </div>
            <div className="flex flex-col gap-2 px-3">
              {[0, 1].map((i) => (
                <div key={i} className={`rounded-lg bg-[#f9fafb] p-2 ${ease}`} style={{ transitionDelay: `${i * 150}ms`, transform: s === 2 ? "none" : "translateY(12px)" }}>
                  <span className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className="size-6 rounded-full bg-[#c4b5fd]" /> Angel Investor Club
                  </span>
                  <span className="mt-2 block h-20 rounded bg-[#e5e7eb]" />
                  <span className="mt-1 block text-[9px] text-[#6b7280]">♥ curtidas · comentários</span>
                </div>
              ))}
            </div>
            <span className="absolute bottom-14 right-4 flex size-10 items-center justify-center rounded-full text-[20px] text-white" style={{ background: purple }}>+</span>
          </Screen>
          <Screen show={s === 3}>
            <div className="flex items-center gap-2 border-b border-[#eee] px-3 pb-2 pt-9">
              <span className="size-7 rounded-full bg-[#c4b5fd]" />
              <span className="font-semibold">Membro da comunidade</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              {[
                ["Oi! Alguma novidade hoje?", false],
                ["Sim, temos uma atualização no projeto.", true],
                ["Ótimo, vou dar uma olhada!", false],
              ].map(([t, me], i) => (
                <span
                  key={t as string}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${ease} ${me ? "self-end text-white" : "self-start bg-[#f3f4f6]"}`}
                  style={{ background: me ? purple : undefined, transitionDelay: `${i * 400}ms`, opacity: s === 3 ? 1 : 0, transform: s === 3 ? "none" : "translateY(8px)" }}
                >
                  {t as string}
                </span>
              ))}
            </div>
          </Screen>
        </>
      )}
    />
  );
}

