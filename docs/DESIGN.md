# Design language — “Reveal & Panel”

The identity comes from the cabinet itself, not from web conventions.

| Cabinet idea | Where it appears |
|---|---|
| **The reveal** — the 3 mm shadow gap between doors | `--reveal: 3px`. Under the sticky header on scroll; between hero photo and copy; between the four audience “doors”; top of the closing band; the drawer-to-door crop in every finish sample. The logo's own striped disc echoes it. |
| **The recessed Shaker panel** | `--recess` / `--recess-deep` inset shadows. Audience doors, form inputs (an inset well that deepens on focus), hover state of ghost buttons, gallery stage, finish tray. |
| **The finish sample tray** | Collection browsing: a felt-lined, recessed tray of real finish chips; the selected chip lifts out with a charcoal edge. |
| **Sample identification cards** | Finish cards with a punched ring-hole, mono code (`SH·WH`), serif name, line · finish type. |
| **The specification sheet** | Plex Mono labels, numbered rows, registration marks (`.marks`) at the corners, a printed source line at the foot. |
| **Soft-close hardware** | One easing curve, `--ease-soft: cubic-bezier(.16,1,.3,1)` — fast start, long settle, no bounce. Drawer opens in ~560 ms and closes faster (360 ms) with an ease-in, like a damped drawer. |
| **Hardware** | Bar “pulls” on the audience doors; the quote drawer has a pull on its leading edge (a grab bar on mobile). |

## Palette

Warm plaster `#f4efe7`, linen `#e5dccd`, charcoal `#1d1b18`, walnut `#6a4a30` (text-safe), oak `#b58f62` (decorative), Highland blue `#2a3e92` (logo, focus rings, catalog spines — used sparingly). All body text pairs meet WCAG AA.

## Type (revised in milestone 2)

- **Mona Sans** (variable weight + width, SIL OFL 1.1, self-hosted from `@fontsource-variable/mona-sans`) for everything.
  - Headlines: weight 520–540, width 106 %, tracking −0.026 to −0.034 em, line-height ≈ 1.0. No italics; a second clause sits on its own line in a quieter tone (`h1 em`).
  - Text: weight 400, normal width, 1.62 line-height, 17 px.
  - Labels: small uppercase at 600 weight with modest tracking — set in the text face, not a typewriter face.
- **IBM Plex Mono** (OFL) only where technical styling helps: product identifiers (`SH·WH`), construction callout numbers, spec-row identifiers, the gallery counter. Use the `.code` class.

The previous Newsreader + Instrument Sans pairing and its italic accent phrases were removed site-wide.

## The hero — “Open something extraordinary”

A full-bleed photograph (IMG_0082) behind two Shaker doors that swing outward on their outer hinges.

- **Construction** (CSS only, no 3D library): each door is a face of vertical-grain stiles, horizontal-grain rails set between them with a hairline joint, and a recessed panel lit by inset shadows (frame shadow from above and the hinge side, catch-light on the lower and inner edges). A ¾″ edge (`rotateY(90deg)`) appears as the door turns. Slim matte-black bar pulls on the meeting stiles; a 3 px centre reveal that warms with light at the moment of opening. Phones get tall two-panel doors with a mid rail.
- **Material**: Shaker Luxe grain sampled from Highland's own product rendering, lighting flattened, rotated for rails.
- **Choreography** (≈1.85 s): closed close-up → ≈0.4 s pause (or until the photo decodes, max 0.7 s) → seam warms → doors swing to 100° with perspective (1.3 s, `cubic-bezier(.52,.01,.16,1)`, no overshoot) while they darken as they turn from the light → kitchen settles from 1.075× and brightens → headline at 1.0 s, CTAs at 1.12 s.
- **Rules**: decorative layer only (`aria-hidden`, `pointer-events: none`, nothing focusable); header never covered; plays once per browser session (`sessionStorage`); skipped for reduced motion; “Skip intro” control; focusing anything in the hero ends it; a 3 s CSS failsafe removes the doors if the controller never runs; without JavaScript a `<noscript>` stylesheet plays the same animation once. State lives on `<html data-intro>` and is driven by two tiny inline scripts, so it never waits for React hydration.
- **Legibility**: a warm, localised pool of shade at lower left (desktop) or a charcoal settle below the cabinetry (phones) — the cabinetry itself is not overlaid.

## Motion rules

- Navigation is immediate; scrolling is native; no intro animation, no scroll-jacking, no parallax.
- Only state changes animate: drawer, collections panel, finish selection crossfade, gallery crossfade, construction callout rings, button press depth.
- `prefers-reduced-motion: reduce` reduces all transitions/animations to ~0 ms and closes the drawer instantly.
- No animation library; everything is CSS (`@starting-style` for entry transitions; CSS 3D transforms for the hero doors).

## Honesty rules built into components

- `<Media>` always prints the asset kind in the caption: *Installed project*, *Catalog rendering*, *Product rendering*, *Finish detail*.
- Finish chips are crops of Highland's own renders — never recoloured.
- The construction drawing is Highland's catalog illustration, captioned with page and edition.
- Forms never claim “sent” unless the configured destination returned 2xx.
