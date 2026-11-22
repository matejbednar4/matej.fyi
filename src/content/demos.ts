import type { RoleId } from "./roles";

/**
 * Screen recordings of the product, each with the context a reader needs to
 * follow it. They have their own page, /demos, one section per recording, in
 * this order.
 *
 * The files are shared with `work.ts`: a work item a recording proves carries
 * the same video in its `media`, often with a `#t=` fragment that opens it at
 * the part that claim is about.
 *
 * The recordings have no sound. The captions burned into each video say what
 * is happening on screen; `context` says why the flow exists and what to watch
 * for, which the video cannot.
 */

export type Demo = {
  /** The section's anchor on /demos. */
  id: string;
  /** Whose product it is: the role's page links here when it has any. */
  role: RoleId;
  /** The section's heading. */
  title: string;
  /** The same demo in a few words, for the rail. */
  label: string;
  /** Paragraphs, in order. */
  context: readonly string[];
  /** A numbered list after the paragraphs, where the context is one. */
  points?: readonly string[];
  /** The recording, as a path under /public. */
  video: string;
  /** A still from it, drawn as the thumbnail. */
  poster: string;
  /** What the recording shows, for a reader who cannot watch it. */
  alt: string;
};

/** The page's own words: its heading, its opening paragraph, its snippet. */
export const demosPage = {
  title: "Demos",
  lede: "Four screen recordings of Tagly, across the customer, business and internal admin apps. After we stopped Tagly, I had to take it down to stop paying for the infrastructure, so I recorded these demos before I did. They run on the staging apps with test accounts and Stripe in test mode, so no real money moves. There's no sound: the captions in each video say what's happening.",
  description:
    "Screen recordings of Tagly's customer, business and admin apps: the full share flow, business auto suggestions, QR sticker referrals and business onboarding.",
};

export const demos: readonly Demo[] = [
  {
    id: "share-flow",
    role: "tagly",
    title: "Full share flow",
    label: "Full share flow",
    context: [
      "This demo shows Tagly's core flow from three sides: the customer's, the business's and the admin's.",
      "Tagly's idea is simple. A customer visits a business, posts an Instagram story that tags it, and links the story to that business in Tagly. The business then pays them for the story, based on its reach, how relevant its audience is, and a few other factors.",
      "There are a few clear problems with that, though:",
    ],
    points: [
      "You can't trust customers to only monetise relevant stories. So before a story can earn anything, AWS Rekognition checks that it tags the business. In the demo, the story is tagged \"Italian Corner\". When the customer tries to link it with Core Pilates, it's turned down, but when they link it with Italian Corner, it's accepted.",
      "A tag doesn't make a story good, real or relevant. So every share is reviewed by one of our admins in the internal admin app before the business can see it. The plan was to automate this with AI later. I didn't build that at the start, because the volume was small enough to review by hand.",
      "Does the business actually like its shares? A business can rate every one of them, and the rating adjusts the customer's multiplier. A customer who shares a lot of bad stories gets paid less, and one who shares good ones gets paid more. In the demo, five stars moves the customer's multiplier from 1.00x to 1.07x.",
    ],
    video: "/work/tagly-share-flow.mp4",
    poster: "/work/tagly-share-flow.webp",
    alt: "A customer shares an Instagram story of two pizzas at Italian Corner. A story that doesn't tag Core Pilates is rejected for it. An admin approves the share, the business rates it five stars, and the customer's reward multiplier rises from 1.00x to 1.07x.",
  },
  {
    id: "auto-suggestions",
    role: "tagly",
    title: "Business auto suggestions",
    label: "Business suggestions",
    context: [
      "Most people post their story while they're still at the business. So when a customer opens Tagly, the app checks whether they're within 50 metres of a business on Tagly, and whether one of their recent stories tags it.",
      "If both are true, the app offers to link the customer's story with the business straight away. It shows the estimated reward, and one tap creates the share. There's no searching for the business and no picking the story, which makes sharing as easy as it can be.",
    ],
    video: "/work/tagly-business-suggestion.mp4",
    poster: "/work/tagly-business-suggestion.webp",
    alt: "A customer posts an Instagram story tagged Sushi Garden, opens Tagly, and is asked whether they want to share Sushi Garden, with the story and an estimated reward shown. They confirm and the share goes under review.",
  },
  {
    id: "sticker-referrals",
    role: "tagly",
    title: "Referrals through QR stickers in partnered businesses",
    label: "QR sticker referrals",
    context: [
      "We put a QR sticker inside businesses we partnered with. In our admin app, each sticker is linked to its business by the number printed on its QR code.",
      "A customer who scans it lands on the invite page, which fetches the business's referral code by the sticker ID. When they install Tagly and sign up, the referral code survives the trip through the App Store, so the new account is referred by the business, and the business earns money from the new people who join through its sticker.",
      "This way, we can also track which businesses bring in more customers and which sticker placements work best.",
    ],
    video: "/work/tagly-sticker-signup.mp4",
    poster: "/work/tagly-sticker-signup.webp",
    alt: "A business sets the referral code tagly-test, an admin assigns sticker 000223 to it, and a customer scans the sticker, goes through the invite page and the App Store, signs up, and finds tagly-test as their referrer in settings.",
  },
  {
    id: "business-sign-up",
    role: "tagly",
    title: "Business onboarding and credit purchase",
    label: "Business onboarding",
    context: [
      "This demo shows how a business got started on Tagly, from opening the business app to a live business page, including buying credits.",
    ],
    video: "/work/tagly-business-onboarding.mp4",
    poster: "/work/tagly-business-onboarding.webp",
    alt: "The business app's onboarding: the intro screens, sign-in with an emailed code, a $250 credit purchase through Apple Pay in Stripe's test mode, and a new business page for Italian Corner with a banner, photos and opening hours.",
  },
];
