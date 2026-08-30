import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MarketLattice } from "@/components/art/architecture";
import { Action } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ticketResale as tr } from "@/lib/site";

/** The coverage of the desk, stated flatly — no invented metrics. */
const COVERAGE = [
  "Primary market",
  "Secondary market",
  "Inventory",
  "Pricing",
  "Trust & control",
];

export function TicketResale() {
  return (
    <section
      id="ticket-resale"
      className="relative isolate -mt-10 scroll-mt-28 overflow-hidden rounded-t-[2.5rem] bg-canvas-alt py-20 shadow-[0_-30px_70px_-40px_rgba(23,23,22,0.12)] sm:-mt-12 sm:py-28 lg:py-36"
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

        {/* Prominent imagery — the desk's inventory, not an illustration of it */}
        <Reveal delay={0.08} className="mt-12 sm:mt-16">
          <div className="relative aspect-[16/7] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/tix.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 84rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-graphite/80 via-graphite/15 to-transparent" />
            <span className="label absolute bottom-5 left-6 text-linen/90 sm:bottom-7 sm:left-9">
              Primary &amp; secondary markets, tracked
            </span>
          </div>
        </Reveal>

        {/* A bordered briefing panel — strategic and business-plain, not a card grid */}
        <Reveal delay={0.1} className="mt-8 sm:mt-10">
          <div className="overflow-hidden rounded-[1.75rem] border border-canvas-border bg-surface/70">
            <div className="grid lg:grid-cols-2">
              {tr.items.map((item, i) => (
                <div
                  key={item.title}
                  className={
                    i === 0
                      ? "group border-b border-canvas-border p-10 sm:p-12 lg:border-b-0 lg:border-r"
                      : "group p-10 sm:p-12"
                  }
                >
                  <div className="flex items-baseline gap-5">
                    <span className="label label-champagne tabular-nums">
                      {tr.index}.{i + 1}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-canvas-text/12 transition-colors duration-1000 ease-editorial group-hover:bg-champagne/60"
                    />
                  </div>
                  <h3 className="font-display mt-8 text-[1.9rem] font-semibold leading-[1.1] text-canvas-text sm:text-[2.35rem]">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.85] text-canvas-text-muted transition-colors duration-700 ease-editorial group-hover:text-canvas-text/80">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-14 flex flex-wrap items-center gap-3 sm:mt-16">
            {COVERAGE.map((item) => (
              <li
                key={item}
                className="label rounded-full border border-canvas-border px-4 py-2 text-taupe"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Closes the section on the marketplace itself rather than the coverage row */}
        <Reveal delay={0.26} className="mt-10 sm:mt-12">
          <Action href={tr.href} tone="ink">
            {tr.cta}
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Action>
        </Reveal>
      </div>
    </section>
  );
}
