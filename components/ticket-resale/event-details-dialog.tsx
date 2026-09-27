"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, MapPin, ShieldCheck, X } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { formatUsd, type ResaleEvent } from "@/lib/ticket-resale-page";
import { site } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * Same accessible-dialog recipe as `ProposalDialog`: scroll lock, Tab trap,
 * Escape-to-close, backdrop click-to-close, focus moved in on open and
 * restored on close (the last part lives in `EventDetailsProvider`).
 *
 * There's no checkout backend yet, so the CTA is honest about it — it hands
 * off to the phone line already established sitewide rather than faking a
 * purchase flow. Swap that link for a real checkout once one exists; every
 * other field here already reads from `ResaleEvent`, so nothing else here
 * needs to change when real inventory replaces `resaleEvents`.
 */
export function EventDetailsDialog({
  event,
  onClose,
}: {
  event: ResaleEvent | null;
  onClose: () => void;
}) {
  const isOpen = event !== null;
  const reduceMotion = useReducedMotionSafe();
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        onClose();
        return;
      }
      if (keyEvent.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (keyEvent.shiftKey && document.activeElement === first) {
        keyEvent.preventDefault();
        last.focus();
      } else if (!keyEvent.shiftKey && document.activeElement === last) {
        keyEvent.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const duration = reduceMotion ? 0.01 : 0.4;

  return (
    <AnimatePresence>
      {event ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-[80] bg-ink-deep/60 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto overscroll-contain p-0 sm:items-center sm:p-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration, ease: EASE }}
              className={clsx(
                "relative w-full max-w-[32rem] bg-paper",
                "rounded-t-feature sm:rounded-feature",
                "border border-canvas-border shadow-[0_40px_90px_-50px_rgba(13,11,10,0.5)]",
                "max-h-[92dvh] overflow-y-auto",
              )}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-graphite/12 bg-white/85 text-slate transition-colors duration-300 hover:border-champagne/50 hover:text-graphite"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>

              <div className="relative aspect-[16/8] w-full overflow-hidden">
                <Image
                  src={event.image}
                  alt=""
                  fill
                  sizes="32rem"
                  className={clsx("object-cover", event.imagePosition)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 via-graphite/0 to-transparent" />
                <span className="ds-badge ds-badge-accent absolute bottom-4 left-6 uppercase tracking-[0.1em]">
                  {event.category}
                </span>
              </div>

              <EventDetailsBody key={event.slug} event={event} headingId={headingId} onClose={onClose} />
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function EventDetailsBody({
  event,
  headingId,
  onClose,
}: {
  event: ResaleEvent;
  headingId: string;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const reduceMotion = useReducedMotionSafe();
  const tier = event.tiers[selected];

  return (
    <div className="px-6 py-7 sm:px-9 sm:py-8">
      <h2 id={headingId} className="display pr-8 text-[1.5rem] text-canvas-text sm:text-[1.75rem]">
        {event.name}
      </h2>

      <dl className="mt-5 space-y-2.5 text-[0.9375rem] text-canvas-text-muted">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-taupe" aria-hidden />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 shrink-0 text-taupe" aria-hidden />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-taupe" aria-hidden />
          <span>
            {event.venue}, {event.city}
          </span>
        </div>
      </dl>

      <div className="mt-7 border-t border-canvas-border pt-6">
        <div className="flex items-center justify-between">
          <p className="label text-taupe">Ticket tiers</p>
          <p className="inline-flex items-center gap-1.5 text-[0.75rem] text-canvas-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-champagne" aria-hidden />
            Verified resale
          </p>
        </div>

        <ul className="mt-3 space-y-2">
          {event.tiers.map((t, i) => {
            const isSelected = i === selected;
            return (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={isSelected}
                  className={clsx(
                    "flex w-full items-center justify-between gap-4 rounded-control border px-4 py-3 text-left transition-colors duration-300 ease-editorial",
                    isSelected
                      ? "border-champagne bg-champagne/10"
                      : "border-canvas-border hover:border-canvas-text/25",
                  )}
                >
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-canvas-text">
                      {t.name}
                    </span>
                    <span className="block text-[0.75rem] text-taupe">{t.availability}</span>
                  </span>
                  <span className="shrink-0 text-[0.9375rem] font-semibold tabular-nums text-canvas-text">
                    {formatUsd(t.price)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setShowComingSoon(true)}
        className="label mt-7 flex w-full items-center justify-center rounded-control bg-graphite px-7 py-4 text-linen pressable hover:bg-graphite-dim"
      >
        Reserve {tier.name} — {formatUsd(tier.price)}
      </button>

      <AnimatePresence initial={false}>
        {showComingSoon ? (
          <motion.p
            role="status"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: EASE }}
            className="mt-3 overflow-hidden rounded-control bg-champagne/10 px-4 py-3 text-center text-[0.8125rem] leading-relaxed text-canvas-text"
          >
            Checkout isn&rsquo;t built yet — this is a front-end preview. Call{" "}
            <a href={site.contact.phoneHref} onClick={onClose} className="font-semibold underline">
              {site.contact.phone}
            </a>{" "}
            and the desk can lock these seats in for you today.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
