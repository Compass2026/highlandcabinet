"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuote } from "./QuoteContext";
import { LeadForm } from "./LeadForm";
import { Close } from "@/components/ui/icons";
import styles from "./QuoteDrawer.module.css";

/**
 * The quote panel — a drawer that glides out on its runners and settles, soft-close style.
 * Built on <dialog> for native focus containment, Escape handling and an inert background.
 */
export default function QuoteDrawer() {
  const { isOpen, close, context, opener } = useQuote();
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [instance, setInstance] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) {
      setInstance((n) => n + 1);
      setClosing(false);
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!isOpen && d.open) {
      setClosing(true);
      const finish = () => {
        d.close();
        setClosing(false);
        document.documentElement.style.overflow = "";
        if (opener?.isConnected) opener.focus();
      };
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = window.setTimeout(finish, reduce ? 0 : 380);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, opener]);

  // Close if the route changes underneath (e.g. a link inside the result panel).
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      close();
    }
  }, [pathname, close]);

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      data-closing={closing ? "" : undefined}
      aria-labelledby="quote-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <span className={styles.pull} aria-hidden="true" />
          <div>
            <p className="label muted">Highland Cabinetry</p>
            <h2 id="quote-title" className={styles.title}>
              Request a quote
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={close}>
            <Close />
            <span className="visually-hidden">Close quote request</span>
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.intro}>
            Tell us about the project. A member of Highland&rsquo;s sales team will follow up with pricing and availability.
          </p>
          <LeadForm
            key={instance}
            variant="quote"
            source={context?.source ?? "drawer"}
            initialFinishId={context?.finishId}
            returnTo="/request-a-quote/"
            onFinished={close}
            resultHeading="h3"
          />
        </div>
      </div>
    </dialog>
  );
}
