"use client";

import { useEffect, useRef } from "react";
import { clsx } from "@/lib/clsx";
import { clamp01, subscribeScrollFrame } from "@/lib/scroll-frame";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/** The covered card settles at this scale and brightness. */
const COVERED_SCALE = 0.94;
const COVERED_BRIGHTNESS = 0.75;

/**
 * Stacking cards: every direct child pins (`position: sticky`) and the next one
 * slides up over it, while the covered card eases down in scale and brightness.
 * The layout rules live in globals.css under `.card-stack`; this component only
 * measures and drives the covered state.
 *
 * Each card's sticky `top` is measured, not fixed. A card that fits the screen
 * pins a little lower than the one before it (12vh + 18px per card, less on
 * phones), so earlier edges peek out above. A card taller than the screen pins
 * by its *bottom* instead (`top` = viewport − height), so it scrolls fully into
 * view before anything covers it — otherwise its lower half would be buried
 * unread. For those, the shrink is anchored at the top of the visible part
 * rather than the card's own top, which sits off-screen.
 *
 * Sticky only switches on once `data-stack-ready` is set, so without script —
 * and under reduced motion, where the CSS also drops the spacing — the children
 * render as the ordinary flow they were before.
 */
export function CardStack({
  children,
  as: Component = "div",
  className,
}: {
  children: React.ReactNode;
  as?: "div" | "ul" | "ol";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotionSafe();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion) return;

    const cards = Array.from(root.children) as HTMLElement[];
    let tops: number[] = [];
    let heights: number[] = [];
    const progress = cards.map(() => 0);

    const measure = () => {
      const vh = window.innerHeight;
      const phone = window.innerWidth < 640;
      const base = vh * (phone ? 0.08 : 0.12);
      const step = phone ? 10 : 18;

      heights = cards.map((card) => card.offsetHeight);
      tops = cards.map((card, i) => {
        const peek = base + i * step;
        const top = heights[i] <= vh - peek ? peek : vh - heights[i];
        card.style.top = `${top}px`;
        card.style.transformOrigin = top < 0 ? `50% ${-top}px` : "50% 0";
        return top;
      });
      root.setAttribute("data-stack-ready", "");
    };

    const frame = () => {
      // Read every position first, then write, so the loop never forces layout.
      const next = cards.map((card, i) =>
        // A card that is itself shrinking is already pinned at its measured top;
        // its live rect would include the scale.
        progress[i] > 0 ? tops[i] : card.getBoundingClientRect().top,
      );

      for (let i = 0; i < cards.length - 1; i++) {
        const coveredFrom = tops[i] + heights[i];
        const coveredBy = Math.max(tops[i + 1], 0);
        progress[i] = clamp01((coveredFrom - next[i + 1]) / (coveredFrom - coveredBy));
      }

      cards.forEach((card, i) => {
        const p = progress[i];
        card.style.scale = p > 0 ? String(1 - (1 - COVERED_SCALE) * p) : "";
        card.style.filter =
          p > 0 ? `brightness(${1 - (1 - COVERED_BRIGHTNESS) * p})` : "";
      });
    };

    const { remeasure, unsubscribe } = subscribeScrollFrame(frame, measure);
    // Card heights move after hydration — images decode, fonts swap, panels open.
    const resize = new ResizeObserver(remeasure);
    cards.forEach((card) => resize.observe(card));

    return () => {
      unsubscribe();
      resize.disconnect();
      root.removeAttribute("data-stack-ready");
      cards.forEach((card) => {
        card.style.removeProperty("top");
        card.style.removeProperty("transform-origin");
        card.style.removeProperty("scale");
        card.style.removeProperty("filter");
      });
    };
  }, [reduceMotion]);

  return (
    <Component ref={ref as never} className={clsx("card-stack", className)}>
      {children}
    </Component>
  );
}
