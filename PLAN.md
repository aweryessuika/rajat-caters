# Rajat Caterers — completion plan

## Direction (kept from v1, pushed further)
Warm ivory paper, ink navy, gold. Bracketed micro-labels `[ LIKE THIS ]` stay as the signature.
Added: deep navy bands (taken from the logo blue) for contrast, Cormorant Garamond display + Manrope body,
gold-deep (#80601A) for small text on paper so it passes contrast.

## Design read
- artifact: premium catering brand site (single page, Next.js 16 + Tailwind 4 + framer-motion)
- mode: preserve + extend (hero scrub sequence, palette, label style kept)
- dials: variance 7 · motion 7 · density 5 · asset-dependence 8 · brand-fidelity 8

## What was wrong in v1
1. Showcase images pointed at deleted `.png` frames -> blank boxes
2. Nav links, floating button, hero links and the form did nothing
3. Testimonials were invented quotes attributed to real names (removed)
4. Copy did not match the real story; hero said "BLR OPERATIONS / MAY 2026"
5. Gold text on gold buffet in hero; low-contrast gold small text on paper
6. Logo dark glow + multiply blend looked muddy; full-screen SVG noise + 80px blur = GPU cost
7. Tabs of menu only had TBA prices

## Sections (in order)
1. Hero — preloader, scroll-scrubbed 101 frames, 3 story captions synced to the footage
2. Marquee ribbon
3. Our Story — user's copy, sticky headline, parallax image
4. Milestones — count-up stats + the five milestones + who we've served
5. Services — accordion with image panel (weddings, corporate, government, abroad)
6. Celebration Menu — tabs, search, "+" to add dishes to the enquiry
7. Weekly Table — Breakfast/Lunch/Dinner by day (from the PDF)
8. Showcase — draggable gallery + lightbox
9. Our Promise — sustainability, packaging, customised menus
10. Enquire — working form -> WhatsApp message (includes chosen dishes) + call buttons
11. Footer

## Dynamic layer
Lenis smooth scroll (single engine), scroll-spy nav that hides on scroll-down, mobile menu,
word-by-word heading reveals, count-up stats, selection tray, floating call/WhatsApp dock,
reduced-motion respected (MotionConfig + Lenis off).

## Open facts to confirm with the owner
- WhatsApp number used: +91 98113 75848
- "(D.R.I Day)" in the milestone text was unclear and is left out
- Real testimonials and real event photos can replace/extend the gallery later

---

# Round 2 — more life, same restraint

Skills applied: find-animation-opportunities (the gate), improve-animations (audit rules), scroll-scrubbed-word-reveal,
marquee-loop, audit-ai-design-slop (self-audit), then better-accessibility + critique skills for the final pass.

## Self-audit: what to remove or fix (slop test)
1. Blurred royal-blue circles behind the navy sections = generic gradient blobs -> replaced by a cursor-following soft spotlight (depth that responds)
2. Our Promise = 4 identical icon-less cards (template repetition) -> stacking cards that pin and layer on scroll
3. Same "eyebrow + word-reveal + paragraph" header on every section is fine as a system, but Story/Promise get different treatments
4. Drop cap broke once the story text became scroll-scrubbed -> lead paragraph is larger instead

## Passed the gate (frequency + purpose)
| Where | Motion | Purpose |
|---|---|---|
| Story copy | words fade in as you read (scrubbed) | reading progress / explanation |
| Marquee | speed + direction follow scroll velocity | delight, one-time marketing page |
| Hero | image drifts a few px with the pointer; CTAs are magnetic | delight at the single most-seen moment |
| Milestones | route line draws Delhi -> Singapore -> Malaysia -> Thailand -> Egypt | explanation of reach |
| Weekly | "Now serving" meal highlighted by the clock | state indication |
| Gallery | cursor chip says Drag / View; cards clip-reveal | feedback + spatial |
| Promise | cards stack on scroll | explanation of sequence |
| Enquire | live "Your occasion" card updates as you fill, stamps when ready | state indication + rare delight |
| Tray | count bumps when a dish is added | feedback |
| Footer | oversized wordmark reveals | rare closing moment |

## Rejected (gate failed)
- Lightbox arrow keys: keyboard-initiated, stays instant
- Menu search results and tab switches: frequent, stay fast and plain
- Parallax on text blocks: reading content should not move for style
- Particles / confetti: decoration with no job
