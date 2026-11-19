import generated from "@/content/media.generated.json";

export type MediaKind = "installed-project" | "catalog-rendering" | "product-rendering" | "finish-detail" | "material-texture" | "marketing-rendering" | "facility" | "affiliation-mark";

export interface MediaAsset {
  id: string;
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt: string;
  kind: MediaKind;
  provenance: string;
  sourceUrl: string;
  sourceSha256: string | null;
}

const table = generated as Record<string, Omit<MediaAsset, "id">>;

export function media(id: string): MediaAsset {
  const m = table[id];
  if (!m) throw new Error(`Unknown media id "${id}". Add it to content/media-sources.json and run scripts/build-media.mjs.`);
  return { id, ...m };
}

/** Short, honest label shown in captions so renderings are never presented as photographs. */
export const kindLabel: Record<MediaKind, string> = {
  "installed-project": "Installed project",
  "catalog-rendering": "Catalog rendering",
  "product-rendering": "Product rendering",
  "finish-detail": "Finish detail",
  "material-texture": "Material texture",
  "marketing-rendering": "Highland rendering",
  facility: "Highland warehouse",
  "affiliation-mark": "Affiliation mark",
};
