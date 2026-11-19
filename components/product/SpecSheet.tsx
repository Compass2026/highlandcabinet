import type { Line } from "@/content/collections";
import styles from "./SpecSheet.module.css";

/** A specification sheet: registration marks, numbered rows, and the source printed at the foot. */
export function SpecSheet({ line, headingId, extraRows = [] }: { line: Line; headingId: string; extraRows?: { label: string; value: string }[] }) {
  return (
    <div className={`${styles.sheet} marks`}>
      <span className="marks__b" aria-hidden="true" />
      <div className={styles.head}>
        <h2 id={headingId} className={styles.title}>
          Specifications
        </h2>
        <span className="label muted">
          {line.name} line · {line.construction}
        </span>
      </div>
      <dl className={styles.list}>
        {extraRows.map((r) => (
          <div key={r.label} className={styles.row}>
            <dt>
              <span className={styles.n} aria-hidden="true">
                —
              </span>
              {r.label}
            </dt>
            <dd>{r.value}</dd>
          </div>
        ))}
        {line.specs.map((r, i) => (
          <div key={r.label} className={styles.row}>
            <dt>
              <span className={styles.n} aria-hidden="true">
                {String(r.callout ?? i + 1).padStart(2, "0")}
              </span>
              {r.label}
            </dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
      {line.specNotes.map((n) => (
        <p key={n} className={styles.note}>
          {n}
        </p>
      ))}
      <p className={styles.source}>
        <span className="label">Source</span> {line.specSource}. Highland may change specifications without notice; confirm current details with your
        account manager.
      </p>
    </div>
  );
}
