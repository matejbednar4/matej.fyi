/**
 * What I have actually worked with. Nouns, not claims: every entry here is
 * checkable, and every entry is proved by something in `work.ts`.
 *
 * This deliberately holds no prose about ability. "I can design a ledger" is a
 * claim and belongs in the work that shows it; "PostgreSQL" is a fact.
 */

export const STACK_GROUPS = [
  "core",
  "backend",
  "services",
  "infrastructure",
  "frontend",
] as const;

export type StackGroup = (typeof STACK_GROUPS)[number];

/**
 * What each group is called on the page, in the order the grid draws them.
 *
 * `core` rather than `language`, because Zod is not a language. The group is
 * what everything is written in: TypeScript as the language, Zod as the same
 * types at runtime on both ends of the wire.
 *
 * The databases are not their own group. PostgreSQL, Redis, Prisma and
 * Kysely are not a separate discipline from the API, they are the same job, and
 * splitting them off left `backend` holding Node and Express, which reads as the
 * thinnest row on the page while being the deepest part of the work. Services
 * and infrastructure stay separate because they genuinely are different: an API
 * someone else runs, and the cloud this one runs on.
 *
 * Frontend comes last so the four server-side rows run together rather than
 * being interrupted by the client.
 */
export const STACK_GROUP_LABEL: Record<StackGroup, string> = {
  core: "Core",
  backend: "Backend",
  services: "Services",
  infrastructure: "Infrastructure",
  frontend: "Frontend",
};

export type StackItem = {
  id: string;
  label: string;
  group: StackGroup;
  /** Shown when a name alone is not enough to place it. */
  note?: string;
  /**
   * The mark's slug in simple-icons, Font Awesome or the traced set. `yarn
   * icons:sync` turns these into inline SVG paths in `brand-icons.ts`. Entries
   * without one render a monogram instead, which is
   * deliberate: a missing logo should still look like part of the set.
   */
  icon?: string;
  /**
   * Overrides the derived monogram where initials read badly. "S3 and
   * CloudFront" derives to "SA" on its own, which means nothing.
   */
  short?: string;
};

export const stack = [
  {
    id: "typescript",
    label: "TypeScript",
    group: "core",
    icon: "typescript",
    note: "Tagly's backend, background services, all three apps and the websites are written in TypeScript",
  },
  {
    id: "zod",
    icon: "zod",
    label: "Zod",
    group: "core",
  },
  {
    id: "i18next",
    label: "i18next",
    group: "core",
    icon: "i18next",
    note: "Tagly's apps and backend both support English and Czech",
  },

  {
    id: "node",
    label: "Node.js",
    group: "backend",
    icon: "nodedotjs",
    note: "Tagly's API and its 7 background services all run on Node",
  },
  { id: "express", label: "Express", group: "backend", icon: "express" },

  {
    id: "postgres",
    label: "PostgreSQL and PostGIS",
    group: "backend",
    icon: "postgresql",
    note: "Tagly's accounts, businesses, shares, the ledger and the job queues all live in the same PostgreSQL database, with PostGIS geography columns for proximity ranking",
  },
  {
    id: "redis",
    label: "Redis",
    group: "backend",
    icon: "redis",
  },
  { id: "prisma", label: "Prisma", group: "backend", icon: "prisma" },
  {
    id: "kysely",
    short: "Ky",
    label: "Kysely",
    group: "backend",
  },
  {
    id: "expo",
    icon: "expo",
    label: "Expo",
    group: "frontend",
    note: "SDK 54: Router, SecureStore, Notifications, Updates, Location, AuthSession and Linking, plus inline native config plugins",
  },
  { id: "next", label: "Next.js", group: "frontend", icon: "nextdotjs" },
  { id: "react", label: "React", group: "frontend", icon: "react" },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    group: "frontend",
    icon: "tailwindcss",
  },
  {
    id: "react-native",
    label: "React Native",
    group: "frontend",
    icon: "react",
  },

  {
    id: "stripe",
    icon: "stripe",
    label: "Stripe",
    group: "services",
    note: "Connect, Checkout, PaymentSheet, off-session charges",
  },
  {
    id: "instagram-graph",
    label: "Instagram Graph API",
    group: "services",
    icon: "instagram",
  },
  {
    id: "appsflyer",
    short: "AF",
    label: "AppsFlyer",
    group: "services",
    note: "Deferred deep links and install attribution",
    icon: "appsflyer",
  },
  {
    id: "app-store-connect",
    label: "App Store Connect",
    group: "services",
    icon: "appstore",
    note: "Three apps, review submissions, TestFlight and store listings",
  },
  {
    id: "play-console",
    label: "Google Play Console",
    group: "services",
    icon: "googleplay",
    note: "Two apps, internal testing tracks, App Signing and listings",
  },
  { id: "resend", label: "Resend", group: "services", icon: "resend" },
  { id: "posthog", label: "PostHog", group: "services", icon: "posthog" },

  {
    id: "aws",
    icon: "aws",
    label: "AWS",
    group: "infrastructure",
    note: "App Runner, ECS Fargate, RDS, ElastiCache, S3 and CloudFront, Amplify, Route 53, VPC, Secrets Manager, Rekognition, Location Service",
  },
  {
    id: "docker",
    icon: "docker",
    label: "Docker",
    group: "infrastructure",
  },
  {
    id: "github-actions",
    icon: "githubactions",
    label: "GitHub Actions",
    group: "infrastructure",
  },
  {
    id: "eas",
    label: "EAS Build and Submit",
    group: "infrastructure",
    icon: "expo",
    note: "Store builds and submissions, driven from CI",
  },
] as const satisfies readonly StackItem[];

export type StackId = (typeof stack)[number]["id"];
