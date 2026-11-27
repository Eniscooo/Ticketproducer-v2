import { principles } from "@/lib/landing";
import { AboutPhone } from "./about-phone";
import { InView } from "./motion";

/**
 * Who we are, without a single number we can't source. The left column states
 * the three things we hold ourselves to as a short ruled list; on the right, a
 * phone holding a Great Gatsby ticket projects the show from its screen — what
 * we do, shown rather than claimed.
 */
export function About() {
  return (
    <section
      id="about"
      className="relative -mt-8 scroll-mt-20 rounded-t-[2rem] bg-canvas-alt tp-section"
    >
      <div className="mx-auto grid w-full max-w-[76rem] items-center gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col justify-center lg:col-span-6">
          <InView>
            
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-canvas-text">
              About Us.
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

        {/* The phone and the Gatsby hologram rising out of it */}
        <AboutPhone className="mx-auto w-full max-w-[32rem] lg:col-span-6 lg:col-start-7 lg:mr-0" />
      </div>
    </section>
  );
}
