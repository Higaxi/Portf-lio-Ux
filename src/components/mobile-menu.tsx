"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { navLinks } from "@/content/nav";
import { ThemeToggle } from "./theme-toggle";
import { ResumeButton } from "./resume-button";

/** Menu do celular: um botão que abre a lista de âncoras. Esc fecha. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="relative z-40 inline-flex min-h-11 min-w-11 items-center justify-end"
      >
        {open ? "Fechar" : "Menu"}
      </button>
      <div id={panelId} hidden={!open} className="fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-bg px-4 pt-20">
        <nav aria-label="Principal no celular">
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-center font-display text-head font-medium uppercase"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ResumeButton className="mt-8 w-full" />
        <ResumeButton lang="en" variant="quiet" className="mt-3 min-h-12 w-full justify-center" />
        <ThemeToggle className="mt-6" />
      </div>
    </div>
  );
}
