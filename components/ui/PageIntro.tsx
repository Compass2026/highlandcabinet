import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

export function PageIntro({ eyebrow, title, children, aside }: { eyebrow: string; title: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className={styles.intro}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.main}>
          <p className="label eyebrow">{eyebrow}</p>
          <h1 className={styles.h1}>{title}</h1>
          {children ? <div className={styles.body}>{children}</div> : null}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
      <hr className="reveal" />
    </header>
  );
}
