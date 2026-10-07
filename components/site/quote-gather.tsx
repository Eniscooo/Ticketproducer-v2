"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { clamp01, subscribeScrollFrame } from "@/lib/scroll-frame";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Start (scattered, in vw/vh from the stage centre — far enough out that only
 * a corner shows, so the quote reads clean first) and end (the fan: slot from
 * centre, a slight arc as a fraction of poster width, and tilt) for each
 * poster. The middle poster sits on top.
 */
const LAYOUT = [
  { sx: -54, sy: -30, sr: -24, fx: -2, fy: 0.16, fr: -14 },
  { sx: -50, sy: 32, sr: 18, fx: -1, fy: 0.04, fr: -7 },
  { sx: 0, sy: 54, sr: 28, fx: 0, fy: 0, fr: 0 },
  { sx: 52, sy: -34, sr: -20, fx: 1, fy: 0.04, fr: 7 },
  { sx: 54, sy: 28, sr: 26, fx: 2, fy: 0.16, fr: 14 },
] as const;

/** Progress reaches 1 this far through the scroll, leaving a beat on the fan. */
const SETTLE_AT = 0.7;
/** Each poster leaves a little after the one before it. */
const STAGGER = 0.05;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * The opening pull quote, with five posters that gather over it on scroll.
 *
 * A 250vh section holds a 100vh sticky stage, so the quote stays pinned while
 * the reader scrolls through it. Scroll position inside the section becomes a
 * 0–1 progress value; each poster blends from its scattered start to its slot
 * in the fan. The blend itself is written in CSS (`.gather-poster` in
 * globals.css) against a per-poster `--e`, so the script only ever sets one
 * number per poster and the browser does the transform maths. The start state
 * is therefore what the server renders.
 *
 * Under reduced motion the section drops to its normal height, nothing pins,
 * and the finished fan sits beneath the quote rather than over it.
 */
export function QuoteGather({
  children,
  posters,
}: {
  children: React.ReactNode;
  posters: readonly string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const posterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotionSafe();

  useEffect(() => {
    const section = sectionRef.current;
    const quote = quoteRef.current;
    if (!section || !quote || reduceMotion) return;

    let travel = 1;
    const measure = () => {
      travel = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    const frame = () => {
      const scrolled = -section.getBoundingClientRect().top;
      const progress = clamp01(scrolled / (travel * SETTLE_AT));
      const span = 1 - STAGGER * (LAYOUT.length - 1);

      posterRefs.current.forEach((poster, i) => {
        const local = clamp01((progress - i * STAGGER) / span);
        poster?.style.setProperty("--e", easeOutCubic(local).toFixed(4));
      });
      // The quote steps back as the fan closes over it.
      quote.style.opacity = String(1 - 0.7 * clamp01((progress - 0.55) / 0.45));
    };

    const { unsubscribe } = subscribeScrollFrame(frame, measure);
    const posterEls = posterRefs.current;
    return () => {
      unsubscribe();
      quote.style.removeProperty("opacity");
      posterEls.forEach((poster) => poster?.style.removeProperty("--e"));
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate h-[250vh] overflow-clip border-t border-canvas-border bg-canvas-alt motion-reduce:h-auto motion-reduce:py-28 sm:motion-reduce:py-40 lg:motion-reduce:py-52"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden [--fan-step:calc(var(--pw)*0.5)] [--pw:clamp(6.5rem,17vw,14rem)] motion-reduce:static motion-reduce:h-auto sm:[--fan-step:calc(var(--pw)*0.62)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_50%,rgba(176,141,87,0.1),transparent_70%)]"
        />

        <div ref={quoteRef} className="relative w-full">
          {children}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 motion-reduce:relative motion-reduce:mt-16 motion-reduce:h-[calc(var(--pw)*1.8)] motion-reduce:w-full"
        >
          {posters.slice(0, LAYOUT.length).map((src, i) => {
            const l = LAYOUT[i];
            return (
              <div
                key={src}
                ref={(el) => {
                  posterRefs.current[i] = el;
                }}
                className="gather-poster absolute inset-0 m-auto h-[calc(var(--pw)*1.5)] w-(--pw) overflow-hidden rounded-[1rem] border border-bone/15 bg-graphite shadow-[0_28px_60px_-28px_rgba(23,23,22,0.55)]"
                style={
                  {
                    "--sx": l.sx,
                    "--sy": l.sy,
                    "--sr": `${l.sr}deg`,
                    "--fx": l.fx,
                    "--fy": `calc(var(--pw) * ${l.fy})`,
                    "--fr": `${l.fr}deg`,
                    zIndex: 3 - Math.abs(i - 2),
                  } as React.CSSProperties
                }
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 14rem, 7rem"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
