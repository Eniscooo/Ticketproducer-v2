import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/ui/reveal";
import { EventSection } from "@/components/ticket-resale/event-section";
import { TicketPicker } from "@/components/ticket-resale/ticket-picker";
import { categoryPlural, formatUsd, resaleEvents, type ResaleEvent } from "@/lib/ticket-resale-page";

/**
 * One page per event, replacing the dialog the cards used to open. The catalogue
 * is static sample data, so every page is generated at build time and the route
 * 404s on an unknown slug rather than rendering an empty shell.
 */
export function generateStaticParams() {
  return resaleEvents.map((event) => ({ slug: event.slug }));
}

const find = (slug: string) => resaleEvents.find((event) => event.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = find(slug);
  if (!event) return { title: "Event not found" };

  return {
    title: `${event.name} — ${event.venue}`,
    description: `${event.name} at ${event.venue}, ${event.city} on ${event.date}. Verified resale tickets from ${formatUsd(event.startingPrice)}.`,
  };
}

/** The facts a buyer checks before they look at price — all verified except the price. */
function EventFacts({ event }: { event: ResaleEvent }) {
  const rows = [
    { icon: Calendar, label: "Performance", value: `${event.date} · ${event.time}` },
    { icon: CalendarDays, label: "Weekly schedule", value: event.schedule },
    { icon: Clock, label: "Running time", value: event.runningTime },
    { icon: Users, label: "Age guidance", value: event.ageGuidance },
    { icon: MapPin, label: "Theatre", value: `${event.venue}, ${event.address}` },
    { icon: Ticket, label: "From", value: `${formatUsd(event.startingPrice)} per ticket` },
  ];

  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-3">
          <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden />
          <div className="min-w-0">
            <dt className="label text-taupe">{row.label}</dt>
            <dd className="mt-1 text-[0.9375rem] leading-snug text-canvas-text">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = find(slug);
  if (!event) notFound();

  /* Same category, different night — the rail already handles the empty case. */
  const alsoOn = resaleEvents.filter(
    (other) => other.category === event.category && other.slug !== event.slug,
  );

  return (
    <div className="page-in flex min-h-dvh flex-col bg-paper">
      <SiteNav />

      <main className="flex-1">
        {/* The room, full width, with the name over it */}
        <section className="relative">
          <div className="relative h-[52vh] min-h-[22rem] w-full overflow-hidden sm:h-[58vh]">
            <Image
              src={event.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover ${event.imagePosition}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/45 to-graphite/25" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto w-full max-w-[75rem] px-6 pb-9 sm:px-10 sm:pb-12">
                <Link
                  href="/ticket-resale#suggested"
                  className="label tap-pad inline-flex items-center gap-2 text-linen/75 transition-colors duration-300 ease-editorial hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  All events
                </Link>

                <div className="mt-5">
                  <span className="ds-badge ds-badge-accent">{event.category}</span>
                </div>

                <h1 className="ds-display mt-4 max-w-3xl text-[clamp(1.9rem,4.6vw,3.25rem)] text-white">
                  {event.name}
                </h1>

                <p className="ds-body mt-3 text-linen/80">
                  {event.date} · {event.time} · {event.venue}
                </p>
                {event.runNote ? (
                  <p className="label mt-3 text-linen/70">{event.runNote}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Seats and price */}
        <section className="bg-paper py-12 sm:py-16">
          <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
            <Reveal>
              <TicketPicker event={event} />
            </Reveal>

            <Reveal delay={0.08} className="mt-10 sm:mt-12">
              <div className="grid gap-8 rounded-feature border border-canvas-border bg-canvas-alt/50 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
                <div>
                  <h2 className="ds-heading text-[1.375rem] text-canvas-text">About the show</h2>
                  <p className="ds-body mt-3 max-w-xl text-canvas-text-muted">{event.description}</p>
                  {event.officialUrl ? (
                    <a
                      href={event.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label link-underline mt-3 inline-flex items-center gap-1.5 text-canvas-text"
                    >
                      Official show site
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  <div className="mt-7">
                    <EventFacts event={event} />
                  </div>
                </div>

                <div>
                  <h2 className="ds-heading text-[1.375rem] text-canvas-text">
                    What you get
                  </h2>
                  <ul className="mt-6 space-y-3.5">
                    {[
                      "Every listing checked against the venue's system before it goes live, and again before transfer.",
                      "Mobile transfer to your account — most land within minutes of purchase.",
                      "Full refund if the event is cancelled; postponements roll over automatically.",
                      "One line to a real person if anything about the order needs a human.",
                    ].map((line) => (
                      <li key={line} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-champagne"
                        />
                        <span className="ds-body text-canvas-text-muted">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <EventSection
          id="also-on"
          title={`More ${categoryPlural(event.category)}`}
          subtitle="More on Broadway."
          events={alsoOn}
          emptyMessage="Nothing else in this category right now."
        />
      </main>

      <SiteFooter />
    </div>
  );
}
