"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Heart, MapPin } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { formatFromPrice, type ResaleEvent } from "@/lib/ticket-resale-page";

export type EventCardVariant = "tile" | "feature" | "poster";

/**
 * One listing, reused everywhere on the route, in three shapes.
 *
 * `tile` is the default rail card: no chrome, a square photo and a compact text
 * stack beneath it.
 *
 * `feature` is the wide shape — a landscape photo inside a real card, name, one
 * meta line, and a round chevron on a row underneath. Two fit the content
 * column, so it reads as a pair of banners rather than a row of thumbnails.
 *
 * `poster` is the tall shape the discovery rail uses: the photograph *is* the
 * card, with the name and date set over its foot on a scrim. Nothing sits
 * outside the frame, so a row of them reads as artwork rather than as records —
 * which is the point, since it is the first thing under the hero.
 *
 * Everything all three show comes off the same `ResaleEvent`; only the
 * proportions and where the type sits differ.
 *
 * The favorite heart is local, unpersisted UI state — there's no account system
 * yet for it to save against — so it sits outside the link in every shape, or
 * tapping it would navigate.
 */
export function EventCard({
  event,
  variant = "tile",
}: {
  event: ResaleEvent;
  variant?: EventCardVariant;
}) {
  const [saved, setSaved] = useState(false);

  const heart = (
    <button
      type="button"
      onClick={() => setSaved((value) => !value)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${event.name} from saved` : `Save ${event.name}`}
      className={clsx(
        "pressable absolute flex items-center justify-center rounded-full",
        variant === "poster"
          ? /* No plate on the poster — the scrim and a drop shadow carry it, as the
               reference has it, and a white disc would punch a hole in the artwork. */
            "right-2.5 top-2.5 h-10 w-10 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] hover:text-white/80"
          : variant === "feature"
            ? "right-5 top-5 h-9 w-9 bg-white/85 text-graphite backdrop-blur-sm hover:bg-white"
            : "right-2.5 top-2.5 h-8 w-8 bg-white/85 text-graphite backdrop-blur-sm hover:bg-white",
      )}
    >
      <Heart
        className={clsx(
          variant === "tile" ? "h-3.5 w-3.5" : "h-[1.15rem] w-[1.15rem]",
          saved
            ? "fill-burgundy text-burgundy"
            : variant === "poster"
              ? "text-white"
              : "text-graphite",
        )}
        aria-hidden
      />
    </button>
  );

  if (variant === "poster") {
    return (
      <div className="group relative h-full w-full text-left">
        <Link
          href={`/ticket-resale/${event.slug}`}
          className="pressable tp-card-hover tp-img-skeleton block overflow-hidden rounded-feature"
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={event.image}
              alt=""
              fill
              sizes="(min-width: 640px) 17rem, 62vw"
              className={clsx(
                "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]",
                event.imagePosition,
              )}
            />

            {/* Deep enough at the foot to hold two lines of type at any brightness */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/25 to-transparent"
            />

            <div className="absolute inset-x-4 bottom-4">
              <h3 className="line-clamp-2 text-[1.0625rem] font-semibold leading-[1.25] text-white">
                {event.name}
              </h3>
              <p className="mt-1 line-clamp-1 text-[0.8125rem] text-white/70">
                {event.date} · {event.city}
              </p>
            </div>
          </div>
        </Link>

        {heart}
      </div>
    );
  }

  if (variant === "feature") {
    return (
      <div className="group relative h-full w-full text-left">
        <Link
          href={`/ticket-resale/${event.slug}`}
          className="pressable tp-card-hover block h-full rounded-feature border border-canvas-border bg-surface p-3 [--press-scale:0.985]"
        >
          <div className="tp-img-skeleton relative aspect-[7/2] w-full overflow-hidden rounded-control">
            <Image
              src={event.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 34rem, (min-width: 640px) 27rem, 86vw"
              className={clsx(
                "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]",
                event.imagePosition,
              )}
            />
          </div>

          <div className="mt-3.5 flex items-center justify-between gap-4 px-1.5 pb-1">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-[1.0625rem] font-semibold leading-[1.3] text-canvas-text">
                {event.name}
              </h3>
              <p className="mt-1 line-clamp-1 text-[0.8125rem] text-canvas-text-muted">
                {event.date} · {event.venue} · {formatFromPrice(event.startingPrice)}
              </p>
            </div>

            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-graphite text-white transition-colors duration-300 ease-editorial group-hover:bg-graphite-dim"
            >
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {heart}
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full text-left">
      <Link href={`/ticket-resale/${event.slug}`} className="pressable block">
        <div className="tp-card-hover tp-img-skeleton relative aspect-square w-full overflow-hidden rounded-feature">
          <Image
            src={event.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 14rem, (min-width: 640px) 33vw, 70vw"
            className={clsx(
              "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]",
              event.imagePosition,
            )}
          />
        </div>

        <h3 className="mt-2.5 line-clamp-1 text-[0.9375rem] font-semibold leading-[1.3] text-canvas-text">
          {event.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[0.75rem] text-canvas-text-muted">
          <Calendar className="h-3 w-3 shrink-0 text-taupe" aria-hidden />
          {event.date} · {event.time}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[0.75rem] text-taupe">
          <MapPin className="h-3 w-3 shrink-0 text-taupe" aria-hidden />
          <span className="line-clamp-1">
            {event.venue}, {event.city}
          </span>
        </p>
        <p className="mt-1.5 text-[0.8125rem] font-medium text-canvas-text">
          {formatFromPrice(event.startingPrice)}
        </p>
      </Link>

      {heart}
    </div>
  );
}
