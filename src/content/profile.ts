/**
 * Me: who I am, where I am, how to reach me, what I speak, where I studied.
 *
 * Everything here is a fact about a person. Anything that is a claim about a
 * project belongs in `work.ts`, where something proves it, and anything the
 * document needs rather than the person belongs in `site.ts`.
 */

export type Language = { label: string; level: string; flag: string };

export type Education = {
  id: string;
  institution: string;
  period: string;
  note?: string;
};

/**
 * `icon` is a brand mark from `brand-icons.ts` or one of the generic marks the
 * rail draws itself.
 *
 * Named for what it is rather than `Link`, which every file importing
 * `next/link` would then have to disambiguate.
 */
export type ContactLink = {
  label: string;
  href: string;
  icon: string;
  /**
   * Also a button in the Contact section. The rail lists every link; the
   * section only offers the ones that are a way to reach me, which a code
   * profile is not.
   */
  inContactSection: boolean;
  /**
   * Also in the landing's intro on a phone, beside the location. On a desktop
   * the rail shows every link beside the page; on a phone the rail is a drawer
   * behind a button, so the way to write to me sits under the bio as well.
   */
  inIntro: boolean;
};

export type Profile = {
  name: string;
  /** The line above the name. A job title, not an entry in `roles.ts`. */
  role: string;
  /** The on-page opener. The search snippet is `site.description`. */
  bio: string;
  location: string;
  /** What I am looking for, the paragraph in the Contact section. */
  availability: string;
  /** The one link in Misc: what I listen to. */
  music: Omit<ContactLink, "inContactSection" | "inIntro">;
  /**
   * Two crops of the same shoot. `avatar` is the headshot, cut to a circle in
   * the file rather than only in CSS so the same image can be the favicon,
   * where there is no CSS to round it. `photo` is the full frame, only fetched
   * when someone opens it. Both are downscaled from the originals in assets/,
   * which is gitignored: image optimisation is off under `output: "export"`, so
   * whatever sits in public/ is exactly what a visitor downloads.
   */
  avatar: string;
  photo: string;
  languages: readonly Language[];
  education: readonly Education[];
  links: readonly ContactLink[];
};

export const profile = {
  name: "Matej Bednar",
  role: "Backend, mobile & DevOps engineer",
  bio: "I built a two-sided marketplace end to end: three React Native apps, a 165-endpoint API, seven background services, and a double-entry ledger moving money in both directions. It runs in three environments, is deployed on AWS from CI, and I took it through App Store and Google Play review.",
  location: "Prague, CZ",
  availability:
    "I'm looking for my next job. Building backend and mobile, and designing the systems and pipelines underneath, is what I know best, but I'd also be happy learning a new stack and getting more experience in a bigger team.",
  music: {
    label: "Music I listen to",
    href: "https://music.apple.com/profile/matejbednar",
    icon: "applemusic",
  },
  avatar: "/avatar.png",
  photo: "/profile-picture.jpg",

  languages: [
    { label: "Czech", level: "Native", flag: "🇨🇿" },
    { label: "English", level: "Fluent", flag: "🇬🇧" },
    { label: "German", level: "Elementary", flag: "🇩🇪" },
  ],

  education: [
    {
      id: "cvut",
      institution:
        "FIT ČVUT (Czech Technical University, Faculty of Information Technology)",
      period: "2025 to 2026",
      note: "Left one semester in to build Tagly full time.",
    },
  ],

  links: [
    {
      label: "me@matej.fyi",
      href: "mailto:me@matej.fyi",
      icon: "mail",
      inContactSection: true,
      inIntro: true,
    },
    {
      label: "/matejbednar4",
      href: "https://github.com/matejbednar4",
      icon: "github",
      inContactSection: false,
      inIntro: false,
    },
    {
      label: "/matejbednar4",
      href: "https://www.linkedin.com/in/matejbednar4",
      icon: "linkedin",
      inContactSection: true,
      inIntro: false,
    },
  ],
} as const satisfies Profile;
