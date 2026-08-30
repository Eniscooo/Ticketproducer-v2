"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";
import { emFinalCta } from "@/lib/event-management-page";
import { useProposal } from "./proposal-context";

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
    <section className="relative bg-paper pb-20">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <div className="relative isolate overflow-hidden rounded-card bg-graphite px-7 py-16 text-center sm:px-12 sm:py-20">
          <Image
            src="/trees.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 75rem, 100vw"
            className="-z-10 object-cover object-[50%_38%] opacity-50"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite/88 via-graphite/52 to-graphite/88"
          />
          {/* A brass lift in the lower corner — the page's one warm note, kept quiet */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(176,141,87,0.16),transparent_72%)]"
          />

          <Reveal>
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
            <div className="mt-9 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => open()}
                className="ds-btn-ghost w-full sm:w-auto"
              >
                {emFinalCta.primaryCta.label}
              </button>
              <a
                href={site.contact.phoneHref}
                className="ds-btn-neutral w-full border border-white/35 bg-white/10 text-linen hover:bg-white/20 sm:w-auto"
              >
                Talk to Event Management
              </a>
            </div>
            <p className="ds-body mt-6 text-linen/55">{site.contact.phone}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
