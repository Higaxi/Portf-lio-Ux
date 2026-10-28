import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // a landing do Canastrium é uma cópia estática em public/canastrium; o endereço curto abre a página dela
  redirects() {
    return [{ source: "/canastrium", destination: "/canastrium/index.html", permanent: false }];
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
