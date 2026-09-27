"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { eventGuide } from "@/lib/event-management-page";
import { useProposal } from "./proposal-context";

/**
 * design.md's Category Card grid, reduced to the photograph itself: no body
 * copy, no call to action, and the name set over the bottom-left corner rather
 * than in a panel beneath. Kept light and small on purpose — it labels the
 * picture instead of competing with it. Hairline border, no shadow.
 *
 * The scrim is what makes that safe: these photographs run from a dark
 * auditorium to a bright beach, so the type needs its own ground rather than
 * relying on the image being dark where the words land.
 *
 * Each card is still a button that opens the proposal dialog in place, seeded
 * with the chosen type, so there is no second page to maintain. With the CTA
 * text gone, the `aria-label` is the only thing telling assistive tech what a
 * card does, and the lift plus image push on hover are the only sighted cue.
 */
export function EventGuide() {
  const { open } = useProposal();

  return (
    <section id="event-guide" className="relative scroll-mt-28 bg-canvas-alt py-20">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="ds-display max-w-2xl text-[clamp(2rem,4.4vw,2.75rem)] text-canvas-text">
            <span className="font-light"> </span>
            <span className="font-semibold">
              Choose your event type
            </span>
          </h2>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
          {eventGuide.map((item, i) => (
            <Reveal as="li" key={item.slug} delay={(i % 4) * 0.05} className="h-full">
              <button
                type="button"
                onClick={() => open({ eventType: item.singular })}
                aria-label={`Request a proposal for ${item.title}`}
                className={clsx(
                  "ds-card group pressable block w-full overflow-hidden text-left [--press-scale:0.98]",
                  "hover:-translate-y-1 hover:border-champagne/40",
                  "focus-visible:-translate-y-1 focus-visible:border-champagne/40",
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 90vw"
                    className={clsx(
                      "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]",
                      item.imagePosition,
                    )}
                  />

                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/20 to-transparent"
                  />

                  <h3 className="absolute bottom-3 left-3.5 right-3.5 text-[0.8125rem] font-medium leading-snug text-white sm:bottom-5 sm:left-6 sm:right-6 sm:text-[0.9375rem]">
                    {item.title}
                  </h3>
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
