"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { faves } from "@/lib/ticket-resale-page";

/** Same round button as the rails' chevrons, so the row reads as one of them. */
const ARROW =
  "grid h-10 w-10 place-items-center rounded-full border border-canvas-border bg-surface text-canvas-text transition-[background-color,opacity] duration-300 ease-editorial hover:bg-canvas-alt disabled:pointer-events-none disabled:opacity-35";

/**
 * "Popular in New York": a row of round venue crops on the page's own ground,
 * sized and spaced like the event rails around it, each a link to that act's
 * tickets, scrolled sideways by swipe, trackpad, or the arrow pair in the
 * heading row. The scroller follows `EventSection`'s rules for the same
 * reasons — no snapping, no `scroll-smooth`, `overscroll-x-contain` — and the
 * arrows grey out at either end, or step aside when the whole row fits. Like
 * the rails, it stays inside the page's content column.
 */
export function TrFaves() {
  const railRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef<number | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  const onScroll = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      update();
    });
  }, [update]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [update]);

  const page = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section id="faves" className="scroll-mt-28 bg-paper py-7 sm:py-9">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal className="flex items-center justify-between gap-4">
          <h2 className="ds-display text-[clamp(1.5rem,2.6vw,2rem)] text-canvas-text">
            Popular in New York
          </h2>
          {/* Only when the row overflows — on a wide screen all of it fits */}
          <div className={clsx("flex shrink-0 gap-2.5", !canPrev && !canNext && "invisible")}>
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={!canPrev}
              aria-label="Scroll popular picks left"
              className={ARROW}
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={!canNext}
              aria-label="Scroll popular picks right"
              className={ARROW}
            >
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul
            ref={railRef}
            onScroll={onScroll}
            className="-mx-6 mt-6 flex gap-5 overflow-x-auto overscroll-x-contain px-6 pb-2 [scrollbar-width:none] sm:-mx-10 sm:mt-7 sm:gap-7 sm:px-10 [&::-webkit-scrollbar]:hidden"
          >
            {faves.map((fave) => (
              <li key={fave.name} className="shrink-0">
                <Link href={fave.href} className="group block w-[6.5rem] text-center sm:w-[7.5rem] lg:w-[8.5rem]">
                  <span className="relative block aspect-square overflow-hidden rounded-full bg-canvas-alt ring-2 ring-transparent ring-offset-[3px] ring-offset-paper transition-[box-shadow] duration-300 ease-editorial group-hover:ring-champagne group-focus-visible:ring-champagne">
                    <Image
                      src={fave.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 8.5rem, (min-width: 640px) 7.5rem, 6.5rem"
                      className={`object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.05] ${fave.position}`}
                    />
                  </span>
                  <span className="mt-3 block truncate text-[0.875rem] font-semibold text-canvas-text sm:text-[0.9375rem]">
                    {fave.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
