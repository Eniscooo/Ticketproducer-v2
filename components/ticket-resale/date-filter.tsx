"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { dateKeyOf, formatDateKey } from "@/lib/ticket-resale-page";
import { PANEL_CLASS, TRIGGER_CLASS, panelMotion, usePopover } from "./filter-menu";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * A real calendar rather than a list of months: pick the night you want.
 *
 * It only ever offers days the catalogue can fill. Days with events carry a dot
 * and are selectable; every other cell is inert, and the month arrows stop at
 * the first and last month that has anything in it — so the picker cannot walk
 * off into empty years.
 *
 * All the arithmetic uses local-time `Date` constructors and `dateKeyOf`, which
 * formats back in local time too, so a day never shifts across a timezone.
 */
export function DateFilter({
  eventDays,
  value,
  onChange,
  allLabel,
}: {
  /** Every day that has at least one event, as "YYYY-MM-DD". */
  eventDays: Set<string>;
  value: string;
  onChange: (next: string) => void;
  allLabel: string;
}) {
  const { open, setOpen, wrapperRef, triggerRef, onKeyDown, onBlur } =
    usePopover<HTMLDivElement>();
  const reduceMotion = useReducedMotionSafe();
  const isAll = value === allLabel;

  const bounds = useMemo(() => {
    const keys = [...eventDays].sort();
    const first = keys[0] ?? dateKeyOf(new Date());
    const last = keys[keys.length - 1] ?? first;
    const toMonth = (key: string) => {
      const [year, month] = key.split("-").map(Number);
      return year * 12 + (month - 1);
    };
    return { min: toMonth(first), max: toMonth(last), firstKey: first };
  }, [eventDays]);

  /* Open on the selected night, or on the first month that has events. */
  const [cursor, setCursor] = useState(() => {
    const key = isAll ? bounds.firstKey : value;
    const [year, month] = key.split("-").map(Number);
    return year * 12 + (month - 1);
  });

  const year = Math.floor(cursor / 12);
  const month = cursor % 12;

  const cells = useMemo(() => {
    const leading = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const out: (string | null)[] = Array.from({ length: leading }, () => null);
    for (let day = 1; day <= days; day += 1) out.push(dateKeyOf(new Date(year, month, day)));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [year, month]);

  const choose = (key: string) => {
    onChange(key);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0" onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Filter by date"
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          TRIGGER_CLASS,
          isAll
            ? "border-canvas-border text-canvas-text hover:border-taupe/50"
            : "border-champagne bg-champagne/10 text-canvas-text",
        )}
      >
        <CalendarDays className="h-3.5 w-3.5 text-taupe" aria-hidden />
        <span className="whitespace-nowrap">{isAll ? allLabel : formatDateKey(value)}</span>
        <ChevronRight
          aria-hidden
          className={clsx(
            "h-3.5 w-3.5 text-taupe transition-transform duration-300 ease-editorial",
            open && "rotate-90",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Choose a date"
            {...panelMotion(reduceMotion)}
            className={clsx(PANEL_CLASS, "w-[17.5rem] p-3")}
          >
            <div className="flex items-center justify-between gap-2 px-1 pb-2">
              <button
                type="button"
                onClick={() => setCursor((c) => Math.max(bounds.min, c - 1))}
                disabled={cursor <= bounds.min}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-full text-canvas-text transition-colors duration-200 ease-editorial hover:bg-canvas-alt disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>

              <p aria-live="polite" className="text-[0.875rem] font-medium text-canvas-text">
                {MONTH_NAMES[month]} {year}
              </p>

              <button
                type="button"
                onClick={() => setCursor((c) => Math.min(bounds.max, c + 1))}
                disabled={cursor >= bounds.max}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-full text-canvas-text transition-colors duration-200 ease-editorial hover:bg-canvas-alt disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div aria-hidden className="grid grid-cols-7 gap-1 px-1 pb-1">
              {WEEKDAYS.map((day, i) => (
                <span
                  key={`${day}-${i}`}
                  className="text-center text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-taupe"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 px-1">
              {cells.map((key, i) => {
                if (!key) return <span key={`blank-${i}`} aria-hidden />;

                const hasEvents = eventDays.has(key);
                const selected = key === value;
                const day = Number(key.split("-")[2]);

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!hasEvents}
                    aria-pressed={selected}
                    aria-label={`${formatDateKey(key)}${hasEvents ? "" : ", no events"}`}
                    onClick={() => choose(key)}
                    className={clsx(
                      "relative flex h-9 w-full items-center justify-center rounded-control text-[0.8125rem] tabular-nums transition-colors duration-200 ease-editorial",
                      selected
                        ? "bg-champagne font-semibold text-white"
                        : hasEvents
                          ? "text-canvas-text hover:bg-canvas-alt"
                          : "text-taupe/35",
                    )}
                  >
                    {day}
                    {hasEvents && !selected ? (
                      <span
                        aria-hidden
                        className="absolute bottom-1.5 h-1 w-1 rounded-full bg-champagne"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => choose(allLabel)}
              className="mt-2 w-full rounded-control px-3.5 py-2.5 text-center text-[0.875rem] text-canvas-text-muted transition-colors duration-200 ease-editorial hover:bg-canvas-alt hover:text-canvas-text"
            >
              {allLabel}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
