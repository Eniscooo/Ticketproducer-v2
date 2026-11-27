"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import {
  budgetRanges,
  calcEventTypes,
  calcGroups,
  calculateEstimate,
  compareToTarget,
  DURATION_BOUNDS,
  GUEST_BOUNDS,
  type CalcSelection,
} from "@/lib/event-management-page";
import { EmSectionHeader } from "./em-section-header";
import { useProposal } from "./proposal-context";
import { FlowButton } from "@/components/ui/flow-button";
import { FileText } from "lucide-react";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const INITIAL: CalcSelection = {
  eventType: "conference",
  guests: 250,
  days: 1,
  venue: "map",
  staffing: "core",
  ticketing: "standard",
  production: "standard",
};

/**
 * Inputs sit in a white hairline card; the running estimate sits in a dark
 * feature card beside it — design.md's light-card / dark-block rhythm, with
 * the stats-block treatment on the figure itself.
 */
export function BudgetCalculator() {
  const [selection, setSelection] = useState<CalcSelection>(INITIAL);
  const [targetRange, setTargetRange] = useState("");
  const { open } = useProposal();

  const estimate = useMemo(() => calculateEstimate(selection), [selection]);
  const comparison = compareToTarget(estimate.high, estimate.low, targetRange);

  const set = <K extends keyof CalcSelection>(key: K, value: CalcSelection[K]) =>
    setSelection((current) => ({ ...current, [key]: value }));

  const eventTypeLabel =
    calcEventTypes.find((t) => t.value === selection.eventType)?.label ?? "";

  return (
    <section
      id="budget-calculator"
      className="tp-section relative scroll-mt-28 bg-canvas-alt"
    >
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <EmSectionHeader
          eyebrow="Budget"
          light="See where your event"
          bold="lands"
          body="Adjust the inputs to see roughly where an event of this shape lands. A planning estimate, not a quote."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* Inputs */}
          <Reveal delay={0.06} className="lg:col-span-7">
            <div className="ds-card h-full p-7 sm:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="calc-event-type" className="label text-taupe">
                    Event type
                  </label>
                  <select
                    id="calc-event-type"
                    value={selection.eventType}
                    onChange={(e) => set("eventType", e.target.value)}
                    className="ds-input mt-2"
                  >
                    {calcEventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="calc-target" className="label text-taupe">
                    Budget range
                  </label>
                  <select
                    id="calc-target"
                    value={targetRange}
                    onChange={(e) => setTargetRange(e.target.value)}
                    className="ds-input mt-2"
                  >
                    <option value="">Compare against a target…</option>
                    {budgetRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <Slider
                  id="calc-guests"
                  label="Number of guests"
                  value={selection.guests}
                  display={selection.guests.toLocaleString("en-US")}
                  min={GUEST_BOUNDS.min}
                  max={2000}
                  step={10}
                  onChange={(v) => set("guests", v)}
                  hint={`Up to ${GUEST_BOUNDS.max.toLocaleString("en-US")} — call us above 2,000.`}
                />
                <Slider
                  id="calc-days"
                  label="Event duration"
                  value={selection.days}
                  display={`${selection.days} ${selection.days === 1 ? "day" : "days"}`}
                  min={DURATION_BOUNDS.min}
                  max={DURATION_BOUNDS.max}
                  step={1}
                  onChange={(v) => set("days", v)}
                />
              </div>

              <div className="mt-8 space-y-6 border-t border-canvas-border pt-7">
                {calcGroups.map((group) => (
                  <fieldset key={group.key}>
                    <legend className="label text-taupe">{group.label}</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const checked = selection[group.key] === option.value;
                        const id = `${group.key}-${option.value}`;
                        return (
                          <div key={option.value}>
                            <input
                              type="radio"
                              id={id}
                              name={group.key}
                              value={option.value}
                              checked={checked}
                              onChange={() => set(group.key, option.value)}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={id}
                              className={clsx(
                                "ds-badge cursor-pointer px-3 py-1.5 transition-colors duration-300 ease-editorial",
                                "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne",
                                checked
                                  ? "bg-graphite text-linen"
                                  : "border border-canvas-border text-canvas-text-muted hover:border-canvas-text/30 hover:text-canvas-text",
                              )}
                            >
                              {option.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Estimate — dark feature card */}
          <Reveal delay={0.12} className="lg:col-span-5">
            <div className="relative isolate flex h-full flex-col overflow-hidden rounded-card bg-graphite p-7 ring-1 ring-inset ring-white/10 shadow-[0_40px_80px_-40px_rgba(10,10,11,0.6)] sm:p-9 lg:sticky lg:top-28">
              {/* Lit glass, not a flat slab: a pool of light from the top corner */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(255,255,255,0.12),transparent_70%)]"
              />
              <span className="ds-badge ds-badge-accent self-start uppercase tracking-[0.14em]">
                Planning Estimate
              </span>

              <p
                aria-live="polite"
                className="ds-display mt-6 text-[clamp(1.75rem,3.6vw,2.4rem)] text-white"
              >
                {usd.format(estimate.low)}
                <span className="font-light text-linen/40"> – </span>
                {usd.format(estimate.high)}
              </p>
              <p className="ds-body mt-2 text-linen/55">
                {selection.guests.toLocaleString("en-US")} guests ·{" "}
                {eventTypeLabel.toLowerCase()} ·{" "}
                {selection.days === 1 ? "1 day" : `${selection.days} days`}
              </p>

              <dl className="mt-7 space-y-2.5 border-t border-white/12 pt-6">
                {estimate.lines.map((line) => (
                  <div key={line.label} className="flex items-start justify-between gap-4">
                    <dt className="text-[0.8125rem] leading-snug text-linen/60">
                      {line.label}
                    </dt>
                    <dd className="shrink-0 text-[0.8125rem] tabular-nums text-white">
                      {usd.format(line.amount)}
                    </dd>
                  </div>
                ))}
              </dl>

              {comparison !== "unknown" ? (
                <p
                  className={clsx(
                    "mt-6 rounded-badge px-4 py-3 text-[0.8125rem] leading-relaxed",
                    comparison === "within"
                      ? "bg-champagne/15 text-white"
                      : "bg-white/5 text-linen/75",
                  )}
                >
                  {comparison === "within"
                    ? "This lands inside the range you selected."
                    : comparison === "above"
                      ? "This runs above the range you selected — we can talk through what to scale back."
                      : "This comes in under the range you selected."}
                </p>
              ) : null}

              <p className="mt-6 text-[0.75rem] leading-relaxed text-linen/40">
                An initial planning estimate only — not a quote, and not binding.
                Real pricing depends on the venue, the date, and the run of show.
              </p>

              <FlowButton
                tone="light"
                icon={FileText}
                fullWidth
                className="mt-7"
                onClick={() =>
                  open({
                    eventType: eventTypeLabel,
                    guests: selection.guests,
                    budgetRange: targetRange || undefined,
                  })
                }
              >
                Request a Proposal
              </FlowButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Slider({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label text-taupe">
          {label}
        </label>
        <span className="text-[0.9375rem] font-semibold tabular-nums text-canvas-text">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-champagne"
      />
      {hint ? <p className="mt-2 text-[0.75rem] text-taupe/70">{hint}</p> : null}
    </div>
  );
}
