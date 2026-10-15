"use server";

import { headers } from "next/headers";
import { profile } from "@/content/profile";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error" | "unconfigured";
  message: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Valores enviados, para o formulário não perder o texto em caso de erro. */
  values?: Partial<Record<ContactField, string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 80, email: 254, message: 4000 } as const;

/*
 * Limite simples por IP: 5 envios a cada 10 minutos. Fica na memória da
 * instância (na Vercel cada função pode ter a sua), então é um freio contra
 * abuso casual, não uma garantia. Para algo robusto, use Upstash/KV.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function field(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = {
    name: field(form, "name").slice(0, LIMITS.name),
    email: field(form, "email").slice(0, LIMITS.email),
    message: field(form, "message").slice(0, LIMITS.message),
  };

  // Honeypot: pessoas não veem este campo; robôs costumam preenchê-lo.
  // Respondemos "sucesso" para não ensinar o robô a contornar.
  if (field(form, "website")) {
    return { status: "success", message: "Mensagem enviada. Obrigado!" };
  }

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (values.name.length < 2) fieldErrors.name = "Escreva seu nome (pelo menos 2 letras).";
  if (!EMAIL_RE.test(values.email)) fieldErrors.email = "Confira o e-mail: ele precisa ter o formato nome@empresa.com.";
  if (values.message.length < 10) fieldErrors.message = "Conte um pouco mais (pelo menos 10 caracteres).";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Corrija os campos marcados e envie de novo.", fieldErrors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconhecido";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  if (!apiKey) {
    return {
      status: "unconfigured",
      message: `O envio pelo formulário ainda não está ativo. Escreva direto para ${profile.email}; sua mensagem continua aqui para você copiar.`,
      values,
    };
  }

  const from = process.env.CONTACT_FROM_EMAIL || "Portfólio <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: "Veio do site de portfólio",
        text: `Nome: ${values.name}\nE-mail: ${values.email}\n\n${values.message}\n\nPara responder, é só usar "Responder": vai direto para quem escreveu.`,
        html: `<p><strong>Nome:</strong> ${escapeHtml(values.name)}<br><strong>E-mail:</strong> ${escapeHtml(values.email)}</p><p>${escapeHtml(values.message).replace(/\n/g, "<br>")}</p><p style="color:#646464">Para responder, é só usar "Responder": vai direto para quem escreveu.</p>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Resend respondeu", res.status, await res.text().catch(() => ""));
      throw new Error(`Resend ${res.status}`);
    }
  } catch (err) {
    console.error("Falha ao enviar contato", err);
    return {
      status: "error",
      message: `Não foi possível enviar agora. Tente de novo ou escreva para ${profile.email}.`,
      values,
    };
  }

  return { status: "success", message: "Mensagem enviada. Respondo em breve!" };
}
