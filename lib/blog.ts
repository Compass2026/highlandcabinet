import data from "@/content/blog/posts.json";

/**
 * Blog posts restored from the previous site (WordPress REST export), at their original
 * /blog/<slug>/ paths. HTML was sanitised to a small allow-list at import; Highland-specific
 * claims the catalogs don't support were corrected (log: docs/migration/wp/blog-audit.json).
 */
export interface Post {
  slug: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  html: string;
  cover: { src: string; width: number; height: number; alt: string } | null;
}

export const posts = data as Post[];
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 230));
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Phoenix" });

/** Posts that share the most title words — a simple, deterministic "related" list. */
export function relatedTo(post: Post, n = 3) {
  const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const mine = words(post.title);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: [...words(p.title)].filter((w) => mine.has(w)).length }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, n)
    .map((x) => x.p);
}

/** Posts without a usable cover (AI-generated or broken originals) borrow a Highland rendering. */
const fallbacks = ["scene-shaker-white", "scene-euro-white-oak", "scene-nano-green", "scene-shaker-luxe", "scene-euro-stone-grey", "scene-shaker-signature-blue"];
export function fallbackScene(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return fallbacks[h % fallbacks.length];
}
