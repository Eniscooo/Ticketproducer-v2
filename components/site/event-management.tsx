"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Action } from "@/components/ui/primitives";
import { clsx } from "@/lib/clsx";
import { clamp01, subscribeScrollFrame } from "@/lib/scroll-frame";
import { applyReveal } from "@/lib/step-reveal";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { eventManagement as em } from "@/lib/site";
import { FloorPlan } from "./floor-plan";

/** Progress reaches 1 a little before the section ends, so the finished room holds. */
const SETTLE_AT = 0.92;
/** The hall outline draws across most of Discovery. */
const OUTLINE_SPAN = 0.2;

/**
 * Event Management, told as a floor plan that builds itself.
 *
 * A 350vh section holds a 100vh sticky stage. Scroll position inside the
 * section becomes progress 0–1; every `[data-at]` inside — plan pieces, the
 * step list, the mobile step row — switches `.on` as progress passes its
 * threshold, and back off on the way up, so the build reverses. The caption
 * follows whichever step is current. Under reduced motion the section drops to
 * its natural height and renders the finished plan with every step lit.
 */
export function EventManagement() {
  const sectionRef = useRef<HTMLElement>(null);
  const hallRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotionSafe();

  useEffect(() => {
    const section = sectionRef.current;
    const hall = hallRef.current;
    if (!section || !hall) return;

    const items = section.querySelectorAll("[data-at]");
    const captions = Array.from(section.querySelectorAll<HTMLElement>("[data-caption]"));
    const thresholds = em.steps.map((step) => step.at);

    const render = (progress: number) => {
      applyReveal(items, progress);
      hall.style.strokeDashoffset = String(1 - clamp01(progress / OUTLINE_SPAN));
      const current = thresholds.findLastIndex((at) => progress >= at);
      captions.forEach((caption, i) => caption.classList.toggle("on", i === current));
    };

    if (reduceMotion) {
      render(1);
      return;
    }

    let travel = 1;
    const measure = () => {
      travel = Math.max(1, section.offsetHeight - window.innerHeight);
    };
    const frame = () => {
      const scrolled = -section.getBoundingClientRect().top;
      render(clamp01(scrolled / (travel * SETTLE_AT)));
    };

    const { unsubscribe } = subscribeScrollFrame(frame, measure);
    return unsubscribe;
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="event-management"
      className="relative h-[350vh] mx-auto w-full max-w-[78rem] scroll-mt-28 rounded-feature overflow-clip border border-canvas-border bg-surface shadow-[0_-22px_48px_-26px_rgba(23,23,22,0.3)] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center pb-6 pt-24 [@media(max-height:820px)]:pt-20 motion-reduce:static motion-reduce:h-auto motion-reduce:py-20 sm:pb-10 sm:pt-28 lg:motion-reduce:py-28">
        <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <div>
              <h2 className="display text-[clamp(2.1rem,5vw,3.75rem)] text-canvas-text [@media(max-height:820px)]:text-[clamp(2rem,4vw,2.75rem)]">
                {em.headline}
              </h2>
              <p className="mt-3 hidden max-w-md text-[0.95rem] leading-[1.8] text-canvas-text-muted sm:block [@media(max-height:820px)]:hidden">
                {em.description}
              </p>
            </div>
            <div className="hidden sm:block">
              <Action href={em.href} tone="ink">
                {em.cta}
                <ArrowUpRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-ui group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Action>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:mt-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14 sm:[@media(max-height:820px)]:mt-6">
            {/* Phones: the steps as a compact numbered row above the plan */}
            <ol className="grid grid-cols-4 gap-2 lg:hidden">
              {em.steps.map((step, i) => (
                <li
                  key={step.title}
                  data-at={step.at}
                  className="border-t-2 border-canvas-border pt-2 opacity-40 transition-[opacity,border-color] duration-500 ease-editorial [&.on]:border-champagne [&.on]:opacity-100"
                >
                  <span className="label block text-champagne-ink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] font-semibold leading-tight text-canvas-text">
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>

            {/* The plan */}
            <figure className="lg:col-span-7">
              <div className="rounded-[1.75rem] bg-graphite p-3 shadow-[0_30px_60px_-40px_rgba(23,23,22,0.45)] sm:p-5">
                <FloorPlan hallRef={hallRef} />
              </div>
              <figcaption className="relative mt-3 h-6 sm:mt-4">
                {em.steps.map((step) => (
                  <span
                    key={step.title}
                    data-caption
                    className="label fx-up absolute inset-x-0 top-0 text-taupe"
                  >
                    {step.caption}
                  </span>
                ))}
              </figcaption>
              {/* The full button doesn't fit a phone's pinned stage; the link does */}
              <Link
                href={em.href}
                className="label mt-2 inline-flex items-center gap-1.5 text-champagne-ink sm:hidden"
              >
                {em.cta}
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </Link>
            </figure>

            {/* Desktop: the numbered steps beside the plan */}
            <ol className="hidden lg:col-span-5 lg:block">
              {em.steps.map((step, i) => (
                <li
                  key={step.title}
                  data-at={step.at}
                  className={clsx(
                    "group/step flex gap-6 border-t border-canvas-border py-5 opacity-35 [@media(max-height:820px)]:py-3.5 transition-opacity duration-500 ease-editorial [&.on]:opacity-100",
                    i === em.steps.length - 1 && "border-b",
                  )}
                >
                  <span className="display text-[2.25rem] leading-none text-canvas-text/15 transition-colors duration-500 ease-editorial group-[.on]/step:text-champagne">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-[1.35rem] font-semibold leading-tight text-canvas-text">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.7] text-canvas-text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
