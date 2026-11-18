"use client";

import { useEffect, useRef, useState } from "react";

// Tamanho do celular no HTML do protótipo (.celular com a moldura), em pixels.
const PHONE_W = 412;
const PHONE_H = 866;

/**
 * Protótipo navegável: o HTML de public/prototipos/<id>/ embutido num iframe.
 *
 * - O iframe abre no modo ?embed (só o celular, fundo transparente).
 * - Escala para caber na coluna sem rolagem horizontal; nunca passa de 100%.
 * - Carrega só quando chega perto da tela (loading="lazy").
 * - Rotulado como recriação: não são as telas originais.
 */
export function NavigablePrototype({ id, title }: { id: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / PHONE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // O Next serve arquivos de public/, não o index de uma pasta: o caminho aponta para o arquivo.
  const src = `/prototipos/${id}/index.html`;

  return (
    <figure className="flex flex-col items-center gap-5 rounded-2xl bg-surface px-4 py-8 md:py-10">
      <div ref={boxRef} className="w-full max-w-[412px]">
        <div className="relative mx-auto overflow-hidden" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
          <iframe
            src={`${src}?embed`}
            title={title}
            loading="lazy"
            className="absolute left-0 top-0 origin-top-left border-0"
            style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})`, background: "transparent" }}
          />
        </div>
      </div>

      <figcaption className="flex w-full max-w-[34rem] flex-col items-center gap-3 text-center">
        <p className="text-body">
          <strong>Resultado final navegável.</strong> Toque nas telas para percorrer o fluxo.
        </p>
        <a href={src} target="_blank" rel="noopener" className="btn-quiet !bg-bg">
          Abrir em tela cheia
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
        <p className="label">Protótipo recriado a partir do case. Não são as telas originais; nomes e valores são fictícios.</p>
      </figcaption>
    </figure>
  );
}
