import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { broadwayReel } from "@/lib/broadway-reel";
import { BroadwayCarousel } from "./broadway-carousel";
import { InView } from "./motion";

/** When the margin notes start writing themselves in — after the copy and the reel have landed. */
const NOTES = 1100;

/** A stroke that draws itself in; `at` is its start, in ms. */
function Stroke({ d, at }: { d: string; at: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      className="ink"
      style={{ ["--d" as string]: `${at}ms` }}
    />
  );
}

/**
 * The front door. A cream stage, a short headline, and the Broadway reel
 * curving across the full width under it. The two doors — tickets and events —
 * sit under the pictures, so the page never pretends the company is only one
 * of them; the tickets door carries the colour because that's who most
 * visitors are.
 *
 * Entrances are one staggered rise (60ms apart), then the reel, then the
 * margin notes write themselves in last — decoration arrives after content.
 */
export function LandingHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-canvas-alt pb-24 pt-28 sm:pb-28 sm:pt-32"
    >
      <div className="mx-auto w-full max-w-[64rem] px-6 text-center sm:px-10">
       

        <InView immediate delay={60}>
          <h1 className="mx-auto mt-5 text-balance font-display text-[clamp(2.25rem,4.7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-canvas-text">
            Find Your Seat for
            <br className="hidden sm:block" /> Broadway&rsquo;s Biggest Nights
          </h1>
        </InView>

        {/* The description carries the margin notes, so they track its edges at every width */}
        <div className="relative mx-auto mt-5 max-w-[27rem]">
          <InView immediate delay={120}>
            <p className="text-pretty text-[0.9375rem] leading-[1.6] text-canvas-text-muted">
              Verified tickets for Hamilton, The Lion King, Wicked and every show in
              between &mdash; and the team that plans and runs live events across
              New York.
            </p>
          </InView>

          <InView
            immediate
            className="pointer-events-none absolute right-[calc(100%+2.5rem)] top-0 hidden text-curtain-ink lg:block"
          >
            <svg aria-hidden viewBox="0 0 36 28" className="h-7 w-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <Stroke d="M6 24 L16 5" at={NOTES} />
              <Stroke d="M17 25 L27 6" at={NOTES + 120} />
            </svg>
          </InView>

          <InView
            immediate
            delay={NOTES + 150}
            className="pointer-events-none absolute left-[calc(100%+3.25rem)] -top-1 hidden text-left text-curtain-ink lg:block"
          >
            <span aria-hidden className="block -rotate-[9deg] font-hand text-[1.6rem] font-semibold leading-[0.95]">
              Find your
              <br />
              next show
            </span>
            <svg aria-hidden viewBox="0 0 90 64" className="ml-1 mt-1 h-16 w-[5.5rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Stroke d="M10 6 C 30 20, 72 18, 74 52" at={NOTES + 400} />
              <Stroke d="M65 44 L 74 54 L 82 43" at={NOTES + 1000} />
            </svg>
          </InView>
        </div>
      </div>

      {/* The reel — full bleed, running off both edges */}
      <div className="mt-6 sm:mt-8">
        <BroadwayCarousel cards={broadwayReel} label="Now playing on Broadway" />
      </div>

      {/* The two doors */}
      <div className="relative mx-auto mt-6 flex w-full max-w-[64rem] justify-center px-6 sm:mt-8 sm:px-10">
        <div className="relative">
          <InView
            immediate
            delay={NOTES + 500}
            className="pointer-events-none absolute right-[calc(100%+1.25rem)] top-1/2 hidden -translate-y-1/2 items-center gap-1 text-curtain-ink md:flex"
          >
            <span aria-hidden className="block translate-y-3 -rotate-[10deg] whitespace-nowrap font-hand text-[1.45rem] font-semibold">
              Experience it live
            </span>
            <svg aria-hidden viewBox="0 0 64 34" className="h-8 w-14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Stroke d="M4 26 C 18 30, 36 26, 54 12" at={NOTES + 700} />
              <Stroke d="M44 10 L 55 11 L 52 22" at={NOTES + 1150} />
            </svg>
          </InView>

          <InView immediate delay={240} className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/ticket-resale"
              className="press group inline-flex h-12 items-center gap-2.5 rounded-full bg-curtain px-6 text-[0.9375rem] font-semibold text-white shadow-[0_0_0_4px_var(--color-canvas-alt),0_0_0_5px_color-mix(in_srgb,var(--color-curtain)_35%,transparent),0_14px_30px_-12px_rgba(123,30,43,0.55)] transition-[background-color,scale] duration-200 ease-ui hover:bg-curtain-deep"
            >
              Find tickets
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-200 ease-ui group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/event-management"
              className="press inline-flex h-12 items-center rounded-full border border-canvas-text/15 px-6 text-[0.9375rem] font-semibold text-canvas-text transition-[border-color,background-color,scale] duration-200 ease-ui hover:border-canvas-text/30 hover:bg-canvas-text/[0.04]"
            >
              Plan an event
            </Link>
          </InView>
        </div>
      </div>
    </section>
  );
}
