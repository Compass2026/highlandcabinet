import styles from "./FactStrip.module.css";

/** Only facts stated consistently in Highland's June 2025 catalogs. No delivery or inventory claims. */
const facts = [
  { k: "3", t: "cabinet lines", d: "Shaker, Nano and Euro (frameless)" },
  { k: "13", t: "finishes", d: "Painted, stained, laminate and PET" },
  { k: "½″", t: "solid wood drawer sides", d: "Dovetailed, on soft-close undermount glides — Shaker & Nano" },
  { k: "3 PM", t: "Arizona order cut-off", d: "For same-day processing, Monday–Friday" },
];

export function FactStrip() {
  return (
    <section aria-label="At a glance" className={styles.strip}>
      <dl className={`container ${styles.list}`}>
        {facts.map((f) => (
          <div key={f.t} className={styles.item}>
            <dt>
              <span className={styles.k}>{f.k}</span> <span className={styles.t}>{f.t}</span>
            </dt>
            <dd>{f.d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
