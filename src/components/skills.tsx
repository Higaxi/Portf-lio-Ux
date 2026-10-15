import { profile } from "@/content/profile";

/** Competências em três grupos e a lista de ferramentas. */
export function Skills() {
  return (
    <section
      id="habilidades"
      aria-labelledby="habilidades-titulo"
      className="mx-auto max-w-[90rem] px-4 pt-28 md:px-10 md:pt-40"
    >
      <h2 id="habilidades-titulo" className="border-b border-line pb-6 font-display text-head font-medium uppercase tracking-tight">
        Competências
      </h2>
      <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-x-6">
        {profile.skills.map((g, gi) => (
          <div key={g.name} data-reveal style={{ "--i": gi } as React.CSSProperties}>
            <h3 className="text-lead">{g.name}</h3>
            <p className="label mt-1">{g.summary}</p>
            <ul className="mt-6 flex flex-col">
              {g.items.map((s) => (
                <li key={s.name} className="border-t border-line py-3">
                  <span className="block text-body">{s.name}</span>
                  <span className="block text-[0.9375rem] leading-snug text-muted">{s.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-x-6" data-reveal>
        <h3 className="label md:col-span-3">Ferramentas</h3>
        <ul className="flex flex-wrap gap-2 md:col-span-9">
          {profile.tools.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
