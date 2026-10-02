/**
 * Jobs. Thin on purpose: a role is a heading and some context, not a container.
 * What I did there lives in `work.ts` and points back here.
 *
 * Education is not a role. It lives in `profile.ts` with the other facts about
 * the person.
 */

export type Role = {
  id: string;
  company: string;
  /** What I was there. The same kind of value as `profile.role`. */
  role: string;
  period: string;
  /**
   * What I did there, in prose. The one that is about me, so it is the one
   * every preview of the role shows: a card on the landing is a claim about my
   * work, not an ad for a company. The work items are the specifics; this is
   * the shape of the job.
   */
  contribution: string;
  /**
   * What the company does, for someone who has never heard of it. About the
   * business, never about me, and only ever seen on the role's own page, where
   * it opens the page under the company's name. Optional: a job at a company
   * everyone knows does not need it.
   */
  about?: string;
  /**
   * The company's mark, as a path under /public. The mark alone, not a lockup
   * with the name beside it: it is drawn in a square, and the page's `h1` is
   * already the company's name. Falls back to initials when absent, the same
   * way a technology without a licensed mark does.
   */
  logo?: string;
  stats?: readonly { value: string; label: string }[];
};

export const roles = [
  {
    id: "tagly",
    company: "Tagly",
    role: "Co-Founder & Lead Engineer",
    period: "Jan 2025 to Sep 2026",
    logo: "/tagly-logo.png",
    about:
      "Tagly is a platform where local businesses pay their customers for posting about them on Instagram. Customers get rewarded based on the reach and audience fit of what they post and businesses get a new marketing channel without spending any time on it.",
    contribution:
      "I co-founded Tagly and built the product on my own. We raised $100,000 and onboarded over 5,000 users. I built the three apps, the API and the seven workers behind them, a custom ledger, deposits and withdrawals through Stripe, and owned the deployment pipeline down to the App Store and Google Play reviews. Here are Tagly's biggest achievements:",
    stats: [
      { value: "5,000+", label: "Users" },
      { value: "20+", label: "Paying businesses" },
      { value: "Peaked at #1", label: "CZ App Store, Lifestyle" },
      { value: "$100,000", label: "Raised" },
      { value: "165", label: "Endpoints" },
      { value: "50", label: "Database tables" },
      { value: "2 apps", label: "Live on both stores" },
    ],
  },
] as const satisfies readonly Role[];

export type RoleId = (typeof roles)[number]["id"];
