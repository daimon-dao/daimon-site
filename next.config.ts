import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pure static export: `next build` writes the whole site to ./out.
  // No server, no middleware, no image optimisation service.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
