"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { trHero } from "@/lib/ticket-resale-page";
import { EventSearch } from "./event-search";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/*
 * Asymmetric composition: headline, body, and search hold the left column;
 * two large venue panels stack on the right — the front one bigger and
 * dropped to the baseline, the back one lifted, tilted, and half hidden
 * behind it. Read as one piece of hero artwork, not as two listing cards.
 *
 * Both panels are placed in percentages inside one aspect box, so the overlap
 * keeps its proportions at every width and only the box's own width changes
 * across breakpoints. The box stays square at every width, which is what gives
 * the front panel its portrait proportion — 66% x 92% of a square is roughly the
 * 0.72 the reference composition uses — and it runs the full height of the hero
 * from the baseline up. The columns are centred, so the headline, body, and
 * search sit in the middle of that height rather than at its foot.
 *
 * The tilt lives on a plain wrapper rather than on the animated element:
 * Framer Motion writes `transform` inline, so a `-rotate-3` class on the same
 * node would be overwritten the moment the entrance animation runs.
 */
const PANELS = {
  /** Proscenium and curtain — the source is already portrait, so cover barely crops. */
  front: { src: "/gianni.jpg", position: "object-[50%_40%]" },
  /** Marquee and tower, centred; a portrait crop of a landscape frame. */
  back: { src: "/CHASE.jpg", position: "object-[50%_45%]" },
};

/**
 * Imagery is the same venue photography the listing cards use — see the note
 * at the top of lib/ticket-resale-page.ts — cropped tighter for hero scale.
 * It is decorative: nothing here is a control, and every event in it is
 * reachable from the rails below.
 */
export function TrHero({ onSearch }: { onSearch: (query: string) => void }) {
  const reduceMotion = useReducedMotionSafe();

  /*
   * One entrance for both panels, differing only in delay and travel. The
   * `animate` target is always passed, never dropped for reduced motion:
   * `useReducedMotionSafe` reports `false` on the server and corrects itself
   * after hydration, and a motion node that loses its target mid-flight keeps
   * whatever inline opacity it had reached — which leaves the panels blank.
   */
  const settle = (delay: number, distance: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 1.4, delay, ease: EASE },
  });

  return (
    <section id="top" className="relative bg-paper pb-9 pt-20 sm:pb-8 sm:pt-30 lg:pb-10">
      {/* The stack is tighter below `sm`: on a phone this is three things in a
          column with the artwork under them, and the desktop gap left the copy
          stranded at the top of the screen with a hole beneath it. */}
      <div className="mx-auto grid w-full max-w-[75rem] items-center gap-y-9 px-6 sm:gap-y-16 sm:px-10 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
        <div className="lg:col-span-6">
          <Reveal>
            {/* `text-balance` evens the two lines it wraps to on a phone, instead
                of leaving one word alone on the second. */}
            <h1 className="ds-display text-balance text-[clamp(2.25rem,5.6vw,3.5rem)] text-canvas-text">
              {trHero.headline}
            </h1>
            <p className="ds-body mt-4 max-w-md text-pretty text-canvas-text-muted sm:mt-5 sm:max-w-lg">
              {trHero.body}
            </p>
          </Reveal>

          {/* The form centres itself inside whatever box it is given — the max-width
              here is what keeps it flush with the headline on wide single-column
              layouts instead of drifting to the middle of the column. */}
          <Reveal delay={0.1} className="mt-7 max-w-xl sm:mt-8">
            <EventSearch onSearch={onSearch} placeholder={trHero.searchPlaceholder} />
          </Reveal>
        </div>

        <div aria-hidden className="lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-[23rem] sm:max-w-[32rem] lg:mx-0 lg:max-w-none">
            <div className="absolute left-0 top-0 h-[62%] w-[52%] -rotate-3">
              <motion.div
                {...settle(0.45, 26)}
                data-reveal
                className="relative h-full w-full overflow-hidden rounded-card"
              >
                <Image
                  src={PANELS.back.src}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 640px) 18rem, 50vw"
                  className={`object-cover ${PANELS.back.position}`}
                />
              </motion.div>
            </div>

            <motion.div
              {...settle(0.2, 44)}
              data-reveal
              className="absolute bottom-0 right-0 z-10 h-[92%] w-[66%] overflow-hidden rounded-card shadow-[0_40px_80px_-45px_rgba(23,23,22,0.45)]"
            >
              {/*
               * Above the fold and the largest thing in it, so it is the LCP
               * candidate: eager plus a high fetch priority. Next 16 deprecated
               * `priority` in favour of `preload`, and the docs steer hero
               * imagery to these two rather than a head-injected preload link.
               */}
              <Image
                src={PANELS.front.src}
                alt=""
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 23rem, (min-width: 640px) 21rem, 62vw"
                className={`object-cover ${PANELS.front.position}`}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
