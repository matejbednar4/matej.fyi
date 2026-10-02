import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import { Sidebar } from "@/components/Sidebar";
import { CustomSection } from "@/components/primitives/CustomSection";
import { WorkItemDetail } from "@/components/details/WorkItemDetail";
import {
  AREAS,
  AREA_META,
  profile,
  site,
  workIn,
  type Area,
} from "@/content";

/**
 * Everything of one kind, whichever role it happened in. This is the index that
 * grows in place: a second role lands here as more items, not as another page.
 */

// Static export needs every path known at build time.
export function generateStaticParams() {
  return AREAS.map((area) => ({ area }));
}

// `params.area` is a plain string, so it is narrowed rather than asserted.
function find(value: string): Area | undefined {
  return AREAS.find((area) => area === value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: value } = await params;
  const area = find(value);
  if (!area) return {};

  // The preview tags are set here in full, not inherited: a page's `openGraph`
  // replaces the layout's whole object rather than merging into it, so a
  // missing one leaves every shared link previewing as the landing.
  const title = `${AREA_META[area].label} | ${profile.name}`;
  const description = AREA_META[area].blurb;
  const url = `${site.url}/work/${area}/`;
  return {
    title: AREA_META[area].label,
    description,
    alternates: { canonical: `${site.url}/work/${area}` },
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: site.locale,
      url,
      title,
      description,
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: value } = await params;
  const area = find(value);
  if (!area) notFound();

  const items = workIn(area);

  return (
    <>
      {/* The rail lists the other kinds of work, so a reader who is done with
          this one reaches the next without going back through the landing. */}
      <Sidebar
        back={{ href: "/", label: profile.name }}
        nav={{
          kind: "pages",
          label: "Work",
          current: `/work/${area}`,
          items: AREAS.map((other) => ({
            href: `/work/${other}`,
            label: AREA_META[other].label,
          })),
        }}
      />

      <main>
        {/* The mark and the name, and straight into the work. The blurb is
            what the door on the landing already said, so repeating it here
            makes a reader read the same sentence twice to reach the list they
            came for. It still writes the page's meta description above. */}
        <PageHeader
          icon={AREA_META[area].icon}
          title={AREA_META[area].label}
        />

        <CustomSection id="work">
          <p className="eyebrow mb-4">
            {items.length} {items.length === 1 ? "piece" : "pieces"} of work
          </p>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <WorkItemDetail
                key={item.id}
                item={item}
                showArea={false}
              />
            ))}
          </div>
        </CustomSection>
      </main>
    </>
  );
}
