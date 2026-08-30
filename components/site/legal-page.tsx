import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/ui/reveal";

/**
 * Shared shell for the legal routes. The body text is a clearly-labeled
 * stand-in, not real legal language — Terms/Privacy/Cookie copy needs
 * drafting and review by counsel before this goes live, the same way the
 * rest of this codebase flags placeholder content rather than inventing
 * anything that could pass as authoritative.
 */
export function LegalPage({
  title,
  updated,
}: {
  title: string;
  updated: string;
}) {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <SiteNav />
      <main className="flex-1 pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-10">
          <Reveal>
            <h1 className="display text-[clamp(2.25rem,5.4vw,3.75rem)] text-canvas-text">
              {title}
            </h1>
            <p className="label mt-5 text-taupe">Last updated {updated}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-[1.75rem] border border-champagne/30 bg-canvas-alt px-7 py-8 sm:px-9 sm:py-10">
              <p className="text-[0.9375rem] leading-[1.9] text-canvas-text-muted">
                This page is a placeholder standing in for the real {title.toLowerCase()}.
                The final text needs to be drafted for Ticket Producer&rsquo;s actual data,
                ticketing, and resale practices and reviewed by counsel before this
                site goes live — nothing below should be treated as binding.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-12 space-y-8 text-[0.9375rem] leading-[1.9] text-canvas-text-muted">
              <p>
                Once finalized, this section will explain, in plain language, how
                Ticket Producer collects, uses, and protects client and event data
                across event management, ticket resale, and TP Elite concierge
                access — along with the rights available to visitors and clients.
              </p>
              <p>
                Questions in the meantime are answered directly — see the contact
                details in the footer below.
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
