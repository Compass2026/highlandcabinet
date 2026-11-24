/**
 * What makes a Highland cabinet — every line here is taken from Highland's own June 2025
 * catalogs (Shaker/Nano and Euro), never from marketing claims that the catalogs don't support.
 * Notably NOT used: "all wood" (untrue for the Euro line's furniture-board case) and soft-close
 * doors on Shaker/Nano (the catalog lists six-way adjustable hinges without a soft-close mechanism).
 */

export const qualitySource = "Highland Cabinetry catalogs, effective June 2025";

/** Highland's own words, from the opening page of both catalogs. */
export const manifesto = {
  title: "Built together. Built to last.",
  quote:
    "One cabinet can make all the difference. It can shape a customer’s impression, impact a builder’s reputation, and influence whether a client calls you back — or doesn’t. That is why consistency is never optional for us.",
  supplyChain:
    "Because we own our entire supply chain, we control how materials are sourced, how every cabinet is crafted, and exactly when it leaves our facility.",
};

export interface Pillar {
  title: string;
  text: string;
  scope: "Shaker & Nano" | "Euro" | "Every line";
}

export const pillars: Pillar[] = [
  {
    title: "A plywood box",
    text: "Cabinet-grade plywood throughout: ⅝″ backs with ¾″ stretchers applied behind, and ½″ end panels.",
    scope: "Shaker & Nano",
  },
  {
    title: "Ready for stone",
    text: "Base cabinets are reinforced with “L” brackets and ½″ plywood sides to carry granite, quartz and other heavy tops.",
    scope: "Shaker & Nano",
  },
  {
    title: "Dovetailed drawers",
    text: "Solid-wood drawer sides, ½″ thick and dovetailed, behind 5-piece fronts — running on full-extension, undermount, soft-close steel guides.",
    scope: "Shaker & Nano",
  },
  {
    title: "Doors that stay true",
    text: "¾″ full-overlay doors on six-way adjustable, European-style concealed hinges. Tall 42″ wall cabinets get a third hinge.",
    scope: "Shaker & Nano",
  },
  {
    title: "A finish that lasts",
    text: "A clear-coat UV finish throughout. Stained finishes come from real wood, so the grain is never quite the same twice — by design.",
    scope: "Shaker & Nano",
  },
  {
    title: "Storage built in",
    text: "Lazy susans, spice and trash pull-outs, roll-out tray kits, plus the trim, fillers, panels and mouldings that finish a job.",
    scope: "Every line",
  },
];

/** Euro is frameless and built differently — said plainly rather than folded into the claims above. */
export const euroBuild = {
  title: "Euro, built its own way.",
  text: "Frameless cabinets on a ¾″ engineered furniture-board case, screw-connected with wood dowel inserts. Heavy-duty steel hinges and metal drawer boxes, both soft-close.",
};

export const service = [
  { k: "One account manager", v: "A single contact who knows your business, from the first order on." },
  { k: "3 PM same-day cut-off", v: "Orders in by 3:00 PM Arizona time, Monday–Friday, are processed that day." },
  { k: "Order your way", v: "Excel order form, customer portal or 2020 SKU lists — with a 2020 Design catalog on request." },
  { k: "Four ways to deliver", v: "Warehouse pickup, Highland’s own truck, common carrier, or white-glove in select markets." },
  { k: "A clear damage policy", v: "Report damage within 30 days with photos and your order number, before installing." },
];
