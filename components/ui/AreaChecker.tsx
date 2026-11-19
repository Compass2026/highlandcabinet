"use client";

import { useId, useState } from "react";
import { serviceStates } from "@/content/locations";
import { QuoteButton } from "@/components/quote/QuoteButton";
import styles from "./AreaChecker.module.css";

export function AreaChecker({ initial }: { initial?: string }) {
  const id = useId();
  const valid = serviceStates.some((s) => s.slug === initial);
  const [state, setState] = useState(valid ? initial! : "");
  const s = serviceStates.find((x) => x.slug === state);

  return (
    <div className={styles.box}>
      <label htmlFor={id} className={styles.lbl}>
        Where is your project?
      </label>
      <div className={styles.selectWrap}>
        <select id={id} value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Choose a state…</option>
          {serviceStates.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.result} aria-live="polite">
        {s ? (
          <>
            <p className={styles.state}>{s.name}</p>
            {s.slug === "arizona" ? (
              <p>
                Arizona projects can be picked up at the Phoenix warehouse or delivered on Highland&rsquo;s own truck or by carrier. Your
                account manager will confirm the best option for the job site.
              </p>
            ) : (
              <p>
                Highland works with trade customers and dealers in {s.name} by delivery and freight from Phoenix. Options, timing and cost
                depend on the destination — send your project location with a quote request and we&rsquo;ll confirm them.
              </p>
            )}
            <QuoteButton source={`service-area:${s.slug}`} className="btn">
              Request a quote for {s.name}
            </QuoteButton>
          </>
        ) : (
          <p className={styles.placeholder}>Select a state to see how Highland supplies projects there.</p>
        )}
      </div>
    </div>
  );
}
