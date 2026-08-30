import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Action } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { eventManagement as em } from "@/lib/site";

export function EventManagement() {
  return (
    <section
      id="event-management"
      className="relative -mt-10 scroll-mt-28 overflow-hidden rounded-t-[2.5rem] bg-paper py-20 shadow-[0_-30px_70px_-40px_rgba(23,23,22,0.12)] sm:-mt-12 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid w-full max-w-[84rem] gap-16 px-6 sm:px-10 lg:grid-cols-12 lg:gap-14">
        {/* Standing column — holds position while the list moves past it */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <h2 className="display text-[clamp(2.5rem,6.4vw,4.5rem)] text-canvas-text">
              {em.headline}
            </h2>
            <p className="mt-8 max-w-md text-[0.95rem] leading-[1.9] text-canvas-text-muted">
              {em.description}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-canvas-border bg-surface p-2.5">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[1rem]">
                <Image
                  src="/management.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30rem, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <p className="label mt-5 text-taupe/80">
              The platform, built around your venue.
            </p>
          </Reveal>

          {/* Closes the standing column rather than interrupting it */}
          <Reveal delay={0.22} className="mt-9">
            <Action href={em.href} tone="ink">
              {em.cta}
              <ArrowUpRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Action>
          </Reveal>
        </div>

        <ul className="lg:col-span-6 lg:col-start-7">
          {em.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 0.08}
              className="group border-t border-canvas-border last:border-b last:border-canvas-border"
            >
              <div className="relative flex gap-6 py-10 transition-colors duration-700 ease-editorial sm:gap-10 sm:py-12">
                {/* Gold rule draws in from the left on approach */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-px left-0 h-px w-0 bg-champagne transition-all duration-1000 ease-editorial group-hover:w-full"
                />
                {/* The large numeral the editorial layout is built around */}
                <span className="display shrink-0 text-[3.25rem] leading-none text-canvas-text/10 transition-colors duration-700 ease-editorial group-hover:text-champagne/30 sm:text-[4rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-2 sm:pt-3">
                  <h3 className="font-display text-[1.65rem] font-semibold leading-[1.15] text-canvas-text sm:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.85] text-canvas-text-muted transition-colors duration-700 ease-editorial group-hover:text-canvas-text/80">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}