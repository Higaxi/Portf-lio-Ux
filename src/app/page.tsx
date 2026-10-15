import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { PersonJsonLd } from "@/components/person-jsonld";

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <ProjectGrid />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
