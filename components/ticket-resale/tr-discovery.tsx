"use client";

import { useMemo, useState } from "react";
import { eventDateKey, resaleEvents } from "@/lib/ticket-resale-page";
import { TrHero } from "./tr-hero";
import { LocationDateBar, TypeChips, ALL, type EventFilterState } from "./event-filters";
import { EventSection } from "./event-section";

const RESULT_COUNT = 10;

/**
 * Owns everything the discovery half of the page shares: the hero's search box,
 * the filters, and the rail all read one piece of state, so a search and a
 * filter compose instead of fighting.
 *
 * Laid out the way a listings app opens. Place and date come first, on their
 * own centred line — a statement of what you are looking at rather than a form.
 * Then the rail itself, as tall artwork. Then the type chips, directly under
 * the rail they narrow, so changing one visibly changes the row above it.
 *
 * `children` is whatever the page wants between the hero and the results — the
 * partner row lives there. Taking it as children rather than importing it keeps
 * that subtree server-rendered even though this component is client-side.
 */
export function TrDiscovery({ children }: { children?: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<EventFilterState>({
    city: ALL,
    date: ALL,
    type: ALL,
  });

  /* Options come from the catalogue, so no control can offer an empty choice. */
  const { cities, eventDays, types } = useMemo(
    () => ({
      cities: [...new Set(resaleEvents.map((event) => event.city))].sort(),
      eventDays: new Set(
        resaleEvents
          .map((event) => eventDateKey(event.date))
          .filter((key): key is string => key !== null),
      ),
      types: [...new Set(resaleEvents.map((event) => event.category))].sort(),
    }),
    [],
  );

  const normalized = query.trim().toLowerCase();

  const matches = useMemo(
    () =>
      resaleEvents.filter((event) => {
        if (filters.city !== ALL && event.city !== filters.city) return false;
        if (filters.date !== ALL && eventDateKey(event.date) !== filters.date) return false;
        if (filters.type !== ALL && event.category !== filters.type) return false;
        if (
          normalized &&
          ![event.name, event.venue, event.city, event.category].some((field) =>
            field.toLowerCase().includes(normalized),
          )
        )
          return false;
        return true;
      }),
    [filters, normalized],
  );

  const isNarrowed =
    normalized.length > 0 ||
    filters.city !== ALL ||
    filters.date !== ALL ||
    filters.type !== ALL;

  const events = isNarrowed ? matches : matches.slice(0, RESULT_COUNT);

  const title = normalized
    ? `Results for "${query.trim()}"`
    : isNarrowed
      ? "Matching events"
      : "Popular events";

  return (
    <>
      <TrHero onSearch={setQuery} />

      {children}

      <section id="suggested" className="scroll-mt-28 bg-paper pt-10 sm:pt-12">
        <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
          <LocationDateBar
            cities={cities}
            eventDays={eventDays}
            value={filters}
            onChange={setFilters}
          />
        </div>
      </section>

      <EventSection
        id="results"
        title={title}
        events={events}
        variant="poster"
        initialCount={8}
        emptyMessage={`Nothing matched${normalized ? ` "${query.trim()}"` : ""}. Try another search, or clear a filter.`}
      />

      <section className="bg-paper pb-9 sm:pb-11">
        <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
          <TypeChips
            types={types}
            value={filters.type}
            onChange={(type) => setFilters({ ...filters, type })}
            resultCount={matches.length}
          />
        </div>
      </section>
    </>
  );
}
