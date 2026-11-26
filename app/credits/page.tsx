import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/ui/reveal";
import { commonsCredits, LICENSE_URLS } from "@/lib/photo-credits";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Credits for the Broadway and New York photography used on Ticket Producer.",
};

/** Same shell as the legal routes — a plain, readable list. */
export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <SiteNav />
      <main className="flex-1 pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-10">
          <Reveal>
            <h1 className="display text-[clamp(2.25rem,5.4vw,3.75rem)] text-canvas-text">
              Photo Credits
            </h1>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.9] text-canvas-text-muted">
              The Broadway photographs on our home page are by the photographers
              below, shared on Wikimedia Commons under Creative Commons licences.
              Each was cropped to fit our layout. Show titles and logos belong to
              their productions. Our New York skyline and venue photography is
              from Unsplash.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-12 divide-y divide-canvas-border border-y border-canvas-border">
              {commonsCredits.map((credit) => (
                <li key={credit.source} className="py-5">
                  <a
                    href={credit.source}
                    className="link-underline font-medium text-canvas-text hover:text-champagne-ink"
                  >
                    {credit.subject}
                  </a>
                  <p className="mt-1 text-[0.875rem] text-canvas-text-muted">
                    Photo by {credit.author} ·{" "}
                    <a
                      href={LICENSE_URLS[credit.license]}
                      className="link-underline hover:text-canvas-text"
                    >
                      {credit.license}
                    </a>{" "}
                    · cropped
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
