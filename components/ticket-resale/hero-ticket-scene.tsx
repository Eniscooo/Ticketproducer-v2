"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { ArrowLeftRight, BadgeCheck, CalendarDays, Check, Heart, MapPin, ShieldCheck } from "lucide-react";
import {
  PerspectiveStage,
  useStageMotion,
  type FloatingLayer,
} from "@/components/ui/animated-3d-perspective-hero-with-floating-glass-layers";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

/**
 * The Tickets hero's 3D scene: one digital ticket in perspective, with the
 * moments around buying it floating in glass at different depths — finding an
 * event, the live seat count, the confirmation, and the resale market.
 *
 * It is an illustration of the product, not live inventory: the details on the
 * cards are representative (no year on the dates, so it never reads as stale),
 * the photography is the site's own licensed set (see PHOTO-CREDITS.md), and
 * the QR code encodes nothing. The whole scene is hidden from assistive tech;
 * the hero's copy and buttons carry the meaning and the actions.
 */

type Show = {
  title: string;
  venue: string;
  date: string;
  time: string;
  /** Published running time, short form. */
  runtime: string;
  section: string;
  row: string;
  seat: string;
  /** Two tickets, all in. */
  total: string;
  number: string;
  image: string;
};

/**
 * The shows the ticket cycles through — each at its real house, with the
 * marquee photography from /public/broadway (credited in PHOTO-CREDITS.md).
 * Dates and curtain times are real performances from each show's published
 * schedule; seats and prices are representative.
 */
const SHOWS: Show[] = [
  { title: "Hamilton", venue: "Richard Rodgers Theatre", date: "Fri, Dec 18", time: "7:00 PM", runtime: "2h 45m", section: "Orchestra", row: "F", seat: "112", total: "$318", number: "TP-4821-0937", image: "/posters/hamilton.jpg" },
  { title: "Wicked", venue: "Gershwin Theatre", date: "Sat, Dec 12", time: "2:00 PM", runtime: "2h 45m", section: "Mezzanine", row: "B", seat: "204", total: "$238", number: "TP-5174-2280", image: "/posters/wicked.jpg" },
  { title: "The Great Gatsby", venue: "Broadway Theatre", date: "Sat, Dec 5", time: "8:00 PM", runtime: "2h 30m", section: "Orchestra", row: "H", seat: "14", total: "$198", number: "TP-5502-7716", image: "/posters/the-great-gatsby.jpg" },
  { title: "The Lion King", venue: "Minskoff Theatre", date: "Sun, Dec 6", time: "1:00 PM", runtime: "2h 30m", section: "Orchestra", row: "K", seat: "18", total: "$258", number: "TP-6032-1145", image: "/posters/the-lion-king.jpg" },
  { title: "Chicago", venue: "Ambassador Theatre", date: "Fri, Dec 4", time: "8:00 PM", runtime: "2h 30m", section: "Orchestra", row: "M", seat: "21", total: "$178", number: "TP-6650-3391", image: "/posters/chicago.jpg" },
  { title: "Aladdin", venue: "New Amsterdam Theatre", date: "Wed, Dec 9", time: "1:00 PM", runtime: "2h 30m", section: "Mezzanine", row: "A", seat: "107", total: "$198", number: "TP-7129-0458", image: "/posters/aladdin.png" },
  { title: "Hadestown", venue: "Walter Kerr Theatre", date: "Sat, Dec 19", time: "7:30 PM", runtime: "2h 30m", section: "Orchestra", row: "H", seat: "4", total: "$218", number: "TP-7713-6602", image: "/broadway/hadestown.jpg" },
  { title: "The Book of Mormon", venue: "Eugene O'Neill Theatre", date: "Thu, Dec 10", time: "7:00 PM", runtime: "2h 30m", section: "Mezzanine", row: "C", seat: "11", total: "$198", number: "TP-8890-5513", image: "/posters/the-book-of-mormon.jpg" },
];

/** How long each show stays on the ticket. */
const SHOW_MS = 5000;

/**
 * Steps through SHOWS on a timer. Holds still for reduced motion (the first
 * show simply stays), and skips ticks while the tab is hidden so it never
 * races through shows nobody saw.
 */
function useShowCycle() {
  const reduceMotion = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % SHOWS.length);
    }, SHOW_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);
  return index;
}

