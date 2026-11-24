import Image from "next/image";
import Link from "next/link";
import { media } from "@/lib/media";
import { fallbackScene, formatDate, type Post } from "@/lib/blog";
import styles from "./Blog.module.css";

export function PostCard({ post, sizes = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" }: { post: Post; sizes?: string }) {
  const fb = post.cover ? null : media(fallbackScene(post.slug));
  const src = post.cover?.src ?? fb!.src;
  return (
    <Link href={`/blog/${post.slug}/`} className={styles.card}>
      <span className={styles.cardImg}>
        <Image src={src} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
      </span>
      <span className={styles.cardBody}>
        <span className={styles.cardDate}>{formatDate(post.date)}</span>
        <span className={styles.cardTitle}>{post.title}</span>
        <span className={styles.cardExcerpt}>{post.excerpt.replace(/\s*…\s*$/, "…")}</span>
      </span>
    </Link>
  );
}
