"use client";

import { MapPin, Navigation } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { FilterMenu } from "./filter-menu";
import { DateFilter } from "./date-filter";

export type EventFilterState = {
  city: string;
  /** A day key ("YYYY-MM-DD") or `ALL`. */
  date: string;
  type: string;
};

export const ALL = "All";
const ALL_CITIES = "All cities";
const ALL_DATES = "All dates";

/**
 * The quick-nav bar: where, when, and what kind. Every option is derived from
 * the catalogue rather than hard-coded, so the bar can never offer a city or a
 * day with nothing behind it, and it filters the listing below for real.
 *
 * Laid out as the reference does — a location and a date control, a hairline,
 * then the type chips — but in this site's own palette, and with popovers of
 * its own instead of native selects, whose OS-drawn menus can't take the
 * design system's radii.
 *
 * It scrolls sideways on a phone instead of wrapping, which keeps the whole set
 * on one line the way the reference has it.
 */
export function EventFilters({
  cities,
  eventDays,
  types,
  value,
  onChange,
  resultCount,
}: {
  cities: string[];
  eventDays: Set<string>;
  types: string[];
  value: EventFilterState;
  onChange: (next: EventFilterState) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-graphite text-white"
      >
        <Navigation className="h-4 w-4" aria-hidden />
      </span>

      <FilterMenu
        label="Filter by city"
        icon={<MapPin className="h-3.5 w-3.5 text-champagne" aria-hidden />}
        value={value.city === ALL ? ALL_CITIES : value.city}
        options={cities}
        allLabel={ALL_CITIES}
        onChange={(next) => onChange({ ...value, city: next === ALL_CITIES ? ALL : next })}
      />

      <DateFilter
        eventDays={eventDays}
        value={value.date === ALL ? ALL_DATES : value.date}
        allLabel={ALL_DATES}
        onChange={(next) => onChange({ ...value, date: next === ALL_DATES ? ALL : next })}
      />

      <span aria-hidden className="mx-1 hidden h-7 w-px shrink-0 bg-canvas-border sm:block" />

      {/* Only the chips scroll, and they take their own line on a phone */}
      <div
        role="group"
        aria-label="Filter by event type"
        className="flex basis-full items-center gap-2 overflow-x-auto pb-1 sm:basis-auto sm:flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[ALL, ...types].map((type) => {
          const active = value.type === type;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...value, type })}
              className={clsx(
                "shrink-0 whitespace-nowrap rounded-ds-pill border px-4 py-2.5 text-[0.875rem] transition-colors duration-300 ease-editorial",
                active
                  ? "border-champagne bg-champagne/12 text-canvas-text"
                  : "border-canvas-border bg-surface text-canvas-text-muted hover:border-taupe/50 hover:text-canvas-text",
              )}
            >
              {type === ALL ? "All types" : type}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="label ml-auto hidden shrink-0 pl-4 text-taupe sm:block">
        {resultCount} {resultCount === 1 ? "event" : "events"}
      </p>
    </div>
  );
}
