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
