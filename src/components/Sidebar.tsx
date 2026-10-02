"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";

type Section = { id: string; label: string };
type Page = { href: string; label: string };

/**
 * What the rail navigates, in the only two shapes the site has: the sections of
 * the page it is on, or a list of pages with at most one of them current.
 *
 * A union rather than two optional lists, so no caller can pass both and the
 * scroll spy can never run against ids that are not on the page.
 */
export type RailNav =
  | { kind: "sections"; items: readonly Section[] }
  | { kind: "pages"; label: string; current: string; items: readonly Page[] };

/**
 * How far below the top of the viewport a section becomes current, in pixels.
 * Deliberately small and fixed rather than a share of the viewport: a share
 * breaks whenever the first section is shorter than it.
 */
const ACTIVATION_OFFSET = 96;

/** Matches Tailwind's `md`, which is where the rail stops being a column. */
const DESKTOP = "(min-width: 48rem)";

/**
 * One identity for "no sections", so the spy effect does not re-attach its
 * listeners on every render of a rail that has none.
 */
const NO_SECTIONS: readonly Section[] = [];

/**
 * Menu, Close and the bar's way back. No padding and no fill, so their ink
 * lines up with the page's gutter; `hit-area` gives the finger a target the
 * size of the bar instead. Their feedback is the accent, `feedback-text`.
 */
const BAR_BUTTON =
  "pressable feedback-text hit-area flex items-center gap-2 text-ui text-ink-muted";

function RowDot({ current }: { current: boolean }) {
  return (
    <span
      aria-hidden
      className={`size-1.5 shrink-0 rounded-pill transition-transform duration-150 ${
        current ? "scale-150 bg-current" : "bg-ink-muted"
      }`}
    />
  );
}

/**
 * The rail, in two shapes.
 *
 * Desktop is a sticky column. Below `md` the same markup becomes a drawer off
 * the right edge, with a progress line and a label pinned to the top of the
 * screen. One DOM tree rather than two, so the nav, the way back and whatever
 * the page passes in under them are written once and cannot drift between the
 * two layouts.
 *
 * With `nav.kind === "sections"` the current row is the last section whose top
 * has passed just under the top of the viewport. Two approaches that look
 * reasonable and are not:
 *
 * - Highest `intersectionRatio`. Ratio is intersected area over *target* area,
 *   so a tall section filling the screen scores lower than a short one that
 *   happens to fit. Work would lose to Contact almost always.
 * - Most visible pixels, or a line a third of the way down. About is only about
 *   250px tall, so Work is already above any such line at scroll zero and
 *   the nav is wrong before the reader has scrolled at all.
 *
 * A small offset avoids both: it asks "which heading did I last scroll past",
 * which is what a reader actually means, and it does not care how tall anything
 * is.
 */
