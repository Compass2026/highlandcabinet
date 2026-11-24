import { leadEvent } from "@/content/tracking";

/** Push the lead event GTM listens for. Called only after the server confirms delivery. */
export function pushLeadEvent(formId: string, formName: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: leadEvent, form_id: formId, form_name: formName });
}

/** First and latest campaign touch captured by the inline script, for inclusion with a lead. */
export function readAttribution(): string {
  try {
    const first = localStorage.getItem("hc_first");
    const last = localStorage.getItem("hc_last");
    return JSON.stringify({ first: first ? JSON.parse(first) : null, last: last ? JSON.parse(last) : null });
  } catch {
    return "";
  }
}
