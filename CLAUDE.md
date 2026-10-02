@AGENTS.md

# matej.fyi

Matej Bednar's personal site: what he's built, what he can build, and founder
experience. Public repo, deployed on Vercel at https://matej.fyi. Static
Next.js 16 (App Router), Tailwind v4, TypeScript. `yarn` only, never `npm`.

---

## Hard constraints

**Static export.** `next.config.ts` sets `output: "export"`, so the build emits
plain HTML/CSS/JS into `out/` and the site stays on Vercel's free tier. That
rules out Server Actions, Route Handlers, `middleware.ts`, `next/image`
optimisation (`images.unoptimized` is on, so size images at build time),
dynamic params without `generateStaticParams`, and anything that needs a
request at runtime (cookies, headers, server `searchParams`, ISR). If a feature
needs a server, it doesn't belong here.

**Never publish business specifics.** `tagly-build-record/` is private,
gitignored source material: never commit it and never quote it in a committed
file. Engineering is fine to write about publicly. These never reach a
committed file or a shipped page:

- the platform take percentage and referral split percentages
- budget lock ratios, price caps, eCPM basis, reward ceilings
- the negative-balance and funding-mode commercial mechanics

Describe *what was engineered*, never *what it charges*.

---

## What lives where

```
src/
  app/
    layout.tsx              root layout: fonts, metadata, the brand sprite
    globals.css             the token contract + base styles (only global CSS)
    page.tsx                landing: SECTIONS, then About, Roles, Highlights,
                            Stack, Work, Contact, Misc, written out inline
    (detail)/               route group, contributes nothing to the URL
      layout.tsx            the page shell both sub-pages share
      roles/[role]/page.tsx   /roles/<id>, everything done in one role
      work/[area]/page.tsx    /work/<area>, everything of one kind
  components/
    primitives/             CustomButton, CustomCard, CustomMark,
                            CustomMedia, CustomModal, CustomSection
    previews/               each leads to its page or opens its detail
      StackItemPreview.tsx  a technology as a tile that turns over
      WorkAreaPreview.tsx   a kind of work, the landing's door to /work/<area>
      WorkItemPreview.tsx   a piece of work as a stack-panel row or a
                            Highlights card, both opening a dialog
    details/                each is the thing in full
      RoleDetail.tsx        a role: a card on the landing, the bare section
                            on its own page; draws the numbers
      StackItemDetail.tsx   the panel a tile opens: a tool and its work
      WorkItemDetail.tsx    one piece of work in full, wherever it appears
    MarkedText.tsx          work copy with its **marked** phrases set in <b>
    PageHeader.tsx          the top of a sub-page: the figure, then the title
    Sidebar.tsx             the rail on every page, navigation only (client)
    StackGrid.tsx           the Stack section and its work dialog (client)
    WorkFilter.tsx          a role's work by area (client)
    WorkHighlights.tsx      the Highlights cards and their dialog (client)
  content/
    profile.ts              name, role, bio, location, photos, languages,
                            education, contact links
    site.ts                 canonical url and the search snippet
    areas.ts                the kinds of work, which are also the routes:
                            label, Lucide mark, tagline, meta-only blurb
    roles.ts                the jobs
    work.ts                 everything I have done, as one ranked list
    stack.ts                the technologies
    index.ts                the only entry point: barrel + derived indexes
  utils/
    externalLink.ts         the attributes an anchor needs to leave the site
tagly-build-record/         PRIVATE, gitignored, never committed
```

---

## Structure

**Routes are `page.tsx`. Always.** An `index.tsx` inside `app/` is ignored, and
the build fails with no routes found. A root `app/layout.tsx` is mandatory.

**A file is named exactly what it exports, in the export's own case.** A
component is a PascalCase `.tsx` file (`RoleDetail.tsx`), a util a camelCase
`.ts` file (`externalLink.ts`). Route files keep the App Router's reserved
names. One main export per file; renaming the export renames the file.

**`utils/` holds plain functions, no JSX, with more than one caller.** A helper
with one caller stays in it (`panelFrames` lives in `StackGrid`).
`components/` holds components and nothing else.

