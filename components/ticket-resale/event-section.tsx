"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { Reveal } from "@/components/ui/reveal";
import type { ResaleEvent } from "@/lib/ticket-resale-page";
import { EventCard, type EventCardVariant } from "./event-card";

/** Round chevron, shared by the header pair and the overlay pair. */
const CHEVRON =
  "flex h-10 w-10 items-center justify-center rounded-full border border-canvas-border bg-surface/95 text-canvas-text shadow-[0_18px_36px_-22px_rgba(23,23,22,0.45)] backdrop-blur-sm transition-colors duration-300 ease-editorial hover:bg-canvas-alt disabled:pointer-events-none disabled:opacity-35";

/**
 * A horizontally-scrollable rail of `EventCard`s with a heading and an
 * optional "View all" toggle that expands the rail into a wrapping grid —
 * a real, working expansion over the dummy dataset rather than a dead link.
 *
 * `variant` picks the card shape and, with it, the rhythm of the whole section.
 * `tile` packs four-to-five square thumbnails across. `feature` runs two wide
 * landscape banners across the content column instead, for a rail worth giving
 * the extra height to.
 *
 * Where the chevrons sit follows from that. Over `tile` cards they overlay the
 * rail, which is the only affordance a plain mouse has: a trackpad or a
 * touchscreen can swipe it, but a wheel cannot scroll sideways. They show from
 * `sm` up rather than `lg`, and they sit just inside the rail's own edges
 * instead of straddling them — half-outside buttons ended up under the fixed
 * category rail at `xl`, which is what made the rail look stuck. A `feature`
 * card is too tall for a vertically-centred overlay to land anywhere sensible,
 * so its pair moves up into the heading row and stays put, greying out at
 * either end of the scroll instead of disappearing.
 */
export function EventSection({
  id,
  title,
  subtitle,
  events,
  tone = "paper",
  initialCount = 4,
  emptyMessage,
  variant = "tile",
}: {
  id: string;
  title: string;
  subtitle?: string;
  events: ResaleEvent[];
  tone?: "paper" | "linen";
  initialCount?: number;
  emptyMessage?: string;
  variant?: EventCardVariant;
}) {
  const [expanded, setExpanded] = useState(false);
  const railRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const feature = variant === "feature";

  const updateScrollButtons = () => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [events, expanded]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (events.length === 0 && !emptyMessage) return null;

  const canExpand = events.length > initialCount;
  const shown = expanded ? events : events.slice(0, initialCount);
  /* The header pair belongs to the scrolling state, so it goes when the grid does. */
  const headerChevrons = feature && !expanded && events.length > 0;

  return (
    <section
      id={id}
      className={clsx(
        "scroll-mt-28",
        feature ? "py-9 sm:py-12" : "py-7 sm:py-9",
        tone === "linen" ? "bg-canvas-alt" : "bg-paper",
      )}
    >
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2
              className={clsx(
                "ds-display text-canvas-text",
                feature ? "text-[clamp(1.75rem,3.2vw,2.5rem)]" : "text-[clamp(1.5rem,2.6vw,2rem)]",
              )}
            >
              {title}
            </h2>
            {subtitle ? <p className="ds-body mt-1.5 text-canvas-text-muted">{subtitle}</p> : null}
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            {canExpand ? (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="label link-underline tap-pad inline-flex shrink-0 items-center gap-1.5 text-taupe transition-colors duration-300 ease-editorial hover:text-canvas-text"
              >
                {expanded ? "Show less" : "View all"}
                <ArrowRight
                  className={clsx(
                    "h-3.5 w-3.5 transition-transform duration-300 ease-editorial",
                    expanded && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            ) : null}

            {headerChevrons ? (
              <>
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  disabled={!canScrollPrev}
                  aria-label={`Scroll ${title} left`}
                  className={CHEVRON}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  disabled={!canScrollNext}
                  aria-label={`Scroll ${title} right`}
                  className={CHEVRON}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </>
            ) : null}
          </div>
        </Reveal>

        {events.length === 0 ? (
          <p className="mt-8 rounded-control border border-canvas-border bg-surface px-6 py-8 text-center text-[0.9375rem] text-canvas-text-muted">
            {emptyMessage}
          </p>
        ) : (
          <div className="relative mt-7">
            <ul
              ref={railRef}
              onScroll={expanded ? undefined : updateScrollButtons}
              className={clsx(
                expanded
                  ? feature
                    ? "grid grid-cols-1 gap-4 lg:grid-cols-2"
                    : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
                  : "flex snap-x scroll-pl-6 gap-4 overflow-x-auto scroll-smooth pb-2 -mx-6 px-6 sm:scroll-pl-10 sm:-mx-10 sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {shown.map((event, i) => (
                <Reveal
                  as="li"
                  key={event.slug}
                  delay={i * 0.05}
                  /*
                   * The rail's own padding cancels its negative margin, so a
                   * percentage width here resolves against the content column:
                   * `50% - half the gap` lands exactly two feature cards across
                   * at every width from `lg` up.
                   */
                  className={
                    expanded
                      ? ""
                      : feature
                        ? "w-[86vw] shrink-0 snap-start sm:w-[27rem] lg:w-[calc(50%-0.5rem)]"
                        : "w-[11.5rem] shrink-0 snap-start sm:w-[13rem] lg:w-[14rem]"
                  }
                >
                  <EventCard event={event} variant={variant} />
                </Reveal>
              ))}
            </ul>

            {!feature && !expanded && canScrollPrev ? (
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                aria-label={`Scroll ${title} left`}
                className={clsx(CHEVRON, "absolute left-1 top-[34%] hidden -translate-y-1/2 sm:flex")}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
            ) : null}

            {!feature && !expanded && canScrollNext ? (
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                aria-label={`Scroll ${title} right`}
                className={clsx(
                  CHEVRON,
                  "absolute right-1 top-[34%] hidden -translate-y-1/2 sm:flex",
                )}
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
