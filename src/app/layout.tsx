import type { Metadata, Viewport } from "next";
import { Karla, Playfair_Display } from "next/font/google";

import { brandIcons, profile, site } from "@/content";
import "./globals.css";

// latin-ext carries the Czech diacritics.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Built from `profile` rather than retyped, so the tab title and the page
// heading can never drift apart.
const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${profile.name}` },
  description: site.description,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: profile.name,
    locale: site.locale,
    title,
    description: site.description,
  },
  // `summary`, not `summary_large_image`: there is no OG image yet, and claiming
  // one that does not exist gets the card downgraded anyway.
  twitter: { card: "summary", title, description: site.description },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // What colour the browser paints its own chrome: the toolbar on a phone,
  // the tab strip elsewhere. The ground, `--color-background` in
  // `globals.css`, written out because a meta tag cannot read a stylesheet.
  // Change one, change both.
  themeColor: "#0d1a13",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${karla.variable}`}
      // Tells the router the page scrolls smoothly, so it can switch that off
      // for the instant a navigation scrolls to the top. Next 16 stopped doing
      // this on its own, and without it a sub-page opened from halfway down
      // the landing arrived mid-scroll: the jump to the top became a long
      // smooth scroll through the new page, and on a phone it was cut short
      // by the first touch or by the toolbar resizing the viewport.
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh">
        {/*
          Every mark, defined once, referenced everywhere by `<use href="#mark-id">`.
          Without this each mark's path is re-inlined at every call site: the AWS
          mark alone appeared 14 times, and 81% of the page's 118KB of path data
          was duplication. Positioned off-canvas rather than `display: none`,
          which breaks `<use>` in some browsers.
        */}
        <svg
          aria-hidden
          focusable="false"
          className="absolute size-0 overflow-hidden"
        >
          {Object.entries(brandIcons).map(([id, icon]) => (
            <symbol key={id} id={`mark-${id}`} viewBox={icon.viewBox}>
              <path d={icon.path} />
            </symbol>
          ))}
        </svg>
        {children}
      </body>
    </html>
  );
}
