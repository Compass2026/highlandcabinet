import data from "@/content/service-areas.json";

/**
 * Service-area pages restored from the previous site at their original paths.
 * These are areas Highland supplies by delivery and freight — never physical locations.
 * Source: WordPress export of highlandcabinetry.com (scripts/wp-export/extract_service_areas.py).
 * Unsupported claims on the originals were not carried over; see `removedClaims` / `issues`.
 */
export interface Facility {
  name: string;
  detail: string;
}

export interface ServiceArea {
  path: string;
  state: string;
  stateName: string;
  city: string | null;
  cityName: string | null;
  areas: string[];
  facilities: Facility[];
  sourceModified: string;
  uniqueWords: number | null;
  issues: string[];
  removedClaims: string[];
  /** The page's original <title> (brand suffix removed), kept to preserve its search terms. */
  originalTitle: string | null;
}

export const serviceAreas = data as ServiceArea[];

/** Pages rebuilt at their own path. Outdated duplicates (e.g. `wisconsin-old`) are redirected instead. */
export const liveServiceAreas = serviceAreas.filter((a) => !a.state.endsWith("-old") && !(a.city ?? "").endsWith("-old"));

export const stateAreas = liveServiceAreas.filter((a) => !a.city);
export const cityAreas = liveServiceAreas.filter((a) => a.city);

export const findArea = (state: string, city?: string) =>
  liveServiceAreas.find((a) => a.state === state && (city ? a.city === city : !a.city));

export const citiesIn = (state: string) => cityAreas.filter((a) => a.state === state).sort((a, b) => a.cityName!.localeCompare(b.cityName!));

/** A rendering for each page, varied deterministically so neighbouring pages don't repeat. */
const scenes = [
  "scene-shaker-white",
  "scene-euro-white-oak",
  "scene-shaker-signature-blue",
  "scene-euro-natural-walnut",
  "scene-shaker-onyx-black",
  "scene-nano-green",
  "scene-shaker-luxe",
  "scene-euro-glacial-white",
  "scene-nano-white",
  "scene-euro-stone-grey",
  "scene-euro-frost-white",
];
export function sceneFor(path: string) {
  let h = 0;
  for (const c of path) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return scenes[h % scenes.length];
}

const abbr: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA", colorado: "CO", connecticut: "CT", delaware: "DE",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY",
  louisiana: "LA", maine: "ME", maryland: "MD", massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO",
  montana: "MT", nebraska: "NE", nevada: "NV", "new-hampshire": "NH", "new-jersey": "NJ", "new-mexico": "NM", "new-york": "NY",
  "north-carolina": "NC", "north-dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode-island": "RI",
  "south-carolina": "SC", "south-dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT", virginia: "VA", washington: "WA",
  "west-virginia": "WV", wisconsin: "WI", wyoming: "WY",
};
export const stateAbbr = (state: string) => abbr[state] ?? "";

/**
 * Title/description for a service-area page. Keeps the original pages' search terms — "RTA", "kitchen & bathroom",
 * "wholesale", "contractors", the place name — without their unsupported delivery promise ("shipped in 7–9 days").
 */
export function areaMeta(a: ServiceArea) {
  const place = a.city ? `${a.cityName}, ${stateAbbr(a.state)}` : a.stateName;
  return {
    title: a.originalTitle ?? `RTA Kitchen & Bathroom Wholesale Cabinets in ${place}`,
    description: `Improve your ${a.cityName ? `${a.cityName}, ${a.stateName}` : a.stateName} projects with RTA kitchen & bathroom cabinets from Highland Cabinetry — a wholesale partner for contractors, builders, remodelers and dealers, with Shaker, Nano and Euro lines and a dedicated account manager.`,
  };
}

/** Answers to the original pages' contractor FAQ, kept only where they can be answered accurately. */
export function areaFaq(a: ServiceArea) {
  const place = a.cityName ?? a.stateName;
  return [
    {
      q: "Do I need a license or EIN to open an account?",
      a: "Yes. Highland Cabinetry sells through the trade. To open a wholesale account and access trade pricing, you’ll need an EIN or a contractor license (ROC).",
    },
    {
      q: "Is there a minimum order requirement?",
      a: "Ordering options depend on the cabinet line, the order and the delivery. Whether it’s one kitchen or many units, the sales team will confirm the best way to order for your project.",
    },
    {
      q: "Can you handle large multi-unit or development projects?",
      a: "Yes. Highland works with builders, developers and contractors who need consistent cabinet styles across many kitchens or units, with one account manager, repeatable ordering by Excel form, customer portal or 2020 SKU list, and delivery scheduled to the job.",
    },
    {
      q: `What are your lead times for ${place} deliveries?`,
      a: `Lead times depend on the cabinet line, order size and destination. Orders placed by 3:00 PM Arizona time, Monday–Friday, are processed the same business day, and your account manager confirms delivery timing for ${place} when the order is placed.`,
    },
    {
      q: "Do you offer design support?",
      a: "Share your layout with your quote request and the sales team will help check cabinet selections and quantities before the order moves forward. A catalog version compatible with 2020 Design software is available on request.",
    },
  ];
}
