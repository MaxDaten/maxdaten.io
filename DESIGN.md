---
name: maxdaten.io
description:
    Dark, warm, precision-engineered personal site of a freelance platform & product engineer
colors:
    forge-orange: '#ff8000'
    forge-orange-hover: '#e67300'
    forge-orange-text: '#ff9933'
    forge-ember: '#7e4611'
    spark-yellow: '#ffd400'
    midnight-console: '#1c1e26'
    console-raised: '#32343e'
    console-deep: '#141519'
    code-slate: '#2b3131'
    paper-white: '#fffcfc'
    paper-white-muted: 'rgba(255, 252, 252, 0.7)'
    ice-white: '#d9f9fd'
    lead-grey: '#d1d5db'
    readout-grey: '#9ca3af'
    fine-print-grey: '#6b7280'
    console-well: 'rgba(0, 0, 0, 0.3)'
    hairline: 'rgba(255, 255, 255, 0.05)'
    forge-border: 'rgba(255, 128, 0, 0.3)'
    ambient-violet: '#6b21a8'
    ambient-blue: '#1e3a8a'
    status-success: '#00c48f'
    status-warning: '#ffca39'
    status-error: '#ff8082'
    status-info: '#6ca9f7'
typography:
    display:
        fontFamily: "'Space Grotesk Variable', Arial, Helvetica, sans-serif"
        fontSize: '49px'
        fontWeight: 700
        lineHeight: 1.1
    headline:
        fontFamily: "'Space Grotesk Variable', Arial, Helvetica, sans-serif"
        fontSize: '2.5rem'
        fontWeight: 700
        lineHeight: 1.1
    title:
        fontFamily: "'Space Grotesk Variable', Arial, Helvetica, sans-serif"
        fontSize: '1.5rem'
        fontWeight: 600
        lineHeight: 1.25
    body:
        fontFamily: "'Inter Variable', Inter, sans-serif"
        fontSize: '18px'
        fontWeight: 400
        lineHeight: 1.65
    label:
        fontFamily: "'JetBrains Mono', monospace"
        fontSize: '14px'
        fontWeight: 400
        lineHeight: 1.5
rounded:
    tag: '4px'
    callout: '8px'
    input: '8px'
    card: '16px'
    button: '24px'
    full: '9999px'
spacing:
    hairline: '4px'
    inline: '8px'
    tight: '12px'
    stack: '16px'
    block: '24px'
    group: '32px'
    section: '48px'
    major: '64px'
    page: '80px'
components:
    button-primary:
        backgroundColor: '{colors.forge-orange}'
        textColor: '{colors.midnight-console}'
        rounded: '{rounded.button}'
        padding: '12px 16px'
    button-understated:
        backgroundColor: 'rgba(255, 128, 0, 0.1)'
        textColor: '{colors.forge-orange}'
        rounded: '{rounded.button}'
        padding: '12px 16px'
    button-ghost-secondary:
        backgroundColor: 'transparent'
        textColor: '{colors.paper-white}'
        rounded: '{rounded.button}'
        padding: '12px 16px'
    tag-primary:
        backgroundColor: 'rgba(255, 128, 0, 0.1)'
        textColor: '{colors.forge-orange-text}'
        typography: '{typography.label}'
        rounded: '{rounded.tag}'
        padding: '4px 12px'
    tag-secondary:
        backgroundColor: 'rgba(255, 252, 252, 0.08)'
        textColor: '{colors.paper-white}'
        typography: '{typography.label}'
        rounded: '{rounded.tag}'
        padding: '4px 12px'
    badge:
        backgroundColor: '{colors.console-well}'
        textColor: '{colors.forge-orange}'
        typography: '{typography.label}'
        rounded: '{rounded.full}'
        padding: '8px 16px'
    card:
        backgroundColor: '{colors.console-raised}'
        textColor: '{colors.paper-white}'
        rounded: '{rounded.card}'
        padding: '24px'
    nav-link:
        textColor: '{colors.paper-white}'
        padding: '8px 0'
    nav-link-active:
        textColor: '{colors.forge-orange}'
        padding: '8px 0'
    callout-info:
        backgroundColor: 'rgba(108, 169, 247, 0.08)'
        textColor: '{colors.paper-white}'
        rounded: '{rounded.callout}'
        padding: '16px'
---

# Design System: maxdaten.io

## Overview

**Creative North Star: "The Rare Holo Card"**

The engineer is the collectible. Everything sits on dark matte card stock, Midnight Console, with
one warm accent, Forge Orange, struck sparingly like the printed border of a trading card. The shine
is rare and earned: foil, glare and glow appear only when light hits (on hover, on tilt, on scroll)
and settle back to a faint trace at rest. The signature object is literal: the profile is a 5:7
trading card with stat rows, an ability box, an iridescent foil and a λ texture that nods to
functional programming.

The system is precision-engineered minimalism, dark and warm, playful only in the details. Layout is
calm and generous, built on an 8px grid; type is a technical pairing of a geometric display face, a
neutral sans for reading and a monospace for every piece of metadata. Density is low: one idea per
section, short copy, wide gutters. Play lives in small, deliberate moments (the holo card, sparkles,
the drifting ambient glow behind the page), never in the structure.

