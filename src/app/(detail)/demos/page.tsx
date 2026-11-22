import type { Metadata } from "next";

import { Clapperboard } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Sidebar } from "@/components/Sidebar";
import { DemoDetail } from "@/components/details/DemoDetail";
import { demos, demosPage, profile, site } from "@/content";

/**
 * The product, recorded, with the context each recording needs. One section
 * per demo, so the rail lists the demos the way the landing's rail lists its
 * sections.
 */

// Set in full rather than inherited; see the area page for why.
const title = `${demosPage.title} | ${profile.name}`;
const url = `${site.url}/demos/`;

export const metadata: Metadata = {
  title: demosPage.title,
  description: demosPage.description,
  alternates: { canonical: `${site.url}/demos` },
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: site.locale,
    url,
    title,
    description: demosPage.description,
  },
  twitter: { card: "summary", title, description: demosPage.description },
};

export default function DemosPage() {
  return (
    <>
      <Sidebar
        back={{ href: "/", label: profile.name }}
        nav={{
          kind: "sections",
          items: demos.map((demo) => ({ id: demo.id, label: demo.label })),
        }}
      />

      <main>
        <PageHeader
          icon={Clapperboard}
          title={demosPage.title}
          lede={demosPage.lede}
        />

        {demos.map((demo) => (
          <DemoDetail key={demo.id} demo={demo} />
        ))}
      </main>
    </>
  );
}
