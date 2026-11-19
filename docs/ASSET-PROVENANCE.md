# Asset provenance

Every image on the site is a local, optimised copy of an asset from the November 17, 2026 preservation archive. Originals were retrieved from their archived source URLs and **accepted only when their SHA-256 matched the archive inventory** (`asset-inventory.csv`). 1,340 of 1,356 archived images verified; the 15 that failed are AI-generated DALL·E blog images (non-ASCII filenames) and one blog thumbnail that has since changed — none are used.

Regenerate with `node scripts/build-media.mjs <dir-of-archived-assets>` (source list: `content/media-sources.json`).

## Excluded on purpose

- AI-generated images found in the archive (filenames containing DALL·E, Gemini_Generated_Image, ChatGPT-Image, and many 2026 blog illustrations) — never used to represent Highland products.
- Stock photography (shutterstock, unsplash filenames).
- KCMA / NKBA / partner logos — require confirmation (see launch checklist).
- The 2023 “Cabinet Features” cutaway photo — authentic, but its baked-in labels conflict with the June 2025 catalog.

## Brand & documents

| File | Source | Notes |
|---|---|---|
| `public/brand/highland-logo.svg` | Vector paths extracted from the cover of the Shaker/Nano catalog PDF (SHA-256 `9d589f46…0822661a`) | Colours as printed: #2A3E92, #231F20. Light variant recoloured for dark backgrounds only. |
| `public/brand/construction-shaker-nano.svg` | Vector illustration extracted from Shaker/Nano catalog p. 3 (Construction Features) | Labelled on site as an illustration reproduced from the catalog. |
| `public/catalogs/highland-shaker-nano-catalog.pdf` | `…/2026/05/341793_HCI-Shaker-Nano-Catalog-June-2025_Web_04.17.26_compressed-1.pdf` — SHA-256 `fd99ab45…989c0de7` | Byte-identical to archive |
| `public/catalogs/highland-euro-catalog.pdf` | `…/2025/07/341792_HCI-Euro-Catalog-June-2025_Final_07.08.25-2-1.pdf` — SHA-256 `9a2156b0…bbde8f21` | Byte-identical to archive |
| `public/catalogs/kitchen-remodeling-checklist.pdf` | `…/2026/01/Kitchen-Remodeling-Checklis.pdf` — SHA-256 `0f9f21bc…9fd032e2` | Not yet linked |

## Images

Kinds: **installed-project** = on-site photograph (EXIF camera data present) · **catalog-rendering** = Highland marketing rendering, also used in the catalogs · **product-rendering** = Highland 3D render of a single cabinet · **finish-detail** = crop of the matching product rendering at the drawer/door reveal (colour unaltered). · **material-texture** = wood grain sampled from a Highland product rendering, studio lighting flattened, used only for the decorative hero doors.

### Hero (second milestone)

- `hero-kitchen-wide` / `hero-kitchen-tall` — IMG_0082 (iPhone 11, July 2021) from Highland's White Shaker project gallery, chosen after comparing every large landscape image in the verified archive: it is a genuine site photograph with the cabinetry as the subject, warm under-cabinet light, and a central hood that lines up with the doors' centre reveal. `tall` is a 1160 × 1920 portrait crop centred on the hood for phones. Not colour-graded.
- `door-grain-v` / `door-grain-h` — Shaker Luxe grain from `854013_B21_Shaker-Luxe.png` (door panel region). `-h` is the same texture rotated 90° so rails carry horizontal grain, as on a real five-piece door. The hero doors are an artistic entrance, not a depiction of a specific SKU, hinge or door size.

