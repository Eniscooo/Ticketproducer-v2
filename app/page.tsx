import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { EventManagement } from "@/components/site/event-management";
import { TicketResale } from "@/components/site/ticket-resale";
import { WhyTicketProducer } from "@/components/site/why-ticket-producer";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { CardStack } from "@/components/ui/card-stack";
import { LandingHero } from "@/components/landing/landing-hero";
import { TwoSides } from "@/components/landing/two-sides";
import { CityBand } from "@/components/landing/city-band";
import { ChoosePath } from "@/components/landing/choose-path";
import { pullQuote } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Ticket Producer — Live events, produced properly" },
  description:
    "Event management for producers, venues and companies, and verified tickets for concerts, sports and Broadway. Based in New York.",
};

/**
 * The landing page explains the whole company, then asks the visitor which
 * half they came for. Order: the two doors up front for people who already
 * know; the two sides side by side; each side's working demo in the stacking
 * cards; who we are; the city; then the question again, full size.
 */
export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-ink">
      <a
        href="#sides"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:bg-bone focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>

      <SiteNav />

      <main className="flex-1">
        <LandingHero />
        <TwoSides />
        <CardStack className="bg-canvas-alt px-3 pb-24 pt-10 [--stack-rest-gap:1.5rem] sm:px-6 sm:pb-28">
          <EventManagement />
          <TicketResale />
        </CardStack>
        <WhyTicketProducer />
        <CityBand quote={pullQuote} />
        <ChoosePath />
        <Faq />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}
