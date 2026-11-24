import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("/home/user/highlandcabinet/package.json");
const sharp = require("sharp");
const imgs = JSON.parse(readFileSync("blog/images.json", "utf8"));
const outRoot = "/home/user/highlandcabinet/public/media/blog";
mkdirSync(outRoot, { recursive: true });
const done = {};
for (const i of imgs) {
  if (!i.ok || i.aiEvidence) { i.out = null; continue; }
  const name = `${i.slug}-${i.n === 0 ? "cover" : i.n}.webp`;
  if (!done[i.file]) {
    try {
      const buf = await sharp(readFileSync(i.file), { animated: false }).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer();
      writeFileSync(`${outRoot}/${name}`, buf);
      const m = await sharp(buf).metadata();
      done[i.file] = { src: `/media/blog/${name}`, width: m.width, height: m.height, bytes: buf.length };
    } catch (e) { console.log("fail", i.url, e.message); done[i.file] = null; }
  }
  i.out = done[i.file];
}
writeFileSync("blog/images.json", JSON.stringify(imgs, null, 1));
const outs = Object.values(done).filter(Boolean);
console.log("converted", outs.length, "MB", (outs.reduce((a, b) => a + b.bytes, 0) / 1e6).toFixed(1));
