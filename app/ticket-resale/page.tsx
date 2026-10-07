import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Faq } from "@/components/site/faq";
import { TrustedPartners } from "@/components/site/trusted-partners";
import { TicketResaleNav } from "@/components/ticket-resale/ticket-resale-nav";
import { TrDiscovery } from "@/components/ticket-resale/tr-discovery";
import { TrFaves } from "@/components/ticket-resale/tr-faves";
import { TrSubscribe } from "@/components/ticket-resale/tr-subscribe";
import { EventSection } from "@/components/ticket-resale/event-section";
import { TrFinalCta } from "@/components/ticket-resale/tr-final-cta";
import { eventRails, resaleEvents, trFaq, type ResaleEvent } from "@/lib/ticket-resale-page";

export const metadata: Metadata = {
  title: "Ticket Resale",
  description:
    "Verified resale tickets for concerts, sports, theater, and live experiences — New York, Chicago, and beyond.",
};

/**
 * Order of the page: hero, then the partner row as the proof line directly
 * under it, then the filter bar and results, then the faves row as a shortcut
 * into the acts on the rails. `TrustedPartners` is passed to `TrDiscovery` as
 * children rather than rendered here, because it has to land between the hero
 * and the results that share the discovery component's state — passing it
 * down keeps it server-rendered.
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
        <TrDiscovery>
          <TrustedPartners tone="light" />
        </TrDiscovery>

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
          headingLight="Ticket Resale"
          headingBold="Questions"
          body="What buyers ask most before their first order. If yours isn't here, the line below reaches a real person."
        />

        <TrFinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
