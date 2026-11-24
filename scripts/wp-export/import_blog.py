import json, re, hashlib, os, html, subprocess, urllib.parse
from bs4 import BeautifulSoup, NavigableString, Comment

BASE = 'https://highlandcabinetry.com'
posts = json.load(open('posts.json'))
featured = {m['id']: m for m in json.load(open('featured.json'))}
DL = 'blog/dl'

def orig(url):
    url = url.split('?')[0]
    return re.sub(r'-\d+x\d+(?=\.\w+$)', '', url)

def fetch(url):
    p = urllib.parse.urlsplit(url)
    qurl = urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(urllib.parse.unquote(p.path)), '', ''))
    fn = os.path.join(DL, hashlib.sha1(url.encode()).hexdigest()[:16] + os.path.splitext(urllib.parse.urlparse(url).path)[1].lower())
    if not os.path.exists(fn) or os.path.getsize(fn) == 0:
        subprocess.run(['curl', '-sL', '-m', '90', '-A', 'Mozilla/5.0', '--globoff', qurl, '-o', fn])
    return fn

ALLOWED = {'p','h2','h3','h4','ul','ol','li','strong','em','b','i','a','img','figure','figcaption','table','thead','tbody','tr','td','th','blockquote','br'}
out = []
images = []
for x in posts:
    slug = x['slug']
    soup = BeautifulSoup(x['content']['rendered'], 'lxml')
    body = soup.body or soup
    for t in body(['script', 'style', 'svg', 'noscript', 'iframe', 'form']): t.decompose()
    for c in body.find_all(string=lambda s: isinstance(s, Comment)): c.extract()
    for t in body.select('.wp-block-spacer'): t.decompose()
    # UAGB / buttons → plain links
    for a in body.select('a.wp-block-button__link, a.uagb-marketing-btn__link'):
        txt = a.get_text(' ', strip=True)
        a.clear(); a.append(txt)
    # h1/h5/h6 → h2/h4
    for h in body.find_all('h1'): h.name = 'h2'
    for h in body.find_all(['h5', 'h6']): h.name = 'h4'
    n = 0
    for img in body.find_all('img'):
        src = img.get('data-src') or img.get('src') or ''
        if not src or src.startswith('data:'): img.decompose(); continue
        src = src.replace('highlandcabinetry.comwp-content', 'highlandcabinetry.com/wp-content')
        if not src.startswith('http'): src = BASE + '/' + src.lstrip('/')
        o = orig(src)
        n += 1
        images.append({'slug': slug, 'n': n, 'url': o, 'alt': img.get('alt', '').strip()})
        img.attrs = {'data-img': '%s-%d' % (slug, n), 'alt': img.get('alt', '').strip()}
    # strip attributes / unwrap disallowed
    for el in list(body.find_all(True)):
        if el.name not in ALLOWED:
            el.unwrap(); continue
        if el.name == 'a':
            href = (el.get('href') or '').strip()
            if href.startswith(BASE): href = href[len(BASE):] or '/'
            if href.startswith('http') and 'highlandcabinetry.com' in href: href = re.sub(r'^https?://(www\.)?highlandcabinetry\.com', '', href) or '/'
            el.attrs = {'href': href} if href and href != '#' else {}
            if not el.attrs: el.unwrap()
        elif el.name == 'img': pass
        elif el.name in ('td', 'th'):
            keep = {k: v for k, v in el.attrs.items() if k in ('colspan', 'rowspan')}
            el.attrs = keep
        else:
            el.attrs = {}
    # drop empty paragraphs
    for p in body.find_all('p'):
        if not p.get_text(strip=True).replace('\xa0', '') and not p.find('img'): p.decompose()
    htmlout = ''.join(str(c) for c in body.contents).strip()
    htmlout = re.sub(r'\n{3,}', '\n\n', htmlout).replace('&nbsp;', ' ')
    fm = featured.get(x['featured_media'])
    yo = x.get('yoast_head_json') or {}
    out.append({
        'slug': slug,
        'title': html.unescape(re.sub(r'<[^>]+>', '', x['title']['rendered'])).strip(),
        'date': x['date'], 'modified': x['modified'],
        'excerpt': html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', x['excerpt']['rendered']))).replace('[…]', '…').strip(),
        'seoTitle': yo.get('title'), 'seoDescription': yo.get('description'),
        'featured': {'url': fm['source_url'], 'alt': fm.get('alt_text', '')} if fm else None,
        'html': htmlout,
    })
    if fm: images.append({'slug': slug, 'n': 0, 'url': fm['source_url'], 'alt': fm.get('alt_text', '')})

json.dump(out, open('blog/posts.clean.json', 'w'), indent=1, ensure_ascii=False)
json.dump(images, open('blog/images.json', 'w'), indent=1)
urls = sorted(set(i['url'] for i in images))
print('posts', len(out), 'image refs', len(images), 'unique', len(urls))
for u in urls: fetch(u)
bad = [u for u in urls if not os.path.exists(os.path.join(DL, hashlib.sha1(u.encode()).hexdigest()[:16] + os.path.splitext(urllib.parse.urlparse(u).path)[1].lower())) or os.path.getsize(os.path.join(DL, hashlib.sha1(u.encode()).hexdigest()[:16] + os.path.splitext(urllib.parse.urlparse(u).path)[1].lower())) < 2000]
print('failed downloads', len(bad), bad[:5])