**Key Characteristics:**

- Dark only: one theme, a Midnight Console base with tonal raises, no light mode.
- One accent: Forge Orange carries every interactive and emphasis signal.
- Light as interaction: glow, halo and foil respond to the visitor, then rest.
- Monospace metadata: dates, tags, badges, stats and tech lists read like instrument readouts.
- One collectible: the holo profile card is the system's single showpiece.

## Colors

A near-black, faintly blue-violet console surface lit by a single forge-hot orange; status hues
exist only inside callouts.

### Primary

- **Forge Orange** (`forge-orange`): the only accent. Primary buttons, the active nav link and its
  2px underline, list markers, link underlines, card hover outlines, the hero badge and headline
  accent, and the 30% selection tint. Hover deepens to **Forge Orange Hover**
  (`forge-orange-hover`).
- **Forge Orange Text** (`forge-orange-text`): the lighter orange for small accent text on
  orange-tinted surfaces (tags, service metadata), where Forge Orange drops below 4.5:1. The same
  hue opens the holo foil's spectrum.
- **Forge Ember** (`forge-ember`): the burnt shade behind the header and footer bars, a 60° gradient
  wash from 30% to 10% with a 30% hairline edge.

### Tertiary

- **Spark Yellow** (`spark-yellow`): sparkle glints only. Never text, never surfaces.
- **Status** (`status-success`, `status-warning`, `status-error`, `status-info`): callouts only, as
  a 3px left rule over a light tint of the same hue.
- **Ambient Violet** (`ambient-violet`) and **Ambient Blue** (`ambient-blue`): the two cool blobs
  drifting behind the page beside an orange one, always heavily blurred. Never text, never surfaces,
  never edges.

### Neutral

- **Midnight Console** (`midnight-console`): the page. Every surface starts here.
- **Console Raised** (`console-raised`): cards and service tiles, one tonal step up.
- **Console Deep** (`console-deep`): the darkest well, below the base.
- **Code Slate** (`code-slate`): code backgrounds, a faintly green-grey slate.
- **Paper White** (`paper-white`): primary text, a barely warm white. **Paper White Muted**
  (`paper-white-muted`) for secondary copy; **Ice White** (`ice-white`) for subtle text.
- **Lead Grey** (`lead-grey`): lead paragraphs such as the hero subheadline. **Readout Grey**
  (`readout-grey`): monospace metadata such as the tech ticker and card stat labels. **Fine Print
  Grey** (`fine-print-grey`): the trading card's footer line.
- **Console Well** (`console-well`): a 30% black well sunk into a surface, behind the hero badge and
  the card ability box.
- **Hairline** (`hairline`): 5% white dividers and top highlights inside cards.
- **Forge Border** (`forge-border`): 30% orange hairlines, the default border.

### Named Rules

**The One Forge Rule.** Forge Orange is the only accent. No second brand hue competes with it;
status colors live inside callouts and nowhere else, and the ambient hues exist only as blurred
light behind the page.

**The Small-Text Rule.** Orange text below 18px on an orange-tinted surface uses Forge Orange Text,
not Forge Orange.

## Typography

**Display Font:** Space Grotesk Variable (with Arial, Helvetica, sans-serif) **Body Font:** Inter
Variable (with sans-serif) **Label/Mono Font:** JetBrains Mono, 400 only (with monospace)

**Character:** a geometric, slightly quirky grotesk for names and headlines against a neutral,
highly legible sans for reading; JetBrains Mono turns every date, tag and stat into a readout. The
root size is 18px, so 1rem = 18px.

### Hierarchy

- **Display** (700, 49px, 1.1, balanced wrap): the hero headline only; 39px below 768px. Its accent
  half carries a Forge Orange to Forge Orange Text gradient fill.
- **Headline** (700, 2.5rem, 1.1): page H1; 2rem below 768px.
- **Title** (600, 1.8rem H2 / 1.5rem H3, 1.1–1.25): section and card titles.
- **Body** (400, 18px, 1.65): all reading text. Prose columns cap at 680px.
- **Label** (400, 12–14px mono): tags, badges, dates (uppercase, 0.05em tracking), service metadata,
  the hero tech ticker and trading-card stats (10px uppercase labels).

### Named Rules

**The Readout Rule.** Metadata is monospace. Dates, tags, badges, years, stats and tech names set in
JetBrains Mono; narrative copy never does.

## Layout

A centered container, 1080px max above 1200px, with side padding that grows with the viewport: 16px
on phones (0 at 320px), 24px from 768px, 32px from 901px. Spacing follows an 8px grid with half
steps: 8px inline gaps, 16px stacks, 24px blocks and card padding, 32px groups, 48px sections and
80px page-level breathing room (the hero pads 80px, 48px below 900px).

The home hero is a two-column grid (text beside the holo card, 48px gap) that collapses to one
column below 900px, with the card first and the text centered. Service tiles run three across and
stack below 900px. Long-form posts use a 680px prose column; code blocks and images break out wider.
Breakpoints: 767px (phone), 900px (tablet portrait), 1200px (tablet landscape).