**Content is separated from presentation.** Copy and data live as typed
objects in `src/content/`; components render what they are given. Editing the
site's words means editing `src/content/`, not JSX.

**A page owns its one-off markup.** A section used on one page, with no props
and no state, is written inline in that `page.tsx`. A component earns its own
file when it has a second caller, when it must be a client component
(`Sidebar`, `StackGrid`, `WorkFilter`, `WorkHighlights`, so the landing stays
out of the bundle), or when it is one of the named shapes below. Not because a
page looks long.

**Every content type has named shapes: `<Type>Preview` and `<Type>Detail`.** The
types are `Role`, `Area` (spelled `WorkArea` in a name), `WorkItem` and
`StackItem`. A preview leads to its type's page or opens its detail; a detail
is the thing in full. A shape is its own file even with one caller: previews in
`previews/`, details in `details/`. A shape that only works inside one parent
says so in its comment.

| Type | Preview | Leads to or opens |
| --- | --- | --- |
| `Area` | `WorkAreaPreview`, the landing's door | `/work/<area>` |
| `Role` | none: `RoleDetail` is drawn as the landing's card | `/roles/<id>` |
| `WorkItem` | `WorkItemPreview`, a stack-panel row or a Highlights card | `WorkItemDetail`, in a dialog |
| `StackItem` | `StackItemPreview`, the tile | `StackItemDetail`, the panel under its row |

`RoleDetail` is a linked card on the landing and, with `isCard={false}`, the
bare section on `/roles/<id>`: no card, no company heading (the `h1` says it),
no link to itself. One component, so the two can never disagree.

**A frame shared by a route subtree is a `layout.tsx`.** The sub-pages share
the page shell through the `(detail)` route group, which is invisible in the
URL. The rail is not in that layout: a layout above `[area]` and `[role]` gets
no params, so it cannot know which list to draw or which row is current. Each
page renders its own `Sidebar`.

**A repeated visual treatment is a `@utility` in `globals.css`** (`surface`,
`chip`, `eyebrow`, `rail-row`), not a React wrapper with a `className`
passthrough.

---

## Pages

**Every page is a rail, then the content**, through `page-shell`.

- **A rail lists the siblings of the page it is on**: the landing's sections,
  the areas on `/work/<area>`, the roles on `/roles/<id>`. Never another
  page's list.
- **The way back** comes first in the rail on a desktop. On a phone it is the
  left of the pinned bar only, as an arrow with its label as the accessible
  name, and it and its divider are not repeated in the drawer. Opening the
  drawer focuses the first nav row.
- **The pinned bar's text says where the reader is**: the current section on
  the landing, the page elsewhere. With a way back the bar is three cells with
  equal outer ones, so the name centres; without one the name sits left.
- **The personal block belongs to the landing.** The landing writes location,
  contact links and languages and passes them to `Sidebar` as `children`. On a
  phone the intro repeats them under the bio (`md:hidden`): location and the
  links flagged `inIntro` on one line, languages on the next.
- **Every rail row is `rail-row`** with `pressable feedback-fill`. The current
  row is the one with `aria-current`.

**The landing** is About, Roles, Highlights, Stack, Work, Contact, Misc.
`SECTIONS` in `page.tsx` drives both the sections and the rail.

**Highlights is the first six items of `work`.** The order of `work.ts` is the
site's one ranking: Highlights, area pages, the role page and stack panels all
follow it, so promoting work means moving it up the file. Each card shows the
area's mark and name, the title and the body clamped to four lines, and opens
the item in a dialog.

**A sub-page opens with `PageHeader`**: the figure and the `h1` in one row, and
at most one paragraph under them. The paragraph only appears when it says
something new. A role page shows `role.about`. A work page shows none, because
the landing's door already gave the tagline; the area's `blurb` is only the
meta description.

**The figure says what the page is about**: my face on the landing, a
company's mark on a role page, the area's mark on a work page. The last two sit
on a `surface` tile the size of the avatar, drawn in `--color-ink`.

- Each area declares its mark as `icon` in `AREA_META`. Because that puts
  lucide-react in `src/content`, `content:check` compiles into
  `node_modules/.cache`, where the package resolves.
