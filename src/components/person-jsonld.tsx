import { profile } from "@/content/profile";

/** Dados estruturados (schema.org/Person) para buscadores. */
export function PersonJsonLd() {
  const base = profile.siteUrl.replace(/\/$/, "");
  const phone = profile.socials.find((s) => s.href.includes("wa.me"))?.href.replace(/^.*wa\.me\//, "+");
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.seoDescription,
    url: base,
    image: `${base}/mateus-higashie.webp`,
    email: `mailto:${profile.email}`,
    ...(phone ? { telephone: phone } : {}),
    address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
    sameAs: profile.socials.filter((s) => !s.href.includes("wa.me")).map((s) => s.href),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
