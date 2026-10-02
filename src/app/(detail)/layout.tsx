import type { ReactNode } from "react";

/**
 * The frame every page below the landing shares: the same two-column shell the
 * landing is built on, so a rail sits beside the content here exactly as it
 * does there.
 *
 * `(detail)` is a route group, so it contributes nothing to the URL. The pages
 * under it stay at /roles/<id> and /work/<area>; the group exists only so
 * both trees share this one layout instead of each page wrapping itself.
 *
 * The rail itself is rendered by the pages rather than here, because only a
 * page knows which of its rows is the current one, and reading that back from
 * the pathname in the client would leave the exported HTML marking none.
 */
export default function DetailLayout({ children }: { children: ReactNode }) {
  return <div className="page-shell">{children}</div>;
}
