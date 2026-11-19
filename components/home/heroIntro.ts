/**
 * The opening, as CSS rules scoped by a state prefix. Emitted twice by <Hero>:
 *   - html[data-intro="play"]          when the inline controller starts the intro
 *   - html:not([data-intro]) (noscript) so it still plays once without JavaScript
 *
 * Timeline (≈1.45 s):
 *   0.00–0.80  doors swing open on their outer hinges, darkening as they turn from the light
 *   0.00–0.35  the centre reveal warms
 *   0.48–1.28  the cabinet opening widens into the full-bleed photograph
 *   0.42–1.45  the kitchen settles from 1.12× to 1×
 *   0.62–0.90  doors and the cabinet's shadow on the wall fade away
 * Large layers animate transform / opacity; the opening is a clip-path inset.
 */
const DOOR = "0.8s cubic-bezier(.45,.05,.2,1)";

export function introRules(p: string, delay = 0): string {
  const d = (s: number) => `${(s + delay).toFixed(2)}s`;
  return [
    `${p} [data-cab]{display:block;animation:hc-fade-out .28s ease ${d(0.62)} both}`,
    `${p} [data-wall]{display:block}`,
    `${p} [data-door="left"]{animation:hc-open-l ${DOOR} ${d(0)} both}`,
    `${p} [data-door="right"]{animation:hc-open-r ${DOOR} ${d(0)} both}`,
    `${p} [data-shade]::after{animation:hc-shade ${DOOR} ${d(0)} both}`,
    `${p} [data-seam]{animation:hc-seam .4s ease-out ${d(0)} both}`,
    `${p} [data-hero-clip]{animation:hc-unclip .8s cubic-bezier(.7,0,.2,1) ${d(0.48)} both}`,
    `${p} [data-hero-img]{animation:hc-settle 1.03s cubic-bezier(.3,.6,.2,1) ${d(0.42)} both}`,
  ].join("\n");
}
