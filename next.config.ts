import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ekspor statis: situs sepenuhnya prerender, siap dihosting di host statis
  // (GitHub Pages, Vercel, Netlify, dll.) tanpa server Node.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
