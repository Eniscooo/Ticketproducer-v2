"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { eventGuide } from "@/lib/event-management-page";
import { EmSectionHeader } from "./em-section-header";
import { useProposal } from "./proposal-context";

/**
 * Event types as tall photo cards. The name sits in a frosted glass bar at the
 * foot of each photograph, with an arrow that turns to face you on hover —
 * the same glass the rest of the site uses for things you can act on.
 *
 * The scrim under the bar is what keeps the type safe: these photographs run
 * from a dark auditorium to a bright beach, so the label needs its own ground.
 *
 * Each card is a button that opens the proposal dialog in place, seeded with
 * the chosen type. The `aria-label` tells assistive tech what it does; the
 * lift, the image push and the arrow are the sighted cues.
 */
export function EventGuide() {
  const { open } = useProposal();

  return (
    <section id="event-guide" className="relative scroll-mt-28 bg-canvas-alt py-24">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <EmSectionHeader
          eyebrow="Event types"
          light="Choose your"
          bold="event type"
          body="Pick the closest fit and we'll come back with a proposal shaped around it."
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
          {eventGuide.map((item, i) => (
            <Reveal as="li" key={item.slug} delay={(i % 4) * 0.05} className="h-full">
              <button
                type="button"
                onClick={() => open({ eventType: item.singular })}
                aria-label={`Request a proposal for ${item.title}`}
                className={clsx(
                  "group pressable relative block aspect-[4/5] w-full overflow-hidden rounded-feature text-left [--press-scale:0.98]",
                  "shadow-[0_18px_40px_-28px_rgba(23,23,22,0.55)] ring-1 ring-inset ring-black/5",
                  "transition-[translate,box-shadow] duration-500 ease-editorial",
                  "hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(23,23,22,0.6)]",
                  "focus-visible:-translate-y-1.5",
                )}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 50vw"
                  className={clsx(
                    "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]",
                    item.imagePosition,
                  )}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent"
                />

                {/* Frosted bar: the type's name and the way in */}
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-[1.1rem] border border-white/20 bg-white/12 px-3 py-2.5 backdrop-blur-md sm:inset-x-3 sm:bottom-3 sm:px-4 sm:py-3">
                  <h3 className="min-w-0 text-[0.8125rem] font-semibold leading-snug text-white sm:text-[0.9375rem]">
                    {item.title}
                  </h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-editorial group-hover:rotate-45 sm:h-8 sm:w-8">
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