- `role.logo` is the mark alone, never a lockup. It is drawn as a CSS mask in
  the ink colour, so only its shape comes from the file. The mask is inline
  (the path is data), in both `mask` and `-webkit-mask` for Safari before 16.4.
  Without a file it falls back to initials.
- Every figure but the avatar is decorative: no alt text, no label.

**`/roles/<id>`** is the intro, `My role at <company>` and `What I've done
here`. `role.contribution` is what I did: required, and what every preview of
the role shows. `role.about` is what the company does: optional, and only on
its own page.

**`WorkFilter`** holds one piece of state, the area showing, and takes the
cards as rendered `children`, so work items stay server-rendered. Showing all
is the default and keeps the per-area labels, so the static HTML is complete
and works without JavaScript. Group labels show only while every group does.
The buttons are `CustomButton`s: pressed is `primary`, the rest `secondary`.

**`/work/<area>`** is the intro, then the work with a count eyebrow and no
section title.

**Routing: two indexes over one list.** Every claim is written once, in
`work.ts`. `/roles/<id>` filters by role, `/work/<area>` by area. The landing
sends readers to areas, the axis that varies. A work item's canonical anchor is
its area page, since `area` is required and the role is not.

- **An area is declared only once work fills it.** `content:check` fails an
  empty one. The seven areas: `payments`, `backend`, `fullstack`, `data`,
  `infra`, `frontend`, `design`. `fullstack` is work that only exists because
  there are two sides (one typed contract, two API versions live at once);
  `design` is galleries rather than claims, so its items are mostly `media`.
- **Nothing keys off a specific id.** No component checks for `"tagly"`; the
  landing draws the first role large by index; a work card reads its company
  through `roleOf`. A second role is a data edit.
- **A work card says where it happened, in its label**: "[logo] Backend at
  Tagly" in a dialog, "[logo] Tagly" on an area page, nothing on the role page.
  The logo is a `CustomMark` with `src`, in `CustomCard`'s `captionMark`.
- **A work item's title stands on its own**, because the stack dialog shows one
  card with nothing around it.
- **Links cross an axis, never move along one.** Work shows its stack as plain
  labels; the Stack grid is the clickable way back. Work never links to work.
  The rail's sibling links are the one exception: that rule governs content,
  and the rail is the site's own index.

---

## Design

One theme, **Jungle Dark**: forest ground, moss chips, a lake-coloured accent
and warm bone text. Nothing switches: no `data-theme`, no toggle,
`color-scheme: dark`. The browser chrome colour is the `themeColor` in
`layout.tsx`'s `viewport`, the ground written out; change both together. If a
second theme ever returns, it overrides tokens only, set by a blocking inline
script in `<head>`, and clears every contrast pair before it ships.

### Tokens

`globals.css` holds the whole contract: `@theme` tokens (colours, radii,
shadows, type scale) and `:root` values for type, motion and texture.

- **It must be `@theme static`.** Otherwise Tailwind drops tokens no utility
  references, and any `var(--color-…)` read breaks.
- **Components read tokens, never literals.** No hex, no arbitrary spacing, no
  one-off radius. A missing value becomes a new token.
- **Texture is tokenised too** (`--wash-top-right`, `--wash-bottom-left`,
  `--grain`), so the ground's recipe lives in one place.

| Token | Value | Role |
| --- | --- | --- |
| `--color-background` | `#0d1a13` | the ground, and the text on an accent fill |
| `--color-surface` | `#1c2a20` | card, lifted above the ground |
| `--color-surface-alt` | `#243d27` | chips and secondary buttons |
| `--color-accent` | `#3fc7b8` | the lake, the only saturated thing, and the text on a selected fill |
| `--color-hover` | `#0e332f` | hover and selected fill |
| `--color-edge` | `#2a3b2c` | dividers only, never to bound a card |
| `--color-ink` | `#ede8d2` | body text, on the ground and on a card alike |
| `--color-ink-muted` | `#a9b597` | secondary copy, captions, dates, labels |
| `--color-plate` | `#ede8d2` | the light tile a brand mark sits on |
| `--color-on-plate` | `#0d1a13` | the mark itself |
| `--color-focus` | `#3fc7b8` | the keyboard focus ring, and nothing else |

