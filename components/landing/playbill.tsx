"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useSpring, useTransform, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { playbill } from "@/lib/landing";
import { InView } from "./motion";

/** The follower's spring — quick enough to keep up, soft enough to feel carried. */
const FOLLOW = { stiffness: 260, damping: 28, mass: 0.6 };

/**
 * The programme: Broadway's anchors as a typeset list, the way a Playbill
 * prints its credits. It's the one dark room on the page.
 *
 * On a fine pointer, a portrait of the show you're over trails just right of
 * the cursor (never over the title you're reading) on
 * a spring and leans a few degrees with its speed — decoration, so it is
 * allowed to be springy. Switching rows crossfades the portraits through a
 * 6px blur, so it reads as one picture changing rather than two swapping.
 * The rest of the list dims while you're in it, keeping the row you're on in
 * focus. Touch screens get a small thumbnail in each row instead, and reduced
 * motion pins the portrait without the spring or the lean.
 */
export function Playbill() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotionSafe();
  const [active, setActive] = useState<number | null>(null);

  const x = useSpring(0, reduceMotion ? { stiffness: 10000, damping: 1000 } : FOLLOW);
  const y = useSpring(0, reduceMotion ? { stiffness: 10000, damping: 1000 } : FOLLOW);
  const lean = useTransform(useVelocity(x), [-1800, 1800], reduceMotion ? [0, 0] : [-9, 9], {
    clamp: true,
  });

  const follow = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={follow}
      className="relative isolate -mt-8 overflow-hidden rounded-t-[2rem] bg-ink py-24 text-bone sm:py-32"
    >
      {/* The follower — fine pointers only; it never takes the pointer, so rows stay clickable */}
      <motion.div
        aria-hidden
        style={{ x, y, rotate: lean }}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <div
          className={clsx(
            "relative ml-8 -mt-[9.6rem] aspect-[720/920] w-[15rem] overflow-hidden rounded-[1.25rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]",
            "transition-[opacity,scale] duration-300 ease-ui",
            active === null ? "scale-90 opacity-0" : "scale-100 opacity-100",
          )}
        >
          {playbill.map((show, i) => (
            <Image
              key={show.image}
              src={show.image}
              alt=""
              fill
              sizes="15rem"
              className={clsx(
                "object-cover transition-[opacity,filter] duration-300 ease-ui",
                active === i ? "opacity-100 blur-0" : "opacity-0 blur-[6px]",
              )}
            />
          ))}
        </div>
      </motion.div>

      <div className="mx-auto w-full max-w-[76rem] px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <InView>
            <p className="text-[0.8125rem] font-medium text-champagne">The programme</p>
            <h2 className="mt-3 font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
              On Broadway.
            </h2>
          </InView>
          <InView delay={60}>
            <Link
              href="/ticket-resale#theater"
              className="press group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-bone/80 transition-[color,scale] duration-200 ease-ui hover:text-white"
            >
              Every show and date
              <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-200 ease-ui group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </InView>
        </div>

        <ol
          onPointerLeave={() => setActive(null)}
          className="group/list mt-12 border-t border-white/10 sm:mt-16"
        >
          {playbill.map((show, i) => (
            <InView
              key={show.title}
              as="li"
              delay={i * 40}
              className="border-b border-white/10 transition-opacity duration-200 ease-ui [@media(hover:hover)_and_(pointer:fine)]:group-hover/list:opacity-35 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100!"
            >
              <Link
                href={show.href}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(null)}
                className="group flex items-center gap-4 py-5 outline-none focus-visible:bg-white/[0.04] sm:gap-6 sm:py-6"
              >
                {/* Touch screens: the portrait lives in the row, since nothing can trail a finger */}
                <span className="relative hidden aspect-[720/920] w-11 shrink-0 overflow-hidden rounded-md [@media(hover:none)]:block">
                  <Image src={show.image} alt="" fill sizes="2.75rem" className="object-cover" />
                </span>
                <span className="hidden w-12 shrink-0 text-[0.8125rem] tabular-nums text-stone-dim sm:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 font-display text-[clamp(1.5rem,3.6vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white transition-[translate] duration-300 ease-ui group-hover:translate-x-2">
                  {show.title}
                </span>
                <span className="hidden text-[0.875rem] text-stone sm:block">{show.theatre}</span>
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-stone transition-[translate,color] duration-200 ease-ui group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-champagne"
                />
              </Link>
            </InView>
          ))}
        </ol>
        <p className="mt-6 text-[0.8125rem] text-stone-dim">
          Show titles belong to their productions. Availability changes nightly.
        </p>
      </div>
    </section>
  );
}
