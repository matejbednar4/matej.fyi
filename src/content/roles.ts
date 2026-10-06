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
  /**
   * Outcomes, not output: what the work achieved, never how much of it there
   * was. A count of endpoints or tables is scope, and scope belongs in the work
   * item it describes.
   */
  stats?: readonly { value: string; label: string }[];
  /**
   * Why the role is over, for one that is: its own section on the role's page,
   * between my role and the work, and never on the landing's card. An end date
   * a month after the best number on that card is the first thing a reader of
   * the page asks about. The title is copy rather than derived, since leaving a
   * company that carries on is not the company ending. Absent while the job is
   * current.
   */
  ending?: { title: string; text: string };
};

export const roles = [
  {
    id: "tagly",
    company: "Tagly",
    role: "Co-Founder & Sole Engineer",
    period: "Jan 2025 to Sep 2026",
    logo: "/tagly-logo.png",
    about:
      "Tagly is a platform where local businesses pay their customers for posting about them on Instagram. Customers get rewarded based on the reach and audience fit of what they post and businesses get a new marketing channel without spending any time on it.",
    contribution:
      "I co-founded Tagly and built the product on my own. We raised $100,000 and onboarded over 5,000 users. I built the three apps, the REST API and the seven workers behind them, a custom ledger, deposits and withdrawals through Stripe, and owned the deployment pipeline down to the App Store and Google Play reviews. Here are Tagly's biggest achievements:",
    stats: [
      { value: "5,000+", label: "Users" },
      { value: "20+", label: "Paying businesses" },
      { value: "Peaked at #1", label: "CZ App Store, Lifestyle" },
      { value: "$100,000", label: "Raised" },
      { value: "2 apps", label: "Live on both stores" },
    ],
    ending: {
      title: "Why Tagly ended",
      text: "We stopped Tagly in September 2026. We were only live in Prague and still onboarded over 5,000 users and more than 20 paying businesses. But the marketplace wasn't dense enough to become active. Reaching that density meant raising a pre-seed round, and investors wanted to see the marketplace active first. It's like Uber with only 20 drivers: nobody would use it.",
    },
  },
] as const satisfies readonly Role[];

export type RoleId = (typeof roles)[number]["id"];