- `--color-focus` matches the accent but stays its own token: a focus ring
  answers to 3:1 against whatever is under it, a different test from the
  accent's.
- There is no scrim token. Both dialogs sit on the ground at 85%.
- **Measured limits:** ground to surface is 1.19:1, surface to chip 1.26:1.
  `--color-surface-alt` cannot go lighter than `#243d27` without dropping
  `--color-ink-muted` on a chip below 4.5:1.
- **The accent stays far from the ink** (OKLab dE 21), not just readable on
  the ground, or every eyebrow and action reads as body text.
- **Why the palette works:** four hues about 130° apart, and warm text on a
  cool ground. Vary the hue, keep the chroma. One green on every layer reads as
  a tinted website; draining the chroma reads as dead.
- **Washes:** two, centred on the screen's edges. Top right is the surface
  colour at 0.9. Bottom left is the accent, capped at 0.16 by contrast, and
  desktop only.

### Elevation

- **Never `border` or `divide-*`.** Every surface composes its channels in
  one property: `box-shadow: var(--shadow-gloss), var(--shadow-card)`. The
  gloss is a one-pixel top highlight; the card shadow is a contact shadow plus
  an ambient one.
- **Only the stack tile adds `--tile-rim`**, on every tile state, or it would
  vanish mid-flip.
- **Depth is claimed once.** `--shadow-card` belongs to a surface on the page
  ground. A surface inside another gets `--shadow-gloss` alone, at rest and on
  hover: `chip`, `CustomMark`'s plate, the button's `surface` ground,
  `CustomMedia` with `ground="card"`. A primitive drawn in both places takes
  the ground as a prop.
- **Floating is not nesting.** A modal, the mobile drawer and a close control
  over content keep their shadow.
- A card that disappears against the ground is a bug.

### Interaction

Each treatment is one `feedback-*` utility that writes the desktop hover and the
phone press side by side, so both always apply to the same controls.

| | utility | desktop hover | phone press |
| --- | --- | --- | --- |
| Raised on the page: pill button, stack tile, picture, dialog close | `feedback-grow` | grows by `--hover-scale` | shrinks |
| A linked card: role card, area door | `feedback-shadow` | holds still; shadow deepens to `--shadow-hover`; arrow slides | shrinks gently |
| Flat in a list: rail row, stack-panel row | `feedback-fill` | `--color-hover` fill, accent text | shrinks |
| Bare control: Menu, Close, the bar's way back | `feedback-text` | accent text | shrinks |

- **Glyphs move on a desktop hover only.** `glyph-forward` slides 4px,
  `glyph-back` slides 4px the other way, `glyph-open` grows 15%. A control
  that navigates gets the arrow; one that opens in place gets expand.
- **A raised control grows a few pixels:** `--hover-scale` is 1.04, and
  `press-small` takes it to 1.12 for anything under 32px.
- **A card does not grow**, because growing from its centre pulls its arrow
  backwards. Its shadow deepens instead.
- **A nested control's hover is a fill, never a size.**
- **The press:** `--press-scale` 0.96, in over `--dur-press` (60ms), out over
  `--dur`.
  - `press-large` (cards, full-width rows) gives 0.985 at the usual pace, and
    turns off long-press preview and drag on touch.
  - `press-none` turns off the desktop click on pictures, whose dialog grows
    in instead.
  - On a phone the press is the shrink and nothing else: no fill, colour or
    glyph.
- **Everything with a hit area of its own is `pressable`**: cards, buttons,
  the filter, rail rows, contact rows, pictures, the dialog's close control.
  Two exceptions. The stack tile cannot carry it, because its turn is on
  `transform`, so `tile-flip` presses on the standalone `scale` instead. A
  link inside running text has no box to give, so it is not pressable.
- **`pressable` owns the transition.** Never add a Tailwind `transition-*` to
  something pressable: `transition` is one property, and the two would race.
- **`--shadow-ring` is `:focus-visible` only**: 2px of `--color-focus`, never
  hover.
