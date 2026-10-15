import { profile } from "@/content/profile";
import { ContactForm } from "./contact-form";
import { RollText } from "./roll-text";

/** Contato: links grandes (o caminho mais curto) e o formulário ao lado. */
export function Contact() {
  const links = [
    ...profile.socials.map((s) => ({ label: s.label, href: s.href, detail: s.href.replace(/^https?:\/\/(www\.)?/, ""), external: true })),
    { label: "E-mail", href: `mailto:${profile.email}`, detail: profile.email, external: false },
  ];

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="mx-auto max-w-[90rem] px-4 pt-28 md:px-10 md:pt-40">
      <h2 id="contato-titulo" className="font-display text-display font-medium uppercase tracking-[-0.045em]">
        Vamos conversar!
      </h2>
      <p className="mt-6 max-w-[48ch] text-lead">
        {profile.availability} Também aceito projetos freelance.
      </p>

      <div className="mt-14 grid gap-16 md:grid-cols-12 md:gap-x-6">
        <ul className="md:col-span-7">
          {links.map((l) => (
            <li key={l.label} className="border-b border-line first:border-t">
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4"
              >
                <span className="font-display text-head font-medium uppercase tracking-tight">
                  <RollText>{l.label}</RollText>
                </span>
                <span className="label break-all">
                  {l.detail}
                  {l.external ? <span className="sr-only"> (abre em nova aba)</span> : null}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="md:col-span-5">
          <h3 className="text-lead">Ou deixe uma mensagem</h3>
          <p className="label mt-1">Respondo pelo e-mail que você informar.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
