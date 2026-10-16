import { profile } from "@/content/profile";

/** Link de download do currículo em PDF, no estilo dos botões do site. */
export function ResumeButton({ variant = "primary", className = "" }: { variant?: "primary" | "quiet"; className?: string }) {
  return (
    <a
      href={profile.resume.href}
      download={profile.resume.fileName}
      className={`${variant === "primary" ? "btn-primary" : "btn-quiet gap-2"} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
      </svg>
      Baixar currículo
      <span className="sr-only"> (PDF, {profile.resume.size})</span>
    </a>
  );
}
