"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { StackItemPreview } from "@/components/previews/StackItemPreview";
import { CustomModal } from "@/components/primitives/CustomModal";
import { StackItemDetail } from "@/components/details/StackItemDetail";
import { WorkItemDetail } from "@/components/details/WorkItemDetail";
import { type StackItem, type WorkItem } from "@/content";

/**
 * How long a panel takes to open or shut: the site's longer duration, read
 * from the token so the two cannot drift, and nothing at all for a reader who
 * asked for reduced motion. In milliseconds, which is what `animate()` takes.
 *
 * Read with its unit, not as a bare number. The token is written `260ms`, but
 * the CSS pipeline prints it in its shortest form, `.26s`, and a bare
 * `parseFloat` read that as 0.26ms: every panel opened and shut in a quarter
 * of a millisecond, which is a snap.
 */
function panelDuration() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  const token = getComputedStyle(document.documentElement)
    .getPropertyValue("--dur-lg")
    .trim();
  const value = parseFloat(token);
  return token.endsWith("ms") ? value : value * 1000;
}

/**
 * The two ends of a panel's box. Shut is no height and no margin; open is
 * whatever the panel measures at rest, read off the element because only the
 * layout knows it. The margin travels with the height so the row reaches
 * nothing at the same moment: see `stack-panel` in `globals.css`.
 *
 * Driven from script rather than a CSS transition because a transition cannot
 * run to `auto`, and the one CSS way to animate an unknown height, the grid's
 * row from 0fr to 1fr, re-resolves the whole grid on every frame and stuttered
 * on a phone. A plain height is the ordinary accordion every site runs.
 */
function panelFrames(panel: HTMLElement) {
  const { marginTop, marginBottom } = getComputedStyle(panel);
  return {
    shut: { height: "0px", marginTop: "0px", marginBottom: "0px" },
    open: { height: `${panel.offsetHeight}px`, marginTop, marginBottom },
  };
}

/**
 * The card inside it, at either end. The box alone only uncovered a card
 * already at full size, which read as the page jumping open rather than as
 * something opening. So the card moves too: it settles from 96% the way a
 * dialog's panel does, scaled from its top edge so it grows out of the tile
 * row rather than towards it.
 *
 * No slide. The box clips while it moves, and a card starting 12px above its
 * place had its top edge and corners cut off by the box's own top edge until
 * it came down. Scaled from the top, it never crosses the top or the sides,
 * and the only edge doing any uncovering is the bottom one, which is the point.
 */
const CARD_SHUT = {
  opacity: 0,
  transform: "scale(0.96)",
  transformOrigin: "top",
};
const CARD_OPEN = { opacity: 1, transform: "none", transformOrigin: "top" };

/**
 * The card's keyframes each way. The fade takes only part of the run, so the
 * card is on screen for most of the motion: in early on the way in, and still
 * there for most of the way out. With the fade on the box's own curve it was
 * mostly there by half time on an open and mostly gone by half time on a
 * close, and the rest of the motion was an empty box.
 */
const CARD_FRAMES = {
  open: [
    { ...CARD_SHUT, offset: 0 },
    { opacity: 1, offset: 0.6 },
    { ...CARD_OPEN, offset: 1 },
  ],
  shut: [
    { ...CARD_OPEN, offset: 0 },
    { opacity: 1, offset: 0.4 },
    { ...CARD_SHUT, offset: 1 },
  ],
};

/**
 * Both halves of a panel's motion, the box and the card, run together.
 * Returns the box's animation, which is the one that decides when it is done.
 */
function animatePanel(panel: HTMLElement, to: "open" | "shut") {
  const box = panelFrames(panel);
  const card = panel.firstElementChild;
  const boxFrames =
    to === "open" ? [box.shut, box.open] : [box.open, box.shut];
  const options: KeyframeAnimationOptions = {
    duration: panelDuration(),
    // Even at both ends, so the motion is visible the whole way through.
    // `ease` put most of it in the first half, and the second half was a
    // creep too small to see: it looked over before it was.
    easing: "ease-in-out",
    // Held at the end of a close so the panel does not spring back to full
    // size on the frame before React takes it out.
    fill: to === "shut" ? "forwards" : "auto",
  };

  // The box clips the card while it moves, so the card is uncovered as the
  // box grows rather than spilling over the tiles below.
  panel.style.overflow = "hidden";
  card?.animate(CARD_FRAMES[to], options);
  return panel.animate(boxFrames, options);
}

/**
 * The Stack section's grids, which tile is open, the panel it opens, and the
 * dialog a piece of work opens from that panel.
 *
 * This is a client component for one reason: a tile opens on a press, so
 * something has to hold which one. It holds every group rather than one,
 * because "open" is a single value across the whole section and there is a
 * single panel. Per-group state would let two tiles sit open at once.
 *
 * Two ids, not one. `open` is the truth. `closing` is the panel on its way
 * out, which stays mounted for the length of its animation and then leaves;
 * without it a close would be the row vanishing in one frame and everything
 * under it jumping up to fill the hole.
 *
 * It takes its groups as props and reaches for no content of its own, the same
 * way `Sidebar` does. `workUsing` is an index over that content rather than
 * content itself, which is why it is read here.
 */
