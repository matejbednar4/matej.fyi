/**
 * What kind of work an item is. This is the axis the site is organised on: a
 * reader wants the hard backend work, not the work at one employer, so the area
 * is a route and the role is only a label on a card.
 *
 * The id doubles as the route slug, so there is one name per area rather than a
 * data id and a separate URL word to keep in step.
 *
 * Every area is a page and a door on the landing, so `yarn content:check` fails
 * on an empty one. `design` is the one area made of galleries rather than
 * claims: it holds the work that is better shown than described.
 */
import {
  ChartLine,
  Cloud,
  Coins,
  Layers,
  MonitorSmartphone,
  Palette,
  Server,
  type LucideIcon,
} from "lucide-react";

export const AREAS = [
  "payments",
  "backend",
  "fullstack",
  "data",
  "infra",
  "frontend",
  "design",
] as const;

export type Area = (typeof AREAS)[number];

/**
 * How an area presents itself.
 *
 * Two lengths on purpose, the same way `profile.bio` and `site.description`
 * are two. `tagline` is the door on the landing, which is about 200px wide at
 * four across, so it has to be one short line. `blurb` is never rendered: it is
 * the area page's meta description, where a search result has room for a
 * sentence the page itself does not need.
 *
 * `icon` is the area's mark: the door on the landing, and the figure at the top
 * of the area's own page.
 */
export const AREA_META: Record<
  Area,
  { label: string; icon: LucideIcon; tagline: string; blurb: string }
> = {
  payments: {
    label: "Payments",
    icon: Coins,
    tagline: "Purchases, payouts and a custom ledger.",
    blurb:
      "Money that has to balance. A double-entry ledger, purchases and payouts in both directions, and settlement that survives a retry.",
  },
  backend: {
    label: "Backend",
    icon: Server,
    tagline: "A 165-endpoint API and 7 background services.",
    blurb:
      "The API and the services behind it. 165 endpoints, 7 background workers, and the queries, caching and auth that sit under them.",
  },
  infra: {
    label: "Infra",
    icon: Cloud,
    tagline: "Three environments, deployed on AWS via CI.",
    blurb:
      "Where it runs. Three environments, with staging and production fully separated on AWS, and every deploy out of CI rather than off a laptop.",
  },
  frontend: {
    label: "Frontend",
    icon: MonitorSmartphone,
    tagline: "Three React Native apps and four websites.",
    blurb:
      "Three React Native apps, two of them in the stores, Tagly's three web surfaces, and this site. One design system behind all three apps, and a map that loads by tile.",
  },
  fullstack: {
    label: "Fullstack",
    icon: Layers,
    tagline: "One typed contract shared by three apps and the server.",
    blurb:
      "The work that only exists because there are two sides. One set of types for the API and the apps, two API versions live at once, and two languages kept in step.",
  },
  design: {
    label: "Design",
    icon: Palette,
    tagline: "Screenshots of the apps and sites I've designed.",
    blurb:
      "Screens from the apps and websites I've designed and built for Tagly: the customer and business apps, the marketing site and the invite page.",
  },
  data: {
    label: "Data",
    icon: ChartLine,
    tagline: "50 tables, from accounts to the ledger and job queues.",
    blurb:
      "Where everything is kept. A 50-table schema designed to make bad states impossible, migrated 74 times with no data lost, and the tracking that changed what got built.",
  },
};
