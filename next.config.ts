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
