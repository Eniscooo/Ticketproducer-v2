"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/** Nothing to subscribe to — the store never changes, only the snapshot differs by environment. */
const noSubscribe = () => () => {};

/**
 * `false` while rendering on the server, `true` once hydrated. Reading it this
 * way rather than through `useState` + an effect avoids the extra render pass
 * that a mount flag normally costs.
 */
function useMounted() {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}

/**
 * The pull-up menu the filters open on a phone.
 *
 * A popover anchored to a pill works with a cursor and fails with a thumb: the
 * panel lands wherever the trigger happens to be, often under the reach of the
 * hand holding the phone, and a calendar wide enough to be usable runs off the
 * side of the screen. This slides up from the bottom edge instead, at full
 * width, with the content where the thumb already is.
 *
 * It renders through a portal on `document.body`. A sheet is `position: fixed`,
 * and any transformed ancestor — a `Reveal`, a `motion.div` mid-animation —
 * becomes the containing block for fixed children, which would pin it to that
 * element instead of the viewport. The portal steps outside all of them.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  /* `document` does not exist during SSR, so the portal waits for mount. */
  const mounted = useMounted();

  /* Escape closes; the page underneath stops scrolling while the sheet owns the screen. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const duration = reduceMotion ? 0.01 : 0.32;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-[70] bg-ink-deep/50 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[80] max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-feature border-t border-canvas-border bg-surface pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-24px_60px_-30px_rgba(23,23,22,0.45)]"
          >
            {/* Grab handle — signals the sheet's edge; the backdrop and button do the closing. */}
            <div className="sticky top-0 z-10 bg-surface pt-2.5">
              <span
                aria-hidden
                className="mx-auto block h-1 w-10 rounded-full bg-canvas-text/15"
              />

              <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-3.5">
                <h2
                  id={headingId}
                  className="label text-taupe"
                >
                  {title}
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-canvas-text-muted transition-colors duration-300 ease-editorial hover:bg-canvas-alt hover:text-canvas-text"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            <div className="px-3 pb-1">{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
