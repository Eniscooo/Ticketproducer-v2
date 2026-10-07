import { ArrowUpRight } from "lucide-react";
import { MarketLattice } from "@/components/art/architecture";
import { Action } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ticketResale as tr } from "@/lib/site";
import { CheckinScanner } from "./checkin-scanner";
import { SalesFeed } from "./sales-feed";

export function TicketResale() {
  return (
    <section
      id="ticket-resale"
      className="relative isolate mx-auto w-full max-w-[78rem] scroll-mt-28 rounded-feature overflow-hidden border border-canvas-border bg-paper py-14 shadow-[0_-22px_48px_-26px_rgba(23,23,22,0.3)] sm:py-20"
    >
      {/* Structural band: infrastructure, held low and quiet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 opacity-[0.14] sm:h-96"
      >
        <MarketLattice />
      </div>

      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="display text-[clamp(2.5rem,7vw,5.25rem)] text-canvas-text">
              {tr.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="max-w-md text-[0.95rem] leading-[1.9] text-canvas-text-muted">
              {tr.description}
            </p>
          </Reveal>
        </div>

        {/* The desk at work: doors on one side, the order book on the other */}
        <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-2">
          <Reveal delay={0.08} className="h-full">
            <CheckinScanner />
          </Reveal>
          <Reveal delay={0.14} className="h-full">
            <SalesFeed />
          </Reveal>
        </div>

        {/* Closes the section on the marketplace itself rather than the coverage row */}
        <Reveal delay={0.2} className="mt-10 sm:mt-12">
          <Action href={tr.href} tone="ink">
            {tr.cta}
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-300 ease-ui group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Action>
        </Reveal>
      </div>
    </section>
  );
}
