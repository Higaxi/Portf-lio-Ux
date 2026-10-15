"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

/** Alterna entre tema claro e escuro e lembra a escolha. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);

  function toggle() {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
    listeners.forEach((l) => l());
  }


  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : theme === "dark"}
      className={`inline-flex min-h-11 items-center text-muted transition-colors hover:text-ink aria-pressed:text-ink aria-pressed:underline aria-pressed:underline-offset-4 ${className}`}
    >
      <span className="roll">
        <span>Tema escuro</span>
        <span aria-hidden="true">Tema escuro</span>
      </span>
    </button>
  );
}
