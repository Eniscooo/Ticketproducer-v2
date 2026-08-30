"use client";

import { useState } from "react";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { formatUsd, seatLayoutFor, type ResaleEvent } from "@/lib/ticket-resale-page";
import { SeatMap } from "./seat-map";

const MAX_QUANTITY = 8;

/**
 * The buying side of an event page: the seat map, the tier list, and a quantity
 * stepper, all reading one piece of state so selecting a zone on the map and
 * selecting a row in the list are the same act.
 *
 * NOTE: there is no checkout behind this yet — no payment provider, no order
 * store — so the action states its own price and hands off to the resale line
 * rather than pretending to take a card. Swap the anchor for the real checkout
 * route when it exists; nothing above it needs to change.
 */
export function TicketPicker({ event }: { event: ResaleEvent }) {
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(2);

  const tier = event.tiers[selected];
  const total = tier.price * quantity;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-5">
      <SeatMap
        layout={seatLayoutFor(event.category)}
        tiers={event.tiers}
        selected={selected}
        onSelect={setSelected}
        venue={event.venue}
      />

      <div className="rounded-feature border border-canvas-border bg-surface p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="label text-taupe">Ticket tiers</p>
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-canvas-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-champagne" aria-hidden />
            Verified resale
          </span>
        </div>

        <ul className="mt-4 space-y-2" role="radiogroup" aria-label="Ticket tiers">
          {event.tiers.map((option, i) => (
            <li key={option.name}>
              <button
                type="button"
                role="radio"
                aria-checked={i === selected}
                onClick={() => setSelected(i)}
                className={clsx(
                  "flex w-full items-center justify-between gap-4 rounded-control border px-4 py-3.5 text-left transition-colors duration-300 ease-editorial",
                  i === selected
                    ? "border-champagne bg-champagne/10"
                    : "border-canvas-border bg-canvas-alt/40 hover:border-taupe/50",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium text-canvas-text">
                    {option.name}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-taupe">
                    {option.availability}
                  </span>
                </span>
                <span className="shrink-0 text-[0.9375rem] font-semibold text-canvas-text">
                  {formatUsd(option.price)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-canvas-border pt-5">
          <p className="label text-taupe">Quantity</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Remove one ticket"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas-border text-canvas-text transition-colors duration-300 ease-editorial hover:bg-canvas-alt disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span
              aria-live="polite"
              className="w-9 text-center text-[0.9375rem] font-semibold tabular-nums text-canvas-text"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={quantity >= MAX_QUANTITY}
              aria-label="Add one ticket"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas-border text-canvas-text transition-colors duration-300 ease-editorial hover:bg-canvas-alt disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <p className="text-[0.9375rem] text-canvas-text-muted">
            {quantity} × {tier.name}
          </p>
          <p className="text-[1.375rem] font-semibold tabular-nums text-canvas-text">
            {formatUsd(total)}
          </p>
        </div>

        <a
          href={`tel:+18008090443`}
          className="ds-btn-primary mt-5 w-full rounded-control"
          aria-label={`Reserve ${quantity} ${tier.name} tickets for ${event.name} by phone`}
        >
          Reserve {quantity} · {formatUsd(total)}
        </a>

        <p className="mt-3 text-center text-[0.8125rem] leading-relaxed text-taupe">
          Prices are per ticket and set by the seller. Fees are shown before you pay.
        </p>
      </div>
    </div>
  );
}
