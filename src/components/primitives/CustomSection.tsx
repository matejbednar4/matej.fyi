import type { ReactNode } from "react";

type Props = {
  id: string;
  /**
   * Optional, because a page whose `h1` already names the block does not need
   * a second title saying the same thing: the area pages hold one list, and
   * that list is what the page is.
   */
  title?: string;
  /**
   * One line under the title, saying what the block below it actually holds.
   * A title is a noun and can only name the thing; this is where it says
   * something. Optional, because a title that already answers the question
   * does not need it: the sub-pages' headings are whole sentences.
   */
  subtitle?: string;
  children: ReactNode;
};

/** A titled block: the heading, the hairline beside it, and what it holds. */
export function CustomSection({ id, title, subtitle, children }: Props) {
  return (
    <section id={id} className="scroll-mt-8 pt-12 md:pt-16">
      <div className={title ? "mb-6" : undefined}>
        {title ? (
          <div className="flex items-baseline gap-4">
            <h2>{title}</h2>
            <span aria-hidden className="h-px min-w-5 flex-1 bg-edge" />
          </div>
        ) : null}
        {/* A deck, not a caption: the display face at the step below the
            heading, one weight lighter and in the muted ink, so it reads as
            the second half of the title rather than as a note under it. An
            eyebrow was the other option and is wrong here, because an eyebrow
            is a label and this is a sentence: four words of accent uppercase
            shout, and the loudest thing in the row would stop being the
            title. */}
        {subtitle ? (
          <p className="mt-1.5 font-display text-lede font-medium text-ink-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
