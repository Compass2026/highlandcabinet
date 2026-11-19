import localFont from "next/font/local";

/**
 * Type pairing (both SIL Open Font License 1.1, self-hosted from Fontsource):
 *  - Libre Caslon Display — headlines and product names, set upright at moderate sizes.
 *  - Mona Sans (variable weight + width) — text, navigation, labels, forms.
 * IBM Plex Mono (OFL) is kept only for product identifiers and dimensions.
 */
export const caslonDisplay = localFont({
  src: [{ path: "../node_modules/@fontsource/libre-caslon-display/files/libre-caslon-display-latin-400-normal.woff2", style: "normal", weight: "400" }],
  variable: "--font-caslon",
  display: "swap",
  fallback: ["Iowan Old Style", "Baskerville", "Georgia", "serif"],
});

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
