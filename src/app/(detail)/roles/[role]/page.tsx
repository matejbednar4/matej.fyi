import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import { Sidebar } from "@/components/Sidebar";
import { WorkFilter } from "@/components/WorkFilter";
import { CustomSection } from "@/components/primitives/CustomSection";
import { RoleDetail } from "@/components/details/RoleDetail";
import { WorkItemDetail } from "@/components/details/WorkItemDetail";
import {
  AREAS,
  AREA_META,
  profile,
  roles,
  site,
  workAt,
} from "@/content";

/**
 * Everything done in one role, every area, no filter. The role is the page, so
 * no card repeats it.
 */

// Static export needs every path known at build time.
export function generateStaticParams() {
  return roles.map((role) => ({ role: role.id }));
}

function find(id: string) {
  return roles.find((role) => role.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role: id } = await params;
  const role = find(id);
  if (!role) return {};

  // What the company does when there is a line for it, since a search result
  // has to say what this page is about before it says what I did in it.
  const description = role.about ?? role.contribution;
  // Set in full rather than inherited; see the area page for why.
  const title = `${role.company}, ${role.role} | ${profile.name}`;
  const url = `${site.url}/roles/${role.id}/`;
  return {
    title: `${role.company}, ${role.role}`,
    description,
    alternates: { canonical: `${site.url}/roles/${role.id}` },
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

export default async function RolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: id } = await params;
  const role = find(id);
  if (!role) notFound();

  // Kinds of work this role actually holds, in the areas' own order. An empty
  // area is dropped here rather than in the filter, so the chip row never
  // offers a count of nothing.
  const areasWorkedIn = AREAS.map((area) => ({
    area,
    items: workAt(role.id, area),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {/* The roles, not the areas: a rail lists the siblings of the page it is
          on. With one role that is a list of one, and it grows by itself. */}
      <Sidebar
        back={{ href: "/", label: profile.name }}
        nav={{
          kind: "pages",
          label: "Roles",
          current: `/roles/${role.id}`,
          items: roles.map((other) => ({
            href: `/roles/${other.id}`,
            label: other.company,
          })),
        }}
      />

      <main>
        {/* The company at the top: the mark, its name, and what it does. What I
            did there is a different subject, so it waits for its own heading
            below rather than running on from this paragraph. */}
        <PageHeader
          title={role.company}
          lede={role.about}
          brand={{ label: role.company, logo: role.logo }}
        />

        <CustomSection id="role" title={`My role at ${role.company}`}>
          <RoleDetail role={role} isCard={false} />
        </CustomSection>

        <CustomSection id="work" title="What I've done here">
          <WorkFilter
            groups={areasWorkedIn.map(({ area, items }) => ({
              id: area,
              label: AREA_META[area].label,
              count: items.length,
              children: items.map((item) => (
                <WorkItemDetail
                  key={item.id}
                  item={item}
                  showArea={false}
                  showRole={false}
                />
              )),
            }))}
          />
        </CustomSection>
      </main>
    </>
  );
}
