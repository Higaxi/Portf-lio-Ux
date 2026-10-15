"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { webClients, webLabel, type WebClient } from "@/content/web-design";

/** Barra de navegador com o domínio (só texto; sem link externo). */
function BrowserBar({ domain }: { domain: string }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 bg-[#e9e9ec] px-3 text-[#3a3a40]">
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </span>
      <span className="mx-auto max-w-[70%] truncate rounded-md bg-white px-3 py-0.5 font-mono text-[0.75rem]">{domain}</span>
    </div>
  );
}

/** Grade de clientes de web design; cada card abre o mockup de notebook. */
export function WebShowcase() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <p className="mb-8 max-w-[62ch] text-body text-muted">
        Landing pages focadas em conversão e geração de leads, para clínicas, consultórios, escritórios e empresas. Clique para navegar pelo site dentro do notebook.
      </p>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {webClients.map((c, i) => (
          <li key={c.slug}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-haspopup="dialog"
              className="zoom-on-hover group block w-full text-left"
            >
              <span className="block overflow-hidden rounded-xl bg-surface-2 p-2 pb-0">
                <span className="block overflow-hidden rounded-t-lg bg-white">
                  <BrowserBar domain={c.pages[0].domain} />
                  <span className="relative block aspect-[16/10] overflow-hidden">
                    <Image src={c.pages[0].thumb} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" loading="eager" className="object-cover object-top" />
                  </span>
                </span>
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-body">{c.name}</span>
                <span className="label shrink-0">{c.pages.length > 1 ? `${c.pages.length} páginas` : "1 página"}</span>
              </span>
              <span className="label block">
                {c.segment} · {webLabel}
              </span>
              <span className="sr-only">: abrir o site no mockup</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? <LaptopDialog start={open} onClose={() => setOpen(null)} /> : null}
    </>
  );
}

/**
 * Popup com mockup de notebook (CSS). A captura do site rola dentro da tela.
 * Abas trocam de página do mesmo cliente; ←/→ trocam de cliente; Esc fecha.
 * No celular, a tela vira um navegador em tela cheia.
 */
function LaptopDialog({ start, onClose }: { start: number; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [ci, setCi] = useState(start);
  const [pi, setPi] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const client: WebClient = webClients[ci];
  const page = client.pages[pi];

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
  }, []);

  const resetScroll = () => {
    screenRef.current?.scrollTo({ top: 0 });
    if (barRef.current) barRef.current.style.transform = "scaleY(0)";
  };
  const goClient = (dir: 1 | -1) => {
    setCi((c) => (c + dir + webClients.length) % webClients.length);
    setPi(0);
    resetScroll();
  };
  const goPage = (i: number) => {
    setPi(i);
    resetScroll();
  };

  const onScroll = () => {
    const el = screenRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (barRef.current) barRef.current.style.transform = `scaleY(${max > 0 ? el.scrollTop / max : 0})`;
    if (!scrolled && el.scrollTop > 40) setScrolled(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("[role=tablist]")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goClient(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goClient(-1);
    }
  };

  const pageKey = page.slices[0].src;

  return (
    <dialog
      ref={ref}
      aria-label={`${client.name}: ${page.label}`}
      onKeyDown={onKeyDown}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-[#0b0b0d]/95 p-0 backdrop:bg-black/60"
    >
      <div className="laptop-in flex h-full flex-col items-center gap-3 px-0 pt-0 text-[#fafafa] md:px-6 md:py-5">
        {/* Topo: nome, contador, fechar */}
        <div className="flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 pt-3 md:px-0 md:pt-0">
          <div className="min-w-0">
            <p className="truncate font-display text-[1.125rem] font-medium md:text-[1.375rem]">{client.name}</p>
            <p className="font-mono text-[0.8125rem] text-white/65">
              {client.segment} · <span className="tabular">{ci + 1}/{webClients.length}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-white px-5 text-[0.9375rem] text-black"
          >
            Fechar
          </button>
        </div>

        {/* Páginas do cliente */}
        {client.pages.length > 1 ? (
          <div role="tablist" aria-label="Páginas do site" className="flex w-full max-w-[1120px] gap-2 overflow-x-auto px-4 md:flex-wrap md:justify-center md:px-0">
            {client.pages.map((p, i) => (
              <button
                key={p.slices[0].src}
                type="button"
                role="tab"
                aria-selected={i === pi}
                onClick={() => goPage(i)}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-[0.875rem] transition-colors ${
                  i === pi ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Notebook (md+) / navegador em tela cheia (celular) */}
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="laptop flex h-full w-full flex-col md:h-auto">
            <div className="laptop-lid flex min-h-0 flex-1 flex-col md:flex-none">
              <span aria-hidden="true" className="laptop-camera hidden md:block" />
              <div className="laptop-screen relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
                <BrowserBar domain={page.domain} />
                <div
                  ref={screenRef}
                  onScroll={onScroll}
                  tabIndex={0}
                  aria-label={`Captura da página ${page.label}. Role para ver a página inteira.`}
                  className="web-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
                >
                  {!loaded[pageKey] ? <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-[#ececee]" /> : null}
                  {page.slices.map((s, i) => (
                    <Image
                      key={s.src}
                      src={s.src}
                      alt={i === 0 ? `Página ${page.label} do site de ${client.name}, captura completa.` : ""}
                      width={s.w}
                      height={s.h}
                      sizes="(min-width: 768px) 1120px, 100vw"
                      quality={80}
                      onLoad={i === 0 ? () => setLoaded((l) => ({ ...l, [pageKey]: true })) : undefined}
                      className="relative block h-auto w-full"
                    />
                  ))}
                </div>
                <span aria-hidden="true" className="absolute bottom-2 right-1 top-10 w-1 overflow-hidden rounded-full bg-black/10">
                  <span ref={barRef} className="block h-full w-full origin-top rounded-full bg-black/50" style={{ transform: "scaleY(0)" }} />
                </span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-[0.8125rem] text-white transition-opacity duration-500 ${
                    scrolled ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Role dentro da tela
                </span>
              </div>
            </div>
            <span aria-hidden="true" className="laptop-base hidden md:block" />
          </div>
        </div>

        {/* Cliente anterior / seguinte */}
        <div className="flex w-full max-w-[1120px] items-center justify-between gap-3 px-4 pb-3 md:px-0 md:pb-0">
          <button type="button" onClick={() => goClient(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-[0.9375rem] hover:bg-white/20">
            <span aria-hidden="true">←</span> Anterior
          </button>
          <p className="hidden font-mono text-[0.8125rem] text-white/60 md:block">← → para trocar de site · Esc para fechar</p>
          <button type="button" onClick={() => goClient(1)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-[0.9375rem] hover:bg-white/20">
            Próximo <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
