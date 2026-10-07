"use client";

import { useEffect } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Switch `.on` for every `[data-at]` inside `root` whose threshold has been
 * reached, and off for the rest. Only touches elements whose state actually
 * changes, so it is cheap to call every frame. The `.fx-*` classes in
 * globals.css turn the class flip into the motion.
 */
export function applyReveal(items: readonly HTMLElement[] | NodeListOf<Element>, value: number) {
  items.forEach((item) => {
    const on = Number((item as HTMLElement).dataset.at) <= value;
    if (item.classList.contains("on") !== on) item.classList.toggle("on", on);
  });
}

/**
 * A small looping demo: steps 0…`steps` are revealed one per `interval`,
 * the finished state holds for `hold`, then everything clears and it starts
 * again. It only runs while the demo is on screen (IntersectionObserver), so
 * offscreen phones cost nothing. Under reduced motion it shows the finished
 * state once and never loops.
 */
export function useStepLoop(
  ref: React.RefObject<HTMLElement | null>,
  { steps, interval = 650, hold = 2200 }: { steps: number; interval?: number; hold?: number },
) {
  const reduceMotion = useReducedMotionSafe();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-at]");

    if (reduceMotion) {
      applyReveal(items, Infinity);
      return;
    }

    let step = -1;
    let timer = 0;
    let running = false;

    const tick = () => {
      step += 1;
      if (step > steps) {
        step = -1;
        applyReveal(items, -1);
        timer = window.setTimeout(tick, 700);
        return;
      }
      applyReveal(items, step);
      timer = window.setTimeout(tick, step === steps ? hold : interval);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          timer = window.setTimeout(tick, 300);
        } else if (!entry.isIntersecting && running) {
          running = false;
          window.clearTimeout(timer);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [ref, steps, interval, hold, reduceMotion]);
}
