import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Faq } from "@/components/site/faq";
import { TicketResaleNav } from "@/components/ticket-resale/ticket-resale-nav";
import { TrDiscovery } from "@/components/ticket-resale/tr-discovery";
import { TrFaves } from "@/components/ticket-resale/tr-faves";
import { TrSubscribe } from "@/components/ticket-resale/tr-subscribe";
import { EventSection } from "@/components/ticket-resale/event-section";
import { TrFinalCta } from "@/components/ticket-resale/tr-final-cta";
import { eventRails, resaleEvents, trFaq, type ResaleEvent } from "@/lib/ticket-resale-page";

export const metadata: Metadata = {
  title: "Tickets",
  description:
    "Verified tickets for every Broadway show in New York — musicals, plays and holiday shows.",
};

/**
 * The ticket side of the site — everything here is for the person buying a
 * seat. Order: hero and search, the filter bar and results, the row of
 * popular picks as a shortcut into the rails, the rails themselves, then the
 * newsletter, FAQ and closing call to action. (TP Elite used to sit after the
 * rails; it is being reworked into its own part of the system.)
 *
 * Cards link to /ticket-resale/[slug] now, so there is no shared dialog
 * provider to wrap the tree in.
 *
 * `TicketResaleNav` is fixed in place (a rail in the left margin, or a bar at
 * the foot of the window) and always on screen, so its position in this tree is
 * immaterial — it reserves no layout space.
 */
export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <a
        href="#suggested"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-bone focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to events
      </a>

      <SiteNav />

      <main className="flex-1">
        <TrDiscovery />

        <TrFaves />

        <TicketResaleNav />

        {eventRails.map((rail) => {
          const events = rail.slugs
            .map((slug) => resaleEvents.find((event) => event.slug === slug))
            .filter((event): event is ResaleEvent => Boolean(event));

          return (
            <EventSection
              key={rail.id}
              id={rail.id}
              title={rail.title}
              subtitle={rail.subtitle}
              events={events}
              variant={rail.variant}
            />
          );
        })}

        <TrSubscribe />

        <Faq
          compact
          items={trFaq}
          id="tr-faq"
          headingLight="Ticket"
          headingBold="Questions"
          body=""
        />

        <TrFinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
