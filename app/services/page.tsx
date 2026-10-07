import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { StatsBar } from "@/components/site/stats-bar";
import { TrustedPartners } from "@/components/site/trusted-partners";
import { ServicesOverview } from "@/components/site/services-overview";
import { PullQuote } from "@/components/site/pull-quote";
import { EventManagement } from "@/components/site/event-management";
import { TicketResale } from "@/components/site/ticket-resale";
import { TPElite } from "@/components/site/tp-elite";
import { WhyTicketProducer } from "@/components/site/why-ticket-producer";
import { Reviews } from "@/components/site/reviews";
import { ReviewsMarquee } from "@/components/site/reviews-marquee";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";
import { CardStack } from "@/components/ui/card-stack";
import { pullQuote, pullQuotePosters, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Event management, ticket resale, and TP Elite concierge access. 10+ years producing live events, based in New York.",
};

export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-ink">
      <a
        href="#event-management"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:bg-bone focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to services
      </a>

      <SiteNav />

      <main className="flex-1">
        <Hero />
        <StatsBar />
        <TrustedPartners />
        <ServicesOverview />
        <PullQuote quote={pullQuote} posters={pullQuotePosters} />
        {/*
          The three services as stacking cards on the quote's linen: each sits
          on the page rather than spanning it, pins, and steps back (smaller,
          dimmer) as the next one slides over. The bottom padding clears the
          rounded top of the section that follows.
        */}
        <CardStack className="bg-canvas-alt px-3 pb-24 pt-10 [--stack-rest-gap:1.5rem] sm:px-6 sm:pb-28">
          <EventManagement />
          <TicketResale />
          <TPElite />
        </CardStack>
        <WhyTicketProducer />
        <PullQuote quote={site.tagline} />
        <Reviews />
        <Faq />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}
