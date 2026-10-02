/**
 * The attributes an anchor needs when it leaves the site.
 *
 * Anything on another origin opens in a new tab, so a reader who clicks a
 * profile or a repo still has the page they were reading. `mailto:` and `#`
 * are not that: a mail client takes over anyway, and a hash never leaves.
 *
 * `noreferrer` as well as `noopener`, because the second is about the window
 * and the first is about what the other site learns. Both are free.
 */
export function externalLink(href: string) {
  return href.startsWith("http")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}
