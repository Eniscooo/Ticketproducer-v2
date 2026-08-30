"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { Reveal } from "@/components/ui/reveal";
import { stats, type Stat } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/** Counts up from zero once its stat enters view; jumps straight to the final value with reduced motion. */
function Counter({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotionSafe();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const controls = animate(0, stat.value, {
      duration: 1.8,
      delay,
      ease: EASE,
      onUpdate: (value) => setDisplay(Math.round(value)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion, stat.value, delay]);

  const value = reduceMotion ? stat.value : display;

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-US")}
      {stat.suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section
      aria-label="Ticket Producer by the numbers"
      className="relative -mt-8 rounded-t-[2rem] bg-ink-deep py-10 shadow-[0_-24px_50px_-35px_rgba(0,0,0,0.7)] sm:py-12"
    >
      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="border-t border-bone/12 pt-5 first:border-t-0 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
              >
                <dd className="display text-[clamp(1.75rem,3.8vw,2.75rem)] leading-none text-ivory">
                  <Counter stat={stat} delay={i * 0.1} />
                </dd>
                <dt className="label mt-2 text-stone-dim">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