export function Sidebar({
  nav,
  back,
  children,
}: {
  nav: RailNav;
  /** The way out, first in the rail. Given on every page below the landing. */
  back?: { href: string; label: string };
  /**
   * Under the nav, behind a divider: the landing's block of personal detail,
   * which the landing writes itself, so the rail knows how to navigate and
   * nothing about me. Omitted everywhere else, where the rail is the way back
   * and an index and nothing more.
   */
  children?: ReactNode;
}) {
  const sections = nav.kind === "sections" ? nav.items : NO_SECTIONS;

  const [active, setActive] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const dimRef = useRef<HTMLButtonElement>(null);

  // Whether the drawer is drawn at all. `open` is the truth; this lags it on
  // the way out, so the drawer stays on screen for the length of its slide.
  // Adjusted during render, the way `CustomModal` holds its lagging item.
  const [drawn, setDrawn] = useState(false);
  if (open && !drawn) setDrawn(true);

  useEffect(() => {
    const update = () => {
      let current = sections[0]?.id;

      // Sections carry pt-16, so their box starts 64px above their heading.
      // Activating a little below that puts the switch roughly where the
      // previous section's content leaves the screen.
      const line = ACTIVATION_OFFSET;

      for (const item of sections) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }

      // At the very top the first section always wins, whatever the maths says.
      if (window.scrollY <= 4) current = sections[0]?.id;

      // The last section is usually too short to reach the line before the page
      // runs out of scroll, so bottom-of-document always selects it.
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = window.scrollY >= scrollable - 2;
      if (atBottom) current = sections[sections.length - 1]?.id;

      setActive(current);
      // A page shorter than the viewport has nothing to report, so it reads as
      // complete rather than dividing by zero.
      setProgress(
        scrollable <= 0 ? 100 : Math.min(100, (window.scrollY / scrollable) * 100),
      );
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // Widening to a desktop shuts the drawer, so it is not found open again on
  // the way back down.
  useEffect(() => {
    const query = matchMedia(DESKTOP);
    const shut = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", shut);
    return () => query.removeEventListener("change", shut);
  }, []);

  // Escape closes. The page behind is not locked: the drawer contains its own
  // scrolling, and locking the document on iOS changed what Safari drew under
  // its toolbar, which is how the drawer opening made a box appear there.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // The first row of the nav, not the first link in the drawer: the way back
    // comes first in the markup and is hidden on a phone, and focusing a
    // hidden link does nothing, which would leave focus behind the dim.
    panelRef.current
      ?.querySelector<HTMLAnchorElement>("nav a")
      ?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The slide, driven the way `CustomModal` drives its fade: the drawer is
  // drawn off the edge, then stamped `data-shown` and slides on; on close the
  // stamp comes off, it slides back, and only then is it hidden. A plain CSS
  // transition cannot run out of `display: none`, and the shut drawer has to
  // be hidden, not parked off the edge (see the comment on the `<aside>`).
  useEffect(() => {
    const panel = panelRef.current;
    const dim = dimRef.current;
    if (!drawn || !panel || !dim) return;

    if (open) {
      // A style flush first, so the drawer is resolved once off the edge
      // before it is asked onto it. In one go the first style it ever gets is
      // the open one, and nothing slides.
      void panel.getBoundingClientRect();
      panel.dataset.shown = "";
      dim.dataset.shown = "";
      return;
    }

    delete panel.dataset.shown;
    delete dim.dataset.shown;
    // Hidden once the slide has run, read off the elements rather than timed,
    // so a desktop that runs no slide, or reduced motion, hides it at once.
    let cancelled = false;
    const slides = [...panel.getAnimations(), ...dim.getAnimations()].map(
      (animation) => animation.finished,
    );
    Promise.allSettled(slides).then(() => {
      if (!cancelled) setDrawn(false);
    });
    // Reopened mid-slide: the open branch takes over, and the transition
    // turns round from wherever the drawer had got to.
    return () => {
      cancelled = true;
    };
  }, [open, drawn]);

  const close = () => {
    setOpen(false);
    openerRef.current?.focus();
  };

  // What the pinned bar names: the section the reader is in on the landing,
  // and the page itself everywhere else, so a reader halfway down a list of
  // backend work can look up and see "Backend".
  const currentLabel =
    nav.kind === "sections"
      ? (sections.find((item) => item.id === active)?.label ?? "")
      : (nav.items.find((item) => item.href === nav.current)?.label ?? "");

  return (
    <>
      {/* Pinned to the top of the screen below md. The progress line is the
          rail's job on a phone: there is no room for a column of links, but a
          reader still wants to know how far through they are.

          The way back is the one rail row that cannot wait behind a menu
          button, so it takes the left of the bar wherever there is one, as an
          arrow alone: its label is the rail's, and the bar's one line of
          words is where the reader is, not where they came from. With it the
          bar is three cells, the way a phone's own navigation bar is laid
          out, the outer two equal so the name is centred on the screen and
          not on whatever is left beside the buttons. Without it the name
          takes the left itself: on the landing it is the section the reader
          has reached, and a progress label reads from the margin, where the
          eye goes to find it, not from the middle of the bar. */}
      {/* Flat ground, no grain: on a phone the strip behind the status bar is
          the root's colour, flat, and a grained bar under it read as a
          different colour. */}
      <div className="fixed inset-x-0 top-0 z-40 bg-background md:hidden">
        <div
          className={`items-center gap-3 px-5 py-3.5 ${
            back ? "grid grid-cols-[1fr_auto_1fr]" : "flex justify-between"
          }`}
        >
          {back ? (
            <Link
              href={back.href}
              aria-label={`Back to ${back.label}`}
              className={`group justify-self-start ${BAR_BUTTON}`}
            >
              <ArrowLeft
                className="glyph glyph-back size-4.5 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
          ) : null}
          <p
            className={`min-w-0 truncate text-ui font-semibold text-ink ${
              back ? "text-center" : ""
            }`}
          >
            {currentLabel}
          </p>
          <button
            ref={openerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="rail"
            className={`${BAR_BUTTON} cursor-pointer justify-self-end`}
          >
            <Menu className="size-4.5 shrink-0" strokeWidth={2} aria-hidden />
            Menu
          </button>
        </div>
        <div aria-hidden className="h-0.5 bg-edge">
          <div
            className="h-full bg-accent"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dims the page and catches a tap outside the drawer. After the bar in
          the DOM at the same z-index, so it dims the bar too. On a phone it
          stops at the layout viewport like every fixed box, and the strip
          under Safari's toolbar is left to Safari's own fade. */}
      {drawn ? (
        <button
          ref={dimRef}
          type="button"
          aria-label="Close menu"
          onClick={close}
          className="rail-dim fixed inset-0 z-40 cursor-default bg-background/70 md:hidden"
        />
      ) : null}

      {/* Shut, the drawer is not drawn at all, rather than parked off the
          edge. Parked there it was still a full-height fixed box on the
          ground colour, and once it had been open Safari kept painting a flat
          box under its toolbar until a reload. Hidden is also out of the tab
          order and the accessibility tree, which `inert` used to do. */}
      <aside
        id="rail"
        ref={panelRef}
        aria-label={children ? "Navigation and contact" : "Navigation"}
        className={`rail-drawer md:sticky md:top-16 ${drawn ? "" : "max-md:hidden"}`}
      >
        {/* Exactly where Menu was: the drawer's padding matches the pinned bar
            and this is the Menu button's own size, so the finger that opened
            the drawer closes it without moving. */}
        <button
          type="button"
          onClick={close}
          className={`${BAR_BUTTON} mb-5 ml-auto cursor-pointer md:hidden`}
        >
          <X className="size-4.5 shrink-0" strokeWidth={2} aria-hidden />
          Close
        </button>

        {/* First, above everything else: on a detail page the way out is the
            one thing a reader is most likely to want. The arrow slides back
            with the row's feedback, the way the press goes. Desktop only: on
            a phone the pinned bar already carries it at the top of the
            screen, and the drawer would say it twice. */}
        {back ? (
          <Link
            href={back.href}
            onClick={() => setOpen(false)}
            className="group pressable feedback-fill rail-row max-md:hidden"
          >
            <ArrowLeft
              className="glyph glyph-back size-4 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            {back.label}
          </Link>
        ) : null}

        <nav
          aria-label={nav.kind === "sections" ? "Page sections" : nav.label}
          // The divider parts the list from the way back, so it goes where the
          // way back does: on a phone it would be a line under nothing.
          className={`flex flex-col gap-0.5 max-md:gap-1 ${
            back ? "md:divider-top md:mt-4 md:pt-4" : ""
          }`}
        >
          {nav.kind === "pages" ? (
            <p className="eyebrow mb-2 px-3">{nav.label}</p>
          ) : null}

          {nav.kind === "sections"
            ? nav.items.map((item) => {
                const on = item.id === active;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={on ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    className="pressable feedback-fill rail-row"
                  >
                    <RowDot current={on} />
                    {item.label}
                  </a>
                );
              })
            : nav.items.map((item) => {
                const on = item.href === nav.current;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={on ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="pressable feedback-fill rail-row"
                  >
                    <RowDot current={on} />
                    {item.label}
                  </Link>
                );
              })}
        </nav>

        {children ? (
          <div className="divider-top mt-6 flex flex-col gap-1 pt-4">
            {children}
          </div>
        ) : null}
      </aside>
    </>
  );
}
