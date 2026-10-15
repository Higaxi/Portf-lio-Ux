import type { Metadata, Viewport } from "next";
import { Inter_Tight, Space_Grotesk, Space_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import { RevealObserver } from "@/components/reveal-observer";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500"], variable: "--font-space-grotesk", display: "swap" });
const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter-tight", display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-space-mono", display: "swap" });

const siteTitle = `${profile.name}, ${profile.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: siteTitle, template: `%s · ${profile.name}` },
  description: profile.seoDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: profile.name,
    title: siteTitle,
    description: profile.seoDescription,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: profile.seoDescription },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0e" },
  ],
};

/* Roda antes da pintura: aplica o tema escolhido, sem piscar. */
const bootScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
        >
          Pular para o conteúdo
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
