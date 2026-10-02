import type { MetadataRoute } from "next";

import { site } from "@/content";

// Required under `output: "export"`: written to out/robots.txt at build time.
export const dynamic = "force-static";

/** Everything is public, and the sitemap says where all of it is. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
