import { MarkedText } from "@/components/MarkedText";
import { CustomMark } from "@/components/primitives/CustomMark";
import { CustomCard } from "@/components/primitives/CustomCard";
import { CustomMedia } from "@/components/primitives/CustomMedia";
import { AREA_META, roleOf, stackOf, type WorkItem } from "@/content";

/**
 * One piece of work, wherever it appears. The area page and the role page both
 * render this, so an item reads identically from either index.
 *
 * The stack chips are labels, not links. Work shows its stack and the stack
 * leads back to work: one clickable direction, one descriptive one. Making both
 * ends clickable turns every card into four underlines nobody follows.
 */
export function WorkItemDetail({
  item,
  showRole = true,
  showArea = true,
}: {
  item: WorkItem;
  /**
   * The company the work was done at, its logo and its name, in the label
   * above the title. Off only on the role's own page, which already is the
   * company. Everywhere else a card can be met on its own, the stack dialog
   * above all, and without it a reader opening the API-versioning item from a
   * TypeScript tile had nothing saying what product it was about.
   */
  showRole?: boolean;
  /**
   * Off where the surrounding context already names the area: its own page,
   * and a role page's per-area group. On in the stack dialog, which is the one
   * place a card is met with nothing around it saying what kind of work it is.
   */
  showArea?: boolean;
}) {
  const tools = stackOf(item);
  const role = showRole ? roleOf(item) : undefined;

  const toolChips =
    tools.length > 0 ? (
      <ul className="flex flex-wrap items-center gap-2">
        {tools.map((tool) => (
          <li
            key={tool.id}
            className="chip flex items-center gap-1.5 py-1 pr-2.5 pl-1 text-meta text-ink-muted"
          >
            <CustomMark
              name={tool.id}
              label={tool.label}
              short={tool.short}
              look="plate"
              size="sm"
            />
            {tool.label}
          </li>
        ))}
      </ul>
    ) : null;

  // The label says what kind of work and where, whichever the page around the
  // card does not already say: "Backend at Tagly" in the stack dialog, "Tagly"
  // on an area page, nothing on the role's own page. The company's logo leads
  // it, the way an area's mark leads a highlight's label, and it sits top left,
  // clear of the dialog's close control in the top-right corner.
  const area = showArea ? AREA_META[item.area].label : undefined;
  const caption =
    area && role ? `${area} at ${role.company}` : (area ?? role?.company);
  const logo = role ? (
    <CustomMark
      name={role.id}
      label={role.company}
      src={role.logo}
      look="bare"
      size="xs"
    />
  ) : undefined;

  return (
    // Clear of the pinned bar on a phone when a link lands on this item.
    <article id={item.id} className="scroll-mt-8 max-md:scroll-mt-18">
      <CustomCard
        size="compact"
        caption={caption}
        captionMark={logo}
        heading={item.title}
        headingLevel={3}
      >
        <p>
          <MarkedText text={item.body} />
        </p>

        {item.bullets ? (
          <ul className="list-disc space-y-1 pl-5">
            {item.bullets.map((point) => (
              <li key={point}>
                <MarkedText text={point} />
              </li>
            ))}
          </ul>
        ) : null}

        {item.outro ? (
          <p>
            <MarkedText text={item.outro} />
          </p>
        ) : null}

        {/* Evidence, not decoration, so it lives under the claim it proves
            and opens to full size rather than being judged at thumbnail
            scale. */}
        {item.media ? (
          <ul className="media-grid gap-3">
            {item.media.map((shot) => (
              <li key={shot.src}>
                <CustomMedia
                  shape="square"
                  ground="card"
                  src={shot.src}
                  alt={shot.alt}
                  caption={shot.caption}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {toolChips}
      </CustomCard>
    </article>
  );
}
