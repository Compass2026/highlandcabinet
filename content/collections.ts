/**
 * Product lines and finishes.
 *
 * Sources
 *  - Finish names, finish types and construction features: Highland Shaker/Nano Catalog and
 *    Euro Catalog, both “effective June 2025” (preserved PDFs, SHA-256 in docs/ASSET-PROVENANCE.md).
 *  - Collection URLs: the previous site's sitemap. Paths are preserved.
 *  - Descriptions: rewritten from the previous product pages; claims that could not be
 *    verified (inventory, delivery days, satisfaction rates) were removed.
 *
 * This file is shaped so it can move into a CMS later: plain data, no JSX.
 */
import type { CatalogId } from "./site";

export type LineId = "shaker" | "nano" | "euro";

export interface SpecRow {
  label: string;
  value: string;
  /** Number used in Highland's catalog construction illustration, when applicable. */
  callout?: number;
}

export interface Line {
  id: LineId;
  name: string;
  short: string;
  construction: "Framed" | "Frameless";
  summary: string;
  catalog: CatalogId;
  specSource: string;
  specs: SpecRow[];
  specNotes: string[];
}

export const lines: Record<LineId, Line> = {
  shaker: {
    id: "shaker",
    name: "Shaker",
    short: "Recessed-panel Shaker doors in six painted and stained finishes.",
    construction: "Framed",
    summary:
      "The classic recessed-panel door, built on a plywood box with dovetail drawers and soft-close hardware. Six finishes, from crisp White to the stained grain of Luxe and Modern Slate.",
    catalog: "shaker-nano",
    specSource: "Shaker/Nano Catalog, Construction Features, p. 3 — effective June 2025",
    specs: [
      { callout: 1, label: "Back panel", value: "⅝″ cabinet-grade plywood, with ¾″ stretchers applied to the back of the cabinet" },
      { callout: 2, label: "“L” bracket", value: "Reinforced base cabinets with ½″ plywood sides for heavy countertops" },
      { callout: 3, label: "End panel", value: "½″ cabinet-grade plywood" },
      { callout: 4, label: "Shelves", value: "Adjustable, on metal shelf rests" },
      { callout: 5, label: "Hinges", value: "Six-way adjustable, European-style hidden metal hinges" },
      { callout: 6, label: "Doors", value: "¾″ full overlay" },
      { callout: 7, label: "Drawers", value: "Dovetail drawers with ½″ solid wood sides; 5-piece drawer fronts" },
      { callout: 8, label: "Glides", value: "Full-extension, undermount, soft-close steel concealed guides" },
      { callout: 9, label: "Finish", value: "Clear-coat UV finish throughout" },
      { callout: 10, label: "Toe kick", value: "4½″" },
    ],
    specNotes: ["42″ wall cabinets have three hinges; all other wall cabinets have two."],
  },
  nano: {
    id: "nano",
    name: "Nano",
    short: "Flat-panel doors on the same box as Shaker, in two painted finishes.",
    construction: "Framed",
    summary:
      "A quieter, flat-panel front on Highland's Shaker/Nano cabinet box — the same plywood construction, dovetail drawers and soft-close hardware, in Green and White.",
    catalog: "shaker-nano",
    specSource: "Shaker/Nano Catalog, Construction Features, p. 3 — effective June 2025",
    specs: [],
    specNotes: ["42″ wall cabinets have three hinges; all other wall cabinets have two."],
  },
  euro: {
    id: "euro",
    name: "Euro",
    short: "Frameless cabinets in five laminate and PET finishes.",
    construction: "Frameless",
    summary:
      "Frameless construction with full-access interiors and slab fronts — matte and gloss whites, a stone grey, and two woodgrains.",
    catalog: "euro",
    specSource: "Euro Catalog, Construction Features, p. 3 — effective June 2025",
    specs: [
      { label: "Case", value: "¾″ white laminated engineered furniture board, screw-connected with wood dowel inserts" },
      { label: "Doors", value: "White Oak and Natural Walnut: furniture board with laminated surface and PVC edgebanding. Frost White, Glacial White and Stone Grey: MDF core with PET face and laser edgebanding" },
      { label: "Hinges", value: "Heavy-duty steel concealed hinge, adjustable, with soft-close mechanism" },
      { label: "Drawers", value: "Metal drawer box with soft-close mechanism" },
      { label: "Glides", value: "Soft-close" },
    ],
    specNotes: ["42″ wall cabinets have three hinges; all other wall cabinets have two."],
  },
};
// Nano shares the Shaker/Nano construction page.
lines.nano.specs = lines.shaker.specs;

