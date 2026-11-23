import type { Metadata } from "next";

import { rolesWithDemos, site } from "@/content";

/**
 * /demos has nothing of its own while only one role has recordings, so it
 * sends the reader to that role's page. When a second role gets demos, this
 * becomes the page that chooses between them.
 *
 * A meta refresh rather than `redirect()`: under `output: "export"` there is
 * no server to answer with a redirect, and `redirect()` exports a page that
 * only moves once its JavaScript runs, so a crawler or a reader without it
 * would be left on a blank page. The refresh works in plain HTML, the
 * canonical tells a search engine which page to keep, and the link is there
 * for anyone the refresh does not move.
 */
const target = rolesWithDemos[0];
const href = `/demos/${target.id}/`;

export const metadata: Metadata = {
  title: `${target.company} demos`,
  alternates: { canonical: `${site.url}${href}` },
  robots: { index: false },
};

export default function DemosPage() {
  return (
    <main>
      {/* React hoists this into <head>. */}
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <p className="text-lede text-ink-muted">
        The demos are on the <a href={href}>{target.company} demos page</a>.
      </p>
    </main>
  );
}
