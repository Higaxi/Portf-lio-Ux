// Escritório do Boteco (/escritorio): página escondida que mostra a sessão do Claude Code do Canastrium ao vivo.
// O computador do Higaxi envia o estado (tools/escritorio/servidor.js no repositório do jogo) e ele fica guardado no Upstash Redis.
// Variáveis na Vercel: UPSTASH_REDIS_REST_URL/TOKEN (ou KV_REST_API_URL/TOKEN, da integração), ESCRITORIO_TOKEN (quem envia)
// e ESCRITORIO_CHAVE (opcional: com ela a página só abre com ?chave=...).

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
export const COOKIE = "escritorio_chave";

export const redisPronto = () => Boolean(REDIS_URL && REDIS_TOKEN);

// comandos do Redis pela API REST do Upstash, vários de uma vez
export async function redis(comandos: (string | number)[][]): Promise<{ result?: unknown; error?: string }[]> {
  const res = await fetch(`${REDIS_URL.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(comandos),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis respondeu ${res.status}`);
  return res.json();
}

function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// quem pode ver: sem ESCRITORIO_CHAVE fica aberto; com ela, vale ?chave=... ou o cookie que a página grava
export function podeVer(req: Request) {
  const chave = process.env.ESCRITORIO_CHAVE;
  if (!chave) return true;
  const url = new URL(req.url);
  const doLink = url.searchParams.get("chave") || "";
  const doCookie = (req.headers.get("cookie") || "").split(/;\s*/).find((c) => c.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1) || "";
  return iguais(doLink, chave) || iguais(decodeURIComponent(doCookie), chave);
}

// quem pode enviar: só o computador do Higaxi, com o ESCRITORIO_TOKEN
export function podeEnviar(req: Request) {
  const token = process.env.ESCRITORIO_TOKEN;
  if (!token) return false;
  const h = req.headers.get("authorization") || "";
  return iguais(h.replace(/^Bearer\s+/i, ""), token);
}

export const SEM_INDICE = { "X-Robots-Tag": "noindex, nofollow, noarchive", "Cache-Control": "no-store" };
