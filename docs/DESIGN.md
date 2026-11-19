# Design language (milestone 3) — “luxury interiors magazine meets architectural showroom”

Bright, confident, tactile. Photography is the centrepiece; type and ornament step back.

- **Ground**: warm white `#fbf9f5`, quiet surface `#f4f0e9`, hairline rules `#e6dfd4`. No heavy dark bands, boxed panels or registration marks; sections are separated by space and single hairlines.
- **Ink**: restrained charcoal `#24211d`; muted text `#6a6258` (5.8:1). Accents: oak, walnut and aged brass `#7a5f36`, used for small details only. Highland blue appears in the logo and focus rings.
- **Type pairing** (both OFL, self-hosted): **Libre Caslon Display** for headlines and product names, upright, moderate sizes (h1 ≈ 49 px, display ≈ 56 px max) — **Mona Sans** for text, navigation, labels and forms. IBM Plex Mono only for product codes (`SH·WH`, `B21`).
- **Composition**: full-width photographs alternate with spacious editorial spreads (asymmetric two-column, generous gutters, ≤ 34 rem measure). Captions sit under images and always state what the image is (installed project / catalog rendering / product rendering / Highland rendering).
- **Motion**: one signature moment (the opening). Elsewhere only slow image zoom on hover (1.2 s, 2.5 %), underline draws on links, crossfades in the finish selector and gallery.

## Homepage sequence

1. Hero — headline + actions on warm white; the cabinet-door opening below.
2. Three lines — Shaker / Nano / Euro, portrait photographs.
3. Full-bleed — installed White Shaker kitchen.
4. Finish selector — choosing a sample changes the cabinet itself (product rendering in that finish), a room photograph, description and links.
5. Construction — four close-ups (oak grain and Shaker profile, Shaker reveal, black bar pulls, pull-out runner) beside four catalog specifications.
6. Full-bleed — Shaker Onyx Black rendering.
7. For the trade — portrait photograph + account facts + actions.
8. Dealers / homeowners — two photographic paths.
9. Catalogs, Phoenix location, closing call to action.

No photograph is repeated on the page.

## The opening — a showroom moment

A pair of Shaker wall-cabinet doors (proportioned ≈ 0.45 wide : 1 tall each) hangs on a softly lit plaster wall inside the hero frame, with a contact shadow beneath. They swing open on their outer hinges (0.8 s), revealing the face frame, the box depth and — inside — the kitchen; the opening then widens (clip-path) into the full-bleed photograph as it settles from 1.12× (finished ≈ 1.45 s). Headline and actions sit above the frame and are usable from the first frame. Plays once per session; skipped with reduced motion; scrolling or “Skip intro” ends it; 3 s failsafe; `<noscript>` CSS fallback. On phones the band keeps headline + one action + dealer link so the whole cabinet sits in the first screen.

Door material: Shaker Luxe grain sampled from Highland's product rendering (lighting flattened; rotated for rails).

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
