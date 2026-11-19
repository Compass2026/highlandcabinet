import localFont from "next/font/local";

/**
 * Mona Sans (SIL Open Font License 1.1) — one variable family with weight and width axes,
 * self-hosted from the Fontsource package. Headlines use a slightly expanded width at medium
 * weight; text uses the normal width. IBM Plex Mono (OFL) is reserved for product codes,
 * dimensions and counters.
 */
export const monaSans = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-standard-normal.woff2", style: "normal", weight: "200 900" }],
  variable: "--font-mona",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const plexMono = localFont({
  src: [{ path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", style: "normal", weight: "500" }],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Menlo", "monospace"],
});
