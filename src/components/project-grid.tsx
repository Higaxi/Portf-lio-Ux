import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { caseStudies, categoryLabels, moreProjects } from "@/content/projects";
import { CaseCover } from "./case-art";
import { RollText } from "./roll-text";
import { ProjectCarousel } from "./project-carousel";

/** Os 4 projetos de maior impacto, nesta ordem. */
const FEATURED = ["premium-league", "pormade", "akamai", "angel-investor"];

type Card = { slug: string; name: string; meta: string; cta: string; media: ReactNode };

const sizes = "(min-width: 768px) 45vw, 100vw";

function buildFeatured(): Card[] {
  return FEATURED.flatMap<Card>((slug) => {
    const c = caseStudies.find((x) => x.slug === slug);
    if (c) {
      return [{ slug, name: c.title, meta: `${c.context} · ${c.year}`, cta: "Estudo de caso", media: <CaseCover project={c} sizes={sizes} /> }];
    }
    const p = moreProjects.find((x) => x.slug === slug && x.case);
    if (p) {
      return [
        {
          slug,
          name: p.name,
          meta: p.categories.map((k) => categoryLabels[k]).join(" · "),
          cta: "Case resumido",
          media: <Image src={p.image.src} alt={p.image.alt} fill sizes={sizes} loading="eager" className="object-cover" />,
        },
      ];
    }
    return [];
  });
}

export function ProjectGrid() {
  const featured = buildFeatured();
  const rest = moreProjects.filter((p) => !FEATURED.includes(p.slug));

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="pt-28 md:pt-40">
      <div className="mx-auto max-w-[90rem] px-4 md:px-10">
        <h2 id="projetos-titulo" data-reveal="title" className="border-b border-line pb-6 font-display text-head font-medium uppercase tracking-tight">
          Projetos
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-16">
          {featured.map((c, i) => (
            <li key={c.slug} data-reveal="card" style={{ "--i": i % 2 } as React.CSSProperties}>
              <Link href={`/projetos/${c.slug}`} className="zoom-on-hover block rounded-xl">
                <ViewTransition name={`capa-${c.slug}`} share="morph" default="none">
                  <div aria-hidden="true" className="relative aspect-video overflow-hidden rounded-xl bg-surface">{c.media}</div>
                </ViewTransition>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <ViewTransition name={`titulo-${c.slug}`} share="morph" default="none">
                    <h3 className="text-lead">
                      <RollText>{c.name}</RollText>
                    </h3>
                  </ViewTransition>
                  <span className="label shrink-0">{c.cta}</span>
                </div>
                <p className="label mt-1">{c.meta}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-24 md:mt-32">
        <div className="mx-auto max-w-[90rem] px-4 md:px-10">
          <h3 id="mais-titulo" data-reveal="title" className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-medium uppercase tracking-tight">
            Mais projetos
          </h3>
          <p data-reveal className="mt-2 max-w-[56ch] text-body text-muted">
            Aplicativos, dashboards e marcas. Os de produto abrem um case resumido; os de marca abrem a imagem ampliada.
          </p>
        </div>
        <ProjectCarousel
          labelledBy="mais-titulo"
          items={rest.map((p) => ({
            slug: p.slug,
            name: p.name,
            category: p.categories.map((k) => categoryLabels[k]).join(" · "),
            description: p.description,
            image: p.image,
            hasCase: Boolean(p.case),
          }))}
        />
      </div>
    </section>
  );
}
