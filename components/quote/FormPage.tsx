import type { ReactNode } from "react";
import { LeadForm } from "./LeadForm";
import type { LeadVariant } from "@/lib/leads";
import { contact, telHref } from "@/content/site";
import { Phone } from "@/components/ui/icons";
import styles from "./FormPage.module.css";

interface Props {
  variant: LeadVariant;
  source: string;
  path: string;
  status?: string;
  finishId?: string;
  side: ReactNode;
}

/** Two-column layout: guidance on the left, the form in a recessed panel on the right. */
export function FormPage({ variant, source, path, status, finishId, side }: Props) {
  return (
    <section className="section" aria-label="Form">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          {side}
          <div className={styles.call}>
            <p className="label muted">Prefer to talk?</p>
            <a href={telHref(contact.phone.value)} className={styles.phone}>
              <Phone /> {contact.phone.value}
            </a>
            <a href={`mailto:${contact.salesEmail.value}`} className={styles.mail}>
              {contact.salesEmail.value}
            </a>
          </div>
        </div>
        <div className={styles.formWrap}>
          <LeadForm variant={variant} source={source} returnTo={path} initialStatus={status} initialFinishId={finishId} />
        </div>
      </div>
    </section>
  );
}
