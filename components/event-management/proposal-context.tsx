"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { ProposalDialog, type ProposalPrefill } from "./proposal-dialog";

type ProposalContextValue = {
  /** Opens the dialog, optionally seeding fields from whatever triggered it. */
  open: (prefill?: ProposalPrefill) => void;
};

const ProposalContext = createContext<ProposalContextValue | null>(null);

export function useProposal() {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error("useProposal must be used inside a ProposalProvider");
  }
  return context;
}

/**
 * One dialog instance for the whole route, so the budget calculator and every
 * Event Guide card share the same modal, validation, and submission path
 * instead of each mounting a copy. Remembers the element that opened it and
 * hands focus back on close.
 */
export function ProposalProvider({ children }: { children: React.ReactNode }) {
  const [prefill, setPrefill] = useState<ProposalPrefill | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((next?: ProposalPrefill) => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPrefill(next ?? {});
  }, []);

  const close = useCallback(() => {
    setPrefill(null);
    // Return focus to the card or button that opened the dialog.
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ProposalContext.Provider value={value}>
      {children}
      <ProposalDialog prefill={prefill} onClose={close} />
    </ProposalContext.Provider>
  );
}
