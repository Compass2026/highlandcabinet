/**
 * The opening choreography, as CSS rules scoped by a state prefix. Emitted twice by <Hero>:
 *   - html[data-intro="play"]        when the inline controller starts the intro
 *   - html:not([data-intro]) (noscript) so the doors still open once without JavaScript
 *
 * Timeline (≈1.85 s): seam warms (0–0.3 s) → doors swing out on their outer hinges
 * (0.12–1.42 s) → kitchen settles from 1.075× (0.10–1.85 s) → headline (1.00 s) → CTAs (1.12 s).
 * Everything large animates transform/opacity only (compositor); the only painted change is the
 * glow of the 3 px centre seam.
 */
const DOOR = "1.3s cubic-bezier(.52,.01,.16,1)";

export function introRules(p: string, delay = 0): string {
  const d = (s: number) => `${(s + delay).toFixed(2)}s`;
  return [
    `${p} [data-doors]{display:block;animation:hc-doors-out .01s linear ${d(1.6)} forwards}`,
    `${p} [data-door="left"]{animation:hc-open-l ${DOOR} ${d(0.12)} both}`,
    `${p} [data-door="right"]{animation:hc-open-r ${DOOR} ${d(0.12)} both}`,
    `${p} [data-shade]::after{animation:hc-shade ${DOOR} ${d(0.12)} both}`,
    `${p} [data-seam]{animation:hc-seam .75s ease-out ${d(0)} both}`,
    `${p} [data-hero-media]{animation:hc-settle 1.75s cubic-bezier(.22,.61,.2,1) ${d(0.1)} both}`,
    `${p} [data-hero-dim]{animation:hc-undim 1.3s cubic-bezier(.3,.6,.2,1) ${d(0.2)} both}`,
    `${p} [data-hero-copy]{animation:hc-rise .7s cubic-bezier(.2,.7,.2,1) ${d(1)} both}`,
    `${p} [data-hero-ctas]{animation:hc-rise .7s cubic-bezier(.2,.7,.2,1) ${d(1.12)} both}`,
    `${p} [data-hero-caption]{animation:hc-fade .6s ease ${d(1.3)} both}`,
  ].join("\n");
}
