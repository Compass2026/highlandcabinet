import localFont from "next/font/local";

/**
 * Mona Sans (variable weight + width, SIL Open Font License 1.1), self-hosted from Fontsource.
 * One architectural sans across headings, text, labels and forms.
 */
export const monaSans = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-standard-normal.woff2", style: "normal", weight: "200 900" }],
  variable: "--font-mona",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
