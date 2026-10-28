"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";

type Tab = { id: string; label: string; panel: ReactNode };

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener("cat-change", cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener("cat-change", cb);
  };
}

/**
 * Abas acessíveis (padrão WAI-ARIA): role=tablist, setas ←/→, Home/End,
 * tabindex móvel. A aba ativa fica na URL (?cat=marca) para compartilhar.
 * Os painéis são renderizados no servidor; só o visível aparece.
 */
export function CategoryTabs({ heading, tabs, extra }: { heading: ReactNode; tabs: Tab[]; extra?: ReactNode }) {
  const ids = tabs.map((t) => t.id);
  const active = useSyncExternalStore(
    subscribe,
    () => {
      const c = new URLSearchParams(window.location.search).get("cat");
      return c && ids.includes(c) ? c : ids[0];
    },
    () => ids[0],
  );
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: string, focus = false) => {
    const url = new URL(window.location.href);
    if (id === ids[0]) url.searchParams.delete("cat");
    else url.searchParams.set("cat", id);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event("cat-change"));
    if (focus) refs.current[ids.indexOf(id)]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % ids.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    if (next >= 0) {
      e.preventDefault();
      select(ids[next], true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        {heading}
        <div className="-mx-1 flex flex-wrap items-center gap-2 px-1">
        <div role="tablist" aria-label="Categorias de projetos" className="flex flex-wrap gap-2">
          {tabs.map((t, i) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`painel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] transition-colors ${
                  selected ? "bg-ink text-bg" : "bg-surface text-ink hover:bg-surface-2"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {extra}
        </div>
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`painel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="tab-panel mt-10 focus-visible:outline-offset-8"
        >
          {t.panel}
        </div>
      ))}
    </>
  );
}
