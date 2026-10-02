import type { LucideIcon } from "lucide-react";

import { monogramFor } from "@/content";

/** A company, as the mark on its own page. */
type Brand = { label: string; logo?: string };

/**
 * What sits at the left of the header: a company's mark, or the mark of a kind
 * of work. A union rather than two optional props, so writing both is a type
 * error rather than a thing to remember, the same way `CustomCard`'s lead is.
 */
type Figure =
  | { brand: Brand; icon?: undefined }
  | { icon: LucideIcon; brand?: undefined };

/**
 * The top of a page below the landing: a figure and the title on one line, then
 * the page's opening words underneath, across the full measure.
 *
 * Not the landing's shape, on purpose. There the words are a bio, which is
 * short enough to sit in a column beside a photo; here they are the page's own
 * copy, and a column indented past a 96px figure is a narrower measure for more
 * text. Only the title stays in the figure's row, where it reads as the label
 * on the mark beside it.
 *
 * It opens the page and stops. Everything else a detail page has to say sits
 * under a heading of its own, so the blocks of the page are all labelled rather
 * than one being labelled and one loose.
 */
export function PageHeader({
  title,
  lede,
  brand,
  icon: Icon,
}: {
  title: string;
  /** The one paragraph that says what this page is about. */
  lede?: string;
} & Figure) {
  return (
    <header>
      <div className="flex items-center gap-6">
        <FigureTile brand={brand} icon={Icon} />
        <h1>{title}</h1>
      </div>

      {lede ? <p className="mt-6 text-lede text-ink-muted">{lede}</p> : null}
    </header>
  );
}

/**
 * The figure itself, in the square the landing's avatar occupies so every
 * page's header weighs the same.
 *
 * A mark sits on a tile of the site's own surface and is drawn in the ink. For
 * the Lucide marks that is nothing new; for a company it means the logo is a
 * mask rather than an image, so only its shape comes from the file. The Tagly
 * file is a dark brown wordmark, and dark brown on the surface is not there at
 * all. It is also how every other brand mark on the site is drawn, monochrome
 * and in a colour the page owns.
 *
 * Decorative on purpose: the `h1` beside it is the name, and a mark that
 * repeats it is read out twice.
 */
// Loose here rather than the union above: the union is the contract callers fit,
// and it cannot survive being taken apart and passed on.
function FigureTile({ brand, icon: Icon }: { brand?: Brand; icon?: LucideIcon }) {
  return (
    <span
      aria-hidden
      className="surface grid size-24 shrink-0 place-items-center text-ink"
    >
      {Icon ? <Icon className="size-11" strokeWidth={1.5} aria-hidden /> : null}

      {brand?.logo ? (
        <span
          className="size-16 bg-ink"
          // The file is data, so the mask cannot come from a class. Both
          // spellings: Safari only took the prefixed one until 16.4.
          style={{
            mask: `url(${brand.logo}) center / contain no-repeat`,
            WebkitMask: `url(${brand.logo}) center / contain no-repeat`,
          }}
        />
      ) : null}

      {brand && !brand.logo ? (
        <span className="font-display text-3xl font-semibold">
          {monogramFor(brand.label)}
        </span>
      ) : null}
    </span>
  );
}
