# Design language (milestone 4) — light, airy, photographic

Bright and calm. Cabinetry photography leads; type and ornament step back. The finish sampler (the sample tray) is the one tactile, signature component.

- **Ground**: near-white `#fdfcfa`, soft off-white surface `#f7f5f1`, hairline rules `#ebe6de`. No dark bands, few boxed panels; sections are separated by space. The only warm, recessed surface is the sample tray (`#f1ece4` with a light inset shadow).
- **Ink**: charcoal `#24211d`; muted text `#6a6258` (5.8:1). Aged brass `#7a5f36` and walnut for small details only. Highland blue appears in the logo and focus rings.
- **Type**: one architectural sans throughout — **Mona Sans** (OFL, self-hosted variable font), headings at weight ≈ 520, slightly widened, tight tracking; moderate sizes (display ≤ 51 px, h2 ≤ 34 px). No serif display face, no italic statements, no spaced-out uppercase labels, no typewriter face. Product codes (`SH·WH`) use the same sans in tabular figures.
- **Composition**: large photographs with plain captions that always state what the image is (installed project / catalog rendering / product rendering).
- **Motion**: no intro sequence. The hero text rises 14 px and the photograph settles from 1.06×. Scroll-driven reveals (CSS `animation-timeline: view()`, no JavaScript): project photos un-inset, headings lift, map routes draw. All motion is disabled with reduced motion and simply absent in browsers without scroll timelines.

## Homepage sequence

1. Hero — full-bleed, naturally bright installed White Shaker kitchen (IMG_4838); headline and one line of copy set into the lower third over a soft shade (white text measured ≥ 4:1 against the photo at every breakpoint); on phones the actions move onto the page below the photo. Beneath it, a ribbon of four verified facts: 3 lines, 13 finishes, 3 PM Arizona-time same-day cut-off (June 2025 catalogs), Phoenix showroom & warehouse.
2. Sampler (`components/home/FinishTray.tsx`, restored from commit `9ab6712`) — unchanged.
3. In real kitchens — four large installed-project photographs that open from a slight inset as they scroll in.
4. Craft — four catalog specifications beside three close-ups.
5. Dealers (`#dealers`) — the Highland warehouse photograph, sticky, beside one desk with two tabs: *Become a dealer* (dealer application) and *Find a dealer* (dealer referral). Contractors are pointed to the trade-account page.
6. Showroom (`#showroom`) — “One showroom. Projects across the country.” Address card with directions and phone, beside a custom map: public-domain US Census boundaries (`scripts/build-map.mjs`, us-atlas), a pulsing Phoenix pin, and routes that draw out to 23 cities named on the service-area pages. Captioned so the routes are not read as locations or delivery promises.
7. Standards & associations — KCMA and NKBA marks in white discs; preview-only until confirmed (see launch checklist #17).
8. Closing quote invitation.

No photograph is repeated on the page.

## Motion rules

- Navigation is immediate; scrolling is native; no intro animation, no scroll-jacking, no parallax.
- The cabinet-door opening of milestones 2–3 was removed at the client's request (milestone 4).
- Only state changes animate: drawer, collections panel, finish selection crossfade, gallery crossfade, construction callout rings, button press depth.
- `prefers-reduced-motion: reduce` reduces all transitions/animations to ~0 ms and closes the drawer instantly.
- No animation library; everything is CSS (`@starting-style` for entry transitions).

## Honesty rules built into components

- `<Media>` always prints the asset kind in the caption: *Installed project*, *Catalog rendering*, *Product rendering*, *Finish detail*.
- Finish chips are crops of Highland's own renders — never recoloured.
- The construction drawing is Highland's catalog illustration, captioned with page and edition.
- Forms never claim “sent” unless the configured destination returned 2xx.