export interface Finish {
  id: string;
  /** Preserved URL path from the previous site (with trailing slash). */
  path: string;
  name: string;
  line: LineId;
  /** Material/finish type exactly as listed in the catalog finish chart. */
  finishType: string;
  /** Sample-card code shown in the UI. Not a SKU. */
  code: string;
  description: string;
  catalogPage?: number;
  media: { render: string; chip: string; scene: string };
  /** Gallery media ids, in order (lead rendering, then installed projects). */
  gallery?: string[];
  /** Marked true when the collection has full editorial content for this milestone. */
  featured?: boolean;
}

export const finishes: Finish[] = [
  {
    id: "shaker-white",
    path: "/wholesale-white-shaker-cabinets/",
    name: "White Shaker",
    line: "shaker",
    finishType: "Paint",
    code: "SH·WH",
    description:
      "A clean painted white on the recessed-panel Shaker door. It reads as quietly traditional or sharply modern depending on the hardware and countertop around it, so it suits a wide range of projects — from a single remodel to a multi-unit build.",
    catalogPage: 9,
    media: { render: "render-shaker-white", chip: "chip-shaker-white", scene: "project-white-shaker-01" },
    gallery: [
      "scene-shaker-white",
      "project-white-shaker-01",
      "project-white-shaker-02",
      "project-white-shaker-04",
      "project-white-shaker-03",
      "project-white-shaker-05",
      "project-white-shaker-06",
      "project-white-shaker-07",
    ],
    featured: true,
  },
  {
    id: "shaker-grey",
    path: "/wholesale-gray-shaker-cabinets/",
    name: "Grey Shaker",
    line: "shaker",
    finishType: "Paint",
    code: "SH·GR",
    description: "A mid-tone painted grey on the Shaker door — classic in profile, contemporary in colour, and easy to pair with white or stone counters.",
    catalogPage: 4,
    media: { render: "render-shaker-grey", chip: "chip-shaker-grey", scene: "scene-shaker-grey" },
  },
  {
    id: "shaker-modern-slate",
    path: "/wholesale-modern-slate-cabinets/",
    name: "Modern Slate",
    line: "shaker",
    finishType: "Stain",
    code: "SH·MS",
    description: "A dark, stained grey that lets the woodgrain show through. Deep enough to anchor a kitchen, with more texture than a painted finish.",
    catalogPage: 6,
    media: { render: "render-shaker-modern-slate", chip: "chip-shaker-modern-slate", scene: "scene-shaker-modern-slate" },
  },
  {
    id: "shaker-onyx-black",
    path: "/wholesale-onyx-black-shaker-cabinet/",
    name: "Onyx Black",
    line: "shaker",
    finishType: "Paint",
    code: "SH·OB",
    description: "A painted black Shaker door for high-contrast kitchens, islands and bars. Brass or matte-black hardware both sit well against it.",
    catalogPage: 7,
    media: { render: "render-shaker-onyx-black", chip: "chip-shaker-onyx-black", scene: "scene-shaker-onyx-black" },
  },
  {
    id: "shaker-signature-blue",
    path: "/wholesale-signature-blue-shaker-cabinets/",
    name: "Signature Blue",
    line: "shaker",
    finishType: "Paint",
    code: "SH·SB",
    description: "A deep painted navy that brings colour to the classic Shaker profile — strong on a full kitchen, or as an island against white perimeter cabinets.",
    catalogPage: 8,
    media: { render: "render-shaker-signature-blue", chip: "chip-shaker-signature-blue", scene: "scene-shaker-signature-blue" },
  },
  {
    id: "shaker-luxe",
    path: "/wholesale-luxe-shaker-cabinets/",
    name: "Luxe",
    line: "shaker",
    finishType: "Stain",
    code: "SH·LX",
    description: "A light, stained finish that keeps the natural woodgrain visible — the warmest of the Shaker finishes. As with any stain on real wood, grain and tone vary from piece to piece.",
    catalogPage: 5,
    media: { render: "render-shaker-luxe", chip: "chip-shaker-luxe", scene: "scene-shaker-luxe" },
  },
  {
    id: "nano-white",
    path: "/wholesale-nano-white-cabinets/",
    name: "Nano White",
    line: "nano",
    finishType: "Paint",
    code: "NA·WH",
    description: "A painted white flat-panel door on the Shaker/Nano box — a simpler, more modern face for the same construction.",
    catalogPage: 12,
    media: { render: "render-nano-white", chip: "chip-nano-white", scene: "scene-nano-white" },
  },
  {
    id: "nano-green",
    path: "/wholesale-nano-green-cabinets/",
    name: "Nano Green",
    line: "nano",
    finishType: "Paint",
    code: "NA·GN",
    description: "A muted painted green on a flat-panel door. Calm on its own, and a natural partner for brass hardware and warm wood floors.",
    catalogPage: 11,
    media: { render: "render-nano-green", chip: "chip-nano-green", scene: "scene-nano-green" },
  },
  {
    id: "euro-white-oak",
    path: "/wholesale-white-oak-euro-cabinets/",
    name: "White Oak",
    line: "euro",
    finishType: "Melamine (MDF)",
    code: "EU·WO",
    description: "Frameless cabinets with a light, satin white-oak grain. Warm without being heavy, and clean-lined enough for contemporary spaces.",
    media: { render: "render-euro-white-oak", chip: "chip-euro-white-oak", scene: "scene-euro-white-oak" },
  },
  {
    id: "euro-natural-walnut",
    path: "/wholesale-natural-walnut-euro-cabinets/",
    name: "Natural Walnut",
    line: "euro",
    finishType: "Melamine (MDF)",
    code: "EU·NW",
    description: "A rich, vertical walnut grain on frameless slab fronts — the darkest wood tone in the Euro line.",
    media: { render: "render-euro-natural-walnut", chip: "chip-euro-natural-walnut", scene: "scene-euro-natural-walnut" },
  },
  {
    id: "euro-stone-grey",
    path: "/wholesale-stone-grey-euro-cabinets/",
    name: "Stone Grey",
    line: "euro",
    finishType: "PET (MDF)",
    code: "EU·SG",
    description: "A flat, mineral grey PET finish on frameless construction, for quiet modern kitchens and baths.",
    media: { render: "render-euro-stone-grey", chip: "chip-euro-stone-grey", scene: "scene-euro-stone-grey" },
  },
  {
    id: "euro-glacial-white",
    path: "/wholesale-glacial-white-euro-cabinets/",
    name: "Glacial White",
    line: "euro",
    finishType: "PET (MDF), gloss",
    code: "EU·GW",
    description: "A gloss white PET face on frameless cabinets. Reflective and bright, suited to compact kitchens that need light.",
    media: { render: "render-euro-glacial-white", chip: "chip-euro-glacial-white", scene: "scene-euro-glacial-white" },
  },
  {
    id: "euro-frost-white",
    path: "/wholesale-white-frost-euro-cabinets/",
    name: "Frost White",
    line: "euro",
    finishType: "PET (MDF), matte",
    code: "EU·FW",
    description: "A soft matte white PET face on frameless cabinets — the understated counterpart to Glacial White.",
    media: { render: "render-euro-frost-white", chip: "chip-euro-frost-white", scene: "scene-euro-frost-white" },
  },
];

export const lineOrder: LineId[] = ["shaker", "nano", "euro"];

export const finishById = (id: string) => finishes.find((f) => f.id === id);
export const finishByPath = (slug: string) => finishes.find((f) => f.path === `/${slug}/`);
export const finishesByLine = (line: LineId) => finishes.filter((f) => f.line === line);
export const slugOf = (f: Finish) => f.path.replace(/\//g, "");
