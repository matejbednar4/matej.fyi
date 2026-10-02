"use client";

import { useState } from "react";

import { CustomModal } from "@/components/primitives/CustomModal";

/**
 * The thumbnail's shape. A face is a fixed circle; a screenshot is a square
 * cropped to its centre, because a row mixing a tall phone screenshot with a
 * wide photograph has no baseline to sit on. The square has no size of its own:
 * it fills the width it is given, so the grid it sits in decides how big it is.
 */
const SHAPE = {
  circle: "size-24 rounded-pill",
  square: "aspect-square w-full rounded-card",
} as const;

/**
 * What the thumbnail sits on, which decides its depth. Depth is claimed once:
 * on the page ground it is a surface of its own, with the card's shadow and
 * the ring over it; inside a card it takes the gloss alone, the way a
 * `CustomMark` plate does, since a shadow there says "this floats" a second
 * time. Its focus ring is written out with it, so focus never brings the
 * card's shadow back.
 */
const GROUND = {
  page: "surface surface-interactive",
  card:
    "bg-surface [box-shadow:var(--shadow-gloss)] focus-visible:outline-none " +
    "focus-visible:[box-shadow:var(--shadow-ring),var(--shadow-gloss)]",
} as const;

/**
 * Any picture that opens to its full size: my face at the top of a page, and
 * the screenshots under a piece of work.
 *
 * The thumbnail is `object-cover`, a window onto the file rather than a squashed
 * copy of it, and the full frame opens in a `CustomModal`. It is only
 * requested when someone opens it, since the dialog draws nothing while shut.
 *
 * A client component, because opening is its whole job and something has to
 * hold whether it is open.
 */
export function CustomMedia({
  src,
  full = src,
  alt,
  caption,
  shape,
  ground = "page",
  priority = false,
}: {
  /** What the thumbnail draws. */
  src: string;
  /** The full frame, where it is a different file from the thumbnail. */
  full?: string;
  /** What the picture shows. Required: these are evidence, not decoration. */
  alt: string;
  /** A few words over the foot of the thumbnail, and under the full picture. */
  caption?: string;
  shape: keyof typeof SHAPE;
  /** The page ground, or inside a card. */
  ground?: keyof typeof GROUND;
  /** Above the fold: fetch it first rather than lazily. */
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // The visible caption names it when there is one, so the alt text stays
        // free to describe the full picture rather than being read twice.
        aria-label={`${caption ?? alt}. Open the full picture.`}
        className={`${GROUND[ground]} pressable press-none feedback-grow flex shrink-0 cursor-pointer flex-col overflow-hidden ${SHAPE[shape]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element --
            image optimisation is off under output: "export", so this is what
            next/image would emit anyway. */}
        <img
          src={src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="min-h-0 w-full flex-1 object-cover"
        />

        {/* The caption at the foot of the tile, on a strip of the secondary
            ground, the one a stack panel sits on, so it reads as a label set
            under the picture rather than more of the tile. Hidden from the
            accessibility tree because the button's label already says it.

            Below the picture, not laid over it. The tile clips to rounded
            corners, and a clipped corner is anti-aliased: a picture running
            under the strip to the bottom edge shows through those half-covered
            pixels as a pale notch in both bottom corners. In flow, the picture
            stops where the strip starts, so the bottom corners are the strip's
            colour on the tile's own, and the square stays square because the
            picture gives up the height the caption takes. */}
        {caption ? (
          <span
            aria-hidden
            className="shrink-0 bg-surface-alt px-2.5 py-1.5 text-left text-meta leading-snug text-ink"
          >
            {caption}
          </span>
        ) : null}
      </button>

      <CustomModal
        kind="image"
        item={open ? full : null}
        onClose={() => setOpen(false)}
      >
        {(source) => (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
            <img
              src={source}
              alt={alt}
              className="max-h-[88dvh] w-auto max-w-full rounded-card object-contain [box-shadow:var(--shadow-card)]"
            />
            {caption ? (
              <p className="mt-3 text-center text-meta text-ink-muted">
                {caption}
              </p>
            ) : null}
          </>
        )}
      </CustomModal>
    </>
  );
}
