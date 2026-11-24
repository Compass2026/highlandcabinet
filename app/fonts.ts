import localFont from "next/font/local";

/**
 * Jost (variable weight, SIL Open Font License 1.1), self-hosted from Fontsource.
 * A geometric sans in the Futura tradition: light for display, regular for text.
 */
export const jost = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-jost",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
