"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { sides, site } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/** The two doors, in the order a visitor is most likely to need them. */
const DOORS = [
  { side: sides.events, prompt: "I'm planning an event" },
  { side: sides.tickets, prompt: "I'm looking for tickets" },
];

/**
 * The front door. Midtown at night does the scene-setting — the city is the
 * one thing both of our customers have in common — and the copy says plainly
 * what the company does. The two doors sit right in the hero for returning
 * visitors who already know which side they want; everyone else scrolls on
 * and gets the full picture before being asked again at the foot of the page.
 *
 * The photograph eases in from a slight zoom on load and then holds still.
 * Under reduced motion it is simply there.
 */
export function LandingHero() {
  const reduceMotion = useReducedMotionSafe();

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section
      id="top"
      className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden bg-ink pb-12 pt-28 sm:pb-16 lg:pb-20"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={reduceMotion ? { scale: 1 } : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 2.6, ease: EASE }}
      >
        <Image
          src="/nyc/skyline-midtown.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
      </motion.div>
      {/* Heaviest at the foot, where the type and the doors land */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/95"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent"
      />

      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-10">
        <motion.p {...rise(0.15)} data-reveal className="label text-brass-light">
          New York · Live Events · Tickets
        </motion.p>

        <motion.h1
          {...rise(0.25)}
          data-reveal
          className="display-tech mt-5 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.98] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
        >
          Live events, <span className="text-brass-light">produced properly.</span>
        </motion.h1>

        <motion.p
          {...rise(0.35)}
          data-reveal
          className="mt-6 max-w-xl text-[clamp(1.05rem,2.2vw,1.25rem)] leading-[1.6] text-bone/85"
        >
          {site.description}
        </motion.p>

        <motion.div
          {...rise(0.48)}
          data-reveal
          className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2"
        >
          {DOORS.map(({ side, prompt }) => (
            <Link
              key={side.key}
              href={side.href}
              className="group pressable relative flex items-end justify-between gap-6 overflow-hidden rounded-[1.5rem] border border-bone/15 bg-ink/45 p-5 backdrop-blur-md [--press-scale:0.985] hover:border-brass/60 hover:bg-ink/60 sm:p-6"
            >
              <span>
                <span className="label block text-stone">{side.audience}</span>
                <span className="mt-2 block font-display text-[1.375rem] font-semibold leading-tight text-white sm:text-[1.5rem]">
                  {prompt}
                </span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass text-ink transition-transform duration-300 ease-ui group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </motion.div>

        <motion.a
          {...rise(0.6)}
          data-reveal
          href="#sides"
          className="label mt-8 inline-flex items-center gap-2 text-stone transition-colors duration-300 ease-ui hover:text-bone"
        >
          Not sure yet? See what we do
          <ArrowDown aria-hidden className="h-3.5 w-3.5" />
        </motion.a>
      </div>
    </section>
  );
}
