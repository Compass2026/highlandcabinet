import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", ".next-static/**", "fallback/**", "out/**", "node_modules/**", "public/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
