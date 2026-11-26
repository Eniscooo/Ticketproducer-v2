import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { doors } from "@/lib/landing";
import { InView } from "./motion";

/**
 * Two ways in — the company's two businesses, side by side and equal. Each
 * card is one link: photograph, who it's for, what it does, where it goes.
 *
 * The photographs unveil top-down as the cards scroll in (clip-path, so it's
 * composited, not laid out), the second a beat after the first. On hover the
 * picture eases forward a few percent and the arrow nudges toward its
 * destination; a press settles the whole card by 1%. Hover is gated to fine
 * pointers by Tailwind's `hover:` variant, so a tap never leaves a card
 * stuck "lifted".
 */
export function Doors() {
  return (
    <section id="sides" className="relative -mt-8 scroll-mt-20 rounded-t-[2rem] bg-paper py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[76rem] px-6 sm:px-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <InView className="lg:col-span-7">
            <p className="text-[0.8125rem] font-medium text-curtain-ink">Two ways in</p>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-canvas-text">
              Whether you&rsquo;re in the audience or running the house.
            </h2>
          </InView>
          <InView delay={60} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-pretty text-[0.9375rem] leading-[1.65] text-canvas-text-muted">
              Two teams, one company. Pick the side you came for — you can cross
              over from the menu at any time.
            </p>
          </InView>
        </div>

        <div className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-2">
          {doors.map((door, i) => (
            <InView key={door.key} delay={i * 80} className="h-full">
              <Link
                href={door.href}
                className={clsx(
                  "press-soft group flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-2",
                  "transition-[border-color,box-shadow,scale] duration-300 ease-ui",
                  door.key === "tickets"
                    ? "border-white/10 bg-graphite hover:shadow-[0_30px_60px_-30px_rgba(23,23,22,0.6)]"
                    : "border-canvas-border bg-surface hover:border-canvas-text/20 hover:shadow-[0_30px_60px_-34px_rgba(23,23,22,0.3)]",
                )}
              >
                <InView
                  kind="unveil"
                  delay={i * 120}
                  className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] [--unveil-radius:1.25rem]"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={door.image}
                      alt={door.imageAlt}
                      fill
                      sizes="(min-width: 768px) 36rem, 92vw"
                      className="object-cover transition-[scale] duration-700 ease-ui group-hover:scale-[1.04]"
                    />
                  </div>
                </InView>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-7 sm:px-7 sm:pb-7">
                  <p
                    className={clsx(
                      "text-[0.8125rem] font-medium",
                      door.key === "tickets" ? "text-champagne" : "text-champagne-ink",
                    )}
                  >
                    {door.audience}
                  </p>
                  <h3
                    className={clsx(
                      "mt-2 font-display text-[clamp(1.75rem,2.8vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.025em]",
                      door.key === "tickets" ? "text-white" : "text-canvas-text",
                    )}
                  >
                    {door.title}
                  </h3>
                  <p
                    className={clsx(
                      "mt-3 max-w-md text-[0.9375rem] leading-[1.65]",
                      door.key === "tickets" ? "text-linen/70" : "text-canvas-text-muted",
                    )}
                  >
                    {door.body}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {door.points.map((point) => (
                      <li
                        key={point}
                        className={clsx(
                          "flex items-center gap-3 text-[0.9375rem]",
                          door.key === "tickets" ? "text-linen/85" : "text-canvas-text",
                        )}
                      >
                        <span
                          aria-hidden
                          className={clsx(
                            "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                            door.key === "tickets" ? "bg-white/10 text-champagne" : "bg-curtain/10 text-curtain-ink",
                          )}
                        >
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <span
                    className={clsx(
                      "mt-auto inline-flex items-center gap-2 self-start pt-8 text-[0.9375rem] font-semibold",
                      door.key === "tickets" ? "text-white" : "text-canvas-text",
                    )}
                  >
                    {door.cta}
                    <span
                      aria-hidden
                      className={clsx(
                        "grid h-8 w-8 place-items-center rounded-full transition-[translate,background-color] duration-200 ease-ui group-hover:translate-x-1",
                        door.key === "tickets" ? "bg-curtain text-white" : "bg-canvas-text text-paper",
                      )}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </div>
              </Link>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
