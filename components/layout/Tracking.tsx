import { indexingEnabled, siteUrl } from "@/content/site";
import { attributionParams, tracking } from "@/content/tracking";

/**
 * One small inline script, run on every page:
 *
 * 1. Attribution (always): keeps the first and the latest campaign touch (gclid, utm_*, referrer,
 *    landing page) in localStorage so a lead can carry it. Nothing leaves the browser until the
 *    visitor submits a form.
 * 2. Tags (production only): loads the previous site's Google Tag Manager containers, Google tag and
 *    CallRail number swapping — but only when the page is actually served from the canonical host,
 *    so staging, previews and *.vercel.app never send hits. Loaded after the page has finished
 *    loading so they do not compete with first paint.
 */
export function Tracking() {
  const config = {
    on: indexingEnabled && process.env.NEXT_PUBLIC_TRACKING !== "off",
    host: new URL(siteUrl).hostname,
    params: attributionParams,
    gtm: tracking.gtmContainers,
    gtag: tracking.googleTag,
    callrail: tracking.callRailSwapScript,
  };
  const js = `(function(C){
var w=window,d=document,ls;try{ls=w.localStorage}catch(e){}
try{var q=new URLSearchParams(location.search),p={},n=0;
C.params.forEach(function(k){var v=q.get(k);if(v){p[k]=v.slice(0,300);n++}});
var r=d.referrer,ext=r&&r.indexOf(location.origin)!==0;
if(ls&&(n||ext||!ls.getItem("hc_first"))){var t=JSON.stringify({params:p,landing:location.pathname,referrer:ext?r.slice(0,300):"",at:new Date().toISOString()});
var f=ls.getItem("hc_first"),old=false;try{old=!f||Date.now()-Date.parse(JSON.parse(f).at)>7776e6}catch(e){old=true}
if(old)ls.setItem("hc_first",t);if(n||ext)ls.setItem("hc_last",t)}}catch(e){}
if(!C.on||location.hostname!==C.host)return;
w.dataLayer=w.dataLayer||[];function gtag(){w.dataLayer.push(arguments)}w.gtag=w.gtag||gtag;
function s(src){var e=d.createElement("script");e.async=true;e.src=src;d.head.appendChild(e)}
function go(){gtag("js",new Date());gtag("config",C.gtag.id);C.gtag.alsoConfigure.forEach(function(i){gtag("config",i)});
s("https://www.googletagmanager.com/gtag/js?id="+C.gtag.id);
C.gtm.forEach(function(i){w.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});s("https://www.googletagmanager.com/gtm.js?id="+i)});
if(C.callrail)s(C.callrail)}
if(d.readyState==="complete")go();else w.addEventListener("load",go)
})(${JSON.stringify(config)});`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
