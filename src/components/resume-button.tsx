import { profile } from "@/content/profile";

/**
 * Link de download do currículo em PDF, no estilo dos botões do site.
 * `lang="en"` baixa a versão em inglês.
 */
export function ResumeButton({
  variant = "primary",
  lang = "pt",
  className = "",
}: {
  variant?: "primary" | "quiet";
  lang?: "pt" | "en";
  className?: string;
}) {
  const file = lang === "en" ? profile.resumeEn : profile.resume;
  return (
    <a
      href={file.href}
      download={file.fileName}
      hrefLang={lang === "en" ? "en" : "pt-BR"}
      className={`${variant === "primary" ? "btn-primary" : "btn-quiet gap-2"} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
      </svg>
      {lang === "en" ? <span lang="en">English version</span> : "Baixar currículo"}
      <span className="sr-only">{lang === "en" ? ` (currículo em inglês, PDF, ${file.size})` : ` (PDF, ${file.size})`}</span>
    </a>
  );
}
