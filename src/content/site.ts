/**
 * What the document needs, as opposed to what the person is. Everything here is
 * read by `layout.tsx` or by a page's `generateMetadata`, and nothing here is
 * rendered on the page itself.
 *
 * The tab title is not here: it is `${profile.name} | ${profile.role}`, built in
 * `layout.tsx` so the title and the page heading cannot drift apart.
 *
 * The favicon is not here either. It is `app/icon.png`, which Next resolves by
 * file convention, so a path in this file would be a value nothing reads.
 */

import { profile } from "./profile";

export const site = {
  url: "https://matej.fyi",
  /**
   * The search snippet. Kept separate from `profile.bio` because Google
   * truncates around 155 characters, and the on-page opener is allowed to be
   * longer.
   */
  description:
    "Backend, mobile & DevOps engineer in Prague. I built a two-sided marketplace: three React Native apps, a 165-endpoint REST API and a double-entry ledger.",
  /** The Open Graph locale, shared by every page's preview tags. */
  locale: "en_GB",
  /**
   * The link preview, drawn by `app/opengraph-image.tsx`. The landing gets its
   * tags from that file by convention. A sub-page sets its own `openGraph`,
   * which replaces the layout's whole object, so it names the image from here.
   *
   * The static export writes the image without an extension, so `vercel.json`
   * gives it its content type, and with `trailingSlash` on, its address ends
   * in a slash.
   */
  ogImage: {
    url: "/opengraph-image/",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: profile.name,
  },
} as const;
