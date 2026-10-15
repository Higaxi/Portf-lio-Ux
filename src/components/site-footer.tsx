import Link from "next/link";
import { profile } from "@/content/profile";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

/** Rodapé: o nome em largura total e uma linha discreta. */
export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="mx-auto mt-32 max-w-[90rem] px-4 pb-8 md:mt-48 md:px-10">
      <p aria-hidden="true" className="select-none font-display text-[13.4vw] font-medium uppercase leading-[0.8] tracking-[-0.05em] md:text-[11.6vw] xl:text-[10.4rem]">
        {profile.handle}
      </p>
      <div className="mt-8 grid gap-3 border-t border-line pt-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <p className="label">{profile.title}</p>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-1">
          <Link href="/#projetos" className="text-link inline-flex min-h-11 items-center">
            Projetos
          </Link>
          <Link href="/#contato" className="text-link inline-flex min-h-11 items-center">
            Contato
          </Link>
        </nav>
        <p className="label tabular md:text-right">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
