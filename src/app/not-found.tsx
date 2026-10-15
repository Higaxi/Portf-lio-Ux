import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="mx-auto flex min-h-[70vh] max-w-[90rem] flex-col justify-center px-4 md:px-10">
        <p className="label">Erro 404</p>
        <h1 className="mt-3 font-display text-[clamp(3rem,10vw,9rem)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">
          Página não encontrada
        </h1>
        <p className="mt-6 max-w-[44ch] text-lead">O endereço pode ter mudado. Os projetos continuam na página inicial.</p>
        <Link href="/#projetos" className="btn-primary mt-10 self-start">
          Ver projetos
        </Link>
      </main>
    </>
  );
}
