import json, re, html
import runpy, os; _e = runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), "edits.py")); E, LINKS = _e["E"], _e["LINKS"]
posts = json.load(open('blog/posts.clean.json'))
imgs = json.load(open('blog/images.json'))
by = {(i['slug'], i['n']): i for i in imgs}
log = {}
for p in posts:
    s = p['slug']; h = p['html']; L = log.setdefault(s, {'edits': [], 'imagesRemoved': [], 'imagesFlagged': []})
    for slug, old, new in E:
        if slug != s: continue
        if old not in h: raise SystemExit('EDIT NOT FOUND: %s :: %s' % (s, old[:80]))
        h = h.replace(old, new); L['edits'].append({'from': html.unescape(re.sub(r'<[^>]+>', '', old)).strip(), 'to': html.unescape(re.sub(r'<[^>]+>', '', new)).strip()})
    def relink(m):
        href = m.group(1); return 'href="%s"' % LINKS.get(href, href)
    h = re.sub(r'href="([^"]+)"', relink, h)
    def img(m):
        key = m.group(1); slug, n = key.rsplit('-', 1); i = by.get((slug, int(n)))
        if not i or not i.get('out'):
            if i: L['imagesRemoved'].append({'url': i['url'], 'reason': i['aiEvidence'] or 'download failed (broken on live site)'})
            return ''
        if i['aiSize']: L['imagesFlagged'].append({'url': i['url'], 'reason': 'AI-generator dimensions %dx%d, no camera data' % (i['w'], i['h'])})
        alt = html.escape(i['alt'] or '', quote=True)
        o = i['out']
        return '<img src="%s" width="%d" height="%d" alt="%s" loading="lazy" decoding="async">' % (o['src'], o['width'], o['height'], alt)
    h = re.sub(r'<img alt="[^"]*" data-img="([^"]+)"/?>', img, h)
    h = re.sub(r'<img data-img="([^"]+)" alt="[^"]*"/?>', img, h)
    h = re.sub(r'<figure>\s*(<figcaption>.*?</figcaption>)?\s*</figure>', '', h, flags=re.S)
    h = re.sub(r'<p>\s*</p>', '', h)
    p['html'] = h
    fi = by.get((s, 0))
    if fi and fi.get('out'):
        p['cover'] = {'src': fi['out']['src'], 'width': fi['out']['width'], 'height': fi['out']['height'], 'alt': fi['alt']}
        if fi['aiSize']: L['imagesFlagged'].append({'url': fi['url'], 'reason': 'cover: AI-generator dimensions, no camera data'})
    else:
        p['cover'] = None
        if fi: L['imagesRemoved'].append({'url': fi['url'], 'reason': 'cover: ' + (fi['aiEvidence'] or 'download failed')})
    p.pop('featured', None)
# residual scan
pat = re.compile(r'7\s*(to|-|–)\s*9\s*(business\s*)?days|all[- ]wood|since 2018|semi-custom|soft-close doors', re.I)
resid = [(p['slug'], m.group(0)) for p in posts for m in pat.finditer(re.sub(r'<[^>]+>', ' ', p['html'])) ]
print('residual pattern hits (review):', resid)
assert '<img data-img' not in ''.join(p['html'] for p in posts)
posts.sort(key=lambda p: p['date'], reverse=True)
json.dump(posts, open('/home/user/highlandcabinet/content/blog/posts.json', 'w'), indent=1, ensure_ascii=False)
json.dump(log, open('/home/user/highlandcabinet/docs/migration/wp/blog-audit.json', 'w'), indent=1, ensure_ascii=False)
print('posts', len(posts), 'edits', sum(len(v['edits']) for v in log.values()), 'images removed', sum(len(v['imagesRemoved']) for v in log.values()), 'flagged', sum(len(v['imagesFlagged']) for v in log.values()), 'no cover', sum(1 for p in posts if not p['cover']))
