"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { testimonials, type Testimonial } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;
const AUTOPLAY_MS = 5500;

/** Only portraits belong in the large frame — no quote borrows another client's face. */
const featured = testimonials.filter((testimonial) => testimonial.image);

const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

/**
 * One card in the scrolling column. Each pass of the loop renders the full set,
 * so this lives outside the component rather than being written twice inline.
 */
function ReviewCard({
  testimonial,
  showQuoteMark,
}: {
  testimonial: Testimonial;
  showQuoteMark: boolean;
}) {
  return (
    <div className="rounded-[1.75rem] border border-canvas-border bg-graphite/[0.025] p-8 sm:p-9">
      {showQuoteMark ? (
        <div className="mb-5 text-4xl leading-none text-champagne">&ldquo;</div>
      ) : null}

      <p className="text-base leading-7 text-canvas-text/70 sm:text-lg">{testimonial.quote}</p>

      <div className="mt-7 flex items-center gap-4">
        {testimonial.image ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-champagne/20">
            <Image
              src={testimonial.image}
              alt=""
              fill
              sizes="48px"
              className={clsx("object-cover", testimonial.avatarClass)}
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-champagne/20 text-sm font-semibold text-canvas-text">
            {initials(testimonial.name)}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-canvas-text">{testimonial.name}</p>
          <p className="label mt-1 text-canvas-text/50">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const reduceMotion = useReducedMotionSafe();

  useEffect(() => {
    if (reduceMotion || paused || featured.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [reduceMotion, paused]);

  const current = featured[index];

  const duration = reduceMotion ? 0.01 : 0.9;

  return (
    <section
      className="relative -mt-8 overflow-hidden rounded-t-[2rem] bg-paper py-20 shadow-[0_-24px_50px_-35px_rgba(23,23,22,0.12)] sm:py-28 lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="display max-w-2xl text-[clamp(2.25rem,5.4vw,3.75rem)] text-canvas-text">
            What Our Client Says.
          </h2>
        </Reveal>

        <div className="relative mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[1.02fr_1fr] lg:items-start">
          {/* Left — the client at full size, quote written over the frame */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] sm:aspect-[16/10] lg:aspect-auto lg:h-[500px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image as string}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={clsx("object-cover", current.imageClass)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/20 to-transparent" />

                <div className="absolute inset-x-6 bottom-6 max-w-2xl sm:inset-x-10 sm:bottom-10">
                  <p className="text-[1.0625rem] leading-[1.7] text-white sm:text-[1.5rem]">
                    &ldquo;{current.quote}&rdquo;
                  </p>

                  <p className="mt-5 text-sm font-semibold text-white">{current.name}</p>

                  <p className="label mt-1 text-linen/75">{current.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — every review, drifting past on a loop */}
          <div className="relative h-[500px] overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-paper to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-paper to-transparent" />

            <motion.div
              className="flex flex-col gap-6"
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            >
              {/* Two identical passes, so the loop can translate exactly one of them */}
              {[0, 1].map((pass) =>
                testimonials.map((testimonial, i) => (
                  <ReviewCard
                    key={`${pass}-${testimonial.name}`}
                    testimonial={testimonial}
                    showQuoteMark={i % 2 === 1}
                  />
                )),
              )}
            </motion.div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 lg:justify-start">
          {featured.map((testimonial, i) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${testimonial.name}`}
              aria-current={i === index}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-500 ease-editorial",
                i === index
                  ? "w-7 bg-champagne"
                  : "w-1.5 bg-canvas-text/15 hover:bg-canvas-text/30",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
