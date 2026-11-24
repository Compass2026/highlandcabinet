#!/usr/bin/env python3
"""
Manual-check worklist for the pages the SEO baseline marks PRESERVE AND VERIFY.

For each page: fetch the rebuilt page from BASE (a production-mode build), then measure how many of the provider's
keywords for that URL are still answerable from the page (every significant word of the keyword appears in the
title, H1 or body), weighted by the provider's estimated traffic. Adds old/new word counts and old headings not
covered (from the earlier page comparison) and the number of claim corrections applied to blog posts.

Provider data are dated observations (Aug–Nov 2026), not Search Console traffic. A low score flags a page for a
human to read; it is not a reason to change or consolidate anything by itself.

    BASE=http://localhost:3001 python3 scripts/seo/priority_checks.py
"""
import csv, html, json, os, re, urllib.request
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.environ.get("BASE", "http://localhost:3001")
B = os.path.join(ROOT, "docs/seo/baseline-2026-11-24")
STOP = set("a an and are as at be by can do does for from how i in is it of on or the to vs what when where which who why with you your my me".split())

def norm(w):
    w = w.lower()
    for suf in ("ies", "es", "s"):
        if len(w) > 4 and w.endswith(suf):
            return w[: -len(suf)] + ("y" if suf == "ies" else "")
    return w

def words(t):
    return [norm(w) for w in re.findall(r"[a-z0-9]+", t.lower())]

ORIG = os.environ.get("ORIG")  # optional: captured old pages (index.json → files) to measure loss, not absolute coverage
orig_idx = json.load(open(os.path.join(ORIG, "index.json"))) if ORIG else {}

def parse(s):
    title = html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1))
    h1 = html.unescape(re.sub(r"<[^>]+>", " ", (re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S) or [None, ""])[1]))
    main = re.search(r"<main[^>]*>(.*)</main>", s, re.S)
    body = re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", " ", main.group(1) if main else s)
    body = html.unescape(re.sub(r"<[^>]+>", " ", body))
    return title, h1, body

def page(path):
    with urllib.request.urlopen(BASE + path + ("" if path.endswith("/") else "/")) as r:
        return parse(r.read().decode("utf-8", "ignore"))

def old_page(path):
    v = orig_idx.get(path)
    if not v: return None
    f = v["file"] if isinstance(v, dict) else v
    f = f if os.path.isabs(f) else os.path.join(ORIG, os.path.basename(f))
    s = open(f, encoding="utf-8", errors="ignore").read()
    s = re.sub(r"(?s)<header\b.*?</header>|<footer\b.*?</footer>", " ", s)  # site chrome is not page content
    m = re.search(r"(?s)<body[^>]*>(.*)</body>", s)
    t = re.search(r"<title>(.*?)</title>", s, re.S)
    h = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S)
    return parse(f"<title>{t.group(1) if t else ''}</title><h1>{h.group(1) if h else ''}</h1><main>{m.group(1) if m else s}</main>")

kw = defaultdict(list)
for r in csv.DictReader(open(os.path.join(B, "keyword-url-baseline.csv"), encoding="utf-8")):
    kw[r["path"].rstrip("/") or "/"].append(r)
prio = [r for r in csv.DictReader(open(os.path.join(B, "page-preservation-priorities.csv"), encoding="utf-8")) if r["review_priority"] == "PRESERVE AND VERIFY"]
cmp_ = {r["path"]: r for r in json.load(open("/dev/null" if not os.environ.get("COMPARE") else os.environ["COMPARE"]))} if os.environ.get("COMPARE") else {}
audit = json.load(open(os.path.join(ROOT, "docs/migration/wp/blog-audit.json")))

out = []
for i, p in enumerate(prio, 1):
    path = p["migration_target"] or (p["path"].rstrip("/") + "/")
    try:
        title, h1, body = page(path)
    except Exception as e:
        out.append({"rank": i, "path": path, "error": str(e)})
        continue
    strong, text = set(words(title + " " + h1)), set(words(title + " " + h1 + " " + body))
    op = old_page(path)
    old_text = set(words(" ".join(op))) if op else None
    recs = kw.get(p["path"].rstrip("/") or "/", [])
    tot = cov = 0.0
    n_cov = n_strong = 0
    missing = []
    lost = []
    old_cov = 0
    for r in recs:
        sig = [w for w in words(r["keyword"]) if w not in STOP]
        etv = float(r["estimated_traffic"] or 0)
        tot += etv
        if sig and all(w in text for w in sig):
            cov += etv; n_cov += 1
            if all(w in strong for w in sig): n_strong += 1
        else:
            missing.append((etv, r["keyword"], [w for w in sig if w not in text]))
            if old_text is not None and sig and all(w in old_text for w in sig):
                lost.append((etv, r["keyword"], [w for w in sig if w not in text]))
        if old_text is not None and sig and all(w in old_text for w in sig):
            old_cov += 1
    missing.sort(reverse=True)
    lost.sort(reverse=True)
    c = cmp_.get(path, {})
    slug = path.strip("/").split("/")[-1]
    edits = len(audit.get(slug, {}).get("edits", [])) if path.startswith("/blog/") else ""
    rec_pct = round(100 * n_cov / len(recs)) if recs else ""
    etv_pct = round(100 * cov / tot) if tot else ""
    lost_etv = round(sum(e for e, _, _ in lost), 1)
    # READ = keywords the OLD page answered that the new page no longer does (a migration loss worth a human look).
    flag = "READ" if lost and (lost_etv >= 1 or len(lost) >= 3) else "OK"
    out.append({
        "rank": i, "path": path, "page_type": p["page_type"], "keyword_records": len(recs), "top10_records": p["top10_records"],
        "est_traffic": round(float(p["estimated_traffic_sum"]), 1), "referring_domains": p["max_referring_domains_per_url_variant"],
        "old_keywords_answerable_pct": round(100 * old_cov / len(recs)) if recs and old_text is not None else "",
        "keywords_answerable_pct": rec_pct, "traffic_weighted_answerable_pct": etv_pct, "keywords_in_title_or_h1": n_strong,
        "lost_vs_old_page": len(lost), "lost_est_traffic": lost_etv,
        "top_lost_keywords": " | ".join(f"{k} (missing: {' '.join(m)})" for _, k, m in lost[:6]),
        "top_missing_keywords": " | ".join(f"{k} (missing: {' '.join(m)})" for _, k, m in missing[:5]),
        "old_words": c.get("old_words", ""), "new_words": len(body.split()), "old_headings_not_covered": c.get("n_headings_not_covered", ""),
        "claim_corrections": edits, "auto_check": flag,
    })

cols = list(out[0].keys())
with open(os.path.join(ROOT, "docs/seo/priority-content-checks.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore"); w.writeheader(); w.writerows(out)
reads = [o for o in out if o.get("auto_check") == "READ"]
print(json.dumps({"pages": len(out), "ok": len(out) - len(reads), "read": len(reads)}, indent=1))
for o in [o for o in out if o.get("auto_check") == "READ"]:
    print(f'{o["rank"]:>3} {o["path"][:58]:58} kw={o["keyword_records"]:>3} old {o["old_keywords_answerable_pct"]!s:>3}% → new {o["keywords_answerable_pct"]!s:>3}%  lost={o["lost_vs_old_page"]} etv={o["lost_est_traffic"]}  {o["top_lost_keywords"][:150]}')
