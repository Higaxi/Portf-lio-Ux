// Chama (desafio WeFit): protótipo publicado em link escondido, em public/wefit-chama-k7x9/.
// O endereço não aparece em nenhum lugar do site: só é devolvido pela API /api/projeto-secreto
// para quem digita o nome do projeto na caixa que abre com a tecla L.
// Os dados do protótipo ficam no mesmo Redis do /escritorio (chaves chama:*), sem prazo de validade,
// para que loja, entregador e Admin em aparelhos diferentes vejam a mesma operação.

export const CAMINHO_CHAMA = "/wefit-chama-k7x9/";

// nomes aceitos na caixa "Qual o nome do projeto secreto?" (sem acento, maiúscula ou espaço)
const NOMES_SECRETOS = ["wefit"];

export function nomeConfere(nome: string) {
  const limpo = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
  return NOMES_SECRETOS.includes(limpo);
}

export const CHAVE_ESTADO = "chama:estado";
export const CHAVE_VERSAO = "chama:versao";

// tamanho máximo do estado gravado (o da demonstração tem uns 300 KB)
export const LIMITE_BYTES = 900_000;

// grava só se ninguém gravou desde a leitura (ou se for um reset, "forcar");
// devolve a nova versão, ou -1 quando outro aparelho gravou antes
export const SCRIPT_GRAVAR = `
local atual = tonumber(redis.call('GET', KEYS[2]) or '0')
if ARGV[2] ~= 'forcar' and tonumber(ARGV[1]) ~= atual then
  return -1
end
local nova = atual + 1
redis.call('SET', KEYS[1], ARGV[3])
redis.call('SET', KEYS[2], nova)
return nova
`;
