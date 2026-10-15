"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fallback das animações por dobra para navegadores SEM scroll-driven
 * animations (animation-timeline). Onde há suporte, o CSS faz tudo sozinho.
 *
 * Alterna .is-in quando o elemento entra e quando sai da tela, nos dois
 * sentidos. Sem JS ou com movimento reduzido, nada é escondido.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // O que já está na tela começa visível (sem piscar).
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-in");
    });
    root.classList.add("reveal-io");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle("is-in", entry.isIntersecting);
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("reveal-io");
    };
  }, [pathname]);

  return null;
}