- **Targets are at least 24px.** Use `hit-area`, a transparent
  pseudo-element, rather than padding the control.
- **Every hand-written hover sits in `@media (hover: hover)`**, because a tap
  leaves `:hover` set.
- **Reduced motion turns off the press and the grow.**

### Texture

- **The ground is dappled radial gradients plus SVG grain** at `soft-light`,
  50%. The grain is blended into the ground, never laid over content.
- **The ground is one fixed layer, `body::before`.** Outside the layout
  viewport iOS paints only the root's background colour, and it clips fixed
  layers at the viewport's edge. So:
  - the pinned bar and the drawer are flat `bg-background`;
  - on a phone the bottom wash is off and the grain fades out over the bottom
    fifth;
  - never lock body scroll while the drawer is open;
  - a shut drawer is `display: none`, never parked off-screen. It slides the
    way a dialog fades: drawn off the edge, `data-shown` after a style flush,
    hidden once the slide back ends.
- **`body` paints no background.** `html` carries the ground colour for iOS.
- **Dims stop at the layout viewport:** the drawer's is the ground at 70%, the
  dialog's at 85%.

### Type

- Two families, never three: **Playfair Display** for display and **Karla**
  for body, through `next/font/google` as `--font-display` and `--font-body`,
  with real fallback stacks. No licensed faces.
- **Type is thinned, not weighted**, with `-webkit-font-smoothing:
  antialiased` on `body`.
- **Small steps carry their own weight:** `--text-micro` 600, `--text-meta`
  500. Add weight to the token, not the call site.
- **`--text-lede`** has line-height 1.5 and drops to 1rem on a phone.
- Playfair wants near-neutral tracking (`-0.008em`) and leading 1.1. Type has
  its own tokens (`--display-scale`, `--display-lh`), so a face swap touches
  no `font-size`.

### Shape, spacing, motion

- Spacing on a 4px scale from tokens. Radii from tokens, uniform corners.
- Motion is 180ms (`--dur`), on `transform` and `opacity`, and respects
  `prefers-reduced-motion`.
- **The one exception is the stack panel's height**, animated with the Web
  Animations API, not a CSS transition (which cannot reach `auto`) or a
  0fr→1fr grid (which stutters on a phone).
  - The box goes from no height to its measured height, with its half-gap
    margin. The card fades and scales from 96% off its top edge, on
    `ease-in-out`.
  - A closing panel stays mounted, inert, until its animation ends.
  - Opening a tile scrolls it to the top when the panel would not fit.
- Responsive by default. The body never scrolls horizontally.

### Accessibility

- **Semantic elements over styled `div`s.** Every interactive element is
  reachable and has a visible focus style from `--shadow-ring`.
  `focus-visible:outline-none` with nothing in its place is a bug.
- **Every text pair meets 4.5:1** on `--color-surface`, `--color-background`
  and `--color-surface-alt`, plus background on accent and accent on hover.
  `--color-ink-muted` on a chip (5.50:1) is the tightest pair. Check only pairs
  the markup renders, and measure them.
- **Targets are 24px square at minimum.**

---

## Primitives

`src/components/primitives/` holds the six primitives: `CustomButton`,
`CustomCard`, `CustomMark`, `CustomMedia`, `CustomModal`, `CustomSection`.
Everything named `Custom*` lives there and nothing else does. A primitive
imports only other primitives.

- **A primitive takes data and owns every treatment.** It holds no copy, never
  reads `@/content` for *what to show* (a generated asset registry like
  `brandIcons` is fine), reads tokens only, is accessible by construction, and
  is a server component unless interaction is its job (`CustomMedia`,
  `CustomModal`).
- **Callers never restyle a primitive.** A missing look becomes a variant prop.
- **Never hand-roll what a primitive owns.** Every action is `CustomButton`,
  every raised surface `CustomCard`, every picture that opens `CustomMedia`,
  every titled block `CustomSection`. A section's optional `subtitle` is one
  line under a title that can only name the thing (`Roles / Where I've
  worked`); a sub-page passes none, since its headings are whole sentences.

### CustomButton

