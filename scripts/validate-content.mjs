#!/usr/bin/env node
/**
 * Content integrity checks (run in CI and before deploys):
 *  - every media id referenced by collections exists in media.generated.json and on disk
 *  - every generated asset carries provenance (source URL; SHA-256 unless extracted from a catalog PDF)
 *  - every non-decorative image has alt text
 *  - collection paths are unique and are marked "built" in the migration inventory
 *  - redirects never point away from a path that is built
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const errors = [];
const media = JSON.parse(await readFile(path.join(root, "content/media.generated.json"), "utf8"));
const collections = await readFile(path.join(root, "content/collections.ts"), "utf8");
const inventory = await readFile(path.join(root, "docs/migration/url-inventory.csv"), "utf8");
const redirectsSrc = await readFile(path.join(root, "content/redirects.ts"), "utf8");

for (const [id, m] of Object.entries(media)) {
  try {
    await access(path.join(root, "public", m.src));
  } catch {
    errors.push(`media ${id}: file missing at public${m.src}`);
  }
  if (!m.sourceUrl) errors.push(`media ${id}: no source URL`);
  if (!m.sourceSha256 && !/#page=\d+$/.test(m.sourceUrl)) errors.push(`media ${id}: no SHA-256 provenance`);
  if (m.kind !== "finish-detail" && !m.alt) errors.push(`media ${id}: missing alt text`);
}

const ids = [...collections.matchAll(/"((?:project|scene|render|chip)-[a-z0-9-]+)"/g)].map((m) => m[1]);
for (const id of new Set(ids)) if (!media[id]) errors.push(`collections.ts references unknown media "${id}"`);

const paths = [...collections.matchAll(/path: "([^"]+)"/g)].map((m) => m[1]);
const dup = paths.filter((p, i) => paths.indexOf(p) !== i);
if (dup.length) errors.push(`duplicate collection paths: ${dup.join(", ")}`);
for (const p of paths) {
  const row = inventory.split("\n").find((l) => l.includes(`,"${p}",`));
  if (!row || !row.includes('"built"')) errors.push(`collection ${p} is not marked built in the migration inventory`);
  if (redirectsSrc.includes(`"source": "${p}"`)) errors.push(`collection ${p} is also a redirect source`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} content problem(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ content valid — ${Object.keys(media).length} media assets, ${paths.length} collections`);
