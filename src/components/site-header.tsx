import Link from "next/link";
import { profile } from "@/content/profile";
import { navLinks } from "@/content/nav";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { RollText } from "./roll-text";
import { ResumeButton } from "./resume-button";

/** Navegação mínima: nome, quatro âncoras, o tema e o currículo. */
export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-4 pt-4 md:px-10 md:pt-6">
      <Link href="/" className="inline-flex min-h-11 items-center font-display text-[1.0625rem] font-medium uppercase tracking-tight">
        <RollText>{profile.name}</RollText>
      </Link>
      <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center">
            <RollText>{l.label}</RollText>
          </Link>
        ))}
        <ThemeToggle />
        <ResumeButton className="min-h-11 px-5 text-[0.9375rem]" />
      </nav>
      <MobileMenu />
    </header>
  );
}
