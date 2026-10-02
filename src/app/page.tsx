import { WorkAreaPreview } from "@/components/previews/WorkAreaPreview";
import { CustomButton } from "@/components/primitives/CustomButton";
import { CustomCard } from "@/components/primitives/CustomCard";
import { CustomMark } from "@/components/primitives/CustomMark";
import { CustomMedia } from "@/components/primitives/CustomMedia";
import { CustomSection } from "@/components/primitives/CustomSection";
import { RoleDetail } from "@/components/details/RoleDetail";
import { Sidebar } from "@/components/Sidebar";
import { StackGrid } from "@/components/StackGrid";
import { WorkHighlights } from "@/components/WorkHighlights";
import {
  AREAS,
  STACK_GROUP_LABEL,
  highlights,
  profile,
  roles,
  site,
  stack,
  stackByGroup,
} from "@/content";
import { externalLink } from "@/utils/externalLink";

/**
 * The sections of the landing, in order. The rail renders this list and the
 * sections below carry the same ids, so both are written here: the page is the
 * only reader, and a stale id is visible from the list rather than a file away.
 */
const SECTIONS = [
  { id: "about", label: "About" },
  { id: "roles", label: "Roles" },
  { id: "highlights", label: "Highlights" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
  { id: "misc", label: "Misc" },
] as const;

/**
 * Who this page is about, as structured data. This is what a search engine or
 * an assistant reads when asked what I work with: facts it can lift rather than
 * infer from prose. Every value comes from `src/content`, so it cannot say
 * anything the page does not.
 *
 * No `alumniOf`: schema.org stretches it to anyone who attended, but it reads
 * as "graduated from", and I left ČVUT after a semester. The page says so; the
 * data must not say more.
 */
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: `${site.url}/`,
  image: `${site.url}${profile.avatar}`,
  jobTitle: profile.role,
  description: site.description,
  homeLocation: { "@type": "Place", name: profile.location },
  knowsAbout: stack.map((item) => item.label),
  knowsLanguage: profile.languages.map((language) => language.label),
  sameAs: profile.links
    .filter((link) => link.href.startsWith("http"))
    .map((link) => link.href),
};

