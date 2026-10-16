import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoverComposition, coverSlugs } from "@/components/cover-composition";

/*
 * Página só de desenvolvimento: monta as capas de Akamai e Angel Investor com
 * as telas redesenhadas em código, para exportar em 2x (playwright).
 * Em produção responde 404.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return coverSlugs.map((slug) => ({ slug }));
}

export default async function CoverRender({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  if (!coverSlugs.includes(slug)) notFound();
  return <CoverComposition slug={slug} />;
}
