import Link from "next/link";
import { profile } from "@/content/profile";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

/** Rodapé discreto: nome e título, links de contato e o ano. */
export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="mx-auto mt-32 max-w-[90rem] px-4 pb-8 md:mt-48 md:px-10">
      <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <p>
          <span className="block text-body">{profile.name}</span>
          <span className="label">{profile.title}</span>
        </p>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-1">
          <Link href="/#projetos" className="text-link inline-flex min-h-11 items-center">
            Projetos
          </Link>
          {profile.socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex min-h-11 items-center">
              {s.label}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ))}
          <a href={`mailto:${profile.email}`} className="text-link inline-flex min-h-11 items-center">
            E-mail
          </a>
        </nav>
        <p className="label tabular md:text-right">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
