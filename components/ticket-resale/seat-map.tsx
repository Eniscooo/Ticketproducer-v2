"use client";

import { clsx } from "@/lib/clsx";
import { formatUsd, type TicketTier } from "@/lib/ticket-resale-page";

/**
 * A zone map, not a per-seat map. The sample catalogue carries three priced
 * tiers per event and no row/seat inventory, so drawing individual seats would
 * be inventing availability the data does not have. Zones are honest about
 * that: they show where each tier sits in the room, what it costs, and how much
 * is left, and clicking one selects that tier.
 *
 * Two layouts, chosen by `seatLayoutFor`: a court with rings around it, or a
 * stage with the house fanning out from it. Both presets are ordered cheapest
 * first, so the last tier is always the one closest to the action — the map
 * reads that order rather than hard-coding section names.
 */

const AVAILABILITY_DOT: Record<TicketTier["availability"], string> = {
  Available: "bg-emerald-600/80",
  Limited: "bg-champagne",
  "Almost gone": "bg-burgundy",
};

type ZoneProps = {
  tier: TicketTier;
  index: number;
  selected: boolean;
  onSelect: (index: number) => void;
  children: React.ReactNode;
};

/**
 * One zone. The `<g>` carries the interaction so the shape and its label move
 * together, and `pointer-events` stays on the shape itself so the gaps between
 * zones are not clickable.
 */
function Zone({ tier, index, selected, onSelect, children }: ZoneProps) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${tier.name}, from ${formatUsd(tier.price)}, ${tier.availability}`}
      aria-pressed={selected}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(index);
        }
      }}
      className={clsx(
        "cursor-pointer outline-none transition-opacity duration-300 ease-editorial",
        selected ? "opacity-100" : "opacity-70 hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      {children}
    </g>
  );
}

export function SeatMap({
  layout,
  tiers,
  selected,
  onSelect,
  venue,
}: {
  layout: "arena" | "stage";
  tiers: TicketTier[];
  selected: number;
  onSelect: (index: number) => void;
  venue: string;
}) {
  /* Closest to the action first, so zone 0 is the priciest ring or front block. */
  const byCloseness = [...tiers].reverse();
  const indexOf = (tier: TicketTier) => tiers.indexOf(tier);

  const fill = (isSelected: boolean) =>
    isSelected ? "var(--color-champagne)" : "var(--color-canvas-alt)";
  const stroke = (isSelected: boolean) =>
    isSelected ? "var(--color-champagne)" : "var(--color-canvas-border)";
  const label = (isSelected: boolean) =>
    isSelected ? "#ffffff" : "var(--color-canvas-text-muted)";

  return (
    <div className="rounded-feature border border-canvas-border bg-surface p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="label text-taupe">Where you&rsquo;ll sit</p>
        <p className="label text-taupe">{layout === "arena" ? "Arena" : "Proscenium"}</p>
      </div>

      <svg
        viewBox="0 0 320 240"
        className="mt-4 w-full"
        role="img"
        aria-label={`Seating zones at ${venue}`}
      >
        {layout === "arena" ? (
          <>
            {/* Outer ring first so the inner ones paint on top of it */}
            {byCloseness
              .map((tier, ring) => ({ tier, ring }))
              .reverse()
              .map(({ tier, ring }) => {
                const inset = 12 + (2 - ring) * 26;
                const isSelected = indexOf(tier) === selected;
                return (
                  <Zone
                    key={tier.name}
                    tier={tier}
                    index={indexOf(tier)}
                    selected={isSelected}
                    onSelect={onSelect}
                  >
                    <rect
                      x={inset}
                      y={inset * 0.85}
                      width={320 - inset * 2}
                      height={240 - inset * 1.7}
                      rx={26}
                      fill={fill(isSelected)}
                      stroke={stroke(isSelected)}
                      strokeWidth="1"
                    />
                    <text
                      x="160"
                      y={inset * 0.85 + 15}
                      textAnchor="middle"
                      className="text-[9px] font-medium uppercase [letter-spacing:0.16em]"
                      fill={label(isSelected)}
                    >
                      {tier.name}
                    </text>
                  </Zone>
                );
              })}

            <rect
              x="112"
              y="94"
              width="96"
              height="52"
              rx="6"
              fill="var(--color-graphite)"
            />
            <text
              x="160"
              y="124"
              textAnchor="middle"
              className="text-[9px] font-medium uppercase [letter-spacing:0.18em]"
              fill="#ffffff"
            >
              Court
            </text>
          </>
        ) : (
          <>
            <rect
              x="70"
              y="12"
              width="180"
              height="30"
              rx="6"
              fill="var(--color-graphite)"
            />
            <text
              x="160"
              y="32"
              textAnchor="middle"
              className="text-[9px] font-medium uppercase [letter-spacing:0.18em]"
              fill="#ffffff"
            >
              Stage
            </text>

            {/* The house fans out from the stage: each block wider than the last */}
            {byCloseness.map((tier, block) => {
              const top = 58 + block * 58;
              const spreadTop = 54 - block * 18;
              const spreadBottom = 54 - (block + 1) * 18;
              const isSelected = indexOf(tier) === selected;
              return (
                <Zone
                  key={tier.name}
                  tier={tier}
                  index={indexOf(tier)}
                  selected={isSelected}
                  onSelect={onSelect}
                >
                  <path
                    d={`M ${spreadTop} ${top} L ${320 - spreadTop} ${top} L ${320 - spreadBottom} ${top + 48} L ${spreadBottom} ${top + 48} Z`}
                    fill={fill(isSelected)}
                    stroke={stroke(isSelected)}
                    strokeWidth="1"
                  />
                  <text
                    x="160"
                    y={top + 29}
                    textAnchor="middle"
                    className="text-[9px] font-medium uppercase [letter-spacing:0.16em]"
                    fill={label(isSelected)}
                  >
                    {tier.name}
                  </text>
                </Zone>
              );
            })}
          </>
        )}
      </svg>

      <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {tiers.map((tier) => (
          <li key={tier.name} className="flex items-center gap-2">
            <span
              aria-hidden
              className={clsx("h-1.5 w-1.5 rounded-full", AVAILABILITY_DOT[tier.availability])}
            />
            <span className="text-[0.8125rem] text-canvas-text-muted">{tier.availability}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
