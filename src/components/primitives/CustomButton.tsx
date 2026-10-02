import { ArrowRight, Maximize2 } from "lucide-react";

import { CustomMark } from "@/components/primitives/CustomMark";
import { externalLink } from "@/utils/externalLink";

/**
 * A button either goes somewhere or does something, never both, and the union
 * makes writing both a type error rather than a thing to remember.
 *
 * `href` is the common case, and the reason the site has almost no handlers:
 * it is a static export, so a real `<a>` keeps middle-click, "copy link
 * address" and anything a crawler can follow. A handler is for the one control
 * that changes what is on the page without changing the page, which today is
 * the work filter.
 */
type Action =
  | { href: string; onPress?: undefined; pressed?: undefined }
  | { href?: undefined; onPress: () => void; pressed?: boolean };

type Props = {
  /** The button's text. */
  label: string;
  /**
   * The name of a mark to sit left of the label: a simple-icons slug, or one of
   * the generic shapes. The button renders it itself, at one size, so no two
   * buttons can end up with differently sized icons.
   */
  icon?: string;
  /** A number after the label, quieter than it. How many, of whatever it is. */
  count?: number;
  variant?: "primary" | "secondary" | "surface";
  /**
   * The shape, which is a different question from the emphasis `variant` sets.
   * A pill sits in a row of its own kind and is as wide as its words. A `row`
   * fills its container, reads left to right with an arrow at the far end, and
   * is what a label too long for a pill wants: a list of work is a list of
   * sentences, and a sentence in a pill is a paragraph with a curved edge.
   */
  layout?: "pill" | "row";
} & Action;

/**
 * Every action on the site. Takes strings and does the rest: a caller never
 * passes markup, a class or a rendered icon, so every button is the same
 * object.
 *
 * A secondary button is a `chip`, the same object as a role's stat chips: the
 * chip colour with the gloss along its top edge, and no line around it.
 */
export function CustomButton(props: Props) {
  const { label, icon, count, variant = "primary", layout = "pill" } = props;

  const RowGlyph = props.href ? ArrowRight : Maximize2;

  // What the button is made of: its fill, its resting shadow, and the focus
  // ring drawn over that shadow. Every ground carries its resting shadow into
  // focus, because box-shadow is one property: a ring written on its own would
  // drop the pill's glow or the surface's gloss for as long as it held focus.
  const GROUND = {
    primary:
      "bg-accent text-background [box-shadow:var(--shadow-pill)] " +
      "focus-visible:[box-shadow:var(--shadow-ring),var(--shadow-pill)]",
    secondary:
      "chip text-ink " +
      "focus-visible:[box-shadow:var(--shadow-ring),var(--shadow-gloss)]",
    // The card colour, lifted by the gloss alone. For a button that sits inside
    // something chip-coloured, where the chip ground of a secondary would be
    // the same value on itself.
    surface:
      "bg-surface text-ink [box-shadow:var(--shadow-gloss)] " +
      "focus-visible:[box-shadow:var(--shadow-ring),var(--shadow-gloss)]",
  } as const;

  // The feedback follows the shape, not the colour, under the pointer and the
  // finger alike. A pill sits on the page, so it grows a little. A row sits in
  // a list inside another surface, so it fills and turns its label to the
  // accent, the way a rail row lights up; its glyph moves as well.
  //
  // Semibold rather than bold, because a row's label is a whole sentence and a
  // pill's is two words. Full width, so it takes the gentler press a card does.
  const shape =
    layout === "row"
      ? "group press-large feedback-fill w-full justify-between gap-4 rounded-chip px-4 py-3 text-left text-body-sm font-semibold"
      : "feedback-grow rounded-pill px-5 py-2.5 text-ui font-bold";

  const className = `pressable inline-flex items-center gap-2 no-underline focus-visible:outline-none ${shape} ${GROUND[variant]}`;

  const content = (
    <>
      {icon ? (
        <CustomMark name={icon} label={label} look="bare" size="xs" />
      ) : null}
      {label}
      {count === undefined ? null : (
        <span className="tabular-nums opacity-60">{count}</span>
      )}
      {/* The glyph is read off what the button is, not passed in: one that
          navigates points the way it goes, one that acts opens in place. An
          arrow on the second promises a page change that never comes. */}
      {layout === "row" ? (
        <RowGlyph
          aria-hidden
          className={`glyph size-4 shrink-0 ${
            props.href ? "glyph-forward" : "glyph-open"
          }`}
        />
      ) : null}
    </>
  );

  // A toggle rather than a destination. `aria-pressed` is what tells a screen
  // reader this is a switch and which way it is set; the fill only says it to
  // someone looking.
  if (props.onPress) {
    return (
      <button
        type="button"
        onClick={props.onPress}
        aria-pressed={props.pressed}
        className={`${className} cursor-pointer`}
      >
        {content}
      </button>
    );
  }

  return (
    <a href={props.href} className={className} {...externalLink(props.href)}>
      {content}
    </a>
  );
}
