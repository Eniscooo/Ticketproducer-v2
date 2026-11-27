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
  /**
   * For content on screen at load: plain markup with a CSS entrance that runs
   * from first paint, instead of waiting for JavaScript to reveal it.
   */
  immediate?: boolean;
};

/**
 * One reveal primitive for the whole site: a fade with a few pixels of travel,
 * once, on entry. With reduced motion it renders plainly — the layout is
 * designed to stand without any of this.
 *
 * It settles in 0.7s. At 1.1s, with sibling staggers stacked on top, a fast
 * scroll outran it and the reader arrived at sections still half-drawn.
 * Motion is written as a full `transform` string rather than Framer's `y`
 * shorthand, which is interpolated on the main thread and drops frames
 * while images below are decoding.
 */
const DURATION = 0.7;

export function Reveal({
  children,
  delay = 0,
  distance = 14,
  as = "div",
  className,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  const reduceMotion = useReducedMotionSafe();

  if (immediate) {
    const Tag = as;
    return (
      <Tag
        className={className ? `tp-rise-now ${className}` : "tp-rise-now"}
        style={delay ? ({ ["--d" as string]: `${Math.round(delay * 1000)}ms` } as React.CSSProperties) : undefined}
      >
        {children}
      </Tag>
    );
  }

  const Component = motion[as];
  const hidden = { opacity: 0, transform: `translateY(${distance}px)` };
  const shown = { opacity: 1, transform: "translateY(0px)" };

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
        initial={{ opacity: 1, transform: "none" }}
        animate={{ opacity: 1, transform: "none" }}
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
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{
        duration: DURATION,
        delay,
        ease: [0.16, 0.84, 0.28, 1],
      }}
    >
      {children}
    </Component>
  );
}