- `href` or `onPress`, never both, typed as a union. `href` is the default,
  because a real `<a>` keeps middle-click and crawlability and needs no client
  component. `onPress` is for controls that change the page in place; a toggle
  passes `pressed`, which sets `aria-pressed`.
- `variant`: `primary` (accent fill), `secondary` (a `chip`), `surface` (card
  colour and gloss, for inside something chip-coloured). Selection is primary
  versus secondary. `count` is its own prop. Each ground keeps its resting
  shadow in its hover and focus shadows, since `box-shadow` is one property.
- `layout`: `pill` (as wide as its words, grows on hover) or `row` (full width,
  fills on hover). A row's glyph follows what it does: `href` gets the arrow,
  `onPress` gets expand.

### CustomCard

- **Callers pass strings** (`caption`, `heading`, `subtitle`, `topRight`,
  `action`); `children` is only the body. The card owns the head row, the
  spacing, the type scale and the action row.
- **The head is one wrapping row**, written as caption, heading, subtitle,
  note: the order a phone shows each line in, and the order a screen reader
  hears. On a desktop the caption or subtitle leads the first line with the
  note at its end, and the heading takes the next line. With neither, the
  heading leads and the note ends its line.
- **A caption says what kind of thing; a subtitle says what the heading is to
  me** (a job title under a company).
- **The lead:** an `icon` beside the heading, a `mark` (a `CustomMark`), or a
  caption, optionally with `captionIcon` (Lucide) or `captionMark` (a
  `CustomMark`) to its left. `mark` and `captionMark` are the only markup slots,
  and take nothing but a `CustomMark`.
- **Spacing:** 6px inside the head, 12px from head to body and between body
  blocks, tighter inside a block (stat chips are 8px apart).
- **`headingLevel` is required**, since the card cannot know its place in the
  outline. Loudness is `size="compact"`.
- **`href` by default, `onPress` only to open something in place**, and only
  from a client component. An `onPress` card is a `div` whose action is a real
  `<button>` with an `::after` covering the whole card; the focus ring is drawn
  on that layer, and the button's name is "action: heading". A `<button>`
  around the card would put a heading inside a button, which is invalid.
  `href`, `onPress` and `action` are typed together.
- **`actionIcon`** is `arrow` or `expand`, defaulting to `arrow` for `href` and
  `expand` for `onPress`.

### CustomMark

Every small mark: a brand from the sprite, a company's file (`src`, masked to
the current colour), a generic Lucide shape (`mail`, `pin`), or a monogram from
`monogramFor` and nowhere else. `look` is `bare`, `plate` or `accent`; `size`
is `xs` to `lg`. Never scale a mark with a transform: add a size.

### CustomModal

- **No toast or alert primitive.** Nothing on the site is transient; surface
  errors inline.
- **Every dialog is `CustomModal`:** a real `<dialog>` with `showModal()`,
  never a hand-rolled overlay. It shows a picture (`CustomMedia`) or a work
  item (the stack and Highlights); a picture opened inside a work dialog lands
  on top of it. The treatments are `modal` and `modal-panel` in `globals.css`.
- **It is driven by the item it shows**, with `null` meaning shut. Both guards
  matter: `showModal()` on an open dialog throws, and `close()` on a shut one
  fires a second `onClose`. It keeps drawing the last item while it fades out.
- **The fade is driven from the component.** It sets `data-shown` after a
  style flush. On close it removes it, waits for the animations, then calls
  `close()`; Escape goes through `cancel` the same way. Not `@starting-style`,
  because Safari has no `overlay`.

---

## Code rules

- **Readable, conventional, explicit.** Code is easy to read and maintain,
  idiomatic Next.js, understandable without explanation. Readability beats
  brevity; explicitness beats cleverness.
- **Inline single-use logic; extract on reuse.** No helper, util or file for
  logic with one caller. Extract when a real second caller appears, or to
  untangle a large function. Content still lives in `src/content/` regardless.
- **Control flow:** avoid deeply nested conditional rendering, and put guard
  clauses first.
- **Abstraction:** no premature abstractions, no giant generic components, no
  semantics hidden behind abstractions. Editability of content wins.
- **No hardcoded derived values.** Auto-size, make it optional or measure it.
  Tokens only.
