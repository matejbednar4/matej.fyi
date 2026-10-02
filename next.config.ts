import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits plain HTML/CSS/JS into ./out.
  // Keeps the deploy on Vercel's free Hobby tier with no serverless
  // functions and no metered image optimization.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // A stray package-lock.json in the home dir makes Turbopack guess the wrong
  // workspace root; pin it to this repo.
  turbopack: { root: import.meta.dirname },
  // Lets a phone on the same network use `yarn dev` at the Mac's LAN address.
  // The dev server refuses its scripts to any host but localhost otherwise, so
  // the page renders but never hydrates: no menu, no stack tiles, no press
  // feedback. Dev only; the static export ignores it.
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
