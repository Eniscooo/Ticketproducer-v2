import { CardStack } from "@/components/ui/card-stack";
import { clsx } from "@/lib/clsx";
import { emSteps } from "@/lib/event-management-page";
import { eventManagement } from "@/lib/site";
import { EmSectionHeader, Tilt3D } from "./em-section-header";
import { PhoneDemo } from "./phone-demos";

/**
 * "How it works": the services as four numbered steps, each a stacking card
 * (`CardStack`) that pins while the next slides over it.
 *
 * Cards alternate light and dark. The dark ones are lit, not flat: a soft pool
 * of light from the top corner, a hairline rim and a faint grid, so they read
 * as glass under a spot rather than a slab. Each step carries its number as a
 * large outlined numeral, and its phone stands in 3D, turned toward the copy
 * and floating, swapping sides card to card; on phones it stacks under the copy.
 */
export function EmServices() {
  return (
    <section id="em-services" className="tp-section relative scroll-mt-28 bg-paper">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <EmSectionHeader
          eyebrow="How it works"
          light="Four steps,"
          bold="one team"
          body={eventManagement.description}
        />
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
                "relative isolate grid min-h-[72vh] items-center gap-10 overflow-hidden rounded-feature p-7 sm:p-10 md:grid-cols-2 lg:p-14",
                "shadow-[0_-22px_48px_-26px_rgba(23,23,22,0.32)]",
                dark
                  ? "bg-graphite ring-1 ring-inset ring-white/10"
                  : "bg-surface ring-1 ring-inset ring-canvas-border",
              )}
            >
              {/* Light: a pool from the top corner, and a faint grid under it */}
              <div
                aria-hidden
                className={clsx(
                  "pointer-events-none absolute inset-0 -z-10",
                  dark
                    ? "bg-[radial-gradient(70%_60%_at_15%_0%,rgba(255,255,255,0.10),transparent_70%)]"
                    : "bg-[radial-gradient(70%_60%_at_85%_0%,rgba(23,23,22,0.04),transparent_70%)]",
                )}
              />
              <div
                aria-hidden
                className={clsx(
                  "pointer-events-none absolute inset-0 -z-10 [background-size:32px_32px] [mask-image:radial-gradient(80%_70%_at_50%_40%,#000,transparent)]",
                  dark
                    ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
                    : "bg-[linear-gradient(to_right,rgba(23,23,22,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,22,0.05)_1px,transparent_1px)]",
                )}
              />

              <div className={clsx("relative", dark && "md:order-last")}>
                {/* The step's number, large and drawn in outline */}
                <span
                  aria-hidden
                  className={clsx(
                    // Fill made transparent with text-fill-color (not `color`), so the stroke can use currentColor.
                    "block font-display text-[clamp(4.5rem,9vw,7rem)] font-extrabold leading-[0.8] tracking-[-0.05em] [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_currentColor]",
                    dark ? "text-white/30" : "text-ink/20",
                  )}
                >
                  {String(step.index).padStart(2, "0")}
                </span>
                <span
                  className={clsx(
                    "mt-6 inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold",
                    dark ? "bg-white/10 text-white" : "bg-ink/5 text-canvas-text",
                  )}
                >
                  Step {step.index} · {step.service}
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

              <div className="flex justify-center py-6">
                <Tilt3D side={dark ? "left" : "right"}>
                  <PhoneDemo demo={step.demo} />
                </Tilt3D>
              </div>
            </li>
          );
        })}
      </CardStack>
    </section>
  );
}