- **Every busy or loading flag resets in a `finally`.**
- **Back-compat code gets a `@deprecated` JSDoc** naming why it exists and what
  removes it.
- **Clear names**, no private abbreviations.
- **Choosing between options**, prefer in order: semantic and SEO clarity,
  standard Next.js, easy for a new engineer, fast to maintain, less fragile.

---

## Copy and voice

Scope: everything a visitor reads (`src/content/`, page text, metadata, link
labels, alt text). Write the way Matej would talk about his own work to someone
he respects: specific, warm, a little understated. Never a brochure, never a
chatbot.

- **No em dashes**, and no en dash as a connector. En dashes in number ranges
  are fine.
- **First person and contractions:** "I built it", "it's".
- **Say what was actually done**, without inflating: two of the three apps are
  on both stores, so say that.
- **Numbers instead of adjectives**, and only numbers the build record or the
  repo backs. State a worst case as a worst case: the estimate cache leads
  with 11 queries per business, which was true on every screen; its 825 and
  307 are what a full 75-business screen would have cost, and its 2 is a
  repeat load. Never write them as the typical cost.
- **Short sentences, varied lengths.** A sentence that needs a third clause is
  two sentences.
- **No exclamation marks and no emoji.**
- **Every work body opens with what was done and what for** ("Built the …
  that …"), names things instead of "it" or "they", and its title stands on
  its own.
- **Mark what it was built with.** In a work item's body, bullets and outro,
  wrap a stack name, or the phrase built around one, in `**double asterisks**`:
  "Built the **Stripe webhook handling** that…". `MarkedText` sets it bold in
  the heading colour. Mark by hand, not by matching the stack list, since the
  phrase worth marking is often longer than the name. Mark the meaningful
  mention, not every repeat, and leave an item with no named tool unmarked.
  Titles and captions are not read for the marker.

**Banned phrasing.** If a sentence contains one, rewrite it.

- Filler verbs: delve, leverage, utilize, unlock, elevate, empower, showcase,
  boast, foster, harness
- Filler adjectives: robust, seamless, cutting-edge, innovative,
  comprehensive, passionate, meticulous, bespoke, world-class
- Setups: "In today's fast-paced world", "Whether you're a X or a Y", "At the
  end of the day", "Let's dive in"
- The antithesis tic: "It's not just X, it's Y"
- Abstraction nouns: journey, landscape, realm, tapestry, testament,
  game-changer
- Hedges: "arguably", "quite possibly", "some might say"
- LinkedIn openers: "I'm excited to share", "Thrilled to announce"

Don't:

> Tagly is a comprehensive, cutting-edge marketplace that seamlessly connects
> local businesses with passionate customers, unlocking authentic word-of-mouth
> at scale.

Do:

> Tagly pays people to post about the local businesses they already visit. I
> built the three apps, the API behind them, and the payment system that moves
> the money.

**The test:** read it aloud. If it sounds like the person who built the thing,
it passes. If it sounds like a landing page someone requested, rewrite it plain.

---

## Working notes

- **Check every Tagly claim against the private build record before it
  ships**, and follow its index's "Claims to avoid". Never commit the record
  or quote it in a committed file.
- **Prefer editing `src/content/`** over reaching into components.
- **`yarn content:check` runs before every build and fails it on:**
  - a stack entry no work uses;
  - a work item attached to nothing;
  - an empty area;
  - an unclosed `**` in work copy, or `**` in a title or caption.

  Add new invariants there rather than trusting a convention.
- **The stack is grouped by layer** (core, backend, services, infrastructure,
  frontend), a different axis from a work item's area. Don't merge them.
- **Run `yarn build` before claiming a change works.** Static-export problems
  only show at build time.
- **`<html>` carries `data-scroll-behavior="smooth"`.** Without it, Next 16
  lands a sub-page mid-scroll. Keep the attribute and the CSS together.
- **A token read from script comes back as the CSS pipeline printed it:**
  `260ms` arrives as `.26s`. Parse it with its unit.
- **Open:** the sub-pages set `title`, `description` and `canonical` but not
  `openGraph`, so a shared `/work/<area>` link previews with the landing's text.
