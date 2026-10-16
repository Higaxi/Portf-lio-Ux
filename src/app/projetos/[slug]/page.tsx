import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition, type ReactNode } from "react";
import {
  caseStudies,
  categoryLabels,
  getCaseStudy,
  moreProjects,
  type CaseStudy,
  type Chapter,
  type MoreProject,
} from "@/content/projects";
import { profile } from "@/content/profile";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CaseCover, DesignSystemArt } from "@/components/case-art";
import { FlowDiagram, JourneyDiagram, Wireframes } from "@/components/case-diagrams";
import { isTodo, published, showTodos } from "@/lib/todo";
import { CasePrototype } from "@/components/prototypes-extra";
import { BrandCaseView } from "@/components/brand-case-view";
import { FlowCallouts } from "@/components/flow-callouts";
import { brandCases, getBrandCase } from "@/content/brand-cases";
import { LearningCards, ResultBlock } from "@/components/case-outcome";
import { HomepageAnatomy } from "@/components/homepage-anatomy";
import { AppScreens } from "@/components/app-screens";
import { PlDesignSystem } from "@/components/pl-design-system";
import { HlAppFuncionario, PlAntesDepois } from "@/components/recreated-sections";

type Params = { slug: string };

const miniProjects = moreProjects.filter((p) => p.case);

