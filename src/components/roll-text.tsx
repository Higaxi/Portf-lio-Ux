/**
 * Texto com efeito "roll" no hover/foco do link ou botão pai: o texto sobe e
 * uma cópia entra por baixo. A cópia é aria-hidden.
 */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
