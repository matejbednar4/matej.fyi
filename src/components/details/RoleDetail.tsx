import { CustomCard } from "@/components/primitives/CustomCard";
import type { Role } from "@/content";

/**
 * Where the role is drawn. On the landing it is a card that links through to
 * the role's own page; on that page it is the same words with no card around
 * them, under the section's `My role at` heading.
 *
 * A union, so a destination and a size can only be given to the card, and an
 * unlinked role cannot be asked for a size it never uses.
 */
type Placement =
  | { isCard: true; href: string; size?: "default" | "compact" }
  | { isCard: false; href?: undefined; size?: undefined };

/**
 * A role in full: who, what, when, and the numbers. A detail rather than a
 * preview even where it links, because the landing's card already says
 * everything the role's page says about the role itself; the page adds what
 * the company does and the work.
 *
 * As a card, the company is the heading and my title is its subtitle, the way
 * an entry on a CV reads, with the period at the far end of the label row. On
 * a phone the three stack as who, what, when.
 *
 * On the role's own page the company is already the `h1` and the link would
 * lead to the page the reader is on, so both go, and the rest stays: the title
 * and the period, the paragraph, the numbers.
 */
export function RoleDetail(props: { role: Role } & Placement) {
  const { role } = props;

  // No label above the numbers, and that was tried three ways. Every wording
  // either overclaimed, since half of these are scale rather than a win, or
  // restated the paragraph the chips already sit under. Each chip carries its
  // own caption, so the row says what it is without a line telling it to.
  //
  // Equal columns rather than chips sized to their words: see `stat-grid`.
  // The number is the point of the chip, so it is the lede size in bold, a
  // step above everything else on the card but its heading, with room around
  // it. Tight leading on both lines, because a chip is two short labels and
  // the body's leading between them read as a gap.
  //
  // The chips sit closer to each other than the row sits to the paragraph
  // above it, so they read as one block. They were 12px apart under an 8px
  // gap from the paragraph, which grouped each chip with the text instead.
  const stats = role.stats ? (
    <ul className="stat-grid gap-2">
      {role.stats.map((stat) => (
        <li key={stat.label} className="chip p-3">
          <b className="block text-lede leading-tight font-bold tabular-nums text-ink">
            {stat.value}
          </b>
          <span className="mt-1 block text-micro leading-tight uppercase tracking-label text-ink-muted">
            {stat.label}
          </span>
        </li>
      ))}
    </ul>
  ) : null;

  if (props.isCard) {
    return (
      <CustomCard
        href={props.href}
        action="Everything I did here"
        size={props.size ?? "default"}
        heading={role.company}
        headingLevel={2}
        subtitle={role.role}
        topRight={role.period}
      >
        <p>{role.contribution}</p>
        {stats}
      </CustomCard>
    );
  }

  return (
    <>
      {/* The same pair the card puts above its heading, so the section opens
          the way the role's card does: the title at one end, the period at
          the other. On a phone they are two lines, both from the left.
          Tracked capitals do not fit a job title and a date range across a
          phone, and left to wrap they broke wherever the width ran out. */}
      <div className="mb-3 flex flex-col gap-1.5 md:flex-row md:flex-wrap md:items-baseline md:gap-x-4">
        <p className="eyebrow">{role.role}</p>
        <p className="eyebrow whitespace-nowrap tabular-nums md:ml-auto">
          {role.period}
        </p>
      </div>

      {/* The lede size rather than the card's body size: here the paragraph is
          what the section is, not the body of something smaller. */}
      <p className="text-lede text-ink-muted">{role.contribution}</p>

      {stats ? <div className="mt-5">{stats}</div> : null}
    </>
  );
}
