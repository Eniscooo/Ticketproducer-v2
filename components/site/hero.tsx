"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { site } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/*
 * One art-directed composition: headline above, the model rising out of a
 * single rounded plinth below, clear ground between the two so the type never
 * competes with the render.
 *
 * Plinth and gap are shares of viewport height, clamped proportionally, so the
 * composition lands the same way on a 768px laptop as on a 1080px desktop and
 * always inside one screen. The model is sized off its *width* — bounded by a
 * share of the plinth AND by viewport height — because a render scaled purely
 * off vh outgrows the plinth on anything narrower than a laptop.
 *
 * The gap is what the model rises through, so it must always exceed the model's
 * reach above the plinth; the bounds above are chosen to keep that true.
 */
const PLINTH_H = "h-[clamp(9rem,22vh,14rem)] lg:h-[clamp(12.5rem,30vh,22rem)]";
// Gap is now minimal — the model is meant to rise up INTO the headline, not clear it
/* Tight under the caption on a phone, where a paragraph follows it; the
   original breathing room from `lg`, where the render rises into the gap. */
const HEADLINE_GAP = "mb-5 lg:mb-[clamp(2rem,4vh,3.5rem)]";

/**
 * Intrinsic size of the cut-out render, for a stable aspect box. Its 1.7932
 * ratio is also hard-coded into the width classes below — Tailwind scans source
 * statically, so an interpolated class name would never be generated. Keep the
 * two in step if the asset is recut.
 */
const MODEL = { w: 1101, h: 614 };

const SPECS = [
  { label: "Based in", value: "New York" },
  { label: "Track record", value: "10+ years of live events" },
];

export function Hero() {
  const reduceMotion = useReducedMotionSafe();

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section
      id="top"
      className="grain relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-[#1A1A1A] pt-[5.5rem] pb-[clamp(1rem,3vh,1.75rem)] sm:pt-24 lg:justify-end"
    >
      {/*
       * Below `lg` the building is the hero's ground: full-bleed, held well back
       * at a third over the section's near-black so it reads as depth rather than a
       * photograph, with the scrim darkest where the headline and the spec row
       * land. The plinth composition is hidden at these widths — the render was
       * cramped there, and two grounds would compete.
       */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 lg:hidden">
        <Image
          src="/des.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%] opacity-[0.32]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/75 via-[#1A1A1A]/40 to-[#1A1A1A]/88" />
      </div>

      {/* A warm wash off the model, plus a quiet burgundy glow in the far corner — the hero's one color note besides brass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_88%,rgba(164,133,90,0.22),transparent_74%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_42%_at_90%_4%,rgba(74,27,40,0.32),transparent_70%)]"
      />

      {/* The stage below also takes `mt-auto`, and two auto margins split the
          leftover height evenly — so this lands a third of the way down rather
          than pinned to the top with all the slack under it. */}
      <div className="mx-auto mt-auto w-full max-w-[80rem] px-6 sm:px-10 lg:mt-0">
        <motion.h1
          {...rise(0.18)}
          data-reveal
          className={`display-tech text-[clamp(2.35rem,6vw,5.25rem)] tracking-[0.05em] text-white ${HEADLINE_GAP}`}
        >
          {/*
           * Two stacked lines below `lg` — "Live events," over "produced
           * properly." — rather than one caption wrapping wherever it runs out
           * of room. From `lg` the same wrappers become flex rows that push
           * their words to the margins, which is the desktop art direction.
           */}
          <span className="block lg:flex lg:items-baseline lg:justify-between lg:gap-4">
            <span>Live</span> <span>events,</span>
          </span>
          <span className="block lg:flex lg:items-baseline lg:justify-between lg:gap-4">
            <span>produced</span> <span className="text-brass-light">properly.</span>
          </span>
        </motion.h1>

        {/* The line the desktop hero leaves to the spec row and the nav */}
        <motion.p
          {...rise(0.3)}
          data-reveal
          className="max-w-lg text-[clamp(1.0625rem,4.6vw,1.25rem)] leading-[1.6] text-stone lg:hidden"
        >
          {site.description}
        </motion.p>
      </div>

      {/* Stage: plinth, the model rising out of it, the spec row over the top.
          `mt-auto` below `lg` beats the section's own `justify-center` and drops
          this block to the foot of the screen; from `lg` the plinth is back and
          the stage sits where the composition puts it. */}
      <div className="mt-auto mb-10 w-full max-w-[80rem] px-6 sm:px-10 lg:mx-auto lg:mb-0 lg:mt-0">
        <div className="relative">
          <div
            className={`relative ${PLINTH_H} hidden overflow-hidden rounded-[1.75rem] border border-bone/12 bg-charcoal lg:block`}
          >
            {/* Dawn behind the model — the plinth's ground, not the page's */}
            <Image
              src="/sky.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 75rem, 100vw"
              className="object-cover object-[50%_78%]"
            />
            {/* Blend the sky down to the plinth's own dark tone, edge to edge */}
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/15 via-charcoal/60 to-charcoal/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-transparent to-charcoal/80" />

            {/* Light catching the leading edge, brightest at the centre */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(242,238,230,0.32),transparent)]"
            />
          </div>

          {/*
           * Desktop only: the render settles into the plinth, held to a share of
           * the width so the two copy columns stay clear of it. Below `lg` the
           * full-bleed building above replaces this whole composition.
           */}
          <motion.div
       aria-hidden
      className="pointer-events-none absolute bottom-[calc(100%-9rem)] left-1/2 z-10 hidden w-[min(96%,34rem,calc(38vh*1.7932))] -translate-x-1/2 lg:bottom-4 lg:block lg:w-[min(85%,calc(65vh*1.7932),74rem)]"
      style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}` }}
            initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 76, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 1.9, delay: 0.3, ease: EASE }
            }
          >
            <Image
              src="/model.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 830px, (min-width: 640px) 620px, 90vw"
              className="object-contain object-bottom"
            />
          </motion.div>

          <motion.div
            {...rise(0.5)}
            data-reveal
            className="mt-9 flex flex-col justify-between gap-5 lg:absolute lg:inset-0 lg:z-20 lg:mt-0 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6 lg:p-7"
          >
            <dl className="flex flex-wrap gap-x-10 gap-y-4 lg:flex-col lg:gap-5">
              {SPECS.map((spec) => (
                <div key={spec.label}>
                  <dt className="label">{spec.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug text-stone lg:max-w-[11rem]">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Duplicated by the nav — dropped below `lg`, where the plinth is gone */}
            <div className="hidden text-right lg:block">
              <p className="label">Services</p>
              <ul className="mt-1.5 space-y-1">
                {site.services.map((item) => (
                  <li key={item.href} className="text-sm leading-snug text-stone">
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
