import { CalendarDays, KeyRound, Ticket, type LucideIcon } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";
import { clsx } from "@/lib/clsx";
import { eventManagement, pullQuote, site, ticketResale, tpElite, type ServiceItem } from "@/lib/site";
import { InView } from "./motion";

/**
 * What we do: the three services, named and described exactly as the brief
 * sets them, each with its sub-items and a way in to its own page. Event
 * Management and Ticket Resale sit on the light ground; TP Elite is the dark
 * one — the room you're invited into.
 *
 * Copy is read from lib/site.ts, so this section and the service pages can't
 * drift apart.
 */

type Service = {
  index: string;
  name: string;
  badge?: string;
  description: string;
  items: ServiceItem[];
  href: string;
  cta: string;
  icon: LucideIcon;
  dark?: boolean;
};

const SERVICES: Service[] = [
  {
    index: "01",
    name: eventManagement.headline,
    description: eventManagement.description,
    items: eventManagement.items,
    href: "/event-management",
    cta: "Explore Event Management",
    icon: CalendarDays,
  },
  {
    index: "02",
    name: ticketResale.headline,
    description: ticketResale.description,
    items: ticketResale.items,
    href: "/ticket-resale",
    cta: "Explore Ticket Resale",
    icon: Ticket,
  },
  {
    index: "03",
    name: tpElite.headline,
    badge: tpElite.label,
    description: tpElite.boxDescription,
    items: tpElite.items,
    href: "/elite",
    cta: "Request access",
    icon: KeyRound,
    dark: true,
  },
];

export function Services() {
  return (
    <section id="services" className="tp-section relative scroll-mt-20 bg-paper">
      <div className="mx-auto w-full max-w-[76rem] px-6 sm:px-10">
        <InView className="max-w-2xl">
          <p className="text-[0.8125rem] font-medium text-curtain-ink">What we do</p>
          <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-canvas-text">
            Three services. One team behind every night.
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-[1.65] text-canvas-text-muted">{site.credibility}</p>
        </InView>

        <ol className="mt-14 grid gap-4 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <InView
              key={service.name}
              as="li"
              delay={i * 70}
              className={clsx(
                "tp-card-hover relative isolate flex flex-col overflow-hidden rounded-feature p-7 sm:p-9",
                service.dark
                  ? "bg-elite-void text-white ring-1 ring-inset ring-white/10"
                  : "border border-canvas-border bg-surface text-canvas-text",
              )}
            >
              {service.dark ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_100%_0%,rgba(74,27,40,0.55),transparent_70%)]"
                />
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <span className={clsx("text-[0.8125rem] tabular-nums", service.dark ? "text-white/55" : "text-canvas-text-muted")}>
                  {service.index}
                </span>
                {service.badge ? (
                  <span className="rounded-full border border-white/20 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/85">
                    {service.badge}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-6 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em]">
                {service.name}
              </h3>
              <p className={clsx("mt-3 text-[0.9375rem] leading-[1.6]", service.dark ? "text-white/70" : "text-canvas-text-muted")}>
                {service.description}
              </p>

              <ul className={clsx("mt-7 flex-1 divide-y border-t", service.dark ? "divide-white/10 border-white/10" : "divide-canvas-border border-canvas-border")}>
                {service.items.map((item) => (
                  <li key={item.title} className="py-4">
                    <p className="text-[0.9375rem] font-semibold">{item.title}</p>
                    <p className={clsx("mt-1 text-[0.875rem] leading-[1.55]", service.dark ? "text-white/60" : "text-canvas-text-muted")}>
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>

              <FlowButton href={service.href} tone={service.dark ? "light" : "ink"} icon={service.icon} className="mt-6 self-start">
                {service.cta}
              </FlowButton>
            </InView>
          ))}
        </ol>

        {/* The pull-quote, set like a line from a programme */}
        <InView as="figure" delay={120} className="mx-auto mt-20 max-w-3xl text-center sm:mt-24">
          <blockquote className="text-balance font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-light leading-[1.2] tracking-[-0.02em] text-canvas-text">
            &ldquo;{pullQuote}&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-canvas-text-muted">
            {site.name}
          </figcaption>
        </InView>
      </div>
    </section>
  );
}
