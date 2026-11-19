"use client";

import type { MouseEvent, ReactNode } from "react";
import { useQuote } from "./QuoteContext";
import { ArrowRight } from "@/components/ui/icons";

interface Props {
  finishId?: string;
  source: string;
  className?: string;
  children?: ReactNode;
  arrow?: boolean;
}

/**
 * A real link to /request-a-quote/ (works without JavaScript and in a new tab) that opens the
 * quote drawer in place when clicked normally. The selected collection travels with it.
 */
export function QuoteButton({ finishId, source, className = "btn", children = "Request a Quote", arrow = true }: Props) {
  const { open } = useQuote();
  const qs = new URLSearchParams({ ...(finishId ? { finish: finishId } : {}), from: source });
  const href = `/request-a-quote/?${qs}`;

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open({ finishId, source }, e.currentTarget);
  }

  return (
    <a href={href} className={className} onClick={onClick} aria-haspopup="dialog">
      {children}
      {arrow ? <ArrowRight /> : null}
    </a>
  );
}
