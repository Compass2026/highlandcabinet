#!/usr/bin/env node
/**
 * Serves a static fallback folder the way Netlify/Cloudflare would, using its `_redirects` file, so the usual
 * suites (test-migration, test-launch-seo, verify-tracking with MAP_TO) can verify the fallback before it is needed.
 *   node scripts/serve-static-fallback.mjs fallback/highland-static-<sha> 3002
 */
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";

const dir = path.resolve(process.argv[2]);
const port = Number(process.argv[3] ?? 3002);
const rules = readFileSync(path.join(dir, "_redirects"), "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"))
  .map((l) => l.trim().split(/\s+/))
  .map(([from, to, status]) => ({ from, to, status: Number(status) }));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain", ".woff2": "font/woff2", ".ico": "image/x-icon" };

http
  .createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    const p = decodeURIComponent(u.pathname);
    for (const r of rules) {
      const hit = r.from.endsWith("*") ? p.startsWith(r.from.slice(0, -1)) : p === r.from || u.pathname === r.from;
      if (!hit) continue;
      if (r.status === 410) {
        res.writeHead(410, { "content-type": types[".html"] });
        return createReadStream(path.join(dir, r.to)).pipe(res);
      }
      // Like Netlify/Cloudflare: the incoming query string is added to the target, before any #fragment.
      const [to, frag] = r.to.split("#");
      res.writeHead(r.status, { location: to + u.search + (frag ? `#${frag}` : "") });
      return res.end();
    }
    let f = path.join(dir, p);
    if (!f.startsWith(dir)) return res.writeHead(400).end();
    if (existsSync(f) && statSync(f).isDirectory()) {
      if (!p.endsWith("/")) {
        res.writeHead(308, { location: p + "/" + u.search });
        return res.end();
      }
      f = path.join(f, "index.html");
    }
    if (!existsSync(f) && existsSync(f + ".html")) f += ".html";
    if (!existsSync(f) || statSync(f).isDirectory()) {
      res.writeHead(404, { "content-type": types[".html"] });
      return existsSync(path.join(dir, "404.html")) ? createReadStream(path.join(dir, "404.html")).pipe(res) : res.end("Not found");
    }
    if (req.method === "POST") return res.writeHead(405).end();
    res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" });
    createReadStream(f).pipe(res);
  })
  .listen(port, () => console.log(`static fallback on http://localhost:${port}`));
