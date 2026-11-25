"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Projeto secreto: a tecla L (fora de campos de texto) abre uma caixa que pergunta
 * o nome do projeto. Com o nome certo, a API devolve o endereço escondido e a página abre.
 * O endereço não fica no código do site: só a API conhece.
 */
export function SecretProject() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tituloId = useId();
  const erroId = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key.toLowerCase() !== "l" || e.ctrlKey || e.metaKey || e.altKey) return;
      const alvo = e.target as HTMLElement | null;
      const digitando = alvo?.closest("input, textarea, select, [contenteditable='true']");
      if (digitando) return;
      e.preventDefault();
      setErro("");
      setOpen(true);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function confirmar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || enviando) return;
    setEnviando(true);
    setErro("");
    try {
      const res = await fetch("/api/projeto-secreto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      const corpo = (await res.json()) as { destino?: string; erro?: string };
      if (!res.ok || !corpo.destino) {
        setErro(corpo.erro ?? "Não é esse o nome.");
        return;
      }
      window.location.href = corpo.destino;
    } catch {
      setErro("Sem conexão. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        onSubmit={confirmar}
        className="w-full max-w-sm rounded-2xl border border-line bg-bg p-6 shadow-2xl"
      >
        <label id={tituloId} htmlFor={`${tituloId}-nome`} className="font-display text-xl font-medium">
          Qual o nome do projeto secreto?
        </label>
        <input
          ref={inputRef}
          id={`${tituloId}-nome`}
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            setErro("");
          }}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? erroId : undefined}
          className="mt-4 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-ink"
        />
        {erro && (
          <p id={erroId} className="mt-2 text-sm text-danger">
            {erro}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-11 rounded-full px-5 text-muted hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando || !nome.trim()}
            className="min-h-11 rounded-full bg-ink px-5 text-bg disabled:opacity-50"
          >
            {enviando ? "Abrindo…" : "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
}
