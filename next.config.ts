import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // landings estáticas em public/: o endereço curto abre a página de cada uma
  redirects() {
    return [
      { source: "/canastrium", destination: "/canastrium/index.html", permanent: false },
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
