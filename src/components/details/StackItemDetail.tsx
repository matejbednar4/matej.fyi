import { WorkItemPreview } from "@/components/previews/WorkItemPreview";
import { CustomCard } from "@/components/primitives/CustomCard";
import { CustomMark } from "@/components/primitives/CustomMark";
import { workUsing, type StackItem, type WorkItem } from "@/content";

/**
 * What one technology is, and every piece of work that proves it: the panel a
 * `StackItemPreview` opens, each piece of work in it a `WorkItemPreview`.
 *
 * The heading is the count and the name in one sentence, at the compact size
 * every card subordinate to another one gets. It was the question, "Where
 * I've used X", in the display face with the count at the far end, and on a
 * phone the two never fit on one line: the count dropped under a heading
 * already a line and a half tall, and the panel was a third header before its
 * first row. One line says both. The mark beside it is the `plate` look, which
 * is what a mark inside something chip-coloured wants, at the size the tool
 * chips on a work card use.
 *
 * Each piece of work opens in a dialog rather than linking to its area page.
 * The panel is inside the Stack section of the landing, and sending a reader to
 * another page to read one card is a lot to ask of a glance: they wanted to
 * know what this tool was used for, not to leave. `StackGrid` owns that dialog
 * and the panel's open and shut animation; this draws what is inside.
 */
export function StackItemDetail({
  item,
  onOpen,
}: {
  item: StackItem;
  onOpen: (work: WorkItem) => void;
}) {
  const used = workUsing(item.id);
  const count = `${used.length} ${
    used.length === 1 ? "piece" : "pieces"
  } of work`;

  return (
    <CustomCard
      size="compact"
      tone="alt"
      mark={
        <CustomMark
          name={item.id}
          label={item.label}
          short={item.short}
          look="plate"
          size="sm"
        />
      }
      heading={`${count} with ${item.label}`}
      headingLevel={3}
    >
      {item.note ? <p>{item.note}</p> : null}

      {used.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {used.map((entry) => (
            <li key={entry.id}>
              <WorkItemPreview item={entry} layout="row" onOpen={onOpen} />
            </li>
          ))}
        </ul>
      ) : null}
    </CustomCard>
  );
}
