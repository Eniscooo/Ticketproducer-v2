"use client";

import { Reveal } from "@/components/ui/reveal";
import { HeroTicketScene } from "./hero-ticket-scene";
import { trHero } from "@/lib/ticket-resale-page";
import { EventSearch } from "./event-search";

/*
 * Headline first, centred; then the product in 3D — a digital ticket standing
 * in perspective and cycling through Broadway shows, with discovery, the live
 * seat count, the purchase confirmation and the resale market floating around
 * it in glass (see `HeroTicketScene`); then the search, directly under it.
 *
 * The scene is decorative and hidden from assistive tech; every event it
 * hints at is reachable from the search and the rails below.
 */
export function TrHero({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-paper pb-10 pt-24 sm:pb-12 sm:pt-32">
      {/* Stage light: a warm pool behind the ticket, the way a spot falls on a curtain */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[14rem] -z-10 h-[40rem] w-[min(76rem,130vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-curtain)_13%,transparent),color-mix(in_srgb,var(--color-brass)_10%,transparent)_55%,transparent)] blur-2xl sm:top-[16rem]"
      />

      <div className="mx-auto w-full max-w-[48rem] px-6 text-center sm:px-10">
        <Reveal immediate>
          
          {/* `text-balance` evens the two lines it wraps to on a phone, instead
              of leaving one word alone on the second. */}
          <h1 className="ds-display mt-5 text-balance text-[clamp(2.25rem,5.6vw,3.75rem)] text-canvas-text">
            {trHero.headline}
          </h1>
          <p className="ds-body mx-auto mt-4 max-w-lg text-pretty text-canvas-text-muted sm:mt-5">
            {trHero.body}
          </p>
        </Reveal>
      </div>

      <HeroTicketScene className="mt-6 px-4 sm:mt-8 sm:px-6" />

      {/* Search sits under the ticket — the step after "this is what you get" is "find yours".
          Lifted above the scene's layer so a floating card's shadow never sits over it. */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-[48rem] px-6 sm:mt-6 sm:px-10">
        <Reveal delay={0.1} className="mx-auto max-w-xl">
          <EventSearch onSearch={onSearch} placeholder={trHero.searchPlaceholder} />
        </Reveal>
      </div>
    </section>
  );
}
