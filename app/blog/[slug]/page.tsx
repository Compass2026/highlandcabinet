import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PostCard } from "@/components/blog/PostCard";
import { ClosingCta } from "@/components/home/Sections";
import { fallbackScene, formatDate, postBySlug, posts, readingMinutes, relatedTo } from "@/lib/blog";
import { kindLabel, media } from "@/lib/media";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/content/site";
import styles from "@/components/blog/Blog.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

const clean = (s?: string | null) => (s ? s.replace(/\s*[-|–]\s*Highland Cabinetry\s*$/i, "").trim() : undefined);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: clean(p.seoTitle) ?? p.title,
    description: p.seoDescription ?? p.excerpt.slice(0, 160),
    path: `/blog/${p.slug}/`,
    image: p.cover?.src ?? media(fallbackScene(p.slug)).src,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  const fb = post.cover ? null : media(fallbackScene(post.slug));
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    author: { "@type": "Organization", name: "Highland Cabinetry" },
    publisher: { "@type": "Organization", name: "Highland Cabinetry" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}/`,
    image: `${siteUrl}${post.cover?.src ?? fb!.src}`,
  };
  return (
    <>
      <article className={styles.article}>
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog/" },
              { label: post.title, href: `/blog/${post.slug}/` },
            ]}
          />
          <header className={styles.head}>
            <p className={styles.meta}>
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {readingMinutes(post.html)} min read
            </p>
            <h1 className={styles.title}>{post.title}</h1>
          </header>
          <figure className={styles.cover}>
            <span className={styles.coverImg}>
              {post.cover ? (
                <Image src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} sizes="(max-width: 1100px) 100vw, 1100px" priority />
              ) : (
                <Image src={fb!.src} alt={fb!.alt} width={fb!.width} height={fb!.height} sizes="(max-width: 1100px) 100vw, 1100px" priority />
              )}
            </span>
            {fb ? <figcaption className={styles.coverCap}>{kindLabel[fb.kind]} · Highland Cabinetry</figcaption> : null}
          </figure>
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className={styles.cta} role="group" aria-label="Request a quote">
            <p className={styles.ctaTitle}>Pricing a kitchen or bath?</p>
            <p>
              Highland supplies Shaker, Nano and Euro cabinets to builders, contractors, remodelers and dealers — including{" "}
              <Link href="/wholesale-white-shaker-cabinets/">White Shaker</Link>, <Link href="/wholesale-gray-shaker-cabinets/">Grey Shaker</Link> and{" "}
              <Link href="/wholesale-signature-blue-shaker-cabinets/">Signature Blue</Link>.
            </p>
            <div className={styles.ctaLinks}>
              <Link href="/request-a-quote/" className="btn">
                Request a quote
              </Link>
              <Link href="/products/" className="btn btn--ghost">
                Browse collections
              </Link>
            </div>
          </div>
        </div>
      </article>
      <section className="section--tight" aria-labelledby="related-title">
        <div className="container">
          <h2 id="related-title" className={styles.relatedTitle}>
            Keep reading
          </h2>
          <ul className={styles.grid}>
            {relatedTo(post).map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ClosingCta source={`blog-${post.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
    </>
  );
}
