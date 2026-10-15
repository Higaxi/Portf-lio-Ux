import Link from "next/link";
import { profile } from "@/content/profile";
import { KeywordPhysics } from "./keyword-physics";

/**
 * Primeira tela: rótulo, o nome em tamanho de cartaz, a foto redonda, a
 * apresentação em primeira pessoa com o número grande e as palavras soltas.
 */
export function Hero() {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section aria-labelledby="hero-nome" className="mx-auto max-w-[90rem] px-4 pt-10 md:px-10 md:pt-16">
      <p className="label uppercase">{profile.title}</p>
      <h1
        id="hero-nome"
        className="mt-3 font-display text-[20vw] font-medium uppercase leading-[0.86] tracking-[-0.045em] md:text-[11.2vw] xl:text-[12vw] 2xl:text-[10.75rem]"
      >
        {profile.name}
      </h1>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-x-6">
        <div className="flex flex-col gap-8 md:col-span-5">
          <div className="flex items-center gap-5">
            {/* TODO: troque o monograma por uma foto sua (next/image, 164×164, rounded-full). */}
            <div
              role="img"
              aria-label={`Monograma de ${profile.name}`}
              className="flex size-28 shrink-0 items-center justify-center rounded-full bg-surface font-display text-[2.5rem] font-medium md:size-[10.25rem] md:text-[4rem]"
            >
              {initials}
            </div>
            <p>
              <span className="block font-display text-head font-medium tracking-tight">{profile.highlight.value}</span>
              <span className="label">{profile.highlight.label}</span>
            </p>
          </div>
          <p className="max-w-[40ch] text-lead">{profile.intro}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="#projetos" className="btn-primary">
              Ver projetos
            </Link>
            <Link href="#contato" className="text-link inline-flex min-h-11 items-center">
              Vamos conversar
            </Link>
          </div>
          <p className="label">
            {profile.location} · {profile.availability}
          </p>
        </div>

        <div className="h-[16rem] md:col-span-7 md:h-[26rem]">
          <KeywordPhysics words={profile.keywords} label="Áreas de atuação" />
        </div>
      </div>
    </section>
  );
}