export function generateStaticParams(): Params[] {
  return [
    ...caseStudies.map((c) => ({ slug: c.slug })),
    ...miniProjects.map((p) => ({ slug: p.slug })),
    ...brandCases.map((b) => ({ slug: b.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  const m = miniProjects.find((p) => p.slug === slug);
  const b = getBrandCase(slug);
  if (!c && !m && !b) return {};
  const title = c ? c.title : m ? m.name : b!.name;
  const description = c ? c.summary : m ? m.description : b!.summary;
  const image = c ? (c.og ?? c.cover?.src) : m ? (m.og ?? m.image.src) : `/projetos/${b!.dir}/01.webp`;
  return {
    title,
    description,
    alternates: { canonical: `/projetos/${slug}` },
    openGraph: {
      title,
      description,
      url: `/projetos/${slug}`,
      type: "article",
      images: [image ?? "/opengraph-image"],
    },
  };
}

export default function ProjectPage({ params }: { params: Promise<Params> }) {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="mx-auto max-w-[90rem] px-4 pt-10 md:px-10 md:pt-16">
        <Link href="/#projetos" className="text-link label inline-flex min-h-11 items-center">
          ← Todos os projetos
        </Link>
        <Suspense fallback={<div className="min-h-[80vh]" />}>
          <ProjectContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

/** Lê o slug dentro do Suspense: a casca da página fica estática e instantânea. */
async function ProjectContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  const m = miniProjects.find((p) => p.slug === slug);
  const b = getBrandCase(slug);
  if (!c && !m && !b) notFound();
  return (
    <>
      {c ? <FullCase c={c} /> : m ? <MiniCasePage p={m} /> : <BrandCaseView b={b!} />}
      <NextProject current={slug} />
    </>
  );
}

/* ---------- Peças comuns ---------- */

function DraftNotice({ show }: { show: boolean }) {
  if (!show || !showTodos) return null;
  return (
    <p className="mt-6 rounded-lg bg-surface p-4 font-mono text-[0.875rem]">
      Rascunho (visível só em desenvolvimento): este texto foi reconstruído e precisa da sua revisão em
      src/content. Mude draft para false quando estiver pronto.
    </p>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="grid grid-cols-1 gap-6 border-t border-line py-14 md:grid-cols-12 md:gap-x-6 md:py-20">
      <h2 id={`${id}-titulo`} data-reveal="title" className="text-lead md:col-span-4">
        {title}
      </h2>
      <div className="md:col-span-8">{children}</div>
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="flex max-w-[64ch] flex-col gap-4">
      {published(items).map((t) => (
        <p key={t} className={t.startsWith("TODO") ? "rounded-lg bg-surface p-3 font-mono text-[0.875rem]" : "text-body"}>
          {t}
        </p>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex max-w-[64ch] flex-col gap-3">
      {items.map((t) => (
        <li key={t} className="grid grid-cols-[1.25rem_1fr] text-body">
          <span aria-hidden="true" className="font-mono text-muted">
            –
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Facts({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
      {rows
        .filter(([, v]) => showTodos || !v.startsWith("TODO"))
        .map(([k, v]) => (
          <div key={k}>
            <dt className="label">{k}</dt>
            <dd className="mt-1 text-body">{v}</dd>
          </div>
        ))}
    </dl>
  );
}

function Figure({ img, sizes }: { img: NonNullable<CaseStudy["problem"]["image"]>; sizes: string }) {
  return (
    <figure className="mt-10" style={{ maxWidth: img.width }}>
      <div className="relative overflow-hidden rounded-xl bg-surface" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
        <Image src={img.src} alt={img.alt} fill sizes={sizes} loading="eager" className="object-cover" />
      </div>
      {img.caption ? <figcaption className="label mt-3">{img.caption}</figcaption> : null}
    </figure>
  );
}

/* ---------- Estudo de caso completo ---------- */

function FullCase({ c }: { c: CaseStudy }) {
  const d = c.deep;
  const chapterToc: [string, string][] = c.chapters
    ? c.chapters.map((ch) => [ch.id, ch.title] as [string, string])
    : d
      ? [
          ["contexto", "Contexto e problema"],
          ["objetivos", "Objetivos"],
          ["descoberta", "Descoberta"],
          ["persona", "Proto-persona"],
          ["jornada", "Jornada atual e futura"],
          ["fluxo", "Fluxo do app"],
          ["wireframes", "Wireframes"],
          ["interface", "Interface"],
          ["testes", "Testes e iteração"],
        ]
      : [
          ["contexto", "Contexto e problema"],
          ["processo", "Processo"],
          ["solucao", "Solução"],
        ];
  const toc: [string, string][] = [
    ...chapterToc,
    ["resultado", "Resultado"],
    ...(c.learnings?.length ? ([["aprendizados", "Aprendizados"]] as [string, string][]) : []),
  ];

  return (
    <article className="mt-6">
      <header>
        <p className="label">
          {[c.context, c.year].filter((v) => showTodos || !isTodo(v)).join(" · ") || c.platforms}
        </p>
        <ViewTransition name={`titulo-${c.slug}`} share="morph" default="none">
          <h1 className="mt-3 max-w-[16ch] font-display text-[clamp(2.5rem,1.5rem+5vw,6.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em]">
            {c.title}
          </h1>
        </ViewTransition>
        <p className="mt-6 max-w-[44ch] text-lead">{c.summary}</p>
        <DraftNotice show={c.draft} />
      </header>

      <ViewTransition name={`capa-${c.slug}`} share="morph" default="none">
        <div className="relative mt-10 aspect-video overflow-hidden rounded-xl bg-surface">
          <CaseCover project={c} sizes="(min-width: 1440px) 1360px, 100vw" priority />
        </div>
      </ViewTransition>

      {/* Resumo */}
      <section aria-labelledby="resumo-titulo" className="mt-10 grid gap-10 md:grid-cols-12 md:gap-x-6">
        <h2 id="resumo-titulo" className="sr-only">
          Resumo
        </h2>
        <div className="md:col-span-8">
          <Facts
            rows={[
              ["Papel", c.role],
              ["Período", c.year],
              ["Plataforma", c.platforms],
              ...(c.facts ?? []),
              ...(d ? ([["Time", d.team], ["Ferramentas", d.tools.join(", ")]] as [string, string][]) : []),
            ]}
          />
        </div>
        <div className="rounded-xl bg-ink p-6 text-bg md:col-span-4">
          <p className="font-mono text-[0.875rem] opacity-80">Resultado</p>
          <p className="mt-2 font-display text-head font-medium tracking-tight">{c.metric.value}</p>
          <p className="mt-1 text-body">{c.metric.label}</p>
        </div>
      </section>

      <nav aria-label="Neste estudo de caso" className="mt-12">
        <ol className="flex flex-wrap gap-2">
          {toc.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="btn-quiet !min-h-10 text-[0.9375rem]">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12">
        {c.chapters ? (
          c.chapters.map((ch) => <ChapterSection key={ch.id} ch={ch} />)
        ) : (
          <>
            <Section id="contexto" title="Contexto e problema">
              <Paragraphs items={c.problem.paragraphs} />
              {c.problem.image ? <Figure img={c.problem.image} sizes="(min-width: 768px) 60vw, 100vw" /> : null}
            </Section>

            {d ? (
              <>
                <Section id="objetivos" title="Objetivos">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <h3 className="label">Para o negócio</h3>
                      <div className="mt-3">
                        <Bullets items={d.objectives.business} />
                      </div>
                    </div>
                    <div>
                      <h3 className="label">Para quem usa</h3>
                      <div className="mt-3">
                        <Bullets items={d.objectives.user} />
                      </div>
                    </div>
                  </div>
                </Section>
                <Section id="descoberta" title="Descoberta">
                  <Bullets items={d.discovery} />
                </Section>
                <Section id="persona" title="Proto-persona">
                  <PersonaCard
                    label="Proto-persona: hipótese construída com o time, não resultado de pesquisa quantitativa"
                    name={d.persona.name}
                    context={d.persona.context}
                    goals={d.persona.goals}
                    pains={d.persona.pains}
                  />
                </Section>
                <Section id="jornada" title="Jornada atual e futura">
                  <JourneyDiagram journey={d.journey} />
                </Section>
                <Section id="fluxo" title="Fluxo do app">
                  <FlowDiagram flow={d.flow} />
                </Section>
                <Section id="wireframes" title="Wireframes">
                  <Wireframes items={d.wireframes} />
                  <p className="label mt-6">Representação dos wireframes, redesenhada para este estudo.</p>
                </Section>
                <Section id="interface" title="Interface de alta fidelidade">
                  <Paragraphs items={c.solution.paragraphs} />
                  <div className="mt-8">
                    <CasePrototype id="pormade" />
                  </div>
                  {showTodos && c.gallery.length === 0 ? (
                    <p className="label mt-4">TODO: adicione as telas finais em public/projetos/{c.slug}/ e preencha gallery.</p>
                  ) : null}
                </Section>
                <Section id="testes" title="Testes e iteração">
                  <Bullets items={d.testing} />
                </Section>
              </>
            ) : (
              <>
                <Section id="processo" title="Processo">
                  <Paragraphs items={c.process.paragraphs} />
                </Section>
                <Section id="solucao" title="Solução">
                  <Paragraphs items={c.solution.paragraphs} />
                  {c.solution.image ? <Figure img={c.solution.image} sizes="(min-width: 768px) 60vw, 100vw" /> : null}
                </Section>
              </>
            )}
          </>
        )}

        {c.impact ? (
          <ResultBlock impact={c.impact} />
        ) : (
          <ResultBlock impact={{ claim: c.metric.value, caption: c.metric.label, chips: [], paragraphs: c.result.paragraphs }} />
        )}

        {c.learnings?.length ? <LearningCards items={c.learnings} /> : null}

        {c.gallery.length > 0 ? (
          <section aria-labelledby="galeria-titulo" className="border-t border-line py-14 md:py-20">
            <h2 id="galeria-titulo" className="text-lead">
              Detalhes
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-6">
              {c.gallery.map((g) => (
                <li key={g.src}>
                  <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width: 768px) 15vw, 45vw" loading="eager" className="h-auto w-full rounded-lg" />
                  {g.caption ? <p className="mt-2 text-[0.9375rem] leading-snug text-muted">{g.caption}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <CaseLinks links={c.links} />
      </div>
    </article>
  );
}

function CaseLinks({ links }: { links: CaseStudy["links"] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 border-t border-line py-10">
      {links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={i === 0 ? "btn-primary" : "btn-quiet !min-h-12 !px-6"}
        >
          {l.label}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      ))}
    </div>
  );
}

function PersonaCard({
  label,
  name,
  context,
  goals,
  pains,
}: {
  label: string;
  name: string;
  context?: string;
  goals: string[];
  pains: string[];
}) {
  return (
    <div className="rounded-xl bg-surface p-6 md:p-8">
      <p className="label">{label}</p>
      <h3 className="mt-3 font-display text-head font-medium tracking-tight">{name}</h3>
      {context ? <p className="mt-3 max-w-[60ch] text-body">{context}</p> : null}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="label">Objetivos</h4>
          <div className="mt-2">
            <Bullets items={goals} />
          </div>
        </div>
        <div>
          <h4 className="label">Frustrações</h4>
          <div className="mt-2">
            <Bullets items={pains} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChapterSection({ ch }: { ch: Chapter }) {
  const stats = ch.columnsStyle !== "list";
  return (
    <Section id={ch.id} title={ch.title}>
      <div className="flex flex-col gap-8">
        {ch.paragraphs ? <Paragraphs items={ch.paragraphs} /> : null}
        {ch.stages ? (
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {ch.stages.map((st, i) => (
              <li key={st.title} className="flex flex-col rounded-xl bg-surface p-4">
                <span className="label">Etapa {i + 1}</span>
                <span className="mt-2 text-body font-medium">{st.title}</span>
                {st.text ? <span className="mt-1 text-[0.9375rem] text-muted">{st.text}</span> : null}
              </li>
            ))}
          </ol>
        ) : null}
        {ch.columns ? (
          <div className={`grid gap-4 ${ch.columns.length >= 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
            {ch.columns.map((col) => (
              <div key={col.title} className="rounded-xl bg-surface p-6">
                <h3 className="label">{col.title}</h3>
                <ul className={`mt-3 flex flex-col ${stats ? "gap-1" : "gap-2"}`}>
                  {col.items.map((it) => (
                    <li key={it} className={stats ? "font-display text-lead font-medium" : "text-[0.9375rem] leading-snug"}>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
        {ch.persona ? (
          <PersonaCard
            label={ch.persona.label ?? "Persona"}
            name={ch.persona.name}
            context={ch.persona.context}
            goals={ch.persona.goals}
            pains={ch.persona.pains}
          />
        ) : null}
        {ch.bullets ? <Bullets items={ch.bullets} /> : null}
        {ch.quotes ? (
          <div className={`grid gap-4 ${ch.quotes.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {ch.quotes.map((q) => (
              <figure key={q.text} className="rounded-xl bg-surface p-6">
                <blockquote className="text-lead">“{q.text}”</blockquote>
                <figcaption className="label mt-4">{q.who}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
        {ch.chips ? (
          <ul className="flex flex-wrap gap-2">
            {ch.chips.map((t) => (
              <li key={t} className="chip !min-h-10 !px-4">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
        {ch.custom === "homepage-anatomy" ? <HomepageAnatomy /> : null}
        {ch.custom === "app-screens" ? <AppScreens /> : null}
        {ch.custom === "pl-design-system" ? <PlDesignSystem /> : null}
        {ch.custom === "pl-antes-depois" ? <PlAntesDepois /> : null}
        {ch.custom === "hl-app-funcionario" ? <HlAppFuncionario /> : null}
        {ch.prototype ? <CasePrototype id={ch.prototype} /> : null}
        {ch.art === "design-system" ? (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <DesignSystemArt />
          </div>
        ) : null}
        {ch.image ? <Figure img={ch.image} sizes="(min-width: 768px) 60vw, 100vw" /> : null}
        {ch.images?.map((img) => <Figure key={img.src} img={img} sizes="(min-width: 768px) 60vw, 100vw" />)}
        {ch.note && (!isTodo(ch.note) || showTodos) ? <p className="label">{ch.note}</p> : null}
      </div>
    </Section>
  );
}

/* ---------- Case resumido ---------- */

function MiniCasePage({ p }: { p: MoreProject }) {
  const mc = p.case!;
  return (
    <article className="mt-6">
      <header>
        <p className="label">{p.categories.map((x) => categoryLabels[x]).join(" · ")}</p>
        <ViewTransition name={`titulo-${p.slug}`} share="morph" default="none">
          <h1 className="mt-3 font-display text-[clamp(2.5rem,1.5rem+5vw,6.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em]">
            {p.name}
          </h1>
        </ViewTransition>
        <p className="mt-6 max-w-[44ch] text-lead">{p.description}</p>
        <DraftNotice show />
      </header>
      <ViewTransition name={`capa-${p.slug}`} share="morph" default="none">
      <div className="relative mt-10 aspect-video overflow-hidden rounded-xl bg-surface">
        <Image src={p.image.src} alt={p.image.alt} fill preload sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover" />
      </div>
      </ViewTransition>
      <div className="mt-12">
        <Section id="desafio" title="Desafio">
          <p className="max-w-[64ch] text-body">{mc.challenge}</p>
        </Section>
        <Section id="publico" title="Público">
          <p className="max-w-[64ch] text-body">{mc.audience}</p>
        </Section>
        <Section id="processo" title="Processo">
          <Bullets items={mc.process} />
        </Section>
        {mc.flow?.length ? (
          <section id="entrega" aria-labelledby="entrega-titulo" className="border-t border-line py-14 md:py-20">
            <div className="grid gap-4 md:grid-cols-12 md:gap-x-6">
              <h2 id="entrega-titulo" data-reveal="title" className="text-lead md:col-span-4">
                Entrega: a jornada principal
              </h2>
              <p className="max-w-[60ch] text-body md:col-span-8">
                {mc.delivery} As decisões de design estão numeradas sobre cada tela.
              </p>
            </div>
            <p className="label mt-8">Telas redesenhadas em alta resolução a partir do protótipo original.</p>
            <div className="mt-4">
              <FlowCallouts screens={mc.flow} accent={mc.accent} />
            </div>
          </section>
        ) : (
          <Section id="decisoes" title="Decisões de design">
            <Bullets items={mc.decisions} />
          </Section>
        )}
        {mc.designSystem ? (
          <section id="design-system" aria-labelledby="ds-titulo" className="border-t border-line py-14 md:py-20">
            <h2 id="ds-titulo" data-reveal="title" className="text-lead">
              Mini design system
            </h2>
            <p className="mt-3 max-w-[60ch] text-body">
              Tipografia, cores, ícones, botões, top bar, formulários, navegação, calendários, gráficos e campos de exibição documentados para manter as telas consistentes.
            </p>
            <div className="mt-8 inline-block max-w-full overflow-hidden rounded-2xl bg-[#e9edf3] p-3 md:p-5">
              <Image src={mc.designSystem.src} alt={mc.designSystem.alt} width={mc.designSystem.width} height={mc.designSystem.height} sizes={`${mc.designSystem.width}px`} loading="eager" className="h-auto w-full rounded-lg" style={{ maxWidth: mc.designSystem.width }} />
            </div>
            <p className="label mt-3">Quadro original, em tamanho real.</p>
          </section>
        ) : null}
        {p.slug === "akamai" || p.slug === "angel-investor" ? (
          <Section id="prototipo" title="Protótipo">
            <CasePrototype id={p.slug === "akamai" ? "akamai" : "angel-investor"} />
          </Section>
        ) : null}
        {mc.original ? (
          <section id="prancha-original" aria-labelledby="original-titulo" className="border-t border-line py-14 md:py-20">
            <h2 id="original-titulo" className="text-lead">
              Prancha original
            </h2>
            <p className="mt-3 max-w-[60ch] text-body text-muted">A apresentação do projeto como foi entregue, em tamanho real.</p>
            <div className="mt-8">
              <Image src={mc.original.src} alt={mc.original.alt} width={mc.original.width} height={mc.original.height} sizes={`(min-width: 1440px) ${mc.original.width}px, 100vw`} loading="eager" className="h-auto w-full rounded-xl" style={{ maxWidth: mc.original.width }} />
            </div>
          </section>
        ) : null}
        {mc.flow?.length ? (
          showTodos && mc.resultsTodo ? (
            <p className="mb-10 rounded-lg bg-surface p-4 font-mono text-[0.875rem]">{mc.resultsTodo}</p>
          ) : null
        ) : (
          <Section id="entrega" title="Entrega">
            <p className="max-w-[64ch] text-body">{mc.delivery}</p>
          </Section>
        )}
      </div>
    </article>
  );
}

/* ---------- Próximo projeto ---------- */

function NextProject({ current }: { current: string }) {
  const order = [
    ...caseStudies.map((c) => ({ slug: c.slug, name: c.title })),
    ...miniProjects.map((p) => ({ slug: p.slug, name: p.name })),
    ...brandCases.map((b) => ({ slug: b.slug, name: b.name })),
  ];
  const i = order.findIndex((o) => o.slug === current);
  const next = order[(i + 1) % order.length];
  return (
    <nav aria-label="Próximo projeto" className="border-t border-line pt-10">
      <Link href={`/projetos/${next.slug}`} className="group block">
        <span className="label">Próximo projeto</span>
        <span className="mt-2 block font-display text-head font-medium uppercase tracking-tight group-hover:underline group-hover:decoration-2 group-hover:underline-offset-8">
          {next.name} →
        </span>
      </Link>
      <p className="label mt-8">
        Quer conversar sobre este projeto?{" "}
        <a className="text-link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
    </nav>
  );
}
