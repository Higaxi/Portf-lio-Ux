// Escritório do Boteco (/escritorio): página escondida que mostra a sessão do Claude Code do Canastrium ao vivo.
// O computador do Higaxi envia o estado (tools/escritorio/servidor.js no repositório do jogo) e ele fica guardado no Redis da Vercel.
// Variáveis na Vercel: REDIS_URL (banco Redis) ou UPSTASH_REDIS_REST_URL/TOKEN (Upstash, aceita prefixo), ESCRITORIO_TOKEN (quem envia)
// e ESCRITORIO_CHAVE (opcional: com ela a página só abre com ?chave=...).
import { createClient, type RedisClientType } from "redis";

// a integração pode pôr um prefixo nos nomes (o do banco, ex.: OBARDOSEUZE_KV_REST_API_URL): aceita qualquer prefixo
function variavel(fim: RegExp) {
  const nome = Object.keys(process.env).find((k) => fim.test(k) && !/READ_ONLY/.test(k));
  return nome ? process.env[nome] || "" : "";
}
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || variavel(/(REST_API_URL|REDIS_REST_URL)$/);
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || variavel(/(REST_API_TOKEN|REDIS_REST_TOKEN)$/);
export const COOKIE = "escritorio_chave";

// o banco "Redis" da Vercel entrega só uma REDIS_URL (conexão TCP); o Upstash entrega a API REST acima
// com prefixo próprio o nome muda (ex.: OBARDOSEUZE_URL); por isso vale também qualquer variável cujo valor seja redis://
const REDIS_TCP = process.env.REDIS_URL || variavel(/(^|_)REDIS_URL$/) || Object.values(process.env).find((v) => /^rediss?:\/\//.test(v || "")) || "";

// para quem tem o token: os NOMES (nunca os valores) das variáveis que parecem de banco, para achar o que faltou
export const nomesDeBanco = () => Object.keys(process.env).filter((k) => /REDIS|KV_|UPSTASH|STORAGE|DATABASE|OBARDO/i.test(k));
export const redisPronto = () => Boolean((REDIS_URL && REDIS_TOKEN) || REDIS_TCP);

// uma conexão por instância da função, reaproveitada entre pedidos
let cliente: Promise<RedisClientType> | null = null;
function conectar() {
  if (!cliente) cliente = createClient({ url: REDIS_TCP }).connect() as Promise<RedisClientType>;
  return cliente.catch((e) => { cliente = null; throw e; });
}

// comandos do Redis, vários de uma vez (REST do Upstash ou conexão direta)
export async function redis(comandos: (string | number)[][]): Promise<{ result?: unknown; error?: string }[]> {
  if (!(REDIS_URL && REDIS_TOKEN)) {
    const c = await conectar();
    return Promise.all(comandos.map((cmd) => c.sendCommand(cmd.map(String)).then((result) => ({ result }))));
  }
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
