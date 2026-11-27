import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Faq } from "@/components/site/faq";
import { TPElite } from "@/components/site/tp-elite";
import { Reveal } from "@/components/ui/reveal";
import { EliteSkylineHero } from "@/components/elite/elite-skyline-hero";
import { EliteRequestForm } from "@/components/elite/elite-request-form";
import { Pricing } from "@/components/ui/pricing";
import { eliteFaq, eliteSteps, eliteTiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "TP Elite",
  description:
    "TP Elite: concierge access for people who live for live events. Priority seats, hard-to-get tables and a direct line — by request.",
};

/**
 * TP Elite's own room. It used to sit at the foot of the Tickets page; it is a
 * different product — a concierge line, not a listing — so it gets its own
 * page, linked from the nav on both sides, the footer and every event page.
 *
 * Order: the door (the skyline hero: day or night with the theme), the room itself (the existing TP Elite
 * section, with the wallet), how a request becomes access, the request form
 * beside the line, then questions. In the dark theme it is a dark room from
 * the hero to the form; in the light theme the same sections read light.
 */
export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <SiteNav />

      <main className="flex-1">
        {/* The door: Manhattan by day or by night, following the theme */}
        <EliteSkylineHero />

        {/* Everything below the hero: dark in the dark theme, light in the light theme (see .tp-elite-adaptive) */}
        <div className="tp-elite-adaptive">
        {/* The room: what membership gives you */}
        <div className="bg-elite-void px-3 pb-16 sm:px-6 sm:pb-24">
          <TPElite />
        </div>

        {/* Membership tiers — still by request: every tier's button leads to the request form */}
        <section id="membership" className="tp-section scroll-mt-24 border-t border-white/[0.06] bg-elite-void">
          <Pricing
            plans={eliteTiers}
            title="Three ways in. All by request."
            description="Choose the level of care you want. Every membership starts with a conversation — access is confirmed on the call."
          />
        </section>

        {/* How a request becomes access, and the request itself */}
        <section id="request" className="tp-section scroll-mt-24 bg-elite-void">
          <div className="mx-auto grid w-full max-w-[75rem] gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label text-white/60">How it works</p>
                <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
                  By conversation, not checkout.
                </h2>
              </Reveal>
              <ol className="mt-10 space-y-8">
                {eliteSteps.map((step, i) => (
                  <Reveal as="li" key={step.title} delay={i * 0.06} className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[0.875rem] font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[1.125rem] font-semibold text-white">{step.title}</h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/65">{step.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delay={0.1} className="lg:col-span-7">
              <div className="relative isolate overflow-hidden rounded-feature border border-white/10 bg-white/[0.04] p-6 shadow-card sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(255,255,255,0.08),transparent_70%)]"
                />
                <h2 className="font-display text-2xl font-semibold text-white">Request access</h2>
                <p className="mt-2 text-[0.9375rem] text-white/60">We read every request and call you back.</p>
                <div className="mt-8">
                  <EliteRequestForm />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        </div>

        <Faq
          items={eliteFaq}
          id="elite-faq"
          headingLight="TP Elite"
          headingBold="Questions"
          body=""
          contactLabel="Request access"
          contactHref="#request"
        />
      </main>

      <SiteFooter />
    </div>
  );
}
