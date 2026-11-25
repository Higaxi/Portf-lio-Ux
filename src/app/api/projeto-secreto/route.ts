import { DESTINO_SECRETO, nomeConfere } from "@/lib/chama";
import { SEM_INDICE } from "@/lib/escritorio";

// POST { nome }: se for o nome do projeto secreto, devolve o endereço escondido (que não está no código do site)
export async function POST(req: Request) {
  const corpo = (await req.json().catch(() => ({}))) as { nome?: unknown };
  const nome = typeof corpo.nome === "string" ? corpo.nome.slice(0, 60) : "";
  if (!nomeConfere(nome)) {
    return Response.json({ erro: "Não é esse o nome." }, { status: 404, headers: SEM_INDICE });
  }
  return Response.json({ destino: DESTINO_SECRETO }, { headers: SEM_INDICE });
}
