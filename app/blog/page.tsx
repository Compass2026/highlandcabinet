import { PageIntro } from "@/components/ui/PageIntro";
import { PostCard } from "@/components/blog/PostCard";
import { ClosingCta } from "@/components/home/Sections";
import { posts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/blog/Blog.module.css";

export const metadata = pageMetadata({
  title: "Kitchen Cabinet Guides & Ideas — Highland Cabinetry Blog",
  description: "Guides on cabinet sizes, materials, styles, costs and installation from Highland Cabinetry, a wholesale supplier of Shaker, Nano and Euro cabinets.",
  path: "/blog/",
});

export default function BlogIndex() {
  const [lead, ...rest] = posts;
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Blog", href: "/blog/" }]} eyebrow="Blog" title={<>Cabinet guides <em>for builders and remodelers.</em></>}>
        <p className="lead">Sizes, materials, styles, costs and installation — {posts.length} articles from Highland Cabinetry.</p>
      </PageIntro>
      <section className="section--tight">
        <div className="container">
          <div className={styles.leadPost}>
            <PostCard post={lead} sizes="(max-width: 900px) 100vw, 60vw" />
          </div>
          <ul className={styles.grid}>
            {rest.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ClosingCta source="blog-index" />
    </>
  );
}
