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
    value: "480-755-2280",
    status: "needs-confirmation",
    source: "Contact Us page and Products page.",
    note:
      "The archive shows three different numbers: 480-755-2280 (Contact, Products), 866.853.7987 (Become a Dealer), " +
      "866-411-2851 (live header bar). Highland must choose the published number(s).",
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
