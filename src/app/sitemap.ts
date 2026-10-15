import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { caseStudies, moreProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl.replace(/\/$/, "");
  const slugs = [...caseStudies.map((c) => c.slug), ...moreProjects.filter((p) => p.case).map((p) => p.slug)];
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${base}/projetos/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
