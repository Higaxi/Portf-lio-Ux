import { nomesDeBanco, podeEnviar, podeVer, redis, redisPronto, SEM_INDICE } from "@/lib/escritorio";

const TRINTA_DIAS = 60 * 60 * 24 * 30;

// GET: o estado mais recente da sessão, ou o código de uma ação (?acao=<id>)
export async function GET(req: Request) {
  if (!podeVer(req)) return new Response("não encontrado", { status: 404, headers: SEM_INDICE });
  if (!redisPronto()) return Response.json({ erro: "o escritório ainda não foi configurado na Vercel" }, { headers: SEM_INDICE });
  const acao = new URL(req.url).searchParams.get("acao");
  const [r] = await redis([["GET", acao ? `escritorio:acao:${acao}` : "escritorio:estado"]]);
  if (typeof r?.result !== "string") return Response.json({ erro: acao ? "ação não encontrada" : "o bar ainda não abriu: nenhuma sessão enviada" }, { status: acao ? 404 : 200, headers: SEM_INDICE });
  return new Response(r.result, { headers: { ...SEM_INDICE, "Content-Type": "application/json; charset=utf-8" } });
}

// POST: o computador do Higaxi manda { estado, acoes: { id: {nome, input, resultado} } }
export async function POST(req: Request) {
  if (!podeEnviar(req)) return new Response("não autorizado", { status: 401 });
  if (!redisPronto()) return Response.json({ erro: "Redis não configurado", variaveis: nomesDeBanco() }, { status: 500 });
  const corpo = (await req.json()) as { estado?: unknown; acoes?: Record<string, unknown> };
  const comandos: (string | number)[][] = [];
  if (corpo.estado) comandos.push(["SET", "escritorio:estado", JSON.stringify({ ...(corpo.estado as object), enviadoEm: Date.now() })]);
  for (const [id, a] of Object.entries(corpo.acoes || {})) {
    if (!/^[\w-]{1,80}$/.test(id)) continue;
    comandos.push(["SET", `escritorio:acao:${id}`, JSON.stringify(a), "EX", TRINTA_DIAS]);
  }
  if (comandos.length) await redis(comandos);
  return Response.json({ ok: true, gravados: comandos.length });
}
