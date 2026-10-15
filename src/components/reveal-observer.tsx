"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Animação de entrada de [data-reveal], como melhoria progressiva: o conteúdo
 * já está visível; só os elementos que ainda estão ABAIXO da tela ganham a
 * animação, disparada um pouco antes de entrarem na viewport. Nada fica
 * escondido sem JS, para buscadores, na impressão ou com movimento reduzido.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const vh = window.innerHeight;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top > vh,
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-playing");
            io.unobserve(entry.target);
          }
        }
      },
      // Dispara quando o elemento está a 12% da altura da tela de aparecer.
      { rootMargin: "0px 0px 12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
