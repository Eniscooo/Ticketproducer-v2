"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type RevealProps = {
  children: React.ReactNode;
  /** Seconds of delay — used to stagger siblings, sparingly. */
  delay?: number;
  /** Vertical travel in px. Keep small; this should read as settling, not sliding. */
  distance?: number;
  as?: "div" | "section" | "li" | "span" | "p";
  className?: string;
};

/**
 * One reveal primitive for the whole site: a slow fade with a few pixels of
 * travel, once, on entry. With reduced motion it renders plainly — the layout
 * is designed to stand without any of this.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 18,
  as = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  const reduceMotion = useReducedMotionSafe();

  const Component = motion[as];

  /*
   * The preference is unknown on the server, so SSR emits the animated branch
   * below and its `initial` opacity of 0. This branch therefore has to drive
   * opacity back up: rendering the same node with no target at all would leave
   * it stuck invisible once the client corrects the preference.
   */
  if (reduceMotion) {
    return (
      <Component
        className={className}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref as never}
      data-reveal
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.16, 0.84, 0.28, 1],
      }}
    >
      {children}
    </Component>
  );
}