## Elevation & Depth

Flat tonal layering, not shadows. Depth comes from stepping between Midnight Console and Console
Raised, from translucent black wells (30% black behind badges and the ability box), and from light:
glows and halos that appear on interaction. Behind everything, three heavily blurred blobs (orange,
purple, blue; 80px blur, 25–40% opacity) drift slowly as ambient light, hidden under reduced motion.

### Shadow Vocabulary

- **Halo** (`box-shadow: 0 0 1px 7px rgba(255, 128, 0, 0.3)`): solid and understated button hover; a
  ring of light, not a lift.
- **Outline glow** (`box-shadow: 0 0 0 1px rgba(255, 128, 0, 0.7)`): interactive card hover.
- **Text glow** (`filter: drop-shadow(0 0 3px #ff8000)`): navigation and footer link hover.

### Named Rules

**The Light-Not-Lift Rule.** Nothing casts a drop shadow. Surfaces answer interaction with light
(halo, outline, glow, foil), never by floating upward.

## Shapes

Softly rounded rectangles with one deliberately round exception. Tags are crisp (4px), callouts and
inputs gentle (8px), cards and the holo card generous (16px), and buttons nearly pill-shaped (24px).
Fully round forms are reserved for the hero badge, the tech-ticker dots and the ambient blobs.
Borders are hairlines: 0.5px on tags, 1px elsewhere, mostly translucent orange or white.

## Components

### Buttons

Confident and luminous: bold labels on near-pill shapes that answer hover with a ring of light.

- **Shape:** near-pill (24px).
- **Primary (solid):** Forge Orange fill, Midnight Console 700 label, 12px × 16px padding at medium;
  the booking call to action.
- **Hover / Focus:** solid and understated gain the Halo; transitions run 0.2s ease-in-out.
- **Understated:** a 10% orange tint with an orange label.
- **Ghost:** transparent with a 30% hairline in the button color (white for secondary actions such
  as the GitHub link). Hover raises the border to 50% and adds an 8% fill.
- **Clear:** no fill; hover adds a 10% tint.
- **Sizes:** small (12px text), medium (16px), large (20px, 16px × 32px padding).

### Chips

- **Style:** monospace 14px at 500, 4px corners, 0.5px border. Primary: 10% orange tint, Forge
  Orange Text, 30% orange border. Secondary: 8% white tint, white text, 30% white border.
- **State:** static labels (post tags); no selected state.

### Cards / Containers

- **Corner Style:** 16px.
- **Background:** Console Raised.
- **Shadow Strategy:** flat; interactive cards gain the Outline glow on hover.
- **Border:** none at rest.
- **Internal Padding:** 24px; cover images sit on top at 16:9.

### Navigation

Header links in Paper White, 32px apart (16px on phones, with 44px tap targets). Hover turns a link
Forge Orange with a soft text glow; the active link is Forge Orange with a 2px orange underline 4px
below. Header and footer share the Forge Ember gradient wash and a 30% ember hairline.

### Callouts

A 3px status-colored left rule over an 8% tint of the same hue, 8px corners, 16px padding, a 20px
icon in the status color and 14px body copy.

### Holo Profile Card

The collectible. A 5:7 trading card on a dark slate base with an 11px inset printed border in 10%
orange. Layers, bottom to top: content (monospace stats, the name in uppercase Space Grotesk, a 4:3
avatar, an ability box with an orange left rule); an iridescent foil (orange, violet and cyan
spectrum over a 17px λ pattern, color-dodge, 10% at rest and 25% on hover); a cursor-following white
glare; an inner orange ambient glow; and a sheen border whose angle follows the cursor. On desktop
it tilts in 3D toward the pointer; on mobile it rests tilted and follows scroll; container queries
scale it with its column.

### Hero Badge

A fully round pill in monospace 14px: Forge Orange text on a 30% black well with a 30% orange
hairline, announcing availability above the headline.

## Do's and Don'ts

### Do:

- **Do** keep every surface on Midnight Console or one tonal step from it (Console Raised, Console
  Deep, 30% black wells).
- **Do** express interaction with light: the Halo on buttons, the Outline glow on cards, the text
  glow on links.
- **Do** set metadata in JetBrains Mono, narrative copy in Inter, and names and headlines in Space
  Grotesk.
- **Do** use Forge Orange Text for small orange text on orange-tinted surfaces.
- **Do** keep reading text at 1.65 line height and prose columns at 680px.
- **Do** reference tokens (`--color-*`, `--radius-*`, `--space-*`) instead of literal values; OG
  cards are the only exception.
- **Do** hide or still ambient motion under `prefers-reduced-motion`.

### Don't:

- **Don't** introduce a second accent color; status hues stay inside callouts.
- **Don't** add drop shadows that lift surfaces; depth is tonal, shine is light.
- **Don't** run foil, glare or glow at full strength at rest; at most a faint trace (the foil's
  10%), with the shine earned on interaction.
- **Don't** add a second collectible showpiece; the holo profile card is the one.
- **Don't** set narrative copy in monospace or metadata in the body face.
