"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { LeadForm } from "@/components/quote/LeadForm";
import type { LeadVariant } from "@/lib/leads";
import styles from "./Showroom.module.css";

const tabs: { variant: LeadVariant; label: string; intro: string; returnTo: string }[] = [
  {
    variant: "dealer-application",
    label: "Become a dealer",
    intro: "Homebuilders, contractors and suppliers: tell us about your business and the sales team will talk you through the program.",
    returnTo: "/become-a-dealer/",
  },
  {
    variant: "dealer-referral",
    label: "Find a dealer",
    intro: "Planning your own kitchen or bath? Highland sells through the trade — send your ZIP code and we’ll point you to a dealer.",
    returnTo: "/find-a-dealer/",
  },
];

/** Two forms behind one accessible tab control (arrow keys move between tabs). */
export function DealerDesk() {
  const id = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const n = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  const t = tabs[active];
  return (
    <div className={styles.desk}>
      <div role="tablist" aria-label="What would you like to do?" className={styles.tabs} onKeyDown={onKey}>
        {tabs.map((tab, i) => (
          <button
            key={tab.variant}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
        <span className={styles.tabInk} style={{ transform: `translateX(${active * 100}%)` }} aria-hidden="true" />
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} className={styles.panel}>
        <p className={styles.panelIntro}>{t.intro}</p>
        <LeadForm key={t.variant} variant={t.variant} source={`home-${t.variant}`} returnTo={t.returnTo} resultHeading="h3" />
      </div>
    </div>
  );
}
