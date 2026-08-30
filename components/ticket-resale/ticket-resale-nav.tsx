"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { navCategories } from "@/lib/ticket-resale-page";
import { CategoryMenu } from "./category-menu";
import { CategoryOverflow } from "./category-overflow";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/** How far down the page the bar starts being useful — above this it stays away. */
const REVEAL_AFTER = 260;

/** Quiet again this long after the last scroll. */
const IDLE_MS = 1800;

/** Categories the bottom bar shows at rest; everything past this goes under "More". */
const MOBILE_SLOTS = 3;

/** Shared chrome for both shapes — the same glass slab, laid out differently. */
const SLAB =
  "rounded-feature border border-surface/50 bg-surface/40 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_30px_55px_-20px_rgba(23,23,22,0.5)] backdrop-blur-2xl backdrop-saturate-150";

/**
 * Category quick-nav for the whole route, in two shapes.
 *
 * From `xl` it is a vertical rail pinned to the left margin — icon-only, with
 * each category's name and subcategories flying out to the right on hover or
 * focus. The breakpoint is `xl` rather than `lg` because that is where the rail
 * first fits: the content column is 75rem wide with 2.5rem of padding, so the
 * page does not open up enough margin to hold a 3.5rem rail clear of the cards
 * until about 1264px. Below that it would sit on top of the leading card of
 * every row.
 *
 * So under `xl` it comes down to the foot of the window as a horizontal bar
 * instead. Only `MOBILE_SLOTS` categories fit there comfortably at phone
 * widths; the rest are listed under a "More" sheet that opens upward. Both
 * shapes are rendered and swapped by breakpoint rather than measured at
 * runtime, so neither flashes on first paint.
 *
 * Either shape is scroll-triggered rather than permanent: hidden at the top of
 * the page, it appears on the first scroll past the hero and settles back out of
 * the way once scrolling stops, so it never sits over the listings while someone
 * is reading them. Any scroll brings it straight back.
 *
 * Pointer or keyboard focus inside it holds it open — otherwise it would vanish
 * mid-reach — and the idle timer restarts when they leave. The mobile "More"
 * sheet reports its own open state in for the same reason: a tap leaves no
 * pointer inside the bar to hold it.
 */
export function TicketResaleNav() {
  const [visible, setVisible] = useState(false);
  const holdRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotionSafe();

  const primary = navCategories.slice(0, MOBILE_SLOTS);
  const overflow = navCategories.slice(MOBILE_SLOTS);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleHide = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      if (!holdRef.current) setVisible(false);
    }, IDLE_MS);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY <= REVEAL_AFTER) {
        clearTimer();
        if (!holdRef.current) setVisible(false);
        return;
      }

      setVisible(true);
      scheduleHide();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    /* Covers a load that starts part-way down the page, e.g. on an anchor. */
    onScroll();

    return () => {
      clearTimer();
      window.removeEventListener("scroll", onScroll);
    };
  }, [scheduleHide]);

  const hold = () => {
    holdRef.current = true;
    clearTimer();
    setVisible(true);
  };

  const release = () => {
    holdRef.current = false;
    scheduleHide();
  };

  /* Stable identity: `CategoryOverflow` reports through this from an effect. */
  const handleOverflowToggle = useCallback(
    (open: boolean) => {
      holdRef.current = open;
      if (open) {
        clearTimer();
        setVisible(true);
        return;
      }
      scheduleHide();
    },
    [scheduleHide],
  );

  const holdProps = {
    onPointerEnter: hold,
    onPointerLeave: release,
    onFocusCapture: hold,
    onBlurCapture: release,
  };

  return (
    <>
      {/*
       * Desktop rail. The fixed positioning and vertical centring live on this
       * wrapper, not on the animated element: framer-motion writes `transform`
       * inline, which would overwrite a `-translate-y-1/2` utility.
       */}
      <div className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
        <AnimatePresence>
          {visible ? (
            <motion.nav
              aria-label="Browse by category"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.36, ease: EASE }}
              {...holdProps}
              className={`pointer-events-auto flex flex-col gap-0.5 ${SLAB}`}
            >
              {navCategories.map((category) => (
                <CategoryMenu
                  key={category.key}
                  category={category}
                  orientation="right"
                  iconOnly
                />
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Everything narrower than the rail: phone, tablet, small laptop */}
      <AnimatePresence>
        {visible ? (
          <motion.nav
            aria-label="Browse by category"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.36, ease: EASE }}
            {...holdProps}
            className="fixed inset-x-0 bottom-4 z-30 mx-auto w-fit max-w-[calc(100vw-1.5rem)] sm:bottom-6 xl:hidden"
          >
            <div className={`flex items-center gap-0.5 ${SLAB}`}>
              {primary.map((category) => (
                <CategoryMenu
                  key={category.key}
                  category={category}
                  orientation="up"
                  iconOnly
                />
              ))}
              <CategoryOverflow categories={overflow} onOpenChange={handleOverflowToggle} />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
