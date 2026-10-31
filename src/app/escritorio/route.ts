import { COOKIE, podeVer, SEM_INDICE } from "@/lib/escritorio";
import { PAGINA } from "./pagina";

// /escritorio: página escondida (nenhum link no portfólio, fora do sitemap, noindex). A página vem de pagina.ts,
// gerado por tools/escritorio/levar-portfolio.js no repositório do Canastrium.
export async function GET(req: Request) {
  if (!podeVer(req)) return new Response("não encontrado", { status: 404, headers: SEM_INDICE });
  const headers: Record<string, string> = { ...SEM_INDICE, "Content-Type": "text/html; charset=utf-8" };
  const chave = new URL(req.url).searchParams.get("chave");
  if (chave && process.env.ESCRITORIO_CHAVE) headers["Set-Cookie"] = `${COOKIE}=${encodeURIComponent(chave)}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;
  return new Response(PAGINA, { headers });
}
