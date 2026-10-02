import { CustomCard } from "@/components/primitives/CustomCard";
import { AREA_META, workIn, type Area } from "@/content";

/**
 * A kind of work, as the door on the landing that leads to its page: the
 * area's mark, its name, one line, and how many pieces of work are behind it.
 *
 * The tagline, not the blurb: at four across a card is about 200px wide, and
 * the blurb waits for the area page where there is a measure to read it on.
 */
export function WorkAreaPreview({
  area,
  href,
}: {
  area: Area;
  href: string;
}) {
  return (
    <CustomCard
      size="compact"
      icon={AREA_META[area].icon}
      href={href}
      action={`All ${workIn(area).length}`}
      heading={AREA_META[area].label}
      headingLevel={3}
    >
      <p>{AREA_META[area].tagline}</p>
    </CustomCard>
  );
}
