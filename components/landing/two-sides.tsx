import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { eventManagement, sides, ticketResale, tpElite, type Side } from "@/lib/site";

type Panel = {
  side: Side;
  headline: string;
  body: string;
  points: string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
  /** The tickets panel is the dark one — two customers, two grounds. */
  dark?: boolean;
};

const PANELS: Panel[] = [
  {
    side: sides.events,
    headline: "You're putting an event on.",
    body: eventManagement.description,
    points: eventManagement.items.map((item) => item.title),
    image: "/nyc/marquee-radio-city.jpg",
    imageAlt: "The Radio City Music Hall marquee lit up at night",
    imagePosition: "object-[50%_40%]",
  },
  {
    side: sides.tickets,
    headline: "You're going to one.",
    body: ticketResale.description,
    points: [
      "Concerts, sports and Broadway",
      "Every listing verified before it goes live",
      `${tpElite.headline} — a private concierge line`,
    ],
    image: "/nyc/marquee-richard-rodgers.jpg",
    imageAlt: "The Richard Rodgers Theatre marquee on Broadway",
    imagePosition: "object-[50%_45%]",
    dark: true,
  },
];

/**
 * The page's thesis: one company, two customers. Each side gets an equal
 * panel — who it's for, what it does, and the one action that takes you
 * there — so a first-time visitor can tell in a glance which half is theirs.
 * The panels are deliberately different grounds (light for the people
 * running an event, dark for the people out at one) so the split reads
 * before a word of copy does.
 */
export function TwoSides() {
  return (
    <section
      id="sides"
      className="relative -mt-8 scroll-mt-20 rounded-t-[2rem] bg-paper py-20 shadow-[0_-24px_50px_-35px_rgba(23,23,22,0.12)] sm:py-28"
    >
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-10">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="display text-[clamp(2.4rem,5.6vw,4.25rem)] text-canvas-text lg:col-span-7">
            One company. Two sides of the night.
          </h2>
          <p className="max-w-md text-[0.9375rem] leading-[1.85] text-canvas-text-muted lg:col-span-4 lg:col-start-9">
            Some people come to us to put an event on. Others come to get into
            one. They need different things, so each has its own home.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-2">
          {PANELS.map((panel, i) => (
            <Reveal key={panel.side.key} delay={i * 0.1} className="h-full">
              <article
                className={clsx(
                  "group flex h-full flex-col overflow-hidden rounded-card border",
                  panel.dark
                    ? "border-graphite bg-graphite"
                    : "border-canvas-border bg-surface",
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={panel.image}
                    alt={panel.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 38rem, 92vw"
                    className={clsx(
                      "object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.04]",
                      panel.imagePosition,
                    )}
                  />
                  <span className="label absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 text-bone backdrop-blur-sm">
                    {panel.side.audience}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <p className={clsx("label", panel.dark ? "text-champagne" : "text-champagne-ink")}>
                    {panel.side.label}
                  </p>
                  <h3
                    className={clsx(
                      "display mt-3 text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.1]",
                      panel.dark ? "text-white" : "text-canvas-text",
                    )}
                  >
                    {panel.headline}
                  </h3>
                  <p
                    className={clsx(
                      "mt-4 max-w-md text-[0.9375rem] leading-[1.8]",
                      panel.dark ? "text-linen/70" : "text-canvas-text-muted",
                    )}
                  >
                    {panel.body}
                  </p>

                  <ul
                    className={clsx(
                      "mt-7 space-y-3 border-t pt-6",
                      panel.dark ? "border-white/10" : "border-canvas-border",
                    )}
                  >
                    {panel.points.map((point) => (
                      <li
                        key={point}
                        className={clsx(
                          "flex items-start gap-3 text-[0.9375rem] leading-snug",
                          panel.dark ? "text-linen/85" : "text-canvas-text",
                        )}
                      >
                        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-9">
                    <Link
                      href={panel.side.href}
                      className={clsx(
                        "gap-2",
                        panel.dark ? "ds-btn-ghost" : "ds-btn-primary rounded-control",
                      )}
                    >
                      {panel.side.cta.label}
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
