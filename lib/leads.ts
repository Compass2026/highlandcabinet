/**
 * Lead forms: field definitions and validation shared by the browser and the API route.
 * Field set derived from the public forms preserved in the archive (Contact / Get a Free
 * Quote, Become a Dealer, Find a Dealer), reorganised so the selected collection leads.
 */
export type LeadVariant = "quote" | "dealer-application" | "dealer-referral" | "contact";

export type FieldType = "text" | "email" | "tel" | "select" | "radio" | "textarea" | "number";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  hint?: string;
  group: "project" | "contact" | "business" | "details";
  half?: boolean;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength?: number;
}

export const customerTypes = [
  "General contractor",
  "Builder / developer",
  "Remodeler",
  "Flipper / real-estate investor",
  "Cabinet dealer / supplier",
  "Multifamily",
  "Designer",
  "Homeowner looking for a dealer",
  "Other",
];

const contactFields: FieldDef[] = [
  { name: "firstName", label: "First name", type: "text", required: true, autoComplete: "given-name", group: "contact", half: true, maxLength: 80 },
  { name: "lastName", label: "Last name", type: "text", required: true, autoComplete: "family-name", group: "contact", half: true, maxLength: 80 },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", group: "contact", half: true, inputMode: "email", maxLength: 160 },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", group: "contact", half: true, inputMode: "tel", maxLength: 40 },
];

export const formDefs: Record<LeadVariant, { title: string; submit: string; fields: FieldDef[] }> = {
  quote: {
    title: "Request a quote",
    submit: "Send quote request",
    fields: [
      { name: "projectType", label: "Project", type: "select", required: true, group: "project", half: true, options: ["Kitchen", "Bathroom / vanity", "Kitchen and bath", "Multi-unit / multifamily", "Other"] },
      { name: "units", label: "Kitchens or units", type: "number", group: "project", half: true, inputMode: "numeric", hint: "Approximate is fine.", maxLength: 6 },
      { name: "timeline", label: "Timeline", type: "select", required: true, group: "project", options: ["Ready to order", "Within 1–3 months", "3–6 months out", "Bidding or planning"] },
      ...contactFields,
      { name: "company", label: "Business name", type: "text", required: true, autoComplete: "organization", group: "business", half: true, maxLength: 120 },
      { name: "customerType", label: "Which best describes you?", type: "select", required: true, group: "business", half: true, options: customerTypes },
      { name: "location", label: "Project location", type: "text", required: true, autoComplete: "address-level2", group: "business", hint: "City and state, or ZIP code.", maxLength: 120 },
      { name: "einRoc", label: "Do you have an EIN or ROC license?", type: "radio", required: true, group: "business", options: ["Yes", "No", "Not sure"] },
      { name: "message", label: "Anything else we should know?", type: "textarea", group: "details", hint: "Cabinet list, layout, delivery needs — whatever you have.", maxLength: 4000 },
    ],
  },
  "dealer-application": {
    title: "Become a dealer",
    submit: "Send dealer application",
    fields: [
      ...contactFields,
      { name: "company", label: "Business name", type: "text", required: true, autoComplete: "organization", group: "business", half: true, maxLength: 120 },
      { name: "customerType", label: "Business type", type: "select", required: true, group: "business", half: true, options: customerTypes.filter((t) => !t.startsWith("Homeowner")) },
      { name: "location", label: "Business location", type: "text", required: true, autoComplete: "address-level2", group: "business", hint: "City and state.", maxLength: 120 },
      { name: "einRoc", label: "Do you have an EIN or ROC license?", type: "radio", required: true, group: "business", options: ["Yes", "No", "Not sure"] },
      { name: "volume", label: "Typical monthly cabinetry volume", type: "select", group: "business", options: ["1–5 kitchens", "6–15 kitchens", "16–30 kitchens", "More than 30 kitchens", "Not sure yet"] },
      { name: "message", label: "Tell us about your business", type: "textarea", group: "details", maxLength: 4000 },
    ],
  },
  "dealer-referral": {
    title: "Find a dealer",
    submit: "Ask for a dealer referral",
    fields: [
      ...contactFields,
      { name: "location", label: "Project ZIP code", type: "text", required: true, autoComplete: "postal-code", group: "project", half: true, inputMode: "numeric", maxLength: 10 },
      { name: "projectType", label: "Project", type: "select", required: true, group: "project", half: true, options: ["Kitchen", "Bathroom / vanity", "Kitchen and bath", "Other"] },
      { name: "message", label: "What are you planning?", type: "textarea", group: "details", hint: "Finishes you like, timing, anything that helps us match you with the right dealer.", maxLength: 4000 },
    ],
  },
  contact: {
    title: "Contact Highland",
    submit: "Send message",
    fields: [
      ...contactFields,
      { name: "company", label: "Business name", type: "text", autoComplete: "organization", group: "business", half: true, hint: "Optional.", maxLength: 120 },
      { name: "customerType", label: "Which best describes you?", type: "select", required: true, group: "business", half: true, options: customerTypes },
      { name: "message", label: "How can we help?", type: "textarea", required: true, group: "details", maxLength: 4000 },
    ],
  },
};

export const groupLabels: Record<FieldDef["group"], string> = {
  project: "The project",
  contact: "Your details",
  business: "Your business",
  details: "Details",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type LeadData = Record<string, string>;
export type LeadErrors = Record<string, string>;

export function validateLead(variant: LeadVariant, data: LeadData): LeadErrors {
  const errors: LeadErrors = {};
  for (const f of formDefs[variant].fields) {
    const v = (data[f.name] ?? "").trim();
    if (f.required && !v) {
      errors[f.name] =
        f.type === "select" || f.type === "radio"
          ? `Choose an option for “${f.label}”.`
          : f.type === "textarea"
            ? "Add a short message so we know how to help."
            : `Enter your ${f.label.toLowerCase()}.`;
      continue;
    }
    if (!v) continue;
    if (f.maxLength && v.length > f.maxLength) errors[f.name] = `Keep this under ${f.maxLength} characters.`;
    else if (f.type === "email" && !EMAIL.test(v)) errors[f.name] = "Enter an email address like name@company.com.";
    else if (f.type === "tel" && v.replace(/\D/g, "").length < 10) errors[f.name] = "Enter a phone number with area code.";
    else if (f.type === "number" && !/^\d+$/.test(v)) errors[f.name] = "Enter a whole number.";
    else if (f.options && !f.options.includes(v)) errors[f.name] = "Choose one of the listed options.";
  }
  return errors;
}

export type LeadResult =
  | { status: "sent" }
  | { status: "not-configured" }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "error" };
