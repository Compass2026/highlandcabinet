/**
 * Business facts used across the site.
 *
 * Every fact records where it came from in the preserved archive and whether Highland has
 * confirmed it. Facts marked `needs-confirmation` are shown only where the site cannot work
 * without them (e.g. a phone number), and every one of them is listed in
 * docs/LAUNCH-CHECKLIST.md. Facts that conflict in the archive and are not needed
 * (shipping timelines, inventory counts, satisfaction rates) are deliberately NOT used.
 */

export type FactStatus = "confirmed" | "needs-confirmation";

export interface Fact<T = string> {
  value: T;
  status: FactStatus;
  source: string;
  note?: string;
}

export const company = {
  name: "Highland Cabinetry",
  legalName: {
    value: "Highland Cabinetry Inc.",
    status: "needs-confirmation",
    source: "Catalog footers (© 2025 Highland Cabinetry Inc.); About page says “Highland Cabinetry 08, Inc”.",
    note: "Confirm the exact legal entity name for the footer and structured data.",
  } satisfies Fact,
  founded: {
    value: "2018",
    status: "needs-confirmation",
    source: "About page: “founded in 2018”. Same page also claims “over ten years of experience”.",
  } satisfies Fact,
} as const;

export const contact = {
  phone: {
    value: "866-545-6280",
    status: "confirmed",
    source: "Confirmed by the Highland project team (November 2026); matches the header bar on the current highlandcabinetry.com.",
    note:
      "Earlier archive pages showed 480-755-2280 (Contact, Products), 866.853.7987 (Become a Dealer) and 866-411-2851 " +
      "(older header bar); all are superseded by this number.",
  } satisfies Fact,
  salesEmail: {
    value: "sales@highlandcabinetryinc.com",
    status: "needs-confirmation",
    source: "Contact Us page.",
    note: "Domain differs from the website domain (highlandcabinetry.com). Catalog lists accounting@highlandcabinetry.com.",
  } satisfies Fact,
} as const;

/** The only physical location named in the archive. City landing pages are NOT locations. */
export const phoenixLocation = {
  name: "Phoenix showroom & warehouse",
  street: "3011 E Broadway Rd, Suite 100",
  locality: "Phoenix",
  region: "AZ",
  postalCode: "85040",
  status: "needs-confirmation" as FactStatus,
  source:
    "Contact Us page (address); Become a Dealer page (“Showroom and Warehouse locations in Phoenix, AZ”); " +
    "Phoenix page (warehouse pickup Mon–Fri, 8am–3pm).",
  pickupHours: {
    value: "Monday–Friday, 8am–3pm",
    status: "needs-confirmation",
    source: "Phoenix service-area page.",
  } satisfies Fact,
};

/** Order-processing facts that ARE stated consistently, in the June 2025 catalogs. */
export const orderPolicy = {
  cutoff: {
    value: "3:00 PM Arizona time, Monday–Friday, for same-day processing",
    status: "confirmed",
    source: "Shaker/Nano and Euro catalogs, Policies & Procedures, effective June 2025.",
  } satisfies Fact,
  deliveryOptions: {
    value: [
      "Pickup during business hours",
      "Highland Cabinetry delivery truck",
      "White-glove delivery in select markets, for an additional fee",
      "Common carrier, scheduled by Highland or by the customer",
    ],
    status: "confirmed",
    source: "Shaker/Nano and Euro catalogs, Policies & Procedures, effective June 2025.",
  } satisfies Fact<string[]>,
  orderMethods: {
    value: ["Excel order form", "Customer portal", "2020 SKU lists"],
    status: "confirmed",
    source: "Catalog Policies & Procedures. Orders are not accepted by phone.",
  } satisfies Fact<string[]>,
  designSoftware: {
    value: "A version of the catalog compatible with 2020 Design software is available on request.",
    status: "confirmed",
    source: "Catalog Policies & Procedures.",
  } satisfies Fact,
};

/**
 * Who Highland sells to. The archive conflicts: the homepage says “suppliers, contractors and
 * homeowners alike”, the Phoenix page says “trade-only… not the general public… EIN or ROC
 * required”. The site follows the trade-first reading and routes homeowners to dealer help,
 * which matches the project brief. Flagged in the launch checklist.
 */
export const audiencePolicy = {
  value: "trade-first; homeowners are referred to dealers",
  status: "needs-confirmation" as FactStatus,
};

/**
 * Standards and associations shown in the Brands section of the current site.
 * Shown on the staging preview for review; hidden in production until each is confirmed.
 */
export interface Affiliation extends Fact {
  id: string;
  name: string;
  mark: string;
  detail: string;
  href?: string;
}

export const affiliations: Affiliation[] = [
  {
    id: "kcma",
    name: "KCMA Certification Program",
    mark: "mark-kcma",
    value: "KCMA certified",
    detail: "Factory-assembled cabinet lines tested to ANSI/KCMA A161.1, the performance and construction standard for kitchen and vanity cabinets.",
    href: "https://www.kcma.org/",
    status: "needs-confirmation",
    source:
      "KCMA certificate no. 25068 for Highland Cabinetry, Phoenix AZ (kcma.org), issued 1 July 2025, expired 31 August 2026. " +
      "Covers factory-assembled lines only; flat-pack cabinets are not certified.",
    note: "Highland must supply the current (2026) certificate before launch, and confirm which website lines it covers.",
  },
  {
    id: "nkba",
    name: "National Kitchen & Bath Association",
    mark: "mark-nkba",
    value: "NKBA member",
    detail: "The trade association for the kitchen and bath industry.",
    href: "https://nkba.org/",
    status: "needs-confirmation",
    source: "Logo in the Brands section of the current website; membership not independently verified.",
    note: "Confirm current membership.",
  },
];

/** On the public site only confirmed affiliations appear; the staging preview shows all, labelled. */
export const visibleAffiliations = () => affiliations.filter((a) => a.status === "confirmed" || process.env.SITE_INDEXING !== "on");

export const catalogs = [
  {
    id: "shaker-nano",
    title: "Shaker & Nano Catalog",
    edition: "Effective June 2025 (web edition dated April 17, 2026)",
    href: "/catalogs/highland-shaker-nano-catalog.pdf",
    pages: 56,
    sizeLabel: "1.8 MB PDF",
    covers: ["shaker", "nano"] as const,
    sourceUrl:
      "https://highlandcabinetry.com/wp-content/uploads/2026/05/341793_HCI-Shaker-Nano-Catalog-June-2025_Web_04.17.26_compressed-1.pdf",
  },
  {
    id: "euro",
    title: "Euro Catalog",
    edition: "Effective June 2025",
    href: "/catalogs/highland-euro-catalog.pdf",
    pages: 44,
    sizeLabel: "12.8 MB PDF",
    covers: ["euro"] as const,
    sourceUrl: "https://highlandcabinetry.com/wp-content/uploads/2025/07/341792_HCI-Euro-Catalog-June-2025_Final_07.08.25-2-1.pdf",
  },
] as const;

export type CatalogId = (typeof catalogs)[number]["id"];

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://highlandcabinetry.com").replace(/\/$/, "");

/** Indexing is OFF unless explicitly enabled on the production deployment. */
export const indexingEnabled = process.env.SITE_INDEXING === "on";

export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, "")}`;
