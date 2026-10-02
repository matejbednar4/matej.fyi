"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { X } from "lucide-react";

/**
 * What a dialog holds decides how wide it is. A picture's panel is as big as
 * the picture; a card is a card's width. Behind both is the same ground at
 * 85%, so the page is still there under whatever opened: a near-black scrim
 * was tried under pictures and read as leaving the site.
 */
const KIND = {
  image: { panel: "" },
  card: { panel: "w-full max-w-200" },
} as const;

/**
 * Every dialog on the site.
 *
 * A real `<dialog>` opened with `showModal()`: the focus trap, Escape, the inert
 * background and the top layer all come with it, and every one of those is
 * something a hand-rolled overlay gets subtly wrong. One opened from inside
 * another lands on top of it, because each is its own entry in the top layer.
 *
 * Driven by the item it shows rather than by a ref the caller pokes: the item
 * is the state, and open is what that state looks like. `null` is shut.
 *
 * Two items, not one. `item` is the truth; `shown` is what the dialog draws,
 * and it lags on close so the contents stay on screen for the length of the
 * fade. Without it they unmount on the frame the dialog starts closing, the
 * panel collapses to its own padding, and the close button rides that collapse
 * down the screen.
 *
 * The fade is driven from here, not from CSS alone. `showModal()` shows the
 * dialog at opacity 0, this marks it `data-shown` and it fades up; on close
 * the mark comes off, the dialog fades down while still in the top layer, and
 * only then is it closed. See `.modal` in `globals.css` for why the pure-CSS
 * version did not survive Safari.
 */
export function CustomModal<T>({
  item,
  onClose,
  kind,
  label,
  children,
}: {
  item: T | null;
  onClose: () => void;
  kind: keyof typeof KIND;
  /** The dialog's accessible name, where its contents do not supply one. */
  label?: string;
  /** Draws the item. Called with the lagging copy, so it is never null. */
  children: (item: T) => ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Adjusted during render rather than in an effect, which is React's own
  // answer for state derived from a prop. It only ever moves forward: `item`
  // going null is what closes the dialog.
  const [shown, setShown] = useState(item);
  if (item !== null && item !== shown) setShown(item);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    if (item !== null) {
      // Guarded: showModal() on an open dialog throws, and it is already open
      // when an item changes under it or it is reopened mid-fade.
      if (!el.open) {
        el.showModal();
        // showModal() focuses the first control inside, which is the close
        // button, and browsers ring it as though it had been tabbed to. Focus
        // the panel instead: the dialog still holds focus and still traps it,
        // and a keyboard user's first Tab lands on Close with its ring.
        panel.current?.focus({ preventScroll: true });
      }
      // A style flush between showing the dialog and marking it shown, so the
      // browser resolves it once at opacity 0 before it is asked for 1 and
      // runs the transition between the two. Done in one go, the first style
      // it ever computes is the shown one and nothing fades.
      void el.getBoundingClientRect();
      el.dataset.shown = "";
      return;
    }

    // Closing. Guarded for the same reason: close() on a shut dialog fires a
    // second onClose.
    if (!el.open) return;
    delete el.dataset.shown;
    // Leave the top layer once the fade has run, and not before, or the
    // dialog drops out from under its own transition. The running animations
    // are read off the element rather than timed, so a browser that ran no
    // transition, or ran a 0.01ms one under reduced motion, closes at once.
    let cancelled = false;
    const fades = el
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished);
    Promise.allSettled(fades).then(() => {
      if (!cancelled && el.open) el.close();
    });
    // Reopened before the fade finished: the open branch above takes over.
    return () => {
      cancelled = true;
    };
  }, [item]);

  // Every way out ends in `onClose`, and the fade runs from there. The
  // target checks matter when one dialog holds another: neither event bubbles
  // natively, but React propagates both through the tree anyway, so closing
  // the inner one would otherwise close this too.
  return (
    <dialog
      ref={dialog}
      aria-label={label}
      // Escape. Left to the browser it closes the dialog on the spot, with no
      // fade, so it is turned into a request instead.
      onCancel={(event) => {
        if (event.target !== dialog.current) return;
        event.preventDefault();
        onClose();
      }}
      onClose={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      // A click that lands on the dialog itself is a click on the backdrop: the
      // panel and everything in it are children, so they never match.
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      className="modal bg-background/85"
    >
      {/* Never taller than the screen; `.modal-panel` caps it, and the
          contents scroll inside it.

          The scroller is a child rather than the panel itself, so the close
          button, which is positioned against the panel, stays put while the
          contents move under it. The padding is on the scroller: overflow
          clips at the padding box, so a card's shadow stays inside it. */}
      <div
        ref={panel}
        // Focusable from script only, and never ringed: it is where focus
        // waits on open, not a control.
        tabIndex={-1}
        className={`modal-panel relative flex flex-col outline-none ${KIND[kind].panel}`}
      >
        <div className="min-h-0 overflow-y-auto p-4">
          {shown !== null ? children(shown) : null}
        </div>

        {/* The secondary ground, a step lighter than the card it lands on,
            with the shadow anything floating over content keeps. A
            surface-coloured button there was a circle of card on card.

            In the corner of whatever opened, 8px in from its top and right
            edges (the scroller's padding is p-4, so top-6 right-6), and 28px
            across so its foot still clears the line a card's heading starts
            on. At 36px there was no spot inset from the corner that did not
            sit on the heading. It grows under the pointer or the finger like
            any raised control, by the small-control amount, since 4% of 28px
            is a pixel. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="pressable press-small feedback-grow absolute top-6 right-6 grid size-7 cursor-pointer place-items-center rounded-pill bg-surface-alt text-ink [box-shadow:var(--shadow-gloss),var(--shadow-card)]"
        >
          <X className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </dialog>
  );
}