/** Frosted card chrome shared by every floating piece. Opaque enough to read even where a browser drops backdrop blur inside 3D. */
const GLASS =
  "rounded-[1.375rem] border border-white/70 bg-surface/85 text-canvas-text backdrop-blur-xl " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_30px_60px_-28px_rgba(23,23,22,0.5),0_10px_24px_-14px_rgba(23,23,22,0.28)] " +
  "dark:border-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-28px_rgba(0,0,0,0.9)]";

/* ------------------------------------------------------------------ */
/* The ticket                                                          */
/* ------------------------------------------------------------------ */

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-stone-dim">{label}</p>
      <p className="mt-0.5 truncate text-[0.8125rem] font-semibold text-bone sm:text-sm">{value}</p>
    </div>
  );
}

function DigitalTicket({ index }: { index: number }) {
  const { px } = useStageMotion();
  // The sheen slides against the pointer, as light would across a glossy card.
  const sheenX = useTransform(px, (v) => `${v * -70}%`);
  const show = SHOWS[index];
  // Long names drop a size so they hold to two lines inside the ticket's face.
  const long = show.title.length > 12;

  return (
    <div className="w-[19rem] [filter:drop-shadow(0_38px_44px_rgba(23,23,22,0.34))_drop-shadow(0_8px_14px_rgba(23,23,22,0.2))] sm:w-[36rem] md:w-[40rem] dark:[filter:drop-shadow(0_38px_44px_rgba(0,0,0,0.7))]">
      <div className="relative flex flex-col overflow-hidden rounded-[1.75rem] bg-ink text-bone ring-1 ring-inset ring-white/8 sm:h-[18rem] sm:flex-row">
        {/* Artwork: every show's photo is stacked and cross-faded, so each is loaded before its turn */}
        <div className="relative h-28 shrink-0 sm:h-auto sm:w-[13rem]">
          {SHOWS.map((s, i) => (
            <Image
              key={s.image}
              src={s.image}
              alt=""
              fill
              loading={i === 0 ? "eager" : "lazy"}
              // The first show's art is the Tickets page's largest element: fetch it first.
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="(min-width: 640px) 208px, 304px"
              className={cn(
                "object-cover object-[50%_42%] transition-[opacity,scale] duration-1000 ease-editorial sm:object-[50%_30%]",
                i === index ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-ink" />
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur">
            Broadway
          </span>
          {/* Which show of how many: small ticks along the foot of the artwork */}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {SHOWS.map((s, i) => (
              <span
                key={s.title}
                className={cn(
                  "h-1 rounded-full transition-[width,background-color] duration-500 ease-ui",
                  i === index ? "w-4 bg-bone" : "w-1 bg-bone/40",
                )}
              />
            ))}
          </div>
        </div>

        {/* Details: keyed on the show, so they re-enter with each change */}
        <div key={show.title} className="tp-swap-in flex min-w-0 flex-1 flex-col justify-between gap-3 px-5 pb-4 pt-3 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-brass-light">
              <span aria-hidden className="h-px w-4 bg-brass" />
              Ticket Producer
            </span>
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-stone">Admit one</span>
          </div>

          <div>
            <p
              className={cn(
                "line-clamp-2 text-balance font-display font-extrabold leading-[0.95] tracking-[-0.03em]",
                long ? "text-[1.5rem] sm:text-[1.7rem]" : "text-[1.75rem] sm:text-[2.35rem]",
              )}
            >
              {show.title}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 truncate text-[0.8125rem] text-stone">
              <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-brass-light" />
              {show.venue} · New York
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-bone/10 pt-3">
            <Field label="Date" value={show.date} />
            <Field label="Time" value={show.time} />
            <Field label="Runtime" value={show.runtime} />
            <Field label="Section" value={show.section} />
            <Field label="Row" value={show.row} />
            <Field label="Seat" value={show.seat} />
          </div>
        </div>

        {/*
         * The seal panel. Deliberately no ticket clichés (the brief rules out
         * barcodes, perforations and torn edges): a plain hairline divides it,
         * and the mark is the logo's own letterforms in a fine ring.
         */}
        <div className="relative flex h-[9.5rem] shrink-0 items-center gap-4 border-t border-bone/10 px-5 sm:h-auto sm:w-[11.5rem] sm:flex-col sm:justify-center sm:gap-3 sm:border-l sm:border-t-0 sm:px-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-bone/25 sm:h-24 sm:w-24">
            <div className="grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full border border-bone/10 sm:h-20 sm:w-20">
              <span className="flex flex-col items-center font-display text-[0.6875rem] font-light leading-none tracking-[0.32em] text-bone">
                <span className="indent-[0.32em]">TP</span>
                <span aria-hidden className="my-1.5 h-px w-6 bg-bone/50" />
                <span className="text-[0.5rem] tracking-[0.28em] indent-[0.28em] text-stone">NYC</span>
              </span>
            </div>
          </div>
          <div className="min-w-0 sm:text-center">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bone">Your seat, confirmed</p>
            <p className="mt-1 font-mono text-[0.6875rem] text-stone">{show.number}</p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-confirm/15 px-2 py-0.5 text-[0.625rem] font-semibold text-confirm">
              <BadgeCheck aria-hidden className="h-3 w-3" />
              Verified
            </p>
          </div>
        </div>

        {/* Gloss: a soft band of light that moves with the pointer */}
        <motion.div
          aria-hidden
          style={{ x: sheenX }}
          className="pointer-events-none absolute -inset-y-4 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.09)_47%,rgba(255,255,255,0.16)_50%,transparent_60%)]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating glass                                                      */
/* ------------------------------------------------------------------ */

/** Left: finding something to see. */
function DiscoveryCard() {
  return (
    <div className={cn(GLASS, "w-56 overflow-hidden p-2")}>
      <div className="relative h-28 overflow-hidden rounded-[0.9rem]">
        <Image src="/shows/oh-mary.jpg" alt="" fill sizes="224px" className="object-cover object-[50%_50%]" />
        <span className="absolute left-2 top-2 rounded-full bg-ink/65 px-2 py-0.5 text-[0.625rem] font-semibold text-bone backdrop-blur">
          Play
        </span>
        <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/85 text-curtain">
          <Heart aria-hidden className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>
      <div className="px-1.5 pb-1 pt-2.5">
        <p className="truncate text-sm font-bold leading-tight">Oh, Mary!</p>
        <p className="mt-1 truncate text-xs text-canvas-text-muted">Lyceum Theatre</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-canvas-text-muted">
          <CalendarDays aria-hidden className="h-3.5 w-3.5" />
          Fri, Dec 11 · 7:30 PM
        </p>
        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-xs text-canvas-text-muted">
            From <span className="text-sm font-bold text-canvas-text">$109</span> incl. fees
          </p>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-curtain px-2.5 py-1 text-[0.6875rem] font-semibold text-white">Get tickets</span>
        </div>
      </div>
    </div>
  );
}

/** Right: the moment it's bought. The ring draws, the tick lands, then the three steps confirm in turn. */
function PurchaseConfirmation({ index }: { index: number }) {
  const show = SHOWS[index];
  const steps = ["Payment successful", "Ticket confirmed", "Mobile ticket ready"];
  return (
    <div className={cn(GLASS, "w-60 p-3.5 sm:w-64 sm:p-4")}>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0 text-confirm" aria-hidden="true">
          <circle cx="20" cy="20" r="18" className="fill-confirm/12" />
          <circle
            cx="20"
            cy="20"
            r="18"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="tp-success-ring origin-center -rotate-90"
          />
          <path
            d="M13 20.5 18 25.5 27.5 15"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tp-success-tick"
          />
        </svg>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight">You&rsquo;re going!</p>
          <p key={show.title} className="tp-swap-in mt-0.5 truncate text-xs text-canvas-text-muted">
            {show.title} · 2 tickets · {show.total}
          </p>
        </div>
      </div>

      {/* The steps only once there's room beside the ticket; below `lg` the card stays compact so it clears the QR code */}
      <ul className="mt-3 hidden space-y-1.5 border-t border-canvas-border pt-3 lg:block">
        {steps.map((step, i) => (
          <li
            key={step}
            className="tp-step flex items-center gap-2 text-xs font-medium"
            style={{ ["--d" as string]: `${2.3 + i * 0.35}s` }}
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-confirm text-white">
              <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3.5} />
            </span>
            {step}
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-canvas-text-muted">
        <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-confirm" />
        Secure checkout · Verified seller
      </p>
    </div>
  );
}

/** Top: availability, live — and the people looking at it with you. */
function LiveAvailability() {
  return (
    <div className={cn(GLASS, "w-56 p-3 sm:w-60 sm:p-3.5")}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-curtain-ink">
          <span className="relative flex h-2 w-2">
            <span className="tp-live-ring absolute inset-0 rounded-full bg-curtain" />
            <span className="relative h-2 w-2 rounded-full bg-curtain" />
          </span>
          Live
        </span>
        <span className="text-[0.6875rem] text-canvas-text-muted">Tonight · 7:00 PM</span>
      </div>
      <p className="mt-2 text-sm font-bold leading-tight">Wicked · Gershwin Theatre</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-curtain-ink">18 seats left</span>
        <span className="text-canvas-text-muted">of 1,933</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas-text/10">
        <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-brass to-curtain" />
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {["bg-brass", "bg-curtain", "bg-graphite", "bg-confirm"].map((tone) => (
            <span key={tone} className={cn("h-5 w-5 rounded-full ring-2 ring-surface", tone)} />
          ))}
        </div>
        <span className="text-[0.6875rem] text-canvas-text-muted">
          <span className="font-semibold text-canvas-text">1.2k</span> people viewing
        </span>
      </div>
    </div>
  );
}

/** Bottom: the resale market — verified listings from other fans. */
function ResaleCard() {
  const listings = [
    { seat: "Orchestra · Row K", qty: "2 tickets", price: "$142" },
    { seat: "Mezzanine · Row C", qty: "4 tickets", price: "$96" },
  ];
  return (
    <div className={cn(GLASS, "w-64 p-3.5")}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-canvas-text-muted">
          <ArrowLeftRight aria-hidden className="h-3.5 w-3.5" />
          Resale
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-confirm/15 px-2 py-0.5 text-[0.625rem] font-semibold text-confirm">
          <BadgeCheck aria-hidden className="h-3 w-3" />
          Verified
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <Image src="/posters/chicago.jpg" alt="" fill sizes="40px" className="object-cover object-top" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight">Chicago</p>
          <p className="truncate text-xs text-canvas-text-muted">Fri, Dec 4 · Ambassador Theatre</p>
        </div>
      </div>
      <ul className="mt-2.5 divide-y divide-canvas-border rounded-xl border border-canvas-border">
        {listings.map((l) => (
          <li key={l.seat} className="flex items-center justify-between px-2.5 py-1.5 text-xs">
            <span className="min-w-0">
              <span className="block font-medium">{l.seat}</span>
              <span className="text-[0.6875rem] text-canvas-text-muted">{l.qty}</span>
            </span>
            <span className="font-bold tabular-nums">{l.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The composition                                                     */
/* ------------------------------------------------------------------ */

/**
 * Phones: the ticket stands portrait, with the live count above it and the
 * confirmation below, so nothing covers the ticket's face. From `sm` the
 * ticket turns landscape and those two move to its corners; from `lg` the
 * discovery and resale cards join, two either side.
 */
function layersFor(index: number): FloatingLayer[] {
  return [
  {
    id: "live",
    node: <LiveAvailability />,
    className: "left-0 top-0 sm:left-[2%] sm:top-[1%] lg:left-[9%] lg:top-[2%]",
    depth: 90,
    float: { duration: 6.5, distance: -8 },
  },
  {
    id: "discovery",
    node: <DiscoveryCard />,
    className: "hidden lg:block lg:-left-[1%] lg:top-[30%]",
    depth: 150,
    float: { duration: 8, distance: -12 },
  },
  {
    id: "confirmation",
    node: <PurchaseConfirmation index={index} />,
    className: "bottom-0 right-0 sm:right-[2%] lg:bottom-auto lg:right-[-1%] lg:top-[5%]",
    depth: 170,
    float: { duration: 7.2, distance: -10 },
  },
  {
    id: "resale",
    node: <ResaleCard />,
    className: "hidden lg:block lg:bottom-[1%] lg:right-[6%]",
    depth: 110,
    float: { duration: 9, distance: -9 },
  },
  ];
}

export function HeroTicketScene({ className }: { className?: string }) {
  const index = useShowCycle();
  return (
    <div aria-hidden className={cn("pointer-events-none select-none", className)}>
      <PerspectiveStage
        main={<DigitalTicket index={index} />}
        layers={layersFor(index)}
        delay={0.35}
        stageClassName="h-[42rem] max-w-[68rem] sm:h-[31rem] lg:h-[35rem]"
      />
    </div>
  );
}
