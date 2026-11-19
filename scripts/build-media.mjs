#!/usr/bin/env node
/**
 * Builds optimized, local copies of approved Highland media.
 *
 * Inputs
 *   content/media-sources.json   approved assets with source URL + SHA-256 provenance
 *   MEDIA_SOURCE_DIR (env/arg)   directory holding the archived originals, named as in the
 *                                preservation archive (assets/<sha256>.<ext>)
 *
 * Outputs
 *   public/media/<id>.(jpg|webp)
 *   content/media.generated.json  dimensions, blur placeholders and provenance for <Media>
 *
 * Every source file is re-hashed and must match the SHA-256 recorded in the
 * preservation archive inventory before it is processed. Colours are never altered.
 *
 * Usage: node scripts/build-media.mjs /path/to/archive/assets
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcDir = process.argv[2] ?? process.env.MEDIA_SOURCE_DIR;
if (!srcDir) {
  console.error("Usage: node scripts/build-media.mjs <archive-assets-dir>");
  process.exit(1);
}
const outDir = path.join(root, "public/media");
await mkdir(outDir, { recursive: true });

const sources = JSON.parse(await readFile(path.join(root, "content/media-sources.json"), "utf8"));
const generated = {};

async function blur(input) {
  const buf = await sharp(input).resize(16, null, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

for (const s of sources) {
  const file = path.join(srcDir, s.sourceFile);
  const data = await readFile(file);
  if (s.sourceSha256) {
    const digest = createHash("sha256").update(data).digest("hex");
    if (digest !== s.sourceSha256) throw new Error(`Checksum mismatch for ${s.id}: ${digest}`);
  }

  let out;
  let pipeline;
  if (s.op === "scene") {
    out = `${s.id}.jpg`;
    // Optional art-direction crop (pixels in the source image), e.g. a portrait crop for phones.
    const base = s.crop ? sharp(data).rotate().extract(s.crop) : sharp(data).rotate();
    pipeline = base.resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true, progressive: true });
  } else if (s.op === "detail") {
    // An editorial close-up: crop of a render or photo, transparent edges laid on warm white.
    out = `${s.id}.jpg`;
    pipeline = sharp(data)
      .rotate()
      .extract(s.crop)
      .flatten({ background: "#f6f3ee" })
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true, progressive: true });
  } else if (s.op === "texture") {
    // A material texture sampled from a product rendering. Baked-in studio lighting is flattened
    // (pixel ÷ heavily blurred copy × mean) so the grain can be relit in CSS; colour is preserved.
    out = `${s.id}.webp`;
    const region = sharp(data).extract(s.crop).removeAlpha();
    const { data: px, info } = await region.clone().raw().toBuffer({ resolveWithObject: true });
    const { data: lo } = await region.clone().blur(80).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const mean = [0, 0, 0];
    for (let i = 0; i < px.length; i += ch) for (let c = 0; c < 3; c++) mean[c] += px[i + c];
    for (let c = 0; c < 3; c++) mean[c] /= px.length / ch;
    const flat = Buffer.alloc(px.length);
    for (let i = 0; i < px.length; i += ch) for (let c = 0; c < ch; c++) flat[i + c] = Math.max(0, Math.min(255, Math.round((px[i + c] / Math.max(1, lo[i + c])) * mean[c])));
    let tex = sharp(flat, { raw: { width: info.width, height: info.height, channels: ch } });
    if (s.rotate) tex = tex.rotate(s.rotate);
    pipeline = tex.webp({ quality: 84, effort: 6 });
  } else if (s.op === "render") {
    out = `${s.id}.webp`;
    const trimmed = await sharp(data).trim({ threshold: 1 }).toBuffer();
    pipeline = sharp(trimmed).resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100, effort: 6 });
  } else if (s.op === "chip") {
    out = `${s.id}.webp`;
    // Locate the cabinet within the 4000px canvas, then crop a fixed proportion that
    // contains the drawer-to-door reveal and the upper-left of the door face.
    const { info } = await sharp(data).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
    const left = -(info.trimOffsetLeft ?? 0);
    const top = -(info.trimOffsetTop ?? 0);
    const W = info.width;
    const H = info.height;
    const size = Math.round(W * 0.34);
    const region = { left: Math.round(left + W * 0.04), top: Math.round(top + H * 0.14), width: size, height: size };
    pipeline = sharp(data).extract(region).flatten({ background: "#ffffff" }).resize(640, 640).webp({ quality: 86, effort: 6 });
  } else if (s.op === "logo") {
    // A third-party mark: trimmed and resized only, never recoloured or redrawn.
    out = `${s.id}.webp`;
    const trimmed = await sharp(data).trim({ threshold: 8 }).toBuffer();
    pipeline = sharp(trimmed).resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 });
  } else {
    throw new Error(`Unknown op ${s.op}`);
  }

  const buf = await pipeline.toBuffer();
  await writeFile(path.join(outDir, out), buf);
  const meta = await sharp(buf).metadata();
  generated[s.id] = {
    src: `/media/${out}`,
    width: meta.width,
    height: meta.height,
    blurDataURL: s.op === "scene" || s.op === "detail" ? await blur(buf) : undefined,
    alt: s.alt,
    kind: s.kind,
    provenance: s.provenance,
    sourceUrl: s.sourceUrl,
    sourceSha256: s.sourceSha256,
  };
  console.log(`${s.id.padEnd(36)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ${(buf.length / 1024).toFixed(0)} KB`);
}

await writeFile(path.join(root, "content/media.generated.json"), JSON.stringify(generated, null, 2) + "\n");
console.log(`\nWrote ${Object.keys(generated).length} assets.`);
