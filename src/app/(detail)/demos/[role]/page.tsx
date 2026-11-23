import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import { Sidebar } from "@/components/Sidebar";
import { DemoDetail } from "@/components/details/DemoDetail";
import {
  demoPages,
  demosOf,
  profile,
  rolesWithDemos,
  site,
} from "@/content";

/**
 * One role's product, recorded, with the context each recording needs. One
 * section per demo, so the rail lists the demos the way the landing's rail
 * lists its sections.
 */

// Static export needs every path known at build time: a role gets a page once
// it has a recording.
export function generateStaticParams() {
  return rolesWithDemos.map((role) => ({ role: role.id }));
}

function find(id: string) {
  const role = rolesWithDemos.find((candidate) => candidate.id === id);
  const page = role ? demoPages[role.id] : undefined;
  return role && page ? { role, page } : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role: id } = await params;
  const found = find(id);
  if (!found) return {};
  const { role, page } = found;

  // Set in full rather than inherited; see the area page for why.
  const heading = `${role.company} demos`;
  const title = `${heading} | ${profile.name}`;
  const url = `${site.url}/demos/${role.id}/`;
  return {
    title: heading,
    description: page.description,
    alternates: { canonical: `${site.url}/demos/${role.id}` },
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: site.locale,
      url,
      title,
      description: page.description,
    },
    twitter: { card: "summary", title, description: page.description },
  };
}

export default async function RoleDemosPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: id } = await params;
  const found = find(id);
  if (!found) notFound();
  const { role, page } = found;
  const roleDemos = demosOf(role.id);

  return (
    <>
      <Sidebar
        back={{ href: "/", label: profile.name }}
        nav={{
          kind: "sections",
          items: roleDemos.map((demo) => ({ id: demo.id, label: demo.label })),
        }}
      />

      <main>
        {/* The company's figure and links, the same header its role page
            opens with, since these recordings are the product it still has
            to show. */}
        <PageHeader
          title={`${role.company} demos`}
          lede={page.lede}
          links={role.links}
          brand={{ label: role.company, logo: role.logo }}
        />

        {roleDemos.map((demo) => (
          <DemoDetail key={demo.id} demo={demo} />
        ))}
      </main>
    </>
  );
}