| ID | Kind | Output | Source URL | Source SHA-256 |
|---|---|---|---|---|
| hero-kitchen-wide | installed-project | `/media/hero-kitchen-wide.jpg` 2400×1800 | /wp-content/uploads/2025/02/IMG_0082_jpg-scaled.jpg | `0c22fd4a30c0…` |
| hero-kitchen-tall | installed-project | `/media/hero-kitchen-tall.jpg` 1160×1920 | /wp-content/uploads/2025/02/IMG_0082_jpg-scaled.jpg | `0c22fd4a30c0…` |
| project-white-shaker-01 | installed-project | `/media/project-white-shaker-01.jpg` 2400×1600 | /wp-content/uploads/2025/03/IMG_4838-scaled.jpg | `6dd4e022ea7b…` |
| project-white-shaker-02 | installed-project | `/media/project-white-shaker-02.jpg` 2400×1600 | /wp-content/uploads/2025/02/IMG_4836-scaled.jpg | `85119b6b9068…` |
| project-white-shaker-03 | installed-project | `/media/project-white-shaker-03.jpg` 1707×2560 | /wp-content/uploads/2025/02/IMG_4916-1-scaled.jpg | `9c140af2e51b…` |
| project-white-shaker-04 | installed-project | `/media/project-white-shaker-04.jpg` 2400×1800 | /wp-content/uploads/2025/02/IMG_0082_jpg-scaled.jpg | `0c22fd4a30c0…` |
| project-white-shaker-05 | installed-project | `/media/project-white-shaker-05.jpg` 2400×1800 | /wp-content/uploads/2025/02/IMG_0087-scaled.jpg | `447f6409f7d1…` |
| project-white-shaker-06 | installed-project | `/media/project-white-shaker-06.jpg` 2400×1800 | /wp-content/uploads/2025/02/IMG_0092_jpg-scaled.jpg | `f9710b8ef805…` |
| project-white-shaker-07 | installed-project | `/media/project-white-shaker-07.jpg` 1920×2560 | /wp-content/uploads/2025/02/IMG_0096-scaled.jpg | `2df78ead22b5…` |
| scene-shaker-white | catalog-rendering | `/media/scene-shaker-white.jpg` 1920×1080 | /wp-content/uploads/2026/03/compressed_Shaker-White.webp | `9f9999f49e9a…` |
| scene-shaker-onyx-black | catalog-rendering | `/media/scene-shaker-onyx-black.jpg` 2400×1350 | /wp-content/uploads/2025/09/Shaker-Onyx-Black-scaled.jpg | `6b9b757ca588…` |
| scene-shaker-signature-blue | catalog-rendering | `/media/scene-shaker-signature-blue.jpg` 1920×1080 | /wp-content/uploads/2026/02/compressed_Shaker-Signature-Blue.webp | `e3d6f46551d1…` |
| scene-shaker-luxe | catalog-rendering | `/media/scene-shaker-luxe.jpg` 2400×1350 | /wp-content/uploads/2025/09/Shaker-Luxe-1-scaled.jpg | `22bdb91e3b0b…` |
| scene-nano-green | catalog-rendering | `/media/scene-nano-green.jpg` 2400×1350 | /wp-content/uploads/2025/09/Nano-Green-scaled.jpg | `727cfbb29f10…` |
| scene-nano-white | catalog-rendering | `/media/scene-nano-white.jpg` 2400×1350 | /wp-content/uploads/2025/09/Nano-White-scaled.jpg | `a99a8eff69b5…` |
| scene-euro-white-oak | catalog-rendering | `/media/scene-euro-white-oak.jpg` 2400×1350 | /wp-content/uploads/2025/08/Euro-White-Oak-1-scaled.jpg | `a023f3b7db25…` |
| scene-euro-natural-walnut | catalog-rendering | `/media/scene-euro-natural-walnut.jpg` 2400×1350 | /wp-content/uploads/2025/08/Euro-Natural-Walnut-1-scaled.jpg | `3d8ed03a6742…` |
| scene-euro-stone-grey | catalog-rendering | `/media/scene-euro-stone-grey.jpg` 2400×1350 | /wp-content/uploads/2025/08/Euro-Stone-Grey-1-scaled.jpg | `d481d382c610…` |
| scene-euro-glacial-white | catalog-rendering | `/media/scene-euro-glacial-white.jpg` 2400×1350 | /wp-content/uploads/2025/07/Euro-Glacial-White-scaled.jpg | `c61e44dcb964…` |
| scene-euro-frost-white | catalog-rendering | `/media/scene-euro-frost-white.jpg` 2400×1350 | /wp-content/uploads/2025/07/Euro-Frost-White-scaled.jpg | `b6c116f65f84…` |
| scene-shaker-grey | catalog-rendering | `/media/scene-shaker-grey.jpg` 1278×1006 | /wp-content/uploads/2025/10/341793_HCI-Shaker-Nano-Catalog-Ocotber_2025_Web_10.24.25.pdf#page=4 | — (extracted from catalog PDF) |
| scene-shaker-modern-slate | catalog-rendering | `/media/scene-shaker-modern-slate.jpg` 1278×1010 | /wp-content/uploads/2025/10/341793_HCI-Shaker-Nano-Catalog-Ocotber_2025_Web_10.24.25.pdf#page=6 | — (extracted from catalog PDF) |
| render-shaker-white | product-rendering | `/media/render-shaker-white.webp` 1108×1400 | /wp-content/uploads/2025/02/3552_B21_StandardWhite.png | `413409593fd3…` |
| chip-shaker-white | finish-detail | `/media/chip-shaker-white.webp` 640×640 | /wp-content/uploads/2025/02/3552_B21_StandardWhite.png | `413409593fd3…` |
| render-shaker-grey | product-rendering | `/media/render-shaker-grey.webp` 1108×1400 | /wp-content/uploads/2025/02/2751_B21_GrayShaker.png | `0cb3dc910288…` |
| chip-shaker-grey | finish-detail | `/media/chip-shaker-grey.webp` 640×640 | /wp-content/uploads/2025/02/2751_B21_GrayShaker.png | `0cb3dc910288…` |
| render-shaker-modern-slate | product-rendering | `/media/render-shaker-modern-slate.webp` 1108×1400 | /wp-content/uploads/2025/02/2952_B21_ModernSlate_Shaker.png | `d7489f5cdbee…` |
| chip-shaker-modern-slate | finish-detail | `/media/chip-shaker-modern-slate.webp` 640×640 | /wp-content/uploads/2025/02/2952_B21_ModernSlate_Shaker.png | `d7489f5cdbee…` |
| render-shaker-onyx-black | product-rendering | `/media/render-shaker-onyx-black.webp` 1108×1400 | /wp-content/uploads/2025/02/3152_B21_OnyxBlackShaker.png | `d298fd21a713…` |
| chip-shaker-onyx-black | finish-detail | `/media/chip-shaker-onyx-black.webp` 640×640 | /wp-content/uploads/2025/02/3152_B21_OnyxBlackShaker.png | `d298fd21a713…` |
| render-shaker-signature-blue | product-rendering | `/media/render-shaker-signature-blue.webp` 1108×1400 | /wp-content/uploads/2025/02/3352_B21_SignatureBlueShaker.png | `9bcadb9899af…` |
| chip-shaker-signature-blue | finish-detail | `/media/chip-shaker-signature-blue.webp` 640×640 | /wp-content/uploads/2025/02/3352_B21_SignatureBlueShaker.png | `9bcadb9899af…` |
| render-shaker-luxe | product-rendering | `/media/render-shaker-luxe.webp` 1094×1400 | /wp-content/uploads/2025/09/854013_B21_Shaker-Luxe.png | `06e64ada8415…` |
| chip-shaker-luxe | finish-detail | `/media/chip-shaker-luxe.webp` 640×640 | /wp-content/uploads/2025/09/854013_B21_Shaker-Luxe.png | `06e64ada8415…` |
| render-nano-white | product-rendering | `/media/render-nano-white.webp` 1108×1400 | /wp-content/uploads/2025/02/160760_B21_WhiteNano.png | `cf6cf74f8b27…` |
| chip-nano-white | finish-detail | `/media/chip-nano-white.webp` 640×640 | /wp-content/uploads/2025/02/160760_B21_WhiteNano.png | `cf6cf74f8b27…` |
| render-nano-green | product-rendering | `/media/render-nano-green.webp` 1108×1400 | /wp-content/uploads/2025/02/160761_B21_GreenNano.png | `c8ed0e78e9f1…` |
| chip-nano-green | finish-detail | `/media/chip-nano-green.webp` 640×640 | /wp-content/uploads/2025/02/160761_B21_GreenNano.png | `c8ed0e78e9f1…` |
| render-euro-white-oak | product-rendering | `/media/render-euro-white-oak.webp` 1114×1400 | /wp-content/uploads/2025/08/163607_B21_White-Oak.png | `37cda99657f6…` |
| chip-euro-white-oak | finish-detail | `/media/chip-euro-white-oak.webp` 640×640 | /wp-content/uploads/2025/08/163607_B21_White-Oak.png | `37cda99657f6…` |
| render-euro-natural-walnut | product-rendering | `/media/render-euro-natural-walnut.webp` 1114×1400 | /wp-content/uploads/2025/08/163608_B21_Natural-Walnut.png | `919b2c1b3c01…` |
| chip-euro-natural-walnut | finish-detail | `/media/chip-euro-natural-walnut.webp` 640×640 | /wp-content/uploads/2025/08/163608_B21_Natural-Walnut.png | `919b2c1b3c01…` |
| render-euro-stone-grey | product-rendering | `/media/render-euro-stone-grey.webp` 1109×1400 | /wp-content/uploads/2025/09/Stone-Gray.png | `7baf7c8c9645…` |
| chip-euro-stone-grey | finish-detail | `/media/chip-euro-stone-grey.webp` 640×640 | /wp-content/uploads/2025/09/Stone-Gray.png | `7baf7c8c9645…` |
| render-euro-glacial-white | product-rendering | `/media/render-euro-glacial-white.webp` 1114×1400 | /wp-content/uploads/2025/07/163604_B21D_Glacial-White.png | `ba640476874c…` |
| chip-euro-glacial-white | finish-detail | `/media/chip-euro-glacial-white.webp` 640×640 | /wp-content/uploads/2025/07/163604_B21D_Glacial-White.png | `ba640476874c…` |
| render-euro-frost-white | product-rendering | `/media/render-euro-frost-white.webp` 1114×1400 | /wp-content/uploads/2025/07/163605_B21D_Frost-White.png | `7ef1709b4820…` |
| chip-euro-frost-white | finish-detail | `/media/chip-euro-frost-white.webp` 640×640 | /wp-content/uploads/2025/07/163605_B21D_Frost-White.png | `7ef1709b4820…` |
| door-grain-v | material-texture | `/media/door-grain-v.webp` 800×1100 | /wp-content/uploads/2025/09/854013_B21_Shaker-Luxe.png | `06e64ada8415…` |
| door-grain-h | material-texture | `/media/door-grain-h.webp` 1100×800 | /wp-content/uploads/2025/09/854013_B21_Shaker-Luxe.png | `06e64ada8415…` |
