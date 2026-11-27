import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/ui/reveal";
import { sides, site } from "@/lib/site";
import { FlowButton } from "@/components/ui/flow-button";

const WAYS_OUT = [
  { label: "Home", href: "/" },
  { label: sides.events.label, href: sides.events.href },
  { label: sides.tickets.label, href: sides.tickets.href },
];

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * The 404 for unmatched URLs and for `notFound()` calls — an unknown resale
 * slug lands here. Same shell as the legal routes, so a wrong turn still reads
 * as the same site, and every way out goes somewhere real: home, the two sides
 * of the site, and the direct line.
 */
export default function NotFound() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <SiteNav />

      <main className="flex flex-1 items-center pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-10">
          <Reveal>
            <p className="label label-champagne tabular-nums">404</p>
            <h1 className="display mt-5 text-[clamp(2.25rem,5.4vw,3.75rem)] text-canvas-text">
              This room isn&rsquo;t on the plan.
            </h1>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.9] text-canvas-text-muted">
              The page may have moved, or the event may have closed. Everything we run is
              one step from here.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-12 grid gap-2.5 sm:grid-cols-3">
              {WAYS_OUT.map((item) => (
                <li key={item.href}>
                  <FlowButton href={item.href} icon={ArrowUpRight} fullWidth>
                    {item.label}
                  </FlowButton>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.9375rem] text-canvas-text-muted">
              Or call the line:{" "}
              <a
                href={site.contact.phoneHref}
                className="link-underline text-canvas-text hover:text-champagne-ink"
              >
                {site.contact.phone}
              </a>
            </p>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
