import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true, focusable: false } as const;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 18 10" className="btn__arrow" {...base} {...p}>
    <path d="M0 5h16.5M12.5 1l4 4-4 4" strokeLinecap="square" />
  </svg>
);

export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 18 10" width="18" height="10" {...base} {...p}>
    <path d="M18 5H1.5M5.5 1l-4 4 4 4" strokeLinecap="square" />
  </svg>
);

export const Close = (p: P) => (
  <svg viewBox="0 0 20 20" width="20" height="20" {...base} {...p}>
    <path d="M4 4l12 12M16 4L4 16" strokeLinecap="square" />
  </svg>
);

export const Download = (p: P) => (
  <svg viewBox="0 0 16 18" width="16" height="18" {...base} {...p}>
    <path d="M8 1v11M3.5 7.5L8 12l4.5-4.5M1 16.5h14" strokeLinecap="square" />
  </svg>
);

export const Phone = (p: P) => (
  <svg viewBox="0 0 18 18" width="16" height="16" {...base} {...p}>
    <path d="M4.5 1.5h-3v3c0 6.6 5.4 12 12 12h3v-3l-3.5-1.5-1.8 1.8a10 10 0 01-5.5-5.5L7.5 6.5 6 3z" strokeLinejoin="round" />
  </svg>
);

export const Chevron = (p: P) => (
  <svg viewBox="0 0 12 8" width="12" height="8" {...base} {...p}>
    <path d="M1 1.5l5 5 5-5" />
  </svg>
);
