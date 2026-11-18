"use client";

import { useEffect, useRef, useState } from "react";

// Tamanho do celular no HTML do protótipo (.celular com a moldura), em pixels.
const PHONE_W = 412;
const PHONE_H = 866;

/** Fundo da caixa de cada protótipo: tons claros da marca, para o celular se destacar. */
const BACKDROP: Record<string, string> = {
  pormade: "linear-gradient(160deg, #f1faf4 0%, #d8f1e1 100%)",
  "premium-league": "linear-gradient(160deg, #f2f5ff 0%, #dbe3ff 100%)",
  "pode-regularizar": "linear-gradient(160deg, #fff5ec 0%, #e6efff 100%)",
  "hora-do-lar-funcionario": "linear-gradient(160deg, #fff7f0 0%, #ffe3cf 100%)",
  "hora-do-lar-empregador": "linear-gradient(160deg, #fff4ea 0%, #f0e5fb 100%)",
  "angel-investor": "linear-gradient(160deg, #f5f1ff 0%, #e3d9ff 100%)",
  akamai: "linear-gradient(160deg, #eef7fe 0%, #d6e6fb 100%)",
};

/**
 * Protótipo navegável: o HTML de public/prototipos/<id>/ embutido num iframe.
 *
 * - O iframe abre no modo ?embed: só o celular, fundo transparente.
 * - A caixa em volta leva as cores da marca do protótipo.
 * - Escala para caber na coluna sem rolagem horizontal; nunca passa de 100%.
 * - Carrega só quando chega perto da tela (loading="lazy").
 * - Rotulado como recriação: não são as telas originais.
 */
export function NavigablePrototype({ id, title }: { id: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [scale, setScale] = useState(1);
  const [open, setOpen] = useState(false);
  const [bigScale, setBigScale] = useState(1);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / PHONE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tela cheia num <dialog> por cima do site: o celular ocupa a altura da janela.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (!open) {
      if (d.open) d.close();
      return;
    }
    const fit = () => setBigScale(Math.min(1.3, (window.innerHeight - 96) / PHONE_H, (window.innerWidth - 32) / PHONE_W));
    fit();
    d.showModal();
    // O protótipo avisa quando apertam Esc com o foco dentro dele (o teclado fica no iframe).
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data === "fechar-prototipo") setOpen(false);
    };
    window.addEventListener("resize", fit);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("message", onMsg);
    };
  }, [open]);

  // O Next serve arquivos de public/, não o index de uma pasta: o caminho aponta para o arquivo.
  const src = `/prototipos/${id}/index.html`;

  return (
    <figure className="flex flex-col items-center gap-5 rounded-2xl px-4 py-8 text-[#111] md:py-10" style={{ background: BACKDROP[id] ?? "#111" }}>
      <div ref={boxRef} className="w-full max-w-[412px]">
        <div className="relative mx-auto overflow-hidden" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
          <iframe
            src={`${src}?embed`}
            title={title}
            loading="lazy"
            className="absolute left-0 top-0 origin-top-left border-0"
            // colorScheme igual ao do protótipo: com esquemas diferentes (site no tema
            // escuro), o navegador pinta um fundo opaco atrás do iframe.
            style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})`, background: "transparent", colorScheme: "light" }}
          />
        </div>
      </div>

      <figcaption className="flex w-full max-w-[34rem] flex-col items-center gap-3 text-center">
        <p className="text-body text-[#111]">
          <strong>Resultado final navegável.</strong> Toque nas telas para percorrer o fluxo.
        </p>
        <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center rounded-full bg-[#111] px-5 text-[0.9375rem] font-medium text-white">
          Abrir em tela cheia
        </button>
        <p className="label text-[#111]/70">Protótipo recriado a partir do case. Não são as telas originais; nomes e valores são fictícios.</p>
      </figcaption>

      <dialog
        ref={dialogRef}
        aria-label={title}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 p-0 backdrop:bg-black/70"
        style={{ background: BACKDROP[id] ?? "#111" }}
      >
        {open ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
            <div className="relative overflow-hidden" style={{ width: PHONE_W * bigScale, height: PHONE_H * bigScale }}>
              <iframe
                src={`${src}?embed`}
                title={title}
                className="absolute left-0 top-0 origin-top-left border-0"
                style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${bigScale})`, background: "transparent", colorScheme: "light" }}
              />
            </div>
            <p className="text-[0.8125rem] text-[#111]/70">Esc ou toque fora para fechar</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar protótipo"
          className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-[#111] text-[1.25rem] text-white shadow-lg"
        >
          ×
        </button>
      </dialog>
    </figure>
  );
}
