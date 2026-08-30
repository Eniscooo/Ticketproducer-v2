"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Heart, MapPin } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { formatUsd, type ResaleEvent } from "@/lib/ticket-resale-page";

export type EventCardVariant = "tile" | "feature";

/**
 * One listing, reused everywhere on the route, in two shapes.
 *
 * `tile` is the default rail card: no chrome (border/background/padding), just
 * a square photo and a compact text stack beneath it, matching the
 * marketplace-listing look this route is going for.
 *
 * `feature` is the wide shape — a landscape photo inside a real card, with the
 * name, a single meta line, and a round chevron on one row underneath. Two of
 * them fit the content column, so it reads as a pair of banners rather than a
 * row of thumbnails. Everything it shows comes off the same `ResaleEvent`; only
 * the proportions differ.
 *
 * The favorite heart is local, unpersisted UI state — there's no account system
 * yet for it to save against — so it sits outside the link in both shapes, or
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
  const feature = variant === "feature";

  const heart = (
    <button
      type="button"
      onClick={() => setSaved((value) => !value)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${event.name} from saved` : `Save ${event.name}`}
      className={clsx(
        "absolute flex items-center justify-center rounded-full bg-white/85 text-graphite backdrop-blur-sm transition-colors duration-300 ease-editorial hover:bg-white",
        /* Inset from the photo's own edge, which the feature card pads away from its own. */
        feature ? "right-5 top-5 h-9 w-9" : "right-2.5 top-2.5 h-8 w-8",
      )}
    >
      <Heart
        className={clsx(
          feature ? "h-4 w-4" : "h-3.5 w-3.5",
          saved ? "fill-burgundy text-burgundy" : "text-graphite",
        )}
        aria-hidden
      />
    </button>
  );

  if (feature) {
    return (
      <div className="group relative h-full w-full text-left">
        <Link
          href={`/ticket-resale/${event.slug}`}
          className="block h-full rounded-feature border border-canvas-border bg-surface p-3 transition-colors duration-300 ease-editorial hover:border-canvas-text/25"
        >
          <div className="relative aspect-[7/2] w-full overflow-hidden rounded-control">
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
                {event.date} · {event.venue} · From {formatUsd(event.startingPrice)}
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
      <Link href={`/ticket-resale/${event.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-feature">
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
          From {formatUsd(event.startingPrice)}
        </p>
      </Link>

      {heart}
    </div>
  );
}
