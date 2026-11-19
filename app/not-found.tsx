import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={`container ${styles.wrap}`}>
      <p className="label eyebrow">404 · Not found</p>
      <h1 className={styles.h1}>
        This door doesn&rsquo;t open <em>onto anything.</em>
      </h1>
      <p className="lead">
        The page may have moved while Highland&rsquo;s site is being rebuilt. Try the collections, or get in touch and we&rsquo;ll point you the
        right way.
      </p>
      <div className={styles.ctas}>
        <Link href="/products/" className="btn">
          Browse collections <ArrowRight />
        </Link>
        <Link href="/contact-us/" className="btn btn--ghost">
          Contact us
        </Link>
      </div>
    </section>
  );
}
