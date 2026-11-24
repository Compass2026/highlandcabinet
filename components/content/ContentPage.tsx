import type { ReactNode } from "react";
import { indexingEnabled } from "@/content/site";
import styles from "./ContentPage.module.css";

/** A long-form page: a reading column with optional preview-only review note. */
export function ContentBody({ children, review }: { children: ReactNode; review?: string }) {
  return (
    <section className="section--tight">
      <div className="container">
        {!indexingEnabled && review ? (
          <p className={styles.review}>
            <strong>Preview only · review needed.</strong> {review}
          </p>
        ) : null}
        <div className={styles.prose}>{children}</div>
      </div>
    </section>
  );
}
