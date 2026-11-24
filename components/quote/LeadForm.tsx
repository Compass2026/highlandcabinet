"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { finishById, finishes, lineOrder, lines } from "@/content/collections";
import { contact, telHref } from "@/content/site";
import { formDefs, groupLabels, validateLead, type FieldDef, type LeadData, type LeadErrors, type LeadResult, type LeadVariant } from "@/lib/leads";
import { pushLeadEvent, readAttribution } from "@/lib/leadClient";
import { SampleCard } from "@/components/ui/SampleCard";
import { ArrowRight, Phone } from "@/components/ui/icons";
import styles from "./LeadForm.module.css";

interface Props {
  variant: LeadVariant;
  source: string;
  initialFinishId?: string;
  returnTo: string;
  /** Status from a no-JavaScript submission redirect (?status=…). */
  initialStatus?: string;
  onFinished?: () => void;
  /** Heading level for result headings, so they sit correctly in the page outline. */
  resultHeading?: "h2" | "h3";
}

type Phase = "editing" | "submitting" | "sent" | "not-configured" | "error";

export function LeadForm({ variant, source, initialFinishId, returnTo, initialStatus, onFinished, resultHeading = "h2" }: Props) {
  const def = formDefs[variant];
  const uid = useId();
  const [finishId, setFinishId] = useState(initialFinishId && finishById(initialFinishId) ? initialFinishId : "");
  const [values, setValues] = useState<LeadData>({});
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<Phase>(
    initialStatus === "sent" || initialStatus === "not-configured" || initialStatus === "error" ? (initialStatus as Phase) : "editing",
  );
  const [showSummary, setShowSummary] = useState(false);
  const [ref, setRef] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const finish = finishId ? finishById(finishId) : undefined;
  const H = resultHeading;

  const groups = useMemo(() => {
    const order: FieldDef["group"][] = ["project", "contact", "business", "details"];
    return order.map((g) => ({ g, fields: def.fields.filter((f) => f.group === g) })).filter((x) => x.fields.length);
  }, [def]);

  useEffect(() => {
    if (phase !== "editing" && phase !== "submitting") resultRef.current?.focus();
  }, [phase]);

  const set = (name: string, v: string) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (touched[name]) {
      const e = validateLead(variant, { ...values, [name]: v });
      setErrors((prev) => {
        const next = { ...prev };
        if (e[name]) next[name] = e[name];
        else delete next[name];
        return next;
      });
    }
  };

  const blur = (name: string) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const e = validateLead(variant, values);
    setErrors((prev) => {
      const next = { ...prev };
      if (e[name] && (values[name] ?? "") !== "") next[name] = e[name];
      else if (!e[name]) delete next[name];
      return next;
    });
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validateLead(variant, values);
    setErrors(e);
    setTouched(Object.fromEntries(def.fields.map((f) => [f.name, true])));
    if (Object.keys(e).length) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setPhase("submitting");
    const hp = (ev.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, finishId, formType: variant, source, page: window.location.pathname, website: hp, attribution: readAttribution() }),
      });
      const json = (await res.json()) as LeadResult;
      if (json.status === "invalid") {
        setErrors(json.errors);
        setPhase("editing");
        setShowSummary(true);
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else {
        if (json.status === "sent" && json.ref) {
          // Only a confirmed delivery counts as a conversion (Google Ads / GA4 / Meta via GTM).
          pushLeadEvent(variant, def.title);
          setRef(json.ref);
        }
        setPhase(json.status);
      }
    } catch {
      setPhase("error");
    }
  }

  const mailto = useMemo(() => {
    const lines_ = [
      `${def.title}${finish ? ` — ${finish.name} (${lines[finish.line].name})` : ""}`,
      "",
      ...def.fields.filter((f) => values[f.name]).map((f) => `${f.label}: ${values[f.name]}`),
    ];
    const subject = `${def.title}${finish ? `: ${finish.name}` : ""}`;
    return `mailto:${contact.salesEmail.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines_.join("\n"))}`;
  }, [def, finish, values]);

  // ---------- result states ----------
  if (phase === "sent") {
    return (
      <div ref={resultRef} tabIndex={-1} className={`${styles.result} ${styles.ok}`} role="status">
        <span className={`label ${styles.resultTag}`}>Received</span>
        <H className={styles.resultTitle}>Thank you — your request is with the Highland team.</H>
        <p>
          Someone from sales will follow up by phone or email{finish ? ` about ${finish.name}` : ""}. If it&rsquo;s urgent, call{" "}
          <a href={telHref(contact.phone.value)}>{contact.phone.value}</a>.
        </p>
        {ref ? <p className={styles.ref}>Reference {ref}</p> : null}
        {onFinished ? (
          <button type="button" className="btn btn--ghost" onClick={onFinished}>
            Close
          </button>
        ) : null}
      </div>
    );
  }

  if (phase === "not-configured") {
    return (
      <div ref={resultRef} tabIndex={-1} className={`${styles.result} ${styles.notice}`} role="status">
        <span className={`label ${styles.resultTag}`}>Preview limitation</span>
        <H className={styles.resultTitle}>This preview isn&rsquo;t connected to Highland&rsquo;s inbox yet.</H>
        <p>
          <strong>Your request has not been sent.</strong> Online submissions will be switched on once Highland confirms where leads
          should go. Until then you can send the same details by email or phone:
        </p>
        <div className={styles.resultActions}>
          <a className="btn" href={mailto}>
            Email this request <ArrowRight />
          </a>
          <a className="btn btn--ghost" href={telHref(contact.phone.value)}>
            <Phone /> {contact.phone.value}
          </a>
        </div>
        <button type="button" className={styles.textBtn} onClick={() => setPhase("editing")}>
          Back to the form
        </button>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div ref={resultRef} tabIndex={-1} className={`${styles.result} ${styles.err}`} role="alert">
        <span className={`label ${styles.resultTag}`}>Not sent</span>
        <H className={styles.resultTitle}>We couldn&rsquo;t send your request.</H>
        <p>
          Nothing was lost — your answers are still here. Try again, or call <a href={telHref(contact.phone.value)}>{contact.phone.value}</a>.
        </p>
        <div className={styles.resultActions}>
          <button type="button" className="btn" onClick={() => setPhase("editing")}>
            Return to the form
          </button>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors);
  let step = 0;

  return (
    <form className={styles.form} method="post" action="/api/lead/" noValidate onSubmit={onSubmit} aria-busy={phase === "submitting"}>
      <input type="hidden" name="formType" value={variant} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="source" value={source} />
      <div className={styles.hp} aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {initialStatus === "invalid" && !showSummary ? (
        <div className={styles.summary} role="alert">
          <p className={styles.summaryTitle}>Some required answers were missing — please complete the form and send it again.</p>
        </div>
      ) : null}

      {showSummary && errorList.length ? (
        <div ref={summaryRef} tabIndex={-1} className={styles.summary} role="alert" aria-labelledby={`${uid}-sum`}>
          <p id={`${uid}-sum`} className={styles.summaryTitle}>
            {errorList.length === 1 ? "One answer needs attention" : `${errorList.length} answers need attention`}
          </p>
          <ul>
            {errorList.map(([name, msg]) => (
              <li key={name}>
                <a href={`#${uid}-${name}`}>{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {variant === "quote" ? (
        <fieldset className={styles.group}>
          <legend className={styles.legend}>
            <span className="label">{String(++step).padStart(2, "0")}</span> Collection
          </legend>
          <div className={styles.collection}>
            {finish ? (
              <SampleCard finish={finish} size="sm" />
            ) : (
              <p className={styles.noFinish}>No collection selected yet — that&rsquo;s fine. Choose one, or leave it open.</p>
            )}
            <div className={styles.field}>
              <label htmlFor={`${uid}-finishId`} className={styles.lbl}>
                {finish ? "Change collection" : "Collection"} <span className={styles.opt}>(optional)</span>
              </label>
              <div className={styles.selectWrap}>
                <select id={`${uid}-finishId`} name="finishId" value={finishId} onChange={(e) => setFinishId(e.target.value)}>
                  <option value="">Not sure yet</option>
                  {lineOrder.map((l) => (
                    <optgroup key={l} label={lines[l].name}>
                      {finishes
                        .filter((f) => f.line === l)
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </fieldset>
      ) : null}

      {groups.map(({ g, fields }) => (
        <fieldset key={g} className={styles.group}>
          <legend className={styles.legend}>
            <span className="label">{String(++step).padStart(2, "0")}</span> {groupLabels[g]}
          </legend>
          <div className={styles.grid}>
            {fields.map((f) => (
              <Field key={f.name} f={f} id={`${uid}-${f.name}`} value={values[f.name] ?? ""} error={errors[f.name]} onChange={set} onBlur={blur} />
            ))}
          </div>
        </fieldset>
      ))}

      <div className={styles.submitRow}>
        <button type="submit" className={`btn ${styles.submit}`} disabled={phase === "submitting"}>
          {phase === "submitting" ? (
            <>
              <span className={styles.progress} aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              {def.submit} <ArrowRight />
            </>
          )}
        </button>
        <p className={styles.fine}>
          Required fields are marked <span aria-hidden="true">*</span>
          <span className="visually-hidden">with an asterisk</span>. We use your details only to respond to this request.
        </p>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {phase === "submitting" ? "Sending your request" : ""}
      </p>
    </form>
  );
}

function Field({
  f,
  id,
  value,
  error,
  onChange,
  onBlur,
}: {
  f: FieldDef;
  id: string;
  value: string;
  error?: string;
  onChange: (n: string, v: string) => void;
  onBlur: (n: string) => void;
}) {
  const hintId = f.hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: f.name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    required: f.required,
    onBlur: () => onBlur(f.name),
  } as const;
  const req = f.required ? <span className={styles.req} aria-hidden="true">*</span> : <span className={styles.opt}>(optional)</span>;

  if (f.type === "radio") {
    return (
      <fieldset className={`${styles.field} ${styles.full}`} aria-describedby={describedBy} id={id} tabIndex={-1}>
        <legend className={styles.lbl}>
          {f.label} {req}
        </legend>
        <div className={styles.radios}>
          {f.options!.map((o) => (
            <label key={o} className={styles.radio}>
              <input type="radio" name={f.name} value={o} checked={value === o} onChange={() => onChange(f.name, o)} onBlur={() => onBlur(f.name)} required={f.required} />
              <span>{o}</span>
            </label>
          ))}
        </div>
        {error ? (
          <p id={errId} className={styles.error}>
            {error}
          </p>
        ) : null}
      </fieldset>
    );
  }

  return (
    <div className={`${styles.field} ${f.half ? "" : styles.full}`} data-invalid={error ? "" : undefined}>
      <label htmlFor={id} className={styles.lbl}>
        {f.label} {req}
      </label>
      {f.hint ? (
        <p id={hintId} className={styles.hint}>
          {f.hint}
        </p>
      ) : null}
      {f.type === "select" ? (
        <div className={styles.selectWrap}>
          <select {...common} value={value} onChange={(e) => onChange(f.name, e.target.value)}>
            <option value="">Select…</option>
            {f.options!.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      ) : f.type === "textarea" ? (
        <textarea {...common} rows={4} maxLength={f.maxLength} value={value} onChange={(e) => onChange(f.name, e.target.value)} />
      ) : (
        <input
          {...common}
          type={f.type === "number" ? "text" : f.type}
          inputMode={f.inputMode}
          autoComplete={f.autoComplete}
          maxLength={f.maxLength}
          value={value}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      )}
      {error ? (
        <p id={errId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