export default function Home() {
  return (
    <div className="page-shell">
      {/* `<` escaped so no value in the data can close the script tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(PERSON).replace(/</g, "\\u003c"),
        }}
      />
      {/* The rail navigates; what sits under its nav is about me, so it is
          written here, on the page about me. */}
      <Sidebar nav={{ kind: "sections", items: SECTIONS }}>
        <p className="flex items-center gap-2.5 px-3 py-1.5 text-ui text-ink-muted">
          <CustomMark
            name="pin"
            label={profile.location}
            look="bare"
            size="xs"
          />
          {profile.location}
        </p>
        {profile.links.map((link) => (
          <a
            key={link.icon}
            href={link.href}
            {...externalLink(link.href)}
            className="pressable feedback-fill rail-row"
          >
            <CustomMark
              name={link.icon}
              label={link.label}
              look="bare"
              size="xs"
            />
            {link.label}
          </a>
        ))}

        {/* A step down from the links: these are context, not actions. */}
        <ul className="divider-top mt-3 flex flex-col gap-0.5 pt-3">
          {profile.languages.map((language) => (
            <li
              key={language.label}
              className="flex items-baseline gap-2 px-3 text-meta"
            >
              <span aria-hidden className="text-micro">
                {language.flag}
              </span>
              <span className="text-ink-muted">{language.label}</span>
              <span className="text-ink-muted">{language.level}</span>
            </li>
          ))}
        </ul>
      </Sidebar>

      <main>
        <header id="about" className="scroll-mt-8">
          {/* Stacked on a phone, the face above the words, so the name and
              bio get the whole width. Side by side from `md`, where there is
              room for both. */}
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            <CustomMedia
              shape="circle"
              src={profile.avatar}
              full={profile.photo}
              alt={profile.name}
              priority
            />
            <div className="min-w-0 flex-1">
              <p className="eyebrow mb-2">{profile.role}</p>
              <h1>{profile.name}</h1>
              <p className="mt-3 text-lede text-ink-muted">{profile.bio}</p>

              {/* Phone only. On a desktop the rail beside the page already
                  says where I am, how to write to me and what I speak; on a
                  phone the rail is a drawer behind a button, so the same facts
                  sit here, under the bio, before the first section. Where I am
                  and how to write to me share a line; the languages are
                  context rather than a way to reach me, so they get their
                  own, a step smaller. The email is a bare control, so its
                  feedback is the accent. */}
              <div className="mt-4 flex flex-col gap-2 md:hidden">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ui text-ink-muted">
                  <p className="flex items-center gap-2">
                    <CustomMark
                      name="pin"
                      label={profile.location}
                      look="bare"
                      size="xs"
                    />
                    {profile.location}
                  </p>
                  {profile.links
                    .filter((link) => link.inIntro)
                    .map((link) => (
                      <a
                        key={link.icon}
                        href={link.href}
                        {...externalLink(link.href)}
                        className="pressable feedback-text flex items-center gap-2 no-underline"
                      >
                        <CustomMark
                          name={link.icon}
                          label={link.label}
                          look="bare"
                          size="xs"
                        />
                        {link.label}
                      </a>
                    ))}
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-meta text-ink-muted">
                  {profile.languages.map((language) => (
                    <li
                      key={language.label}
                      className="flex items-baseline gap-1.5"
                    >
                      <span aria-hidden className="text-micro">
                        {language.flag}
                      </span>
                      <span className="text-ink">{language.label}</span>
                      <span>{language.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* A list, not a hero: the current role is the largest card because it
            is first, so adding a second role is a data edit. */}
        <CustomSection id="roles" title="Roles" subtitle="Where I've worked">
          <div className="flex flex-col gap-6">
            {roles.map((role, index) => (
              <RoleDetail
                key={role.id}
                role={role}
                isCard
                href={`/roles/${role.id}`}
                size={index === 0 ? "default" : "compact"}
              />
            ))}
          </div>
        </CustomSection>

        {/* The strongest work, the first six in work.ts, before the stack, so
            a reader meets it on purpose rather than through whichever tool
            they open first. Each card opens the item in full in a dialog. */}
        <CustomSection
          id="highlights"
          title="Highlights"
          subtitle="The work I'm proudest of"
        >
          <WorkHighlights items={highlights} />
        </CustomSection>

        {/* The one section that has to be interactive, so the grids move into a
            client component and the page keeps owning the content. */}
        <CustomSection
          id="stack"
          title="Stack"
          subtitle="What I've worked with"
        >
          <StackGrid
            groups={stackByGroup().map(({ group, items }) => ({
              label: STACK_GROUP_LABEL[group],
              items,
            }))}
          />
        </CustomSection>

        {/* One door per area. This is the only choice the page asks a reader to
            make, and it is the one that scales: a second role adds items behind
            these doors, not another door. */}
        <CustomSection
          id="work"
          title="Work"
          subtitle="What I've built, split by area"
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {AREAS.map((area) => (
              <WorkAreaPreview key={area} area={area} href={`/work/${area}`} />
            ))}
          </div>
        </CustomSection>

        <CustomSection id="contact" title="Contact">
          <CustomCard heading="Get in touch" headingLevel={2}>
            <p>{profile.availability}</p>
            <div className="flex flex-wrap gap-3">
              {profile.links
                .filter((link) => link.inContactSection)
                .map((link, index) => (
                  <CustomButton
                    key={link.icon}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    variant={index === 0 ? "primary" : "secondary"}
                  />
                ))}
            </div>
          </CustomCard>
        </CustomSection>

        {/* Everything that is true about me and is not work. Written out here
            rather than componentised: one caller, no state, no props. */}
        <CustomSection id="misc" title="Misc">
          <div className="flex flex-col gap-3">
            {profile.education.map((school) => (
              <CustomCard
                key={school.id}
                size="compact"
                caption="Education"
                topRight={school.period}
                heading={school.institution}
                headingLevel={3}
              >
                <p>{school.note}</p>
              </CustomCard>
            ))}

            {/* A button on the ground rather than a card: one link is not a
                block, and a card around it would claim the same weight as the
                education above. */}
            <div className="flex flex-wrap gap-3">
              <CustomButton
                href={profile.music.href}
                icon={profile.music.icon}
                label={profile.music.label}
                variant="surface"
              />
            </div>
          </div>
        </CustomSection>
      </main>
    </div>
  );
}
