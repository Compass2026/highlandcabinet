"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

export interface QuoteContextValue {
  /** Collection the visitor was looking at, if any. */
  finishId?: string;
  /** Where the request was opened from — recorded with the lead. */
  source: string;
}

interface Ctx {
  open: (context: QuoteContextValue, opener?: HTMLElement | null) => void;
  close: () => void;
  isOpen: boolean;
  context: QuoteContextValue | null;
  opener: HTMLElement | null;
}

const QuoteCtx = createContext<Ctx | null>(null);

// The drawer (form, validation) is only downloaded when first opened.
const QuoteDrawer = dynamic(() => import("./QuoteDrawer"), { ssr: false });

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [context, setContext] = useState<QuoteContextValue | null>(null);
  const [opener, setOpener] = useState<HTMLElement | null>(null);

  const open = useCallback((c: QuoteContextValue, el?: HTMLElement | null) => {
    setContext(c);
    setOpener(el ?? (typeof document !== "undefined" ? (document.activeElement as HTMLElement) : null));
    setMounted(true);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen, context, opener }), [open, close, isOpen, context, opener]);

  return (
    <QuoteCtx.Provider value={value}>
      {children}
      {mounted ? <QuoteDrawer /> : null}
    </QuoteCtx.Provider>
  );
}

export function useQuote() {
  const c = useContext(QuoteCtx);
  if (!c) throw new Error("useQuote must be used inside <QuoteProvider>");
  return c;
}
