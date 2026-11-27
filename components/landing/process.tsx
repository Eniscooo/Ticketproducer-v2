import { eventManagement } from "@/lib/site";
import { eventProcess } from "@/lib/landing";
import { InView } from "./motion";
import { FlowButton } from "@/components/ui/flow-button";

/**
 * The event side, explained in four beats. One rule runs across the steps and
 * draws itself left to right as the section arrives (ease-in-out — it's
 * travelling, not arriving); the steps rise in behind it, 80ms apart, so the
 * line seems to switch each one on as it passes. On phones the same rule runs
 * down the left edge instead.
 */
export function Process() {
  return (
    <section className="relative -mt-8 rounded-t-[2rem] bg-paper tp-section">
      <div className="mx-auto w-full max-w-[76rem] px-6 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <InView className="lg:col-span-7">
            <p className="text-[0.8125rem] font-medium text-curtain-ink">Event management</p>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-canvas-text">
              From the first call to the curtain coming down.
            </h2>
          </InView>
          <InView delay={60} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-pretty text-[0.9375rem] leading-[1.65] text-canvas-text-muted">
              {eventManagement.description}
            </p>
            <FlowButton href="/event-management" className="mt-6">
              See how we work
            </FlowButton>
          </InView>
        </div>

        <div className="relative mt-16 sm:mt-20">
          {/* The rule: across on wide screens, down the side on phones */}
          <InView
            kind="draw"
            className="absolute left-0 right-0 top-[0.4375rem] hidden h-px bg-canvas-text/15 md:block"
          />
          <div aria-hidden className="absolute bottom-2 left-[0.4375rem] top-2 w-px bg-canvas-text/15 md:hidden" />

          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {eventProcess.map((step, i) => (
              <InView key={step.title} as="li" delay={200 + i * 80} className="relative pl-9 md:pl-0">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 grid h-3.5 w-3.5 place-items-center rounded-full bg-paper ring-1 ring-canvas-text/25 md:static"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-curtain-ink" />
                </span>
                <p className="text-[0.8125rem] tabular-nums text-canvas-text-muted md:mt-6">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-display text-[1.375rem] font-semibold tracking-[-0.015em] text-canvas-text">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[17rem] text-[0.9375rem] leading-[1.6] text-canvas-text-muted">
                  {step.body}
                </p>
              </InView>
            ))}
          </ol>
        </div>

       
      </div>
    </section>
  );
}
