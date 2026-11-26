import Image from "next/image";
import { principles } from "@/lib/landing";
import { site } from "@/lib/site";
import { InView } from "./motion";

/**
 * Who we are, without a single number we can't source. The skyline unveils on
 * the left as a tall frame; the right column states the three things we hold
 * ourselves to as a short ruled list, then where to find us.
 */
export function About() {
  return (
    <section
      id="about"
      className="relative -mt-8 scroll-mt-20 rounded-t-[2rem] bg-canvas-alt py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-[76rem] gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <InView
          kind="unveil"
          className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] [--unveil-radius:1.75rem] lg:col-span-5"
        >
          <div className="absolute inset-0">
            <Image
              src="/nyc/skyline-empire-state.jpg"
              alt="The Empire State Building above the Manhattan skyline at night"
              fill
              sizes="(min-width: 1024px) 30rem, 92vw"
              className="object-cover object-[60%_40%]"
            />
          </div>
          <p className="absolute bottom-5 left-5 rounded-full bg-ink/60 px-3 py-1.5 text-[0.75rem] font-medium text-bone backdrop-blur-md">
            {site.contact.addressLines[0]}
          </p>
        </InView>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <InView>
            <p className="text-[0.8125rem] font-medium text-curtain-ink">About us</p>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-canvas-text">
              Made in New York, on the floor &mdash; not in a deck.
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-[0.9375rem] leading-[1.65] text-canvas-text-muted">
              We started out running doors for other people&rsquo;s events. The
              systems came after the shifts, not instead of them &mdash; and
              that&rsquo;s still how we work, whether we&rsquo;re mapping a hall
              or finding you two seats for Saturday.
            </p>
          </InView>

          <ol className="mt-10 border-t border-canvas-border">
            {principles.map((item, i) => (
              <InView
                key={item.title}
                as="li"
                delay={i * 60}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-canvas-border py-5"
              >
                <span className="pt-0.5 text-[0.8125rem] tabular-nums text-canvas-text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-[1.125rem] font-semibold tracking-[-0.01em] text-canvas-text">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[0.9375rem] leading-[1.6] text-canvas-text-muted">
                    {item.body}
                  </p>
                </div>
              </InView>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
