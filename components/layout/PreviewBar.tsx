import { indexingEnabled } from "@/content/site";
import styles from "./PreviewBar.module.css";

/** Visible only on staging/preview deployments (when indexing is disabled). */
export function PreviewBar() {
  if (indexingEnabled) return null;
  return (
    <aside className={styles.bar} aria-label="Preview notice">
      <div className="container">
        <span className="label">Preview</span>
        <span>
          Staging build for Highland review — hidden from search engines. Business facts marked for confirmation are listed in the
          launch checklist.
        </span>
      </div>
    </aside>
  );
}
