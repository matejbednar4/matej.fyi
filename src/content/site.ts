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

export const site = {
  url: "https://matej.fyi",
  /**
   * The search snippet. Kept separate from `profile.bio` because Google
   * truncates around 155 characters, and the on-page opener is allowed to be
   * longer.
   */
  description:
    "Backend, mobile & DevOps engineer in Prague. I built a two-sided marketplace end to end: three React Native apps, a 165-endpoint API and a double-entry ledger.",
  /** The Open Graph locale, shared by every page's preview tags. */
  locale: "en_GB",
} as const;
