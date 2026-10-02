import { MarkedText } from "@/components/MarkedText";
import { CustomButton } from "@/components/primitives/CustomButton";
import { CustomCard } from "@/components/primitives/CustomCard";
import { AREA_META, type WorkItem } from "@/content";

/**
 * One piece of work, in one of two shapes, both opening it in full as a
 * `WorkItemDetail` where the caller says: a dialog, so the reader never leaves
 * the page. That takes a handler, so either shape is only drawn inside a
 * client component.
 *
 * - `row` is its title alone, for a list inside a stack panel. The card
 *   colour, not the secondary chip: the panel is chip-coloured, and a
 *   secondary button's own ground is that same chip value, so the row would
 *   be a chip on a chip.
 * - `card` is a highlight on the landing: the area's mark and name above the
 *   title, then the body cut off after four lines, so a reader sees how the
 *   claim starts and opens it for the rest. Its action expands rather than
 *   points, since it opens in place.
 */
export function WorkItemPreview({
  item,
  layout,
  onOpen,
}: {
  item: WorkItem;
  layout: "row" | "card";
  onOpen: (item: WorkItem) => void;
}) {
  if (layout === "card") {
    return (
      <CustomCard
        size="compact"
        caption={AREA_META[item.area].label}
        captionIcon={AREA_META[item.area].icon}
        heading={item.title}
        headingLevel={3}
        action="Read in full"
        actionIcon="expand"
        onPress={() => onOpen(item)}
      >
        <p className="line-clamp-4">
          <MarkedText text={item.body} />
        </p>
      </CustomCard>
    );
  }

  return (
    <CustomButton
      layout="row"
      variant="surface"
      label={item.title}
      onPress={() => onOpen(item)}
    />
  );
}
