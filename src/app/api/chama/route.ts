import { CHAVE_ESTADO, CHAVE_VERSAO, LIMITE_BYTES, SCRIPT_GRAVAR } from "@/lib/chama";
import { nomesDeBanco, redis, redisPronto, SEM_INDICE } from "@/lib/escritorio";

// Serviço do protótipo Chama (desafio WeFit): o estado da operação mockada, compartilhado entre aparelhos.

const SEM_REDIS = { erro: "Redis não configurado na Vercel" };

// erro de conexão com o Redis: devolve só a mensagem e os NOMES das variáveis (nunca os valores)
function falhaRedis(e: unknown) {
  const mensagem = e instanceof Error ? e.message : String(e);
  return Response.json({ erro: `Redis indisponível: ${mensagem.slice(0, 160)}`, variaveis: nomesDeBanco() }, { status: 503, headers: SEM_INDICE });
}

// GET: o estado atual e a versão (estado null na primeira vez: o protótipo cria os dados de demonstração)
export async function GET() {
  if (!redisPronto()) return Response.json(SEM_REDIS, { status: 503, headers: SEM_INDICE });
  let estado, versao;
  try {
    [estado, versao] = await redis([["GET", CHAVE_ESTADO], ["GET", CHAVE_VERSAO]]);
  } catch (e) {
    return falhaRedis(e);
  }
  return new Response(
    `{"versao":${Number(versao?.result ?? 0) || 0},"estado":${typeof estado?.result === "string" ? estado.result : "null"}}`,
    { headers: { ...SEM_INDICE, "Content-Type": "application/json; charset=utf-8" } },
  );
}

// PUT: { estado, forcar? } grava se a versão lida ainda for a atual (409 se outro aparelho gravou antes)
export async function PUT(req: Request) {
  if (!redisPronto()) return Response.json(SEM_REDIS, { status: 503, headers: SEM_INDICE });
  const texto = await req.text();
  if (texto.length > LIMITE_BYTES) return Response.json({ erro: "estado grande demais" }, { status: 413, headers: SEM_INDICE });
  let corpo: { estado?: { versao?: number; entregas?: unknown }; forcar?: boolean };
  try {
    corpo = JSON.parse(texto);
  } catch {
    return Response.json({ erro: "JSON inválido" }, { status: 400, headers: SEM_INDICE });
  }
  const estado = corpo.estado;
  if (!estado || typeof estado !== "object" || !Array.isArray(estado.entregas)) {
    return Response.json({ erro: "estado inválido" }, { status: 400, headers: SEM_INDICE });
  }
  const lida = Number(estado.versao ?? 0) || 0;
  let r;
  try {
    [r] = await redis([
    ["EVAL", SCRIPT_GRAVAR, 2, CHAVE_ESTADO, CHAVE_VERSAO, lida, corpo.forcar ? "forcar" : "normal", JSON.stringify(estado)],
    ]);
  } catch (e) {
    return falhaRedis(e);
  }
  if (r?.error) return Response.json({ erro: r.error }, { status: 500, headers: SEM_INDICE });
  const versao = Number(r?.result);
  if (versao < 0) return Response.json({ erro: "conflito" }, { status: 409, headers: SEM_INDICE });
  return Response.json({ ok: true, versao }, { headers: SEM_INDICE });
}
