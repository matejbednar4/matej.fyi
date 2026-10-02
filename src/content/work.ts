import type { Area } from "./areas";
import type { RoleId } from "./roles";
import type { StackId } from "./stack";

/**
 * Everything I have done, as one flat list. This is the only place a claim is
 * written down; Work and Stack are two views over it.
 *
 * `area` is required, because it is the route an item lives at. `meta` is not:
 * it holds the links out to the other tables, and an item that happened outside
 * a job or where the tools are not the point has neither.
 *
 * Ids are typed against their tables, so a renamed role or stack entry fails
 * the build instead of silently producing a dead reference.
 *
 * Order is editorial, and it is the one ranking on the site: the first six are
 * the landing's Highlights, and the same order runs down every area page,
 * every role page and every stack panel. Put the strongest work first.
 *
 * `bullets` and `outro` exist for the few items that are a list rather than a
 * paragraph. Most items have neither, and an item that wants them usually wants
 * a shorter `body` instead.
 *
 * Numbers came from the repo. Do not estimate them, and do not add anything
 * about what the platform charges: see the private-detail rule in CLAUDE.md.
 */

export type WorkItem = {
  id: string;
  title: string;
  /**
   * The claim, in one or two sentences. Wrap a stack name, or the phrase built
   * around one, in `**double asterisks**` to set it in the heading colour:
   * "Built the **Stripe webhook handling** that…". Mark the meaningful
   * mention, not every repeat. Bullets and the outro read the same marker;
   * the title and the captions do not.
   */
  body: string;
  /** Only where the claim is genuinely a list. */
  bullets?: readonly string[];
  /** One closing sentence after a list. */
  outro?: string;
  /**
   * Screenshots, where a claim is better shown than described. Drawn as a row
   * of thumbnails at one height, each opening to its own size.
   *
   * `alt` is required and is not decorative: these are evidence, so a reader
   * who cannot see them still has to learn what they prove.
   */
  media?: readonly {
    src: string;
    alt: string;
    /** The visible line under the thumbnail: what the shot is, in a few words. */
    caption: string;
  }[];
  area: Area;
  /** Where it happened and what it used. Both optional, and so is `meta`. */
  meta?: {
    role?: RoleId;
    stack?: readonly StackId[];
  };
};

