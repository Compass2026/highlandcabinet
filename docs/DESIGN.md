# Design language (milestone 4) — light, airy, photographic

Bright and calm. Cabinetry photography leads; type and ornament step back. The finish sampler (the sample tray) is the one tactile, signature component.

- **Ground**: near-white `#fdfcfa`, soft off-white surface `#f7f5f1`, hairline rules `#ebe6de`. No dark bands, few boxed panels; sections are separated by space. The only warm, recessed surface is the sample tray (`#f1ece4` with a light inset shadow).
- **Ink**: charcoal `#24211d`; muted text `#6a6258` (5.8:1). Aged brass `#7a5f36` and walnut for small details only. Highland blue appears in the logo and focus rings.
- **Type**: one architectural sans throughout — **Mona Sans** (OFL, self-hosted variable font), headings at weight ≈ 520, slightly widened, tight tracking; moderate sizes (display ≤ 51 px, h2 ≤ 34 px). No serif display face, no italic statements, no spaced-out uppercase labels, no typewriter face. Product codes (`SH·WH`) use the same sans in tabular figures.
- **Composition**: large photographs with plain captions that always state what the image is (installed project / catalog rendering / product rendering).
- **Motion**: no intro sequence. The hero text fades up 8 px and the photograph settles from 1.03× (both disabled with reduced motion). Elsewhere only state changes animate.

## Homepage sequence

1. Hero — concise headline, one line of copy, two actions; a naturally bright installed White Shaker kitchen (IMG_4838) full width below.
2. Sampler (`components/home/FinishTray.tsx`, restored from commit `9ab6712`) — Shaker / Nano / Euro rows of door-face samples on a tray; the selected sample updates the large room photograph and the product card (cabinet rendering, code, name, description, *View* link, *Quote this finish*). On the homepage White Shaker uses a different installed photo (IMG_0082) so the hero is not repeated.
3. In real kitchens — four large installed-project photographs.
4. Craft — four catalog specifications beside three close-ups.
5. Contractor and dealer paths, with a homeowner line to Find a dealer.
6. Closing quote invitation (with the sales phone number).

No photograph is repeated on the page. Catalogs and the Phoenix location live on /products/, the footer and the contact page.

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
