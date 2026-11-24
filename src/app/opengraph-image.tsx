import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { profile, site } from "@/content";

/**
 * The link preview: the site's ground and my name, nothing else. Rendered to a
 * PNG at build time. Next writes the landing's og:image and twitter:image tags
 * from this file; the sub-pages name it through `site.ogImage`, which also
 * holds its size and alt text.
 *
 * The image renderer cannot read `globals.css`, so the ground is redrawn here
 * as SVG from the same recipe as `body::before`: `--color-background`, the two
 * washes and `--grain` laid over them at `soft-light`. The values are written
 * out. Change one, change both.
 */

// Required under `output: "export"`: written to out/opengraph-image.png at
// build time.
export const dynamic = "force-static";

export const alt = site.ogImage.alt;
export const size = { width: site.ogImage.width, height: site.ogImage.height };
export const contentType = site.ogImage.type;

const { width, height } = size;

// A CSS `radial-gradient(52% 44% at 96% 0%, …)` is an ellipse 52% of the width
// across and 44% of the height tall, so each wash is a unit circle scaled to
// those radii and moved to its centre.
const ground = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <radialGradient id="top-right" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
      gradientTransform="translate(${width * 0.96} 0) scale(${width * 0.52} ${height * 0.44})">
      <stop offset="0" stop-color="#1c2a20" stop-opacity="0.9" />
      <stop offset="0.72" stop-color="#1c2a20" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bottom-left" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
      gradientTransform="translate(${width * 0.04} ${height}) scale(${width * 0.48} ${height * 0.42})">
      <stop offset="0" stop-color="#3fc7b8" stop-opacity="0.16" />
      <stop offset="0.7" stop-color="#3fc7b8" stop-opacity="0" />
    </radialGradient>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <pattern id="grain" patternUnits="userSpaceOnUse" width="160" height="160">
      <rect width="160" height="160" filter="url(#noise)" opacity="0.5" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#0d1a13" />
  <rect width="100%" height="100%" fill="url(#top-right)" />
  <rect width="100%" height="100%" fill="url(#bottom-left)" />
  <rect width="100%" height="100%" fill="url(#grain)" style="mix-blend-mode: soft-light" />
</svg>`;

export default async function OpengraphImage() {
  const playfair = await readFile(
    join(process.cwd(), "src/fonts/playfair-display-600.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          alt=""
          width={width}
          height={height}
          src={`data:image/svg+xml;base64,${Buffer.from(ground).toString("base64")}`}
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            color: "#ede8d2",
            fontFamily: "Playfair Display",
            fontWeight: 600,
            fontSize: 128,
            letterSpacing: "-0.008em",
            lineHeight: 1.1,
          }}
        >
          {profile.name}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, weight: 600, style: "normal" },
      ],
    },
  );
}
