import json,re,collections
from bs4 import BeautifulSoup
P=json.load(open('allpages.json'))
scores={r[0]:r for r in json.load(open('sa_scores.json'))['rows']}
def strings_after(h, stop_tags=('h2',)):
    out=[]
    for el in h.next_elements:
        if getattr(el,'name',None) in stop_tags and el is not h: break
        if isinstance(el,str):
            t=el.strip()
            if t and not (el.parent and el.parent.name in ('script','style')): out.append(t)
    return out
CLAIMS=[('20,000+ kitchens in stock',r'20,000'),('5-star Google reviews',r'5-Star Google'),('“thousands of contractors”',r'thousands of'),('unattributed testimonial',r'— Licensed General Contractor'),('savings tiers 10–20%',r'Up to 1[05]%|up to 10–20%'),('installation offered',r'Installation is an additional service'),('3D renderings included',r'3D renderings'),('no minimum order',r'No minimum order'),('“imported RTA / manufacturer-direct”',r'import RTA|Imported RTA'),('outdated phone 480-755-2280',r'480-755-2280'),('typo “Highlend”',r'Highlend'),('retired finishes (Uptown/Delta Green/Arctic White)',r'Uptown White|Delta Green|Arctic White'),('“largest in-stock” claim',r'largest'),('delivery-time promise',r'\d+\s*[-–]\s*\d+\s*days|\d+\s*DAYS')]
out={}
for x in P:
    link=x['link'].replace('https://highlandcabinetry.com','')
    if not link.startswith('/wholesale-cabinets/') or link=='/wholesale-cabinets/': continue
    parts=[p for p in link.strip('/').split('/')][1:]
    s=BeautifulSoup(x['content']['rendered'],'lxml')
    for t in s(['script','style','svg','noscript']): t.decompose()
    text=re.sub(r'\s+',' ',s.get_text(' '))
    areas=[]; fac=[]
    for h in s.find_all('h2'):
        ht=h.get_text(' ',strip=True)
        if re.search(r'(Areas|Cities) we Serve',ht,re.I):
            areas=[t for t in strings_after(h) if t!=ht and len(t)<40]
        if 'Facilities and Services' in ht:
            items=[t for t in strings_after(h,()) if t!=ht]
            # group: name lines followed by address/phone line(s)
            cur=None
            for t in items:
                if re.search(r'\d{3}\)?[-\s.]?\d{3}[-.]\d{4}',t) or re.search(r'\d+ .*(St|Street|Ave|Avenue|Rd|Road|Blvd|Drive|Dr|Way|Plaza|Pl|Suite)',t):
                    if cur is None: continue
                    cur['detail']=(cur.get('detail','')+'\n'+t).strip()
                else:
                    if cur and 'detail' not in cur: cur['name']+=' '+t; continue
                    cur={'name':t}; fac.append(cur)
            fac=[f for f in fac if f.get('detail')]
    flags=[name for name,pat in CLAIMS if re.search(pat,text)]
    sc=scores.get(link)
    issues=[]
    if sc and sc[2]<150: issues.append('thin: template text with ~%d words unique to this page'%sc[2])
    if 'old' in link: issues.append('duplicate/outdated copy')
    if link.endswith('/san-diego/') and 'greater LA area' in text: issues.append('wrong metro in delivery line (says greater LA)')
    out[link]={'state':parts[0],'city':parts[1] if len(parts)>1 else None,'title':re.sub(r'<[^>]+>','',x['title']['rendered']),
      'modified':x['modified'],'areas':areas,'facilities':fac,'sourceClaimsRemoved':flags,'issues':issues,
      'words':sc[1] if sc else None,'uniqueWords':sc[2] if sc else None,
      'seoTitle':(x.get('yoast_head_json') or {}).get('title'),'seoDescription':(x.get('yoast_head_json') or {}).get('description')}
json.dump(out,open('sa_extract.json','w'),indent=1,ensure_ascii=False)
import collections
print(len(out), 'with areas',sum(1 for v in out.values() if v['areas']),'with facilities',sum(1 for v in out.values() if v['facilities']))
print(out['/wholesale-cabinets/texas/dallas/']['facilities'], out['/wholesale-cabinets/texas/']['areas'][:8])
print(collections.Counter(f for v in out.values() for f in v['sourceClaimsRemoved']))
print([k for k,v in out.items() if not v['areas']][:10])
