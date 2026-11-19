import Image from "next/image";
import Link from "next/link";
import type { Finish } from "@/content/collections";
import { lines } from "@/content/collections";
import { media } from "@/lib/media";
import styles from "./SampleCard.module.css";

interface Props {
  finish: Finish;
  /** Link the whole card to the collection page. */
  href?: string;
  size?: "sm" | "md";
  className?: string;
  as?: "div" | "li";
  headingLevel?: "h2" | "h3" | "p";
}

/**
 * A finish sample identification card — the tag punched and hung on a ring in a design studio.
 * The chip is a crop of Highland's own product rendering; colour is never altered.
 */
export function SampleCard({ finish, href, size = "md", className, as = "div", headingLevel = "p" }: Props) {
  const chip = media(finish.media.chip);
  const Tag = as;
  const H = headingLevel;
  const body = (
    <>
      <span className={styles.hole} aria-hidden="true" />
      <span className={styles.chip}>
        <Image src={chip.src} alt="" width={chip.width} height={chip.height} sizes={size === "sm" ? "96px" : "200px"} />
      </span>
      <span className={styles.meta}>
        <span className={`code ${styles.code}`}>{finish.code}</span>
        <H className={styles.name}>{finish.name}</H>
        <span className={styles.spec}>
          {lines[finish.line].name} · {finish.finishType}
        </span>
      </span>
    </>
  );
  return (
    <Tag className={`${styles.card} ${styles[size]} ${className ?? ""}`}>
      {href ? (
        <Link href={href} className={styles.link}>
          {body}
        </Link>
      ) : (
        <div className={styles.link}>{body}</div>
      )}
    </Tag>
  );
}
