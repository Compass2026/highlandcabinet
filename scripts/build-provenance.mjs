#!/usr/bin/env node
// Regenerates the image table in docs/ASSET-PROVENANCE.md from content/media.generated.json.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const media = JSON.parse(await readFile(path.join(root, "content/media.generated.json"), "utf8"));
const doc = path.join(root, "docs/ASSET-PROVENANCE.md");
const text = await readFile(doc, "utf8");
const head = text.slice(0, text.indexOf("| ID | Kind |"));
const rows = Object.entries(media).map(([id, m]) => {
  const sha = m.sourceSha256 ? `\`${m.sourceSha256.slice(0, 12)}…\`` : "— (extracted from catalog PDF)";
  return `| ${id} | ${m.kind} | \`${m.src}\` ${m.width}×${m.height} | ${m.sourceUrl.replace("https://highlandcabinetry.com", "")} | ${sha} |`;
});
await writeFile(doc, `${head}| ID | Kind | Output | Source URL | Source SHA-256 |\n|---|---|---|---|---|\n${rows.join("\n")}\n`);
console.log(`provenance: ${rows.length} images`);
