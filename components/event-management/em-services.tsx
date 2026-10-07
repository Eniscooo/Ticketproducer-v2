import { CardStack } from "@/components/ui/card-stack";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { emSteps } from "@/lib/event-management-page";
import { eventManagement } from "@/lib/site";
import { PhoneDemo } from "./phone-demos";

/**
 * "How it works": the services as four numbered steps, each a stacking card
 * (`CardStack`) that pins while the next slides over it.
 *
 * Each card is a card sitting on the page rather than a band across it:
 * held to ~1100px and centred so the paper shows either side, 28px corners,
 * its own ground (alternating light and dark, in the page's light-card /
 * dark-block rhythm), a soft shadow on the top edge so the overlap reads, and
 * about three-quarters of the screen tall so the page shows above and below.
 * Copy sits on one side and a phone running that step's demo on the other,
 * swapping sides card to card; on phones the demo stacks under the copy.
 */
export function EmServices() {
  return (
    <section id="em-services" className="relative scroll-mt-28 bg-paper py-20">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="ds-display max-w-2xl text-[clamp(2rem,4.4vw,2.75rem)] text-canvas-text">
            <span className="font-light">How it </span>
            <span className="font-semibold">works</span>
          </h2>
          <p className="ds-body mt-5 max-w-xl text-canvas-text-muted">
            {eventManagement.description}
          </p>
        </Reveal>
      </div>

      <CardStack
        as="ol"
        className="mx-auto mt-14 w-full max-w-[78rem] px-4 [--stack-rest-gap:1.5rem] sm:px-8"
      >
        {emSteps.map((step, i) => {
          const dark = i % 2 === 1;
          return (
            <li
              key={step.index}
              className={clsx(
                "grid min-h-[72vh] items-center gap-8 rounded-feature p-7 shadow-[0_-22px_48px_-26px_rgba(23,23,22,0.32)] sm:gap-10 sm:p-10 md:grid-cols-2 lg:p-14",
                dark ? "bg-graphite" : "border border-canvas-border bg-surface",
              )}
            >
              <div className={clsx(dark && "md:order-last")}>
                <span className={clsx("label", dark ? "text-champagne" : "text-champagne-ink")}>
                  Step {step.index}
                </span>
                <h3
                  className={clsx(
                    "ds-display mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold",
                    dark ? "text-white" : "text-canvas-text",
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={clsx(
                    "ds-body mt-4 max-w-md",
                    dark ? "text-linen/70" : "text-canvas-text-muted",
                  )}
                >
                  {step.body}
                </p>
              </div>
              <div className="flex justify-center">
                <PhoneDemo demo={step.demo} />
              </div>
            </li>
          );
        })}
      </CardStack>
    </section>
  );
}
