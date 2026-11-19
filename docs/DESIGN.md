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

## Type

- **Newsreader** (variable, optical size) — editorial headlines and finish names.
- **Instrument Sans** — body and UI.
- **IBM Plex Mono** — spec labels, codes, captions.

Self-hosted via `next/font/local` from Fontsource packages; no runtime font CDN.

## Motion rules

- Navigation is immediate; scrolling is native; no intro animation, no scroll-jacking, no parallax.
- Only state changes animate: drawer, collections panel, finish selection crossfade, gallery crossfade, construction callout rings, button press depth.
- `prefers-reduced-motion: reduce` reduces all transitions/animations to ~0 ms and closes the drawer instantly.
- No animation library; everything is CSS (`@starting-style` for entry transitions).

## Honesty rules built into components

- `<Media>` always prints the asset kind in the caption: *Installed project*, *Catalog rendering*, *Product rendering*, *Finish detail*.
- Finish chips are crops of Highland's own renders — never recoloured.
- The construction drawing is Highland's catalog illustration, captioned with page and edition.
- Forms never claim “sent” unless the configured destination returned 2xx.
