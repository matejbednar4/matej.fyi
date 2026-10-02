import { ArrowRight, Maximize2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { externalLink } from "@/utils/externalLink";

/**
 * How a card announces what it is: something beside the heading, or a label
 * above it, never both. Two of them is two answers to the same question, and
 * the union makes writing both a type error rather than a thing to remember.
 *
 * `icon` is a component reference, never rendered markup: the caller says which
 * icon, the card owns the size, the colour and where it sits, so no two cards
 * can draw one differently.
 *
 * `mark` is the one exception, and it is narrow: a brand mark is not a Lucide
 * component, it is a `CustomMark`, which already owns its own box, plate and
 * sizes for exactly this reason. The card places it and does not draw it. Pass
 * a `CustomMark` and nothing else.
 *
 * `captionIcon` belongs to the caption rather than the heading: a small mark
 * to the left of the label above, in the label's own colour. A highlight card
 * carries its area this way, the mark the area's door uses with its name,
 * while the heading keeps its own line underneath. `captionMark` is the same
 * place for a `CustomMark`, such as a company's logo: a work card's label
 * reads "[logo] Backend at Tagly". One or the other, and only with a caption.
 */
type Lead =
  | {
      icon: LucideIcon;
      mark?: undefined;
      caption?: undefined;
      captionIcon?: undefined;
      captionMark?: undefined;
    }
  | {
      mark: ReactNode;
      icon?: undefined;
      caption?: undefined;
      captionIcon?: undefined;
      captionMark?: undefined;
    }
  | {
      caption?: string;
      captionMark?: ReactNode;
      captionIcon?: undefined;
      icon?: undefined;
      mark?: undefined;
    }
  | {
      caption: string;
      captionIcon: LucideIcon;
      captionMark?: undefined;
      icon?: undefined;
      mark?: undefined;
    };

type Content = {
  heading: string;
  /**
   * Where the heading sits in the document outline. The card cannot infer this:
   * the same card is the `h1` of an area page and an `h3` inside a grid.
   */
  headingLevel?: 1 | 2 | 3;
  /**
   * The right end of the card's top line: a period, a count, an org. It shares
   * the label row when there is a caption or a subtitle to share it with, and
   * the heading's row when there is not, so a card with one note above the
   * heading never spends a whole row on it. On a phone every part of the head
   * is a line of its own, and this one comes last.
   */
  topRight?: string;
  /**
   * What the heading is to me, the way a job title goes with a company's
   * name. Not a caption, which says what kind of thing the card is: a caption
   * is above the heading at every width, while a subtitle leads the label
   * row on a desktop and sits under the heading on a phone, so a role reads
   * who, what, when rather than opening on two lines of tracked capitals.
   */
  subtitle?: string;
  /**
   * Everything under the heading: the prose, then whatever follows it. Pass
   * bare semantic elements and nothing else. The card supplies the type, the
   * colour and the gap between them, so a caller never writes a class here.
   */
  children?: ReactNode;
  /** `compact` is for cards subordinate to another, and quiets the heading. */
  size?: "default" | "compact";
  /**
   * Which ground the card is made of. `alt` is the chip colour, one step
   * further from the background, for a card that opened out of something rather
   * than sitting on the page in its own right.
   */
  tone?: "surface" | "alt";
};

/**
 * Where a card goes, or what it does. A card is a link by default: a real
 * `<a>` keeps middle-click, "copy link address" and anything a crawler can
 * follow, and needs no client component. `onPress` is for a card that opens
 * something in place, a dialog, so only a client component can pass it: the
 * highlights on the landing open a piece of work without leaving the page.
 * Never both, and an action label always arrives with one or the other, so a
 * label that does nothing cannot be written.
 */
type Navigation =
  | { href: string; action?: string; actionIcon?: ActionIcon; onPress?: undefined }
  | { onPress: () => void; action: string; actionIcon?: ActionIcon; href?: undefined }
  | {
      href?: undefined;
      onPress?: undefined;
      action?: undefined;
      actionIcon?: undefined;
    };

/**
 * The glyph after the action label, and how it answers the pointer. `arrow`
 * points the way a link goes and slides toward it on hover; `expand` opens
 * something here and grows in place, the glyph a row in a stack panel uses.
 * Left out, it follows what the card does, the same rule `CustomButton` reads
 * off itself: `arrow` for `href`, `expand` for `onPress`. An arrow on a card
 * that opens a dialog promises a page change that never comes.
 */
type ActionIcon = "arrow" | "expand";

/**
 * Every raised surface on the site.
 *
 * The contract is fixed and callers fit it, not the other way round. There is
 * no prop for a caller's one-off: no `className`, no second heading, no escape
 * hatch. If a card seems to need one, the content is wrong for a card. That is
 * what keeps every card on the site the same object.
 */
export function CustomCard({
  icon: Icon,
  mark,
  caption,
  captionIcon: CaptionIcon,
  captionMark,
  heading,
  headingLevel = 1,
  topRight,
  subtitle,
  children,
  action,
  actionIcon,
  href,
  onPress,
  size = "default",
  tone = "surface",
}: Content & Lead & Navigation) {
  const compact = size === "compact";
  const Heading = `h${headingLevel}` as const;

  // The type scale is not a prop because `compact` already says how loud the
  // card should be: a subordinate card gets a subordinate heading. The mark
  // rides the same ladder, so it is always the weight of the heading it sits
  // beside rather than a fixed size that grows wrong.
  const headingClass =
    headingLevel === 1
      ? "font-display text-3xl font-semibold"
      : compact
        ? "text-body-sm font-bold"
        : "font-display text-xl font-semibold";

  const iconClass =
    headingLevel === 1 ? "size-7" : compact ? "size-4.5" : "size-5";

  // Same surface either way: a detail card is subordinate by size and width,
  // not by being a different material. One ground utility or the other, never
  // both: two background-colour rules on one element are settled by stylesheet
  // order rather than by class order.
  const ground = tone === "alt" ? "surface-alt" : "surface";

  // `mt-auto` pins the action to the bottom of the card, so a row of cards
  // with taglines of different lengths still lines its actions up. The gap
  // above it is padding rather than a margin, because a margin would lose to
  // the auto one when there is no slack to absorb. `self-start` keeps the hit
  // area the width of the label, which blockifying inside a flex column would
  // otherwise stretch to the full card. The label holds still and the arrow
  // moves, like every other glyph on the site.
  const actionClass =
    "mt-auto self-start pt-4 inline-flex items-center gap-2 text-ui font-semibold text-accent";
  const expands = (actionIcon ?? (onPress ? "expand" : "arrow")) === "expand";
  const ActionGlyph = expands ? Maximize2 : ArrowRight;
  const actionLabel = (
    <>
      {action}
      <ActionGlyph
        aria-hidden
        className={`glyph size-4 ${expands ? "glyph-open" : "glyph-forward"}`}
      />
    </>
  );

  // A card that opens something in place is a `div` whose action is a real
  // `<button>`, and the button's invisible `::after` covers the whole card, so
  // a press anywhere on it is a press of the button. Not a `<button>` around
  // the card: a heading inside a button is not valid HTML, and a screen reader
  // would read the whole card as one button label. The ring is drawn on that
  // same covering layer, so focus outlines the card rather than the label,
  // and the button's accessible name carries the heading, so six cards do not
  // read as six identical "Read in full" buttons.
  const actionRow = !action ? null : onPress ? (
    <button
      type="button"
      onClick={onPress}
      aria-label={`${action}: ${heading}`}
      className={`${actionClass} cursor-pointer focus-visible:outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:[box-shadow:var(--shadow-ring)] ${
        ground === "surface-alt" ? "after:rounded-chip" : "after:rounded-card"
      }`}
    >
      {actionLabel}
    </button>
  ) : (
    <span className={actionClass}>{actionLabel}</span>
  );

  const content = (
    <>
      {/* The head: the label row and the heading as one wrapping row, so a
          phone can put its parts in a different order from a desktop without
          any of them being written twice.

          On a desktop the caption or the subtitle leads the first line and
          the note ends it, drawn as eyebrows so the two ends are one
          typographic pair; the heading takes the whole next line. With
          nothing to lead the first line the heading leads it instead and the
          note ends it, so a card with one note never spends a row on it.

          On a phone every part is a line of its own, in the order they are
          written: a caption, the heading, a subtitle, the note. Who, what,
          when. Tracked capitals do not fit a job title and a date range
          across a phone. Written in that order, it is also the order a
          screen reader hears at every width; a desktop only moves the heading
          below the label row.

          The head is one tight unit, closer together than anything below it,
          so a label reads as belonging to its heading and not to the body. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {caption ? (
          <p className="eyebrow flex items-center gap-1.5 max-md:basis-full">
            {CaptionIcon ? (
              <CaptionIcon
                aria-hidden
                strokeWidth={2.25}
                className="size-3.5 shrink-0"
              />
            ) : (
              captionMark
            )}
            {caption}
          </p>
        ) : null}

        {/* The mark and the heading are one item, so the heading wraps beside
            its mark rather than falling below it. */}
        <div
          className={`flex min-w-0 items-center gap-2 max-md:basis-full ${
            caption || subtitle ? "md:order-last md:basis-full" : ""
          }`}
        >
          {Icon ? (
            <Icon
              aria-hidden
              strokeWidth={2}
              className={`shrink-0 text-accent ${iconClass}`}
            />
          ) : null}
          {mark}
          <Heading className={headingClass}>{heading}</Heading>
        </div>

        {subtitle ? (
          <p className="eyebrow max-md:basis-full">{subtitle}</p>
        ) : null}
        {topRight ? (
          <p className="eyebrow tabular-nums whitespace-nowrap max-md:basis-full md:ml-auto">
            {topRight}
          </p>
        ) : null}
      </div>

      {/* One column with one gap, so the card spaces its own contents and no
          caller ever sets a margin. The prose treatment is inherited, which is
          why children arrive as bare elements. The space above the body is
          wider than any gap inside the head, and the gap between blocks is a
          paragraph's, so a list or a row of chips is as clearly its own block
          as a second paragraph is. */}
      {children ? (
        <div className="mt-3 flex flex-col gap-3 text-body-sm text-ink-muted">
          {children}
        </div>
      ) : null}

      {actionRow}
    </>
  );

  // A phone gets the compact padding on every card: 28px a side is a fifth of
  // a 390px screen spent on air.
  const pad = compact ? "p-5" : "p-5 md:p-7";

  // The column is what lets the action row sit at the bottom: a grid stretches
  // every card in a row to the tallest, and the flex context turns that spare
  // height into something to push against.
  const base = `${ground} flex flex-col ${pad}`;

  // `group` is what the arrow's slide hangs off; see `.glyph-forward`.
  // `feedback-shadow`, not `feedback-grow`: the card holds still while its
  // shadow deepens and its arrow slides, under the pointer or the finger.
  // Grown from its centre, the card pulled the arrow back by about as much as
  // the arrow slid, so it looked as if nothing moved.
  const responds = "group feedback-shadow pressable press-large";

  // `relative` so the button's covering layer spans this card and no further.
  // The card is hovered and pressed through that layer, which is its child.
  if (onPress) {
    return <div className={`${base} relative ${responds}`}>{content}</div>;
  }
  if (!href) return <div className={base}>{content}</div>;

  // No `block` here: `base` is already `flex`, and two display utilities on one
  // element are settled by stylesheet order rather than by the order they are
  // written, so the column would win or lose at random.
  const interactive = `${base} ${responds} surface-interactive no-underline`;
  // Only in-app routes get the router; a hash, a mailto or an external URL
  // would gain nothing and Link would warn about them.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={interactive}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={interactive} {...externalLink(href)}>
      {content}
    </a>
  );
}
