import { Info, X } from "lucide-react";

import { CustomMark } from "@/components/primitives/CustomMark";
import type { StackItem } from "@/content";

/**
 * Both faces of a tile are laid out identically, written once, so the mark and
 * the close control occupy the same place and the name does not shift as the
 * tile turns.
 */
const TILE_FACE = "flex flex-col items-center justify-center gap-3 px-2";
const TILE_LABEL = "text-center text-meta font-semibold leading-tight text-ink";

/**
 * One technology, as a tile that opens its `StackItemDetail` under its row. The
 * tile is the card: there is no second surface behind the group.
 *
 * It turns over. Both faces carry the name; only what sits above it changes,
 * from the mark to a close control. Both live on one button rather than two:
 * the same press opens and closes, so there is one control to reach with a
 * keyboard and one thing `aria-expanded` can describe. A second button on the
 * reverse would be unreachable in the DOM order it appears in and would say the
 * wrong thing to a screen reader, which never sees the rotation at all.
 *
 * Controlled, not stateful. Only one tile may be open at a time, and the panel
 * that sits under it belongs to the grid, so the grid owns which one it is.
 * It is an `<li>` because it is one cell of `StackGrid`'s list, and it takes a
 * handler, so it is only ever drawn inside that client component.
 */
export function StackItemPreview({
  item,
  open,
  onToggle,
}: {
  item: StackItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    // The id is what the grid scrolls to when this tile opens. Prefixed so a
    // technology can never collide with a section or a piece of work.
    <li id={`stack-${item.id}`} className="tile-scene">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={
          open
            ? `Hide where I used ${item.label}`
            : `${item.label}. Show where I used it.`
        }
        data-open={open ? "true" : undefined}
        className="tile-flip group block aspect-square w-full cursor-pointer"
      >
        <span className={`tile-face ${TILE_FACE}`}>
          {/* The corner mark that says the tile does something. Muted at rest so
              it stays a hint rather than competing with the logo, and it takes
              the accent at the same moment the tile grows: see `tile-hint`. A
              corner plus in a grid of cards reads as "add this one" as easily
              as "open this one", which is the one thing it must not say. */}
          <Info
            aria-hidden
            strokeWidth={2.5}
            className="tile-hint absolute top-2.5 right-2.5 size-3.5"
          />
          <CustomMark
            name={item.id}
            label={item.label}
            short={item.short}
            look="accent"
            size="lg"
          />
          <span className={TILE_LABEL}>{item.label}</span>
        </span>

        {/* The same face with the mark swapped for a close control, so the name
            holds still through the turn and only the thing above it changes.
            The X sits in a box the size of the mark's rather than on its own,
            or the label would land a few pixels higher on the reverse and the
            two sides would not line up. */}
        <span className={`tile-face tile-face-back ${TILE_FACE}`}>
          <span className="grid size-12 place-items-center">
            <X className="size-8 text-accent" strokeWidth={2} aria-hidden />
          </span>
          <span className={TILE_LABEL}>{item.label}</span>
        </span>
      </button>
    </li>
  );
}
