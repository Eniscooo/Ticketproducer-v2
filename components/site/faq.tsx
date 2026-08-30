"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { faq, type FaqItem } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * Two-column FAQ: the framing copy holds the left column while the questions
 * stack as compact filled cards on the right. Far shorter than a full-width
 * accordion, and it follows design.md — rounded containers, subtle fill
 * instead of shadow, compact internal density.
 *
 * Shared by /services and /event-management; defaults reproduce the site-wide
 * content and the `#faq` anchor the nav links to.
 */
export function Faq({
  items = faq,
  id = "faq",
  headingLight = "Frequently",
  headingBold = "Asked Questions",
  body = "Answers to what producers and venues ask most. If your situation isn't here, the line below is answered by the people who would run your event.",
  compact = false,
}: {
  items?: readonly FaqItem[];
  id?: string;
  headingLight?: string;
  headingBold?: string;
  body?: string;
  /** Tighter vertical rhythm, for routes that run their sections closer together. */
  compact?: boolean;
} = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotionSafe();
  const uid = useId();

  return (
    <section
      id={id}
      className={clsx(
        "relative -mt-8 scroll-mt-28 rounded-t-[2rem] bg-paper shadow-[0_-24px_50px_-35px_rgba(23,23,22,0.1)]",
        compact ? "py-12 sm:py-14" : "py-20 sm:py-24",
      )}
    >
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: framing */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="ds-display text-[clamp(2rem,4.4vw,2.75rem)] text-canvas-text">
                <span className="font-light">{headingLight} </span>
                <span className="font-semibold">{headingBold}</span>
              </h2>
              <p className="ds-body mt-5 max-w-sm text-canvas-text-muted">{body}</p>
              <Link
                href="/services#contact"
                className="ds-btn-primary mt-8 rounded-control"
              >
                Contact Us
              </Link>
            </Reveal>
          </div>

          {/* Right: compact question cards */}
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <dl className="flex flex-col gap-2.5">
                {items.map((item, i) => {
                  const open = openIndex === i;
                  const answerId = `${uid}-answer-${i}`;
                  return (
                    <div
                      key={item.question}
                      className={clsx(
                        "overflow-hidden rounded-control transition-colors duration-500 ease-editorial",
                        open ? "bg-canvas-alt" : "bg-canvas-alt/70 hover:bg-canvas-alt",
                      )}
                    >
                      <dt>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(open ? null : i)}
                          aria-expanded={open}
                          aria-controls={answerId}
                          className="group flex w-full items-center justify-between gap-5 px-5 py-4 text-left sm:px-6 sm:py-[1.15rem]"
                        >
                          <span className="text-[0.9375rem] font-medium leading-snug text-canvas-text sm:text-base">
                            {item.question}
                          </span>
                          <Plus
                            aria-hidden
                            className={clsx(
                              "h-4 w-4 shrink-0 text-canvas-text-muted transition-transform duration-500 ease-editorial",
                              open && "rotate-45 text-champagne",
                            )}
                          />
                        </button>
                      </dt>
                      <AnimatePresence initial={false}>
                        {open ? (
                          <motion.dd
                            id={answerId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: reduceMotion ? 0.01 : 0.4,
                              ease: EASE,
                            }}
                            className="overflow-hidden"
                          >
                            <p className="ds-body px-5 pb-5 pr-10 text-canvas-text-muted sm:px-6 sm:pb-6">
                              {item.answer}
                            </p>
                          </motion.dd>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
