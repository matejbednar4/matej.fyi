import { Mail, MapPin } from "lucide-react";

import { iconFor, monogramFor } from "@/content";

/**
 * Generic marks come from Lucide: an envelope and a map pin are shapes, not
 * trademarks, so there is no sourcing problem and no reason to hand-draw them.
 */
const GENERIC = { mail: Mail, pin: MapPin } as const;

/**
 * What the mark sits on.
 *
 * - `bare` is a mark beside a label: a rail row or a button. No box of its own.
 * - `plate` is a mark inside something chip-coloured. It gets its own light
 *   plate, because a chip inside a chip is the same value on itself and the
 *   mark's box disappears.
 * - `accent` is the stack tile, where the mark is the whole point of the card.
 *   The tile is already the surface, so a plate inside it would only draw a
 *   box around the thing you are meant to look at.
 */
const LOOK = {
  bare: "",
  plate: "bg-plate text-on-plate [box-shadow:var(--shadow-gloss)]",
  accent: "text-accent",
} as const;

/**
 * A plate's corner follows its size. The small one sits 4px inside a tool chip
 * and takes `--radius-mark`, tuned to read as the same corner as the chip
 * around it; the chip radius itself would make a 24px plate a circle.
 */
const PLATE_RADIUS = {
  xs: "rounded-mark",
  sm: "rounded-mark",
  md: "rounded-chip",
  lg: "rounded-chip",
} as const;

/**
 * Size is separate from look, because the two vary independently. The glyph
 * fills more of its box at `lg`, since without a plate there is no edge for it
 * to keep clear of. On a plate it is half the box, which leaves the mark room
 * to sit inside its tile rather than press against the edge.
 */
const BOX = { xs: "size-4", sm: "size-6", md: "size-9", lg: "size-12" } as const;
const GLYPH = {
  xs: "size-3.5",
  sm: "size-3",
  md: "size-4.5",
  lg: "size-8",
} as const;
const MONOGRAM = {
  xs: "text-micro",
  sm: "text-micro",
  md: "text-micro",
  lg: "text-body",
} as const;

/**
 * Every small mark on the site: a technology, a contact link, a location.
 *
 * A brand mark comes from the sprite in `layout.tsx`, a company's from its own
 * file, a generic shape from Lucide, and anything else falls back to a
 * monogram in the same box and colour, so a missing logo still looks like part
 * of the set rather than a hole. Always decorative: a label sits beside every
 * one of them.
 */
export function CustomMark({
  name,
  label,
  short,
  src,
  look,
  size,
}: {
  /** A sprite id from `brand-icons.ts`, or `mail` or `pin`. */
  name: string;
  /** What the monogram is derived from when there is no mark. */
  label: string;
  /** Overrides the derived monogram where initials read badly. */
  short?: string;
  /**
   * A company's mark as a file under /public, such as `role.logo`. Only its
   * shape is used, drawn in the colour the mark sits in, the same way
   * `PageHeader` draws it large, so a dark logo still shows on this ground.
   */
  src?: string;
  look: keyof typeof LOOK;
  size: keyof typeof BOX;
}) {
  const Generic = GENERIC[name as keyof typeof GENERIC];

  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center ${BOX[size]} ${LOOK[look]} ${
        look === "plate" ? PLATE_RADIUS[size] : ""
      }`}
    >
      {src ? (
        <span
          className={`${GLYPH[size]} bg-current`}
          // The file is data, so the mask cannot come from a class. Both
          // spellings: Safari only took the prefixed one until 16.4.
          style={{
            mask: `url(${src}) center / contain no-repeat`,
            WebkitMask: `url(${src}) center / contain no-repeat`,
          }}
        />
      ) : iconFor(name) ? (
        // The symbol carries its own viewBox, so this one does not need it.
        <svg className={`${GLYPH[size]} fill-current`}>
          <use href={`#mark-${name}`} />
        </svg>
      ) : Generic ? (
        <Generic className={GLYPH[size]} strokeWidth={2} />
      ) : (
        <span className={`${MONOGRAM[size]} font-bold tracking-tight`}>
          {monogramFor(label, short)}
        </span>
      )}
    </span>
  );
}
