"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";
import { emFinalCta } from "@/lib/event-management-page";
import { useProposal } from "./proposal-context";
import { FlowButton } from "@/components/ui/flow-button";
import { CalendarDays, Phone } from "lucide-react";

/**
 * design.md's inverted closing block: dark surface, generous radius,
 * hairline-free, centred — now over a photograph of the room before doors.
 *
 * The image sits at a negative z-index inside an isolated stacking context, so
 * it paints over the card's own graphite fill but under every line of copy. It
 * is held far back by its own opacity plus a gradient scrim: the headline,
 * body, and both actions have to keep their contrast, so the photograph is
 * atmosphere rather than subject.
 */
export function EmFinalCta() {
  const { open } = useProposal();

  return (
    <section className="relative bg-paper pb-24 sm:pb-32">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <div className="relative isolate overflow-hidden rounded-card bg-graphite px-7 py-16 text-center ring-1 ring-inset ring-white/10 shadow-[0_50px_100px_-50px_rgba(10,10,11,0.7)] sm:px-12 sm:py-24">
          <Image
            src="/nyc/skyline-brooklyn-bridge.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 75rem, 100vw"
            className="-z-10 object-cover object-[50%_55%] opacity-50"
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

          {/* A faint grid falling away from the middle, and two soft lights */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]"
          />
          <div
            aria-hidden
            className="tp-glow-breathe absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="tp-glow-breathe absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-curtain/30 blur-3xl"
          />

          <Reveal>
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[0.8125rem] font-medium text-white/85 backdrop-blur">
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="tp-live-ring absolute inset-0 rounded-full bg-white" />
                <span className="relative h-2 w-2 rounded-full bg-white" />
              </span>
              Taking bookings now
            </p>
            <h2 className="ds-display mx-auto max-w-3xl text-[clamp(2rem,4.8vw,3.25rem)] text-white">
              <span className="font-light">{emFinalCta.headlineTop} </span>
              <span className="font-semibold">{emFinalCta.headlineBottom}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="ds-body mx-auto mt-6 max-w-xl text-linen/75">
              {emFinalCta.body}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <FlowButton onClick={() => open()} tone="light" icon={CalendarDays}>
                {emFinalCta.primaryCta.label}
              </FlowButton>
              <FlowButton href={site.contact.phoneHref} tone="light" icon={Phone}>
                Talk to Event Management
              </FlowButton>
            </div>
            <p className="ds-body mt-6 text-linen/55">{site.contact.phone}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
