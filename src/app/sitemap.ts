import type { MetadataRoute } from "next";

import { AREAS, roles, site } from "@/content";

// Required under `output: "export"`: written to out/sitemap.xml at build time.
export const dynamic = "force-static";

/**
 * Every page on the site, built from the same lists the routes are, so a new
 * area or role is in the sitemap the moment it has a page.
 *
 * Trailing slashes because `trailingSlash` is on: these have to match the
 * canonical URLs exactly, or a crawler is handed a redirect for every entry.
 *
 * No `lastModified`. The only date available at build time is the build
 * itself, which would claim every page changed on every deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    ...roles.map((role) => ({ url: `${site.url}/roles/${role.id}/` })),
    ...AREAS.map((area) => ({ url: `${site.url}/work/${area}/` })),
  ];
}
