import type { RoleId } from "./roles";

/**
 * Screen recordings of the product, each with the context a reader needs to
 * follow it. They have their own page, /demos, one section per recording, in
 * this order.
 *
 * Each context stands on its own: a reader can land on any section from the
 * rail, so none points at another demo.
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
  lede: "Screen recordings of Tagly, across the customer, business and internal admin apps. After we stopped Tagly, I had to take it down to stop paying for the infrastructure, so I recorded these demos before I did. They run on the staging apps with test accounts and Stripe in test mode, so no real money moves. There's no sound: the captions in each video say what's happening.",
  description:
    "Screen recordings of Tagly's customer, business and admin apps: the customer share flow, the tag check, QR sticker referrals, the full share flow, business auto suggestions, the business wallet and business onboarding.",
};

export const demos: readonly Demo[] = [
  {
    id: "customer-share-flow",
    role: "tagly",
    title: "Customer share flow",
    label: "Customer share flow",
    context: [
      "This demo shows Tagly's core flow from the customer's side. They post an Instagram story tagging Italian Corner, open Tagly, find the business on the map and connect the story with the business. Tagly checks the business is tagged, creates the share and sends it for review.",
    ],
    video: "/work/tagly-share-customer.mp4",
    poster: "/work/tagly-share-customer.webp",
    alt: "A customer posts an Instagram story of two pizzas tagged Italian Corner, opens Tagly, finds Italian Corner on the map, picks the story and confirms. The share is created and goes under review, with an estimated reward of 114 Kč.",
  },
  {
    id: "wrong-business",
    role: "tagly",
    title: "Wrong business tagged",
    label: "Wrong business tagged",
    context: [
      "You can't trust customers to only monetise relevant stories, so before a story can earn anything, AWS Rekognition checks that it tags the business.",
      "In this demo, the customer's story is tagged \"Italian Corner\", but they try to link it with \"Core Pilates\". Rekognition doesn't find Core Pilates tagged in the story, so Tagly blocks the share and asks them to choose or post another story.",
    ],
    video: "/work/tagly-share-wrong-tag.mp4",
    poster: "/work/tagly-share-wrong-tag.webp",
    alt: "A customer posts a story tagged Italian Corner, then tries to share it for Core Pilates. Tagly shows that the story needs to mention Core Pilates and offers to choose or post another story.",
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
    video: "/work/tagly-deeplink-referrals.mp4",
    poster: "/work/tagly-deeplink-referrals.webp",
    alt: "A business sets the referral code tagly-test, an admin assigns sticker 000223 to it, and a customer scans the sticker, goes through the invite page and the App Store, signs up, and finds tagly-test as their referrer in settings.",
  },
  {
    id: "share-flow",
    role: "tagly",
    title: "Full share flow",
    label: "Full share flow",
    context: [
      "This demo shows Tagly's core flow from three sides: the customer's, the business's and the admin's.",
      "Tagly's idea is simple. A customer visits a business, posts an Instagram story that tags it, and links the story to that business in Tagly. The business then pays them for the story based on its reach, how relevant its audience is, and a few other factors.",
      "There are two clear problems with that, though:",
    ],
    points: [
      "A tag doesn't make a story good, real or relevant. So every share is reviewed by one of our admins in the internal admin app before the business can see it. The plan was to automate this with AI later. I didn't build that at the start, because the volume was small enough to review by hand.",
      "Does the business actually like its shares? A business can rate every one of them, and the rating adjusts the customer's multiplier. A customer who shares a lot of bad stories gets paid less, and one who shares good ones gets paid more. In the demo, five stars moves the customer's multiplier from 1.00x to 1.07x.",
    ],
    video: "/work/tagly-share-full.mp4",
    poster: "/work/tagly-share-full.webp",
    alt: "A customer posts an Instagram story of two pizzas tagged Italian Corner, finds the business on Tagly's map and shares the story. An admin approves the share, the business rates it five stars, and the customer's reward multiplier shows 1.07x.",
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
    video: "/work/tagly-share-suggestion.mp4",
    poster: "/work/tagly-share-suggestion.webp",
    alt: "A customer posts an Instagram story tagged Sushi Garden, opens Tagly, and is asked whether they want to share Sushi Garden, with the story and an estimated reward shown. They confirm and the share goes under review.",
  },
  {
    id: "business-wallet",
    role: "tagly",
    title: "Business wallet",
    label: "Business wallet",
    context: [
      "This demo shows the three ways a business can pay for its shares:",
    ],
    points: [
      "They buy prepaid credits through Stripe with Apple Pay or by card.",
      "They can link a card and set a monthly budget, and on the 1st of each month Tagly tops their credits back up to it.",
      "With pay as you go, their linked card is charged each time a customer shares them, so they never have to commit money upfront.",
    ],
    video: "/work/tagly-business-wallet.mp4",
    poster: "/work/tagly-business-wallet.webp",
    alt: "In the business wallet, a business buys $250 of credits with Apple Pay through Stripe in test mode, links a card for a monthly top-up, changes its monthly budget from $250 to $300, and turns on pay as you go.",
  },
  {
    id: "business-sign-up",
    role: "tagly",
    title: "Business onboarding and credit purchase",
    label: "Business onboarding",
    context: [
      "This demo shows how a business goes through onboarding in Tagly, from downloading the business app to a live business page, including buying credits.",
    ],
    video: "/work/tagly-business-onboarding.mp4",
    poster: "/work/tagly-business-onboarding.webp",
    alt: "A business downloads Tagly Partner from the App Store, signs in with an emailed code, buys $250 of credits through Apple Pay in Stripe's test mode, and creates a business page for Italian Corner with a banner, opening hours, Instagram and a website.",
  },
];
