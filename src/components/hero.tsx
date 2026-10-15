import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { KeywordPhysics } from "./keyword-physics";

/**
 * Primeira tela: as palavras caem numa faixa e pousam sobre o nome; abaixo,
 * a foto, o número grande, a apresentação e as ações.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-nome" className="mx-auto max-w-[90rem] px-4 pt-6 md:px-10 md:pt-10">
      <p className="label uppercase">{profile.title}</p>

      <div className="mt-3 h-[8.5rem] sm:h-[10rem] md:h-[12.5rem] lg:h-[14rem]">
        <KeywordPhysics words={profile.keywords} label="Áreas de atuação" />
      </div>

      <h1
        id="hero-nome"
        className="mt-2 font-display text-[20vw] font-medium uppercase leading-[0.86] tracking-[-0.045em] md:text-[11.2vw] xl:text-[12vw] 2xl:text-[10.75rem]"
      >
        {profile.name}
      </h1>

      <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:items-center md:gap-x-6">
        <div className="flex items-center gap-5 md:col-span-4">
          <Image
            src="/mateus-higashie.webp"
            alt="Foto de Mateus Higashie"
            width={400}
            height={400}
            preload
            sizes="(min-width: 768px) 164px, 112px"
            className="size-28 shrink-0 rounded-full bg-surface object-cover md:size-[10.25rem]"
          />
          <p>
            <span className="block font-display text-head font-medium tracking-tight">{profile.highlight.value}</span>
            <span className="label">{profile.highlight.label}</span>
          </p>
        </div>
        <div className="flex flex-col gap-6 md:col-span-7 md:col-start-6">
          <p className="max-w-[44ch] text-lead">{profile.intro}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="#projetos" className="btn-primary">
              Ver projetos
            </Link>
            <Link href="#contato" className="text-link inline-flex min-h-11 items-center">
              Vamos conversar
            </Link>
            <span className="label">
              {profile.location} · {profile.availability}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
