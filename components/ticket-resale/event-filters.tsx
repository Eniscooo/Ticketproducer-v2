"use client";

import { MapPin } from "lucide-react";
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
export const ALL_CITIES = "All cities";
export const ALL_DATES = "All dates";

/**
 * Where and when, on their own centred line above the listings.
 *
 * These two are the page's opening statement rather than a form: no boxes, no
 * fill, just place and date with a hairline between them, the way a listings
 * app states what you are currently looking at. Both open as a pull-up sheet on
 * a phone and a popover with a cursor — see `FilterMenu` and `DateFilter`.
 *
 * Every option is derived from the catalogue, so neither control can offer a
 * city or a day with nothing behind it.
 */
export function LocationDateBar({
  cities,
  eventDays,
  value,
  onChange,
}: {
  cities: string[];
  eventDays: Set<string>;
  value: EventFilterState;
  onChange: (next: EventFilterState) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      <FilterMenu
        label="Filter by city"
        icon={<MapPin className="h-4 w-4 text-taupe" aria-hidden />}
        value={value.city === ALL ? ALL_CITIES : value.city}
        options={cities}
        allLabel={ALL_CITIES}
        onChange={(next) => onChange({ ...value, city: next === ALL_CITIES ? ALL : next })}
      />

      <span aria-hidden className="h-6 w-px shrink-0 bg-canvas-border" />

      <DateFilter
        eventDays={eventDays}
        value={value.date === ALL ? ALL_DATES : value.date}
        allLabel={ALL_DATES}
        onChange={(next) => onChange({ ...value, date: next === ALL_DATES ? ALL : next })}
      />
    </div>
  );
}

/**
 * The type chips, which sit under the rail they filter.
 *
 * They scroll sideways rather than wrapping, so the set stays on one line at
 * every width, and the scrollbar is hidden because the row is short enough to
 * read as a row of controls rather than as a scroller.
 */
export function TypeChips({
  types,
  value,
  onChange,
  resultCount,
}: {
  types: string[];
  value: string;
  onChange: (next: string) => void;
  resultCount: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        role="group"
        aria-label="Filter by event type"
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[ALL, ...types].map((type) => {
          const active = value === type;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(type)}
              className={clsx(
                "shrink-0 whitespace-nowrap rounded-ds-pill border px-4 py-2.5 text-[0.875rem] font-medium transition-colors duration-300 ease-editorial",
                active
                  ? "border-champagne bg-champagne/12 text-champagne"
                  : "border-canvas-border bg-surface text-canvas-text-muted hover:border-taupe/50 hover:text-canvas-text",
              )}
            >
              {type === ALL ? "All types" : type}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="label hidden shrink-0 pl-1 text-taupe sm:block">
        {resultCount} {resultCount === 1 ? "event" : "events"}
      </p>
    </div>
  );
}
