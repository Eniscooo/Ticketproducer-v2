"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Action } from "@/components/ui/primitives";
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
const PLINTH_H =
  "h-[clamp(9rem,22vh,14rem)] lg:h-[clamp(12.5rem,30vh,22rem)] 2xl:h-[clamp(16rem,34vh,26rem)]";
/*
 * Tight under the caption on a phone, where a paragraph follows it. Roomier
 * from `lg`. At `2xl` it is computed rather than chosen: see the note on the
 * calc below.
 */
const HEADLINE_GAP =
  "mb-8 lg:mb-[clamp(2rem,4vh,3.5rem)] 2xl:mb-[calc(34rem-clamp(16rem,34vh,26rem))]";

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
      /* `2xl:` is "desktop monitor" here and `lg:` is "laptop" — the extra bottom
         padding lifts the whole bottom-aligned composition off the floor on a big
         screen, where it was sitting too low, and changes nothing at laptop size. */
      className="grain relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-[#1A1A1A] pt-[5.5rem] pb-[clamp(1rem,3vh,1.75rem)] sm:pt-24 lg:justify-end 2xl:justify-center 2xl:pb-[clamp(3.5rem,7vh,6.5rem)]"
    >
      {/*
       * Below `lg` the building is the hero's ground: full-bleed, over the
       * section's near-black, with the scrim heaviest where the headline and the
       * spec row land. The plinth composition is hidden at these widths — the
       * render was cramped there, and two grounds would compete.
       *
       * Two numbers set how bright this reads: the image's own `opacity`, and
       * the scrim stops on the gradient below it. Both were pulled up so the
       * building is legible as a photograph rather than a suggestion of one.
       */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 lg:hidden">
        <Image
          src="/des.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%] opacity-[0.62]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/55 via-[#1A1A1A]/20 to-[#1A1A1A]/82" />
      </div>

      {/* A warm wash off the model, plus a quiet burgundy glow in the far corner — the hero's one color note besides brass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_88%,rgba(164,133,90,0.32),transparent_74%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_42%_at_90%_4%,rgba(74,27,40,0.42),transparent_70%)]"
      />
      {/* Vignette. The ground is a single flat value corner to corner, which
          reads as paint; pulling the edges down lets the lit centre come
          forward. Kept shallow — at this strength it is felt, not seen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(115%_95%_at_50%_45%,transparent_42%,rgba(0,0,0,0.42))]"
      />

      {/* `relative z-20` puts the type in front of the render. The cut-out is
          `z-10` and rises deliberately into this space — the spec row already
          sits at `z-20` for the same reason; the headline was the one piece
          still unstacked, so the building painted straight over it. */}
      {/* The 80rem shell is the site's column everywhere else, but the hero is
          the one full-bleed composition on the page and looked boxed-in on a
          wide monitor. From `2xl` it opens to 104rem, still capped at 92vw so
          an ultrawide keeps a margin instead of running to the bezels. Widening
          this also widens the headline, whose two lines are `justify-between` —
          so the words push further into the corners, which is the point. */}
      <div className="relative z-20 mx-auto mt-auto w-full max-w-[80rem] px-6 sm:px-10 lg:mt-0 2xl:mt-[clamp(4rem,12vh,11rem)] 2xl:max-w-[min(104rem,92vw)] 2xl:px-12">
        <motion.h1
          {...rise(0.18)}
          data-reveal
          /*
           * The shadow lifts white off the photograph, and below `lg` there is a
           * photograph. From `lg` the type sits on flat near-black and the same
           * shadow is just a grey halo eating the letterforms, so it comes off.
           *
           * Tracking tightens as the type grows. Letterspacing is an optical
           * correction for small text; at 108px, 0.05em is 5.4px of air between
           * characters and the word stops reading as one shape.
           */
          className={`display-tech text-[clamp(2.35rem,6vw,5.25rem)] tracking-[0.05em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] lg:[text-shadow:none] lg:tracking-[0.035em] 2xl:text-[clamp(5.25rem,6.4vw,6.75rem)] 2xl:tracking-[0.02em] ${HEADLINE_GAP}`}
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

        {/* The line the desktop hero leaves to the spec row and the nav.
            `bone/90` rather than `stone` — stone is a muted grey that went flat
            against the brighter ground. */}
        <motion.p
          {...rise(0.3)}
          data-reveal
          /* `#e8dcc4` is bone pulled toward brass — warm enough to read as gold
             against the photograph without costing a paragraph its legibility. */
          className="max-w-lg text-[clamp(1.25rem,5.6vw,1.6rem)] font-medium leading-[1.45] text-[#e8dcc4] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] lg:hidden"
        >
          {site.description}
        </motion.p>

        {/* Mobile only — the desktop hero's composition is the plinth, the render
            rising out of it, and the spec row over the top; a button in that space
            competed with all three. */}
        <motion.div {...rise(0.42)} data-reveal className="mt-7 lg:hidden">
          <Action href="#event-management" tone="brass" size="lg">
            Explore services
          </Action>
        </motion.div>
      </div>

      {/* Stage: plinth, the model rising out of it, the spec row over the top.
          `mt-auto` below `lg` beats the section's own `justify-center` and drops
          this block to the foot of the screen; from `lg` the plinth is back and
          the stage sits where the composition puts it. */}
      <div className="mt-auto mb-10 w-full max-w-[80rem] px-6 sm:px-10 lg:mx-auto lg:mb-0 lg:mt-0 2xl:max-w-[min(104rem,92vw)] 2xl:px-12">
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
           *
           * The `2xl` cap is a firm 70rem, not a percentage. The shell widens to
           * 104rem there, and a percentage would have grown the render with it —
           * which moves its peak, and the headline gap is computed off exactly
           * that peak. Pinning the width keeps the type sitting on the building
           * at every monitor size instead of drifting as the shell changes.
           */}
          <motion.div
       aria-hidden
      className="pointer-events-none absolute bottom-[calc(100%-9rem)] left-1/2 z-10 hidden w-[min(96%,34rem,calc(38vh*1.7932))] -translate-x-1/2 lg:bottom-4 lg:block lg:w-[min(85%,calc(65vh*1.7932),74rem)] 2xl:w-[min(86%,calc(70vh*1.7932),70rem)]"
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
            {/*
             * Below `lg` the two specs anchor opposite ends of the hero's foot:
             * `justify-between` pushes the last one right, and `last:text-right`
             * turns its own type around to meet that edge. Both are undone at
             * `lg`, where the same list becomes a left-aligned column inside the
             * plinth — `justify-between` on a `flex-col` would spread it
             * vertically instead.
             *
             * The size and weight bumps are on the whole list, not just the
             * right-hand spec: two facts in the same row at different sizes read
             * as a mistake. Scope them with `last:` if you want only one.
             */}
            <dl className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 lg:flex-col lg:justify-start lg:gap-5">
              {SPECS.map((spec) => (
                <div
                  key={spec.label}
                  /* The reset carries `last:` too, deliberately. The rule it undoes
                     compiles to `.last\:text-right:last-child` — a class plus a
                     pseudo-class — and a media query adds no specificity, so a plain
                     breakpoint variant is one lower and lost silently at every width.
                     (Written without the losing class name: Tailwind scans comments
                     as source, and naming it here generated a dead utility.) */
                  className="max-w-[48%] last:text-right lg:max-w-none lg:last:text-left"
                >
                  <dt className="label text-[0.875rem] font-black text-brass-light lg:text-[0.8125rem] lg:font-medium lg:text-stone-dim">
                    {spec.label}
                  </dt>
                  <dd className="mt-1.5 text-[1.0625rem] font-black leading-snug text-bone/90 lg:mt-2 lg:max-w-[13rem] lg:text-[1.0625rem] lg:font-normal lg:text-stone">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Duplicated by the nav — dropped below `lg`, where the plinth is gone */}
            <div className="hidden text-right lg:block">
              <p className="label lg:text-[0.8125rem]">Services</p>
              <ul className="mt-2 space-y-1.5">
                {site.services.map((item) => (
                  <li key={item.href} className="text-[1.0625rem] leading-snug text-stone">
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
