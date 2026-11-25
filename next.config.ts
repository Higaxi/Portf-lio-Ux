import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // landings estáticas em public/: o endereço curto abre a página de cada uma
  redirects() {
    return [
      // o site do Canastrium saiu daqui e tem domínio próprio
      { source: "/canastrium", destination: "https://canastrium.com.br", permanent: true },
      { source: "/canastrium/:path*", destination: "https://canastrium.com.br/:path*", permanent: true },
      { source: "/redline-test", destination: "/redline-test/index.html", permanent: false },
      // protótipo do site da Fazenda Um: link escondido (sem link no site, fora do sitemap, páginas com noindex)
      { source: "/fazenda-um", destination: "/fazenda-um/index.html", permanent: false },
      // proposta de home premium da UM Coffee Co.: link escondido (sem link no site, páginas com noindex)
      { source: "/ppumcoffe", destination: "/ppumcoffe/index.html", permanent: false },
    ];
  },
  // protótipos em inglês do desafio: endereço curto, arquivos em public/cc/ (as páginas usam <base href="/cc/">)
  rewrites() {
    return [
      { source: "/ccdesktop", destination: "/cc/desktop.html" },
      { source: "/ccmobile", destination: "/cc/app.html" },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
