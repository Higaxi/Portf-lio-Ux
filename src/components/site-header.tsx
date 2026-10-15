import Link from "next/link";
import { profile } from "@/content/profile";
import { navLinks } from "@/content/nav";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { RollText } from "./roll-text";

/** Navegação mínima: nome, quatro âncoras e o tema. */
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
      </nav>
      <MobileMenu />
    </header>
  );
}