export const work: readonly WorkItem[] = [
  {
    id: "apps-shipped-to-both-stores",
    title: "Three apps, two of them live on both stores",
    body: "Built **3 React Native apps** from scratch. The customer and business apps are live on the **App Store and Google Play**, and the internal admin dashboard is distributed through **TestFlight**. I handled the code, payments, deployment and infrastructure, as well as the App Store and Google Play reviews and listings. Tagly: Share and Earn **peaked at number 1 in the Lifestyle category on the Czech App Store** on 15 August 2026.",
    media: [
      {
        src: "/work/app-store-no1.webp",
        caption: "Number one in Lifestyle, Czech App Store",
        alt: "The Czech App Store's Top Downloaded Lifestyle chart, with Tagly at number one above Pinterest.",
      },
    ],
    area: "fullstack",
    meta: {
      role: "tagly",
      stack: ["eas", "app-store-connect", "play-console", "instagram-graph"],
    },
  },
  {
    id: "double-entry-ledger",
    title: "Double-entry ledger",
    body: "Designed the double-entry ledger behind every balance on Tagly. The ledger has 16 transaction kinds, covering deposits, withdrawals, refunds, payments, locks, unlocks, referral bonuses and adjustments. Customers, businesses and the platform each have an available and a reserved balance. Every movement of money is one row that can't be edited, and every row write goes through a single helper.",
    area: "payments",
    meta: { role: "tagly", stack: ["stripe", "postgres", "prisma"] },
  },
  {
    id: "three-environments",
    title: "Three environments, nine installable apps",
    body: "Set up three environments for the whole Tagly ecosystem: development runs locally, and staging and production run on **AWS**. The three apps come to nine builds, and all nine install side by side on one phone. Any environment can be tested on a real device without touching production data. Staging and production are fully separated, each with its own database, cache and storage, across 13 AWS services in total.",
    media: [
      {
        src: "/work/nine-apps.webp",
        caption: "3 apps in 3 environments on my phone",
        alt: "A home screen folder holding nine app icons: the customer, business and admin apps in development, staging and production builds.",
      },
    ],
    area: "infra",
    meta: { role: "tagly", stack: ["aws", "eas", "expo"] },
  },
  {
    id: "pricing-engine",
    title: "Pricing each customer's post from 9 factors",
    body: "Built the engine that decides how much a customer is paid for posting about a business. The engine prices each post from 9 factors. Three of the factors:",
    bullets: [
      "Geography: how far the customer's audience lives from the business, geocoded through **AWS Location**.",
      "Authenticity: the account's size and its follower-to-following ratio. Smaller, more authentic accounts earn more than large ones.",
      "Anti-spam: the more often someone posts, the lower each reward.",
    ],
    outro:
      "Every factor is stored on the reward, along with the version of the code that priced it. Any past payout can be recomputed exactly.",
    area: "backend",
    meta: {
      role: "tagly",
      stack: ["postgres", "kysely", "instagram-graph", "aws"],
    },
  },
  {
    id: "v1-and-v2",
    title: "Two versions of the API live at once",
    body: "Ran v1 and v2 of Tagly's API side by side, because an app already on someone's phone can't be updated on demand. Every request and response shape a shipped build relied on had to keep working, even as the database behind the API changed. A whole product area was deleted from the database while its old fields stayed supported for older builds. Only the API contract was versioned, so everything behind the contract could keep changing. Every piece of compatibility code carried a marker saying when it could be removed: 19 markers in total. Retiring v1 took three steps:",
    bullets: [
      "Built a minimum-version gate. Every request carries the app's version, and a build below the minimum is shown an update screen.",
      "Raised the minimum version so every old install had to update, then waited out a safety window.",
      "Deleted v1's endpoints, scanned for code that only v1 used, and dropped the database columns that only v1 wrote.",
    ],
    outro:
      "The whole cutover is written down as a repeatable procedure for the next version.",
    area: "fullstack",
    meta: { role: "tagly", stack: ["express", "typescript"] },
  },
  {
    id: "design-apps",
    title: "App design built around the core audience",
    body: "Designed the screens of Tagly's three **React Native apps**. The theme is built for Tagly's core audience, women aged 18 to 35: warm coffee and beige tones, with butter yellow and baby blue accents. All three apps share that palette and one set of components. Below are some of the screens.",
    media: [
      {
        src: "/work/app-onboarding.webp",
        caption: "Customer app: onboarding",
        alt: "The first onboarding screen, showing the map and explaining that a customer finds a business on Tagly.",
      },
      {
        src: "/work/map.webp",
        caption: "Customer app: the map",
        alt: "The map screen, each nearby business pinned with what a customer could earn for sharing it.",
      },
      {
        src: "/work/app-discover.webp",
        caption: "Customer app: discover",
        alt: "The discover screen: a search field, businesses recommended for you and businesses near you, each card showing what a share could earn.",
      },
      {
        src: "/work/app-settings.webp",
        caption: "Customer app: settings",
        alt: "Settings, grouped into account and security, connected accounts, preferences and notifications.",
      },
      {
        src: "/work/app-business-account.webp",
        caption: "Business app: account",
        alt: "A business account with its two venues and its totals: reach, shares, average price and credits purchased.",
      },
      {
        src: "/work/app-business-wallet.webp",
        caption: "Business app: wallet",
        alt: "The wallet: available and locked credits, the two automatic payment methods, and the transactions behind them.",
      },
      {
        src: "/work/app-business-shares.webp",
        caption: "Business app: shares",
        alt: "The shares grid, each one with its state and what it cost, including two a business reported.",
      },
      {
        src: "/work/app-business-menu.webp",
        caption: "Business app: menu",
        alt: "The business side menu, with the account's visibility, settings and the invite link.",
      },
    ],
    area: "design",
    meta: { role: "tagly", stack: ["react-native", "expo"] },
  },
  {
    id: "schema",
    title: "Fifty-table schema",
    body: "Designed Tagly's whole database, from accounts to the ledger and the job queues. The database has 50 tables, 546 columns, 33 enums and 73 foreign keys, and runs on **RDS**. Job queues live in their own schema, apart from the money and account data that has to last. **Prisma** handles the schema and ordinary queries, and **Kysely** handles the queries an ORM can't express. A few of the design decisions:",
    bullets: [
      "Half-finished sign-ups live in separate pending tables. A real customer row only exists once it has a name, a verified email and a signed agreement. Abandoned sign-ups are deleted on a schedule without touching real accounts.",
      "Money is stored in whole cents and multipliers in basis points, so important data never uses a float. Balances are built per currency, so supporting a new currency means adding a column, not converting data.",
      "Important data is never denormalised. Lifetime spend, and which balance paid for a post, are both derived from the ledger.",
      "Public uids are random and start with a prefix that says what kind of record they belong to. Internal ids stay plain integers.",
    ],
    area: "data",
    meta: { role: "tagly", stack: ["postgres", "prisma", "kysely", "aws"] },
  },
  {
    id: "shared-types",
    title: "All types are defined once, shared across the apps and the server",
    body: "Built a shared package that defines every endpoint's request and response shape. Every app and service imports the same package, so the client and the server always agree on the shape of the data. The package holds 160 endpoint contracts and 46 DTOs. The backend validates every incoming request against these contracts, and the apps' SDK checks every response and logs any mismatch.",
    area: "fullstack",
    meta: { role: "tagly", stack: ["zod", "typescript", "express"] },
  },
  {
    id: "github-actions-pipelines",
    title: "Everything ships from GitHub Actions",
    body: "Built the **GitHub Actions pipelines** that ship every part of Tagly, so nothing is deployed by hand. One pipeline ships the API and all 7 background services. Another builds and submits the apps, per environment and platform. A third deploys the marketing, landing and redirect sites. Each pipeline checks the result against what **AWS, EAS and Amplify** report back.",
    area: "infra",
    meta: {
      role: "tagly",
      stack: ["github-actions", "aws", "eas"],
    },
  },
  {
    id: "qr-referral-attribution",
    title: "QR stickers with referral attribution",
    body: "Built the referral attribution behind the QR sticker on the counter of every business Tagly works with. Everyone who joins through a sticker is credited to whoever invited them. Scanning a sticker opens the app if it's installed, or a landing page carrying the business's referral code if it isn't. The referral code survives the trip through the app store: **AppsFlyer** retrieves the code on the first open after install, and the app saves it locally.",
    media: [
      {
        src: "/work/qr-sticker.webp",
        caption:
          "Physical stickers placed in partnered businesses, linked via an ID",
        alt: "A Tagly counter sticker: a QR code beside the line asking customers to share the business on Instagram for a reward.",
      },
    ],
    area: "infra",
    meta: { role: "tagly", stack: ["appsflyer", "next", "expo"] },
  },
  {
    id: "share-anti-fraud",
    title: "Anti-fraud checks for each share",
    body: "Built the checks that stop Tagly from paying for a fake or repeated share. Every share has to pass **AWS Rekognition**, which reads the picture to confirm the right business was tagged. A cap in the pricing stops reshares from inflating a post's reach. A record of paid posts survives account deletion, so the same post can't be paid twice. Banned Instagram accounts are kept on a list, so a banned account can't be linked to a new Tagly account.",
    area: "backend",
    meta: { role: "tagly", stack: ["aws", "instagram-graph"] },
  },
  {
    id: "three-payment-methods",
    title: "Three ways for a business to pay",
    body: "Built the 3 ways a business can pay on Tagly: prepaid credits, pay-as-you-go, and automatic monthly top-ups. Credits are a one-off payment with no card kept on file. Pay-as-you-go charges a saved card whenever someone shares the business. Monthly top-ups refill the credit balance from the saved card at the start of each month. In the app, payments go through **Stripe's native payment sheet**. The sheet reporting success isn't proof the money moved, so the app only shows success once the backend has confirmed the payment.",
    area: "payments",
    meta: {
      role: "tagly",
      stack: ["stripe", "express", "react-native", "expo"],
    },
  },
  {
    id: "customer-payouts",
    title: "Customer payouts to real bank accounts in Czechia and the US",
    body: "Built the payouts that let customers withdraw their rewards straight to their own bank account, through **Stripe Connect**. Money moves from Tagly's platform balance to the customer's Stripe Connect account, then on to their bank. Every step shows up in the app. A reconciliation worker catches any payout stuck in an edge-case state.",
    area: "payments",
    meta: { role: "tagly", stack: ["stripe"] },
  },
  {
    id: "login-methods",
    title: "Sign-in and per-account auth",
    body: "Built sign-in and authentication across Tagly. Customers and businesses sign in with an email and a one-time code, or with Apple or Google. Customers can also sign in with Instagram, offered for anyone who's forgotten their email. One-time codes have attempt limits, resend limits and lockouts. After sign-in, every request carries a JWT with the caller's public uid. The uid's prefix is different for each account type, so the backend knows whether a customer, a business or an admin is calling. Each endpoint is only reachable by the account type it was built for.",
    area: "backend",
    meta: { role: "tagly", stack: ["express", "resend", "typescript"] },
  },
  {
    id: "instagram-integration",
    title: "Full Instagram integration, approved by Meta",
    body: "Built the **Instagram integration** that lets Tagly read statistics of the posts it pays for. The integration covers account connection, token refresh and permission handling, plus the data-deletion callbacks Meta requires before granting access in the Meta App Review. Two background workers collect the data. One pulls post-level insights for every share. The other takes a snapshot of the customer's account when they connect Instagram or create a share.",
    area: "backend",
    meta: { role: "tagly", stack: ["instagram-graph", "node"] },
  },
  {
    id: "background-services",
    title: "7 background services",
    body: "Built the 7 background services that handle Tagly's work outside of API requests. All 7 run on **ECS Fargate** and share one framework. The services cover database maintenance, notifications, payments, Stripe reconciliation, cleanup, Instagram post insights collection and Instagram profile snapshot collection.",
    area: "backend",
    meta: { role: "tagly", stack: ["node", "aws", "docker"] },
  },
  {
    id: "notifications",
    title: "52 notifications across push and email",
    body: "Built the 52 notifications Tagly sends, across 11 categories: balance, shares, referrals, security, marketing and more. Each notification goes out as a push notification, an email, or both. Security and legal notices are mandatory. Every other notification can be turned off per channel. Marketing notifications that would land overnight wait until morning, and go out as a push first, with an email only if the push wasn't acted on. Marketing email also sends from a separate subdomain, so spam complaints can't stop an important notification from arriving.",
    area: "backend",
    meta: { role: "tagly", stack: ["resend", "expo", "node"] },
  },
  {
    id: "stripe-webhooks-and-reconciliation",
    title: "Stripe webhooks and reconciliation workers",
    body: "Built the **Stripe webhook handling** that keeps Tagly's balances in sync with Stripe. The webhook handler covers 12 event types. Each event is recorded before Tagly acts on it, so nothing is ever counted twice. Reconciliation workers sweep for deposits that were never credited and withdrawals that got stuck, so no error state is left unresolved.",
    area: "payments",
    meta: { role: "tagly", stack: ["stripe", "express", "node"] },
  },
  {
    id: "migrations",
    title: "Seventy-four migrations",
    body: "Shipped 74 schema migrations to Tagly's live database. The new shape goes live next to the old one first, the old columns and tables are only dropped later, once nothing reads them and the workers have moved to the new shape.",
    area: "data",
    meta: { role: "tagly", stack: ["prisma", "postgres", "aws"] },
  },
  {
    id: "estimate-cache",
    title: "Hundreds of queries per screen, down to 2",
    body: "Cut the cost of calculating the earnings estimate a customer sees on every business in the app, in two steps. Each business used to cost 11 database queries, run one after another, and 7 of those fetched the same customer data again every time. At its limit of 75 businesses, a full map screen would have cost around 825 queries. Moving the 7 customer-related queries out of the per-business loop, and running the rest in parallel, brought a full screen down to about 307. Then every estimate was cached in **Redis** per customer and per business, so loading a screen again costs 2 Redis reads. Counters on the customer and the business clear an estimate the moment anything that affects its price changes. If Redis is down, estimates fall back to live pricing.",
    area: "backend",
    meta: { role: "tagly", stack: ["redis", "postgres", "kysely"] },
  },
  {
    id: "design-system",
    title: "Shared design system across three apps",
    body: "Built 53 components and 53 design tokens shared by all three apps, so a design change only happens once, in the shared package. One business-management form serves 9 different screens across the admin and business apps. Each screen hands the form its own pair of functions for reading and saving data.",
    area: "frontend",
    meta: { role: "tagly", stack: ["react-native", "typescript"] },
  },
  {
    id: "onboarding-rebuild",
    title: "Completely restructured onboarding based on funnel data",
    body: "Rebuilt Tagly's onboarding after the funnel showed a big drop-off at the first step, connecting Instagram. Onboarding now starts with an email code, or Apple or Google sign-in. Connecting Instagram moved to the end and became optional, which doubled the onboarding completion rate.",
    area: "data",
    meta: { role: "tagly", stack: ["posthog", "react-native"] },
  },
  {
    id: "map",
    title: "Map of nearby businesses",
    body: "Built a map that loads businesses in tiles as you pan, showing each business with how much you can earn for sharing it. Markers keep their own selected state and are drawn separately for iOS and Android. A list along the bottom of the screen lets you cycle through every available business without moving the map.",
    media: [
      {
        src: "/work/map.webp",
        caption: "Tagly's map screen",
        alt: "The map screen, each nearby business pinned with what a customer could earn for sharing it.",
      },
    ],
    area: "frontend",
    meta: { role: "tagly", stack: ["react-native", "expo"] },
  },
  {
    id: "localisation",
    title: "English and Czech across the apps and the backend",
    body: "Localised Tagly into English and Czech, from the apps to the backend's notification and email templates. Every user-facing string lives in one of 292 translation files. The language follows the device's language, and units follow the device's measurement system. Users can change both in their preferences.",
    area: "fullstack",
    meta: { role: "tagly", stack: ["i18next", "react-native", "typescript"] },
  },
  {
    id: "share-lifecycle",
    title: "From a customer's Instagram story to a payout",
    body: "Built the lifecycle every share on Tagly goes through, from a customer posting a story to Instagram to getting paid for it. An admin approves each share. 24 hours after the story goes up, a worker collects the post's data and a snapshot of the customer's profile. A share is only paid out once both steps are done. The price comes from the pricing engine, based on the collected data.",
    area: "backend",
    meta: { role: "tagly", stack: ["instagram-graph", "postgres", "prisma"] },
  },
  {
    id: "rate-limits",
    title: "Rate limits on Redis",
    body: "Built the rate limits that protect Tagly's API from abuse. There's one limit for signed-out traffic, one per logged-in account, and tighter limits on high-security endpoints like login. All the limits live in **Redis**, so each limit is shared across every server instead of counted per server.",
    area: "backend",
    meta: { role: "tagly", stack: ["redis", "express"] },
  },
  {
    id: "error-tracking",
    title: "Errors and funnels tracked in PostHog",
    body: "Set up error tracking and funnels in **PostHog**, so problems and drop-offs show up in one place. The API and all 7 background services send every error to PostHog. The customer and business apps report errors from their critical flows, and track how far people get through each funnel.",
    area: "infra",
    meta: { role: "tagly", stack: ["posthog"] },
  },
  // Galleries rather than claims: the screenshots are the point, and the copy
  // only has to say what a reader is looking at.
  {
    id: "design-web",
    title: "Web design",
    body: "Designed and built Tagly's business-facing marketing site and user-facing invite page. Both ship in English and Czech and are deployed on **Amplify**. This site is built with the same stack: **Next.js, React and Tailwind**.",
    media: [
      {
        src: "/work/marketing-hero.webp",
        caption: "Marketing site: hero",
        alt: "The top of Tagly's marketing site: the headline, a product video, and the count of people already using it.",
      },
      {
        src: "/work/marketing-how.webp",
        caption: "Marketing site: how it works",
        alt: "The marketing site's three-step explanation, each step shown on a phone: posting the story, approving the share, getting paid.",
      },
      {
        src: "/work/marketing-examples.webp",
        caption: "Marketing site: real-world examples",
        alt: "Real shares from businesses on the marketing site, each card showing its reach, its price and what the customer spent.",
      },
      {
        src: "/work/invite-page.webp",
        caption: "Invite page: hero",
        alt: "The invite page on a phone, with the App Store link and a row of recent payouts.",
      },
      {
        src: "/work/invite-steps.webp",
        caption: "Invite page: step by step",
        alt: "The invite page's step-by-step section, showing the map and an Instagram story being posted.",
      },
    ],
    area: "design",
    meta: { role: "tagly", stack: ["next", "react", "tailwind"] },
  },
  {
    id: "web-surfaces",
    title: "Tagly's marketing site, invite page and redirect page",
    body: "Built Tagly's three web surfaces. The business-facing marketing site and the user-facing invite page, which opens when someone taps an invite link, are both built in **Next.js and React**, in English and Czech. The third is a dependency-free static page that sends people back into the app after an OAuth sign-in or a Stripe flow.",
    media: [
      {
        src: "/work/marketing-hero.webp",
        caption: "Tagly's business-facing marketing site",
        alt: "The top of Tagly's marketing site: the headline, a product video, and the count of people already using it.",
      },
      {
        src: "/work/invite-page.webp",
        caption: "Tagly's user-facing invite page",
        alt: "The invite page on a phone, with the App Store link and a row of recent payouts.",
      },
    ],
    area: "frontend",
    meta: { role: "tagly", stack: ["next", "react", "tailwind", "i18next"] },
  },
] as const;
