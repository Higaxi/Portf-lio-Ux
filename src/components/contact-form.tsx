"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContact, type ContactField, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { status: "idle", message: "" };

const inputClass =
  "mt-2 block w-full min-h-12 rounded-lg bg-surface px-4 py-3 text-body text-ink border border-transparent placeholder:text-muted hover:border-line focus-visible:border-ink aria-[invalid=true]:border-danger";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
    if (state.status === "error" && state.fieldErrors) {
      const first = Object.keys(state.fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else if (state.status !== "idle") {
      statusRef.current?.focus();
    }
  }, [state]);

  const err = (f: ContactField) => state.fieldErrors?.[f];
  const val = (f: ContactField) => (state.status === "success" ? "" : (state.values?.[f] ?? ""));

  return (
    <form ref={formRef} action={formAction} noValidate className="mt-6 flex flex-col gap-4">
      {(["name", "email", "message"] as const).map((f) => {
        const id = `contato-${f}`;
        const label = { name: "Nome", email: "E-mail", message: "Mensagem" }[f];
        const common = {
          id,
          name: f,
          required: true,
          defaultValue: val(f),
          "aria-invalid": err(f) ? true : undefined,
          "aria-describedby": err(f) ? `${id}-erro` : undefined,
          className: inputClass,
        };
        return (
          <div key={`${f}-${state.status}-${state.message}`}>
            <label htmlFor={id} className="label">
              {label}
            </label>
            {f === "message" ? (
              <textarea {...common} rows={4} maxLength={4000} className={`${inputClass} resize-y`} />
            ) : (
              <input
                {...common}
                type={f === "email" ? "email" : "text"}
                autoComplete={f === "email" ? "email" : "name"}
                spellCheck={f === "email" ? false : undefined}
                maxLength={f === "email" ? 254 : 80}
              />
            )}
            {err(f) ? (
              <p id={`${id}-erro`} className="mt-2 text-[0.9375rem] text-danger">
                {err(f)}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Honeypot: escondido de pessoas e de leitores de tela. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="contato-website">Não preencha este campo</label>
        <input id="contato-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={state.status === "error" ? "alert" : "status"}
        className="text-body outline-none empty:hidden"
      >
        {state.message ? (
          <p className={state.status === "error" ? "text-danger" : "text-ink"}>{state.message}</p>
        ) : null}
      </div>

      <button type="submit" disabled={pending} className="btn-primary mt-2 min-h-14 w-full">
        {pending ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
