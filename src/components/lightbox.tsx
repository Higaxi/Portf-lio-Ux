"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/content/brand-cases";

/**
 * Lightbox em tela cheia que vira carrossel: setas, swipe, teclado
 * (← → Esc), contador "3/17". Usa <dialog> nativo (foco preso pelo
 * navegador); ao fechar, o foco volta ao elemento que abriu.
 * Imagens altas: "Ajustar à tela" ou "Tamanho real" (rolagem vertical).
 * Renderize só quando estiver aberto: <Lightbox start={i} ... />.
 */
export function Lightbox({
  images,
  start,
  onClose,
  label,
}: {
  images: GalleryImage[];
  start: number;
  onClose: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState(start);
  const [actual, setActual] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    opener.current = document.activeElement as HTMLElement | null;
    if (!d.open) d.showModal();
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent((c) => (c + dir + images.length) % images.length);
      setActual(false);
    },
    [images.length],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const img = images[current];

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onKeyDown={onKeyDown}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#0b0b0d] p-0 text-[#fafafa] backdrop:bg-black/80"
    >
      {img ? (
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6">
            <p className="tabular font-mono text-[0.875rem]" aria-live="polite">
              {current + 1}/{images.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActual((v) => !v)}
                aria-pressed={actual}
                className="inline-flex min-h-11 items-center rounded-full bg-white/10 px-4 text-[0.9375rem] transition-colors hover:bg-white/20"
              >
                {actual ? "Ajustar à tela" : "Tamanho real"}
              </button>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-[0.9375rem] text-black"
              >
                Fechar
              </button>
            </div>
          </div>

          <div
            className={`relative min-h-0 flex-1 ${actual ? "overflow-auto" : "overflow-hidden"}`}
            onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
            onTouchEnd={(e) => {
              const t = touch.current;
              touch.current = null;
              if (!t) return;
              const dx = e.changedTouches[0].clientX - t.x;
              const dy = e.changedTouches[0].clientY - t.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
            }}
          >
            {actual ? (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes={`(min-width: ${img.width}px) ${img.width}px, 100vw`}
                className="mx-auto h-auto w-full"
                style={{ maxWidth: img.width }}
              />
            ) : (
              // Ajusta à tela sem nunca passar da resolução nativa da imagem.
              <div className="flex h-full w-full items-center justify-center p-2 md:p-6">
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes={`(min-width: ${img.width}px) ${img.width}px, 100vw`}
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                  style={{ maxWidth: `min(100%, ${img.width}px)` }}
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[1.25rem] transition-colors hover:bg-white/20"
            >
              <span aria-hidden="true">←</span>
            </button>
            <p className="line-clamp-2 max-w-[60ch] text-center text-[0.875rem] text-white/75">{img.alt}</p>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[1.25rem] transition-colors hover:bg-white/20"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
