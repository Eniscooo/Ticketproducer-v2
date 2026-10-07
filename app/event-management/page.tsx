import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Faq } from "@/components/site/faq";
import { ProposalProvider } from "@/components/event-management/proposal-context";
import { EmHero } from "@/components/event-management/em-hero";
import { EmServices } from "@/components/event-management/em-services";
import { DashboardMarquee } from "@/components/event-management/dashboard-marquee";
import { BudgetCalculator } from "@/components/event-management/budget-calculator";
import { EventGuide } from "@/components/event-management/event-guide";
import { EmAbout } from "@/components/event-management/em-about";
import { EmFinalCta } from "@/components/event-management/em-final-cta";
import { emFaq } from "@/lib/event-management-page";

export const metadata: Metadata = {
  title: "Event Management",
  description:
    "Event staffing, venue mapping, and a custom ticketing platform built around the room. Plus consulting for producers. New York.",
};

/**
 * Structure follows design.md: a light canvas throughout, 80px section
 * rhythm, and contrast carried by inverted dark *cards* inside sections
 * rather than by full-bleed dark bands. Alternating canvas/linen grounds keep
 * adjacent sections separable without a hard seam.
 *
 * ProposalProvider wraps the whole main because three separate sections
 * (calculator, guide, final CTA) all open the same dialog.
 */
export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <a
        href="#em-services"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-bone focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to services
      </a>

      <SiteNav />

      <ProposalProvider>
        <main className="flex-1">
          <EmHero />
          <EmServices />
          <DashboardMarquee />
          <BudgetCalculator />
          <EventGuide />
          <EmAbout />
          <Faq
            items={emFaq}
            id="em-faq"
            headingLight="Event Management"
            headingBold="Questions"
            body=""
          />
          <EmFinalCta />
        </main>
      </ProposalProvider>

      <SiteFooter />
    </div>
  );
}
