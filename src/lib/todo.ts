/** Textos que começam com "TODO" são pendências do conteúdo. */
export const isTodo = (text: string | undefined | null): boolean => !text || text.trim().startsWith("TODO");

/** Em desenvolvimento mostramos as pendências; em produção, escondemos. */
export const showTodos = process.env.NODE_ENV !== "production";

/** Filtra pendências em produção. */
export function published<T extends string>(texts: T[]): T[] {
  return showTodos ? texts : texts.filter((t) => !isTodo(t));
}
