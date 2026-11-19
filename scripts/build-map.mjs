#!/usr/bin/env node
/**
 * Builds the location map from public-domain US Census boundaries (us-atlas, ISC).
 *
 * Outputs
 *   public/map/us-states.svg        static base map (states), served-states shaded
 *   content/map.generated.json      projected points for Phoenix and a set of served cities
 *
 * "Served" = states listed on the previous site's service-area pages (content/locations.ts data,
 * mirrored here as slugs). They are areas served, never locations. Phoenix is the only physical site.
 *
 * Usage: node scripts/build-map.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { presimplify, simplify } from "topojson-simplify";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const raw = JSON.parse(await readFile(require.resolve("us-atlas/states-10m.json"), "utf8"));
// Light simplification (spherical area threshold) keeps coastlines recognisable at ~1000px.
const topo = simplify(presimplify(raw), 0.001);

// Served state names, read from content/locations.ts so the two never drift.
const locSrc = await readFile(path.join(root, "content/locations.ts"), "utf8");
const served = new Set([...locSrc.matchAll(/\{ slug: "[a-z-]+", name: "([^"]+)", cities:/g)].map((m) => m[1]));
const cityNames = new Set([...locSrc.matchAll(/\{ slug: "[a-z-]+", name: "([^"]+)" \}/g)].map((m) => m[1]));

const W = 975;
const H = 610;
const projection = geoAlbersUsa().scale(1300).translate([W / 2, H / 2]);
const p = geoPath(projection).digits(1);

const states = feature(topo, topo.objects.states).features.filter((f) => f.properties.name !== "Puerto Rico" && projection.invert);
const borders = p(mesh(topo, topo.objects.states, (a, b) => a !== b));
const nation = p(feature(topo, topo.objects.nation));

const otherPaths = states.filter((f) => !served.has(f.properties.name)).map((f) => p(f)).filter(Boolean).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<path id="n" d="${nation}" fill="#ebe5db"/>
${otherPaths ? `<path d="${otherPaths}" fill="#f5f2ed"/>` : ""}
<path d="${borders}" fill="none" stroke="#fdfcfa" stroke-width="1.2" stroke-linejoin="round"/>
</svg>
`;
await writeFile(path.join(root, "public/map/us-states.svg"), svg);

// Major cities named on the service-area pages (public coordinates).
const cities = [
  ["Los Angeles", 34.0522, -118.2437], ["San Diego", 32.7157, -117.1611], ["Las Vegas", 36.1699, -115.1398],
  ["Tucson", 32.2226, -110.9747], ["Salt Lake City", 40.7608, -111.891], ["Denver", 39.7392, -104.9903],
  ["Albuquerque", 35.0844, -106.6504], ["Dallas", 32.7767, -96.797], ["Houston", 29.7604, -95.3698],
  ["Seattle", 47.6062, -122.3321], ["Portland", 45.5152, -122.6784], ["Sacramento", 38.5816, -121.4944],
  ["Boise City", 43.615, -116.2023], ["Kansas City", 39.0997, -94.5786], ["Chicago", 41.8781, -87.6298],
  ["Minneapolis", 44.9778, -93.265], ["Nashville", 36.1627, -86.7816], ["Atlanta", 33.749, -84.388],
  ["Charlotte", 35.2271, -80.8431], ["Orlando", 28.5383, -81.3792], ["Miami", 25.7617, -80.1918],
  ["New York City", 40.7128, -74.006], ["Boston", 42.3601, -71.0589],
];
for (const [n] of cities) if (!cityNames.has(n)) throw new Error(`${n} is not on a service-area page`);
const pt = (lat, lon) => projection([lon, lat]).map((v) => Math.round(v * 10) / 10);
const out = {
  width: W,
  height: H,
  servedStateCount: served.size,
  phoenix: pt(33.4484, -112.074),
  cities: cities.map(([name, lat, lon]) => ({ name: name === "Boise City" ? "Boise" : name, point: pt(lat, lon) })),
};
await writeFile(path.join(root, "content/map.generated.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`map: ${served.size} served states, ${cities.length} cities, svg ${(svg.length / 1024).toFixed(0)} KB`);
