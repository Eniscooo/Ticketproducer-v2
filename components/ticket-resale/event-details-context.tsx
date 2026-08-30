"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { EventDetailsDialog } from "./event-details-dialog";
import type { ResaleEvent } from "@/lib/ticket-resale-page";

type EventDetailsContextValue = {
  open: (event: ResaleEvent) => void;
};

const EventDetailsContext = createContext<EventDetailsContextValue | null>(null);

export function useEventDetails() {
  const context = useContext(EventDetailsContext);
  if (!context) {
    throw new Error("useEventDetails must be used inside an EventDetailsProvider");
  }
  return context;
}

/**
 * One dialog instance for the whole route — every event card, in every
 * section, opens the same modal instead of each mounting a copy. Remembers
 * the card that opened it and hands focus back on close.
 */
export function EventDetailsProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<ResaleEvent | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((next: ResaleEvent) => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEvent(next);
  }, []);

  const close = useCallback(() => {
    setEvent(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <EventDetailsContext.Provider value={value}>
      {children}
      <EventDetailsDialog event={event} onClose={close} />
    </EventDetailsContext.Provider>
  );
}
