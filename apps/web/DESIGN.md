---
name: Privana — Proximidade
description: Creator-first familiarity with a royal purple identity.
colors:
  primary: "#6929D4"
  on-primary: "#FFFFFF"
  canvas: "#FBF9FE"
  surface: "#FFFFFF"
  ink: "#261A35"
  supporting: "#6E5C7C"
  rail: "#F2EBFA"
  selected: "#EDE3FC"
  divider: "#E7DFED"
  field: "#9D8CAA"
  dark-primary: "#C3A1FF"
  dark-on-primary: "#271139"
  dark-canvas: "#17111F"
  dark-surface: "#231A2E"
  dark-ink: "#FBF7FF"
  dark-supporting: "#C9B7D9"
  dark-rail: "#21142E"
  dark-selected: "#39234F"
  dark-divider: "#493855"
  dark-field: "#8A729C"
typography:
  headline:
    fontFamily: '"Bricolage Grotesque", "Hanken Grotesk", system-ui, "Segoe UI", Arial, sans-serif'
    fontSize: "30px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Hanken Grotesk", system-ui, "Segoe UI", Arial, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  supporting:
    fontFamily: '"Hanken Grotesk", system-ui, "Segoe UI", Arial, sans-serif'
    fontSize: "14px"
    fontWeight: 400
rounded:
  control: "12px"
  content: "16px"
  table: "14px"
spacing:
  content: "24px"
  columns: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.content}"
---

# Design System: Privana

## Overview

**Creative North Star: "Proximidade"**

The owner selected Proximidade on November 7, 2026 after comparing Galeria, Proximidade and Ritmo. This records the rendered, read-only direction studies in [the review packet](../../docs/planning/m015-brand/direction-review.md). It is the approved target for later M01.5 work; the current application still uses its incumbent tokens and fonts. PR acceptance and logo approval are separate review gates.

Creators' work carries the visual interest. The surrounding interface is welcoming, legible and familiar: tinted navigation, clear selected states, generous media and economical operational rows. Public entry is photographic; Studio and owner views prioritize completing tasks. The platform is Brazil-first; its language, names and currency examples follow pt-BR conventions.

**Key Characteristics:**

- Royal purple and violet tonal layers.
- Humanist UI with expressive major headings.
- Mobile creator workflows and readable owner data.

## Colors

The frontmatter owns the sampled light/dark values. Primary marks an action or selection; the pale violet rail and canvas establish identity without competing with content. Supporting text stays distinct from disabled controls. White text belongs on light-theme primary; dark-theme primary uses dark text. Do not substitute the light primary onto dark surfaces indiscriminately.

Status is communicated with text and context as well as color. Publication approval, identity/age verification and payment state remain separate. This study does not establish the complete semantic/error palette; KAR-146–150 must validate contrast for every implemented state and CMS accent override.

## Typography

Hanken Grotesk is the UI/data family (400–700). Bricolage Grotesque is for the wordmark and major headings (normally 600–700), with optical sizing enabled. Headlines are 30px/1.2 on desktop, 27px on the mobile Studio; section titles are 22px, or 20px in compact/mobile content. Body is 16px/1.5, with longer post paragraphs using 1.65 line height. Supporting copy and table cells are 14px, except the first table column at 16px. Public headlines use 48px, stepping down to 42px and 37px at narrower widths. Numbers should align using tabular numerals where supported.

The selected fonts, licenses, loading/fallback evidence and payload method are in [the font study](../../docs/planning/m015-brand/font-study.md). The generic fallback is a deliberate readable alternative, not a guarantee against layout shift. Production should use the existing self-hosted font pipeline in its authorized token story and verify generated fallback metrics.

## Layout

Desktop uses a 232px navigation rail, a primary work area and, when useful, a 278px discovery column separated by 32px. At 1150px the secondary column collapses; at 700px the rail yields to bottom navigation. The mobile feed runs edge to edge; Studio retains comfortable page gutters. These are sampled concept breakpoints, to be reconciled with the current application in the shell/component stories.

Keep one search for the current task. Place publication near the Studio heading; follow with counts and content rows. Owner data uses aligned table columns with contained horizontal scrolling rather than shrinking text. Reflow, safe areas, long names, keyboard use and text enlargement remain implementation acceptance checks.

**The Creator Content Rule.** Keep content prominent and surrounding controls predictable.

## Elevation & Depth

Tonal layers and quiet one-pixel dividers establish hierarchy. Content and tables are mostly flat. Reserve shadow for actual overlays and elevation; this study does not prescribe an overlay shadow token.

## Shapes

Use 12px controls, 16px content containers and 14px table containers. Avatars and icon actions are circular. Avoid rounding every nested row into another card. The mobile feed removes outer card corners; its content remains recognizable through spacing and action placement.

## Components

Primary actions have a minimum 44px height and a clear verb. The study's disabled actions are read-only examples, not a proposed disabled opacity standard. Secondary buttons use a field-strength border; tabs pair selected color with an underline. Focus is visibly offset from the control. Preserve native field, link, button and table semantics.

The sidecar's five primitives illustrate this geometry in isolation. Added interactive states, the labeled search and the enlarged status label are handoff examples, not exact replicas of disabled prototype controls or evidence of shipped behavior. Its synthesized tonal ramps are panel aids, not additional production palette tokens.

The signature response is an immediate violet selected-state change without shifting surrounding content. Later implementation may use brief color/opacity transitions and must respect reduced motion. This static study establishes appearance, not animation, optimistic mutation or keyboard-flow acceptance. Keep accurate pending, failure and rollback feedback when adopting the system.

## Do's and Don'ts

- Do preserve familiar creator-platform navigation, one clear primary task and the separation of fan, Studio and owner workspaces.
- Do keep real creator media dominant and label fictional/sample data honestly; never turn seed totals into commercial proof.
- Do keep simulated payments clearly identified and server access state authoritative.
- Don't copy competitor marks, manufacture trust badges or imply that publishing approval verifies identity/age.
- Don't adopt the prototype's tiny demo badges or fixed preview toolbar as production design tokens. Their role is review context; required status/action labels need the later accessibility checks.
