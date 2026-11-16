import { ProsceniumArt } from "@/components/art/architecture";
import { Reveal } from "@/components/ui/reveal";
import { whyChoose } from "@/lib/site";

export function WhyTicketProducer() {
  return (
    <section id="about" className="relative isolate -mt-8 scroll-mt-20 overflow-hidden rounded-t-[2rem] bg-paper py-20 shadow-[0_-24px_50px_-35px_rgba(23,23,22,0.12)] sm:py-28 lg:py-36">
      {/* Subtle imagery, not decoration for its own sake — the same architectural linework used above the fold */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-[0.05]"
      >
        <ProsceniumArt />
      </div>

      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="display max-w-3xl text-[clamp(2.5rem,6vw,4.25rem)] text-canvas-text">
            {whyChoose.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-12 border-t border-canvas-border pt-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-canvas-border">
          {whyChoose.reasons.map((reason, i) => (
            <Reveal
              key={reason.title}
              delay={i * 0.08}
              className="lg:px-8 lg:first:pl-0"
            >
              <span className="label label-champagne tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-5 text-[1.5rem] text-canvas-text">
                {reason.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.8] text-canvas-text-muted">
                {reason.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
