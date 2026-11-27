import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { trFinalCta } from "@/lib/ticket-resale-page";
import { FlowButton } from "@/components/ui/flow-button";
import { Ticket } from "lucide-react";

/**
 * design.md's inverted closing block: dark surface, generous radius,
 * hairline-free, centred — the resale route's counterpart to the one that
 * closes Event Management, built to the same measurements on purpose. Two
 * closing blocks a click apart should not be two different sizes.
 *
 * The photograph sits at a negative z-index inside an isolated stacking
 * context, so it paints over the card's own graphite fill but under every line
 * of copy. Its opacity plus the gradient scrim hold it far enough back that the
 * headline, body, and button all keep their contrast: it is atmosphere here,
 * not subject.
 */
export function TrFinalCta() {
  return (
    <section className="relative bg-paper pb-14 pt-2">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <div className="relative isolate overflow-hidden rounded-card bg-graphite px-7 py-16 text-center sm:px-12 sm:py-20">
          <Image
            src="/nyc/skyline-lower-manhattan.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 75rem, 100vw"
            className="-z-10 object-cover object-[50%_45%] opacity-40"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite/88 via-graphite/52 to-graphite/88"
          />
          {/* A brass lift in the lower corner — the page's one warm note, kept quiet */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(255,255,255,0.16),transparent_72%)]"
          />

          <Reveal>
            <h2 className="ds-display mx-auto max-w-3xl text-[clamp(2rem,4.8vw,3.25rem)] text-white">
              <span className="font-light">{trFinalCta.headlineTop} </span>
              <span className="font-semibold">{trFinalCta.headlineBottom}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="ds-body mx-auto mt-6 max-w-xl text-linen/75">{trFinalCta.body}</p>
          </Reveal>

          <Reveal delay={0.14}>
            <FlowButton href={trFinalCta.cta.href} tone="light" icon={Ticket} className="mt-9">
              {trFinalCta.cta.label}
            </FlowButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
