import { profile } from "@/content/profile";
import { isTodo, showTodos } from "@/lib/todo";

/** Sobre: a frase, dois blocos curtos, o objetivo e uma nota pessoal. */
export function About() {
  const personal = profile.about.personal;
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="mx-auto max-w-[90rem] px-4 pt-28 md:px-10 md:pt-40">
      <h2 id="sobre-titulo" className="border-b border-line pb-6 font-display text-head font-medium uppercase tracking-tight">
        Sobre
      </h2>
      <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-x-6">
        <p data-reveal className="text-head md:col-span-6 md:pr-8">
          {profile.about.statement}
        </p>
        <div className="flex flex-col gap-10 md:col-span-5 md:col-start-8">
          {profile.about.blocks.map((b, i) => (
            <div key={b.title} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
              <h3 className="label">{b.title}</h3>
              <p className="mt-2 text-body">{b.text}</p>
            </div>
          ))}
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <h3 className="label">Próximo passo</h3>
            <p className="mt-2 text-body">{profile.goal}</p>
          </div>
          {!isTodo(personal) || showTodos ? (
            <div data-reveal style={{ "--i": 4 } as React.CSSProperties}>
              <h3 className="label">Fora do trabalho</h3>
              <p className={`mt-2 text-body ${isTodo(personal) ? "bg-surface p-3 font-mono text-[0.875rem]" : ""}`}>
                {personal}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