export function StackGrid({
  groups,
}: {
  groups: readonly { label: string; items: readonly StackItem[] }[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [closing, setClosing] = useState<string | null>(null);

  /**
   * The piece of work the dialog is showing, or null. One dialog for the whole
   * grid rather than one per row: only one can be open, and a `<dialog>` per
   * work item would be a hundred of them in the markup.
   */
  const [detail, setDetail] = useState<WorkItem | null>(null);

  /**
   * How many columns `auto-fill` decided on. The panel goes after the last tile
   * of the open tile's row, and only the browser knows where that row ends, so
   * it is read off the resolved grid rather than guessed from a breakpoint.
   * Every group is the same grid at the same width, so one is measured.
   */
  const gridRef = useRef<HTMLUListElement>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const template = getComputedStyle(grid).gridTemplateColumns;
      setColumns(Math.max(1, template.split(" ").length));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // At most one of each is ever mounted, so a ref per kind is enough.
  const openPanel = useRef<HTMLLIElement>(null);
  const closingPanel = useRef<HTMLLIElement>(null);

  /**
   * A panel on its way out collapses, then leaves. Layout effects rather than
   * plain ones so the animation is running before the frame paints; otherwise
   * a panel could show for one frame at the size it is leaving from.
   */
  useLayoutEffect(() => {
    if (!closing) return;
    const panel = closingPanel.current;
    if (!panel) return;

    const animation = animatePanel(panel, "shut");

    let cancelled = false;
    animation.finished.then(
      () => {
        if (!cancelled) setClosing(null);
      },
      () => {
        // Cancelled, which only happens when the element has already gone.
      },
    );
    // Another close took over, or the same tile reopened mid-collapse.
    return () => {
      cancelled = true;
    };
  }, [closing]);

  /**
   * A panel that has just arrived grows into place, and the page goes to it.
   *
   * A panel is the list of work a tool proves, and on a phone it is taller
   * than what is left of the screen under the tile that opened it, so a
   * reader saw its heading and a row or two and had to scroll for the rest.
   * Opening brings the tile to the top, with the panel filling the screen
   * under it. Only when the panel would not fit where it is: on a desktop it
   * usually does, and a page that jumps on every press when nothing was hidden
   * is worse than one that does not move.
   *
   * Everything is measured before anything moves. A panel shutting above this
   * one is still at its full height on this frame and will take that height
   * with it, so what it still has to give up is subtracted from the
   * positions, or the scroll would land that far short.
   */
  useLayoutEffect(() => {
    if (!open) return;
    const panel = openPanel.current;
    const tile = document.getElementById(`stack-${open}`);
    if (!panel || !tile) return;

    const leaving = closingPanel.current;
    const leavingStyle = leaving ? getComputedStyle(leaving) : null;
    const leavingSpace =
      leaving && leavingStyle
        ? leaving.offsetHeight +
          parseFloat(leavingStyle.marginTop) +
          parseFloat(leavingStyle.marginBottom)
        : 0;
    const shiftOf = (target: Element) =>
      leaving &&
      leaving.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
        ? leavingSpace
        : 0;

    const tileTop = tile.getBoundingClientRect().top - shiftOf(tile);
    const rect = panel.getBoundingClientRect();
    const panelTop = rect.top - shiftOf(panel);
    const panelBottom = panelTop + rect.height;

    const animation = animatePanel(panel, "open");
    // Back to the stylesheet's values once it is at rest, so the card's
    // shadow is whole again.
    animation.finished.then(
      () => {
        panel.style.overflow = "";
      },
      () => {},
    );

    if (panelTop >= 0 && panelBottom <= window.innerHeight) return;

    // The tile's own scroll margin, which is where it sits under the pinned
    // bar. No `behavior`: the document's `scroll-behavior` decides, which is
    // smooth, and plain under `prefers-reduced-motion`.
    const margin = parseFloat(getComputedStyle(tile).scrollMarginTop) || 0;
    window.scrollTo({ top: window.scrollY + tileTop - margin });
  }, [open]);

  const toggle = (id: string) => {
    if (open === id) {
      setOpen(null);
      setClosing(id);
      return;
    }
    // Switching: the old panel shuts while the new one opens.
    if (open) setClosing(open);
    setOpen(id);
  };

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group, groupIndex) => {
        // The last tile of the row a tile sits in, clamped to the last tile
        // of the group when that row is short.
        const rowEndOf = (index: number) =>
          Math.min(
            Math.floor(index / columns) * columns + columns - 1,
            group.items.length - 1,
          );

        const openIndex = group.items.findIndex((item) => item.id === open);
        const openItem = openIndex < 0 ? undefined : group.items[openIndex];
        const closingIndex = group.items.findIndex(
          (item) => item.id === closing,
        );
        const closingItem =
          closingIndex < 0 ? undefined : group.items[closingIndex];

        return (
          <div key={group.label}>
            <p className="eyebrow mb-3">{group.label}</p>
            <ul
              ref={groupIndex === 0 ? gridRef : undefined}
              className="stack-grid"
            >
              {group.items.map((item, index) => (
                <Fragment key={item.id}>
                  <StackItemPreview
                    item={item}
                    open={open === item.id}
                    onToggle={() => toggle(item.id)}
                  />

                  {/* The one leaving, first, so it sits above the one
                      arriving when both share a row. Inert: nothing in it
                      can be reached while it is on its way out. */}
                  {closingItem && index === rowEndOf(closingIndex) ? (
                    <li ref={closingPanel} inert className="stack-panel">
                      <StackItemDetail item={closingItem} onOpen={setDetail} />
                    </li>
                  ) : null}

                  {openItem && index === rowEndOf(openIndex) ? (
                    <li ref={openPanel} className="stack-panel">
                      <StackItemDetail item={openItem} onOpen={setDetail} />
                    </li>
                  ) : null}
                </Fragment>
              ))}
            </ul>
          </div>
        );
      })}

      {/* The same `WorkItemDetail` the work pages render, so a piece of work
          reads identically wherever it is met. */}
      <CustomModal
        kind="card"
        item={detail}
        label={detail?.title}
        onClose={() => setDetail(null)}
      >
        {(work) => <WorkItemDetail item={work} />}
      </CustomModal>
    </div>
  );
}
