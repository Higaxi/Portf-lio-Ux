import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { caseStudies, categoryLabels, moreProjects } from "@/content/projects";
import { brandCases, manualPages } from "@/content/brand-cases";
import { CaseCover } from "./case-art";
import { isTodo, showTodos } from "@/lib/todo";
import { RollText } from "./roll-text";
import { ProjectCarousel } from "./project-carousel";
import { CategoryTabs } from "./category-tabs";
import { WebShowcase } from "./web-showcase";
import { BrandTiles } from "./brand-tiles";

/** Os 6 projetos de maior impacto, nesta ordem. */
const FEATURED = ["premium-league", "hora-do-lar", "pormade", "pode-regularizar", "akamai", "angel-investor"];

type Card = { slug: string; name: string; meta: string; cta: string; media: ReactNode };

const sizes = "(min-width: 768px) 45vw, 100vw";

function buildFeatured(): Card[] {
  return FEATURED.flatMap<Card>((slug) => {
    const c = caseStudies.find((x) => x.slug === slug);
    if (c) {
      const meta = [c.context, c.year].filter((v) => showTodos || !isTodo(v)).join(" · ") || c.platforms;
      return [{ slug, name: c.title, meta, cta: "Estudo de caso", media: <CaseCover project={c} sizes={sizes} /> }];
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

/** Grade de cards grandes (2 colunas no desktop, 1 no celular). */
function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-16">
      {cards.map((c, i) => (
        <li key={c.slug} data-reveal="card" style={{ "--i": i % 2 } as React.CSSProperties}>
          <Link href={`/projetos/${c.slug}`} className="zoom-on-hover block rounded-xl">
            <ViewTransition name={`capa-${c.slug}`} share="morph" default="none">
              <div aria-hidden="true" className="relative aspect-video overflow-hidden rounded-xl bg-surface">
                {c.media}
              </div>
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
  );
}

export function ProjectGrid() {
  const featured = buildFeatured();
  const productRest = moreProjects.filter((p) => !FEATURED.includes(p.slug) && !p.categories.every((k) => k === "branding"));
  const brandTiles = moreProjects.filter((p) => p.categories.every((k) => k === "branding"));

  const brandCards: Card[] = brandCases.map((b) => {
    const cover = manualPages(b)[0];
    return {
      slug: b.slug,
      name: b.name,
      meta: b.deliverable,
      cta: "Estudo de caso",
      media: cover ? <Image src={cover.src} alt={cover.alt} fill sizes={sizes} loading="eager" className="object-cover" /> : null,
    };
  });

  const product = (
    <>
      <CardGrid cards={featured} />
      <div className="-mx-4 mt-24 md:-mx-10 md:mt-32">
        <div className="px-4 md:px-10">
          <h3 id="mais-titulo" data-reveal="title" className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-medium uppercase tracking-tight">
            Mais projetos
          </h3>
          <p data-reveal className="mt-2 max-w-[56ch] text-body text-muted">
            Aplicativos, dashboards, landing pages e conceitos. Os que têm case resumido abrem a página; os demais, a imagem ampliada.
          </p>
        </div>
        <ProjectCarousel
          labelledBy="mais-titulo"
          items={productRest.map((p) => ({
            slug: p.slug,
            name: p.name,
            category: p.categories.map((k) => categoryLabels[k]).join(" · "),
            description: p.description,
            image: p.image,
            hasCase: Boolean(p.case),
          }))}
        />
      </div>
    </>
  );

  const brand = (
    <>
      <CardGrid cards={brandCards} />
      <div className="mt-20">
        <h3 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] font-medium uppercase tracking-tight">Outras marcas</h3>
        <p className="mt-2 max-w-[56ch] text-body text-muted">Identidades sem manual publicado. Clique para ver a aplicação ampliada.</p>
        <div className="mt-8">
          <BrandTiles
            items={brandTiles.map((p) => ({
              src: p.image.src,
              thumb: p.image.src,
              width: p.image.width,
              height: p.image.height,
              alt: p.image.alt,
              title: p.name,
              description: p.description,
            }))}
          />
        </div>
      </div>
    </>
  );

  const web = <WebShowcase />;

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="pt-28 md:pt-40">
      <div className="mx-auto max-w-[90rem] px-4 md:px-10">
        <CategoryTabs
          heading={
            <h2 id="projetos-titulo" data-reveal="title" className="font-display text-head font-medium uppercase tracking-tight">
              Projetos
            </h2>
          }
          tabs={[
            { id: "produto", label: "Product Design", panel: product },
            { id: "marca", label: "Design Gráfico · Construção de marca", panel: brand },
            { id: "web", label: "Web Design", panel: web },
          ]}
        />
      </div>
    </section>
  );
}
