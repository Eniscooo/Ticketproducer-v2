"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useStepLoop } from "@/lib/step-reveal";
import type { EmStepDemo } from "@/lib/event-management-page";

/*
 * Small looping demos, one per "How it works" step, each inside a drawn phone.
 * Every moving piece carries `data-at` (the loop step it appears on) and an
 * `.fx-*` class from globals.css; `useStepLoop` walks the steps while the phone
 * is on screen, holds the finished screen, clears, and starts over. Under
 * reduced motion each one is simply its finished screen. All HTML/CSS/SVG —
 * no images.
 */

/** A small green confirmation tick. */
function Tick({ at, className }: { at: number; className?: string }) {
  return (
    <span
      data-at={at}
      className={clsx(
        "fx-pop grid h-4 w-4 shrink-0 place-items-center rounded-full bg-confirm text-white [transition-delay:220ms]",
        className,
      )}
    >
      <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3.5} />
    </span>
  );
}

function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between px-1 text-[0.55rem] font-medium text-white/60">
        <span>9:41</span>
        <span className="h-1.5 w-6 rounded-full bg-white/25" />
      </div>
      <p className="mt-4 px-1 text-[0.8rem] font-semibold text-white">{title}</p>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </>
  );
}

/** 01 — the event takes shape, then the plan is reviewed line by line. */
function CreateDemo() {
  const fields = [
    ["Event", "Spring Gala"],
    ["Date", "May 14 · 7 PM"],
    ["Venue", "Pier 17, NYC"],
  ];
  const review = ["Pre-production", "Sequencing", "Ops review"];
  return (
    <Screen title="New event">
      <div className="space-y-1.5">
        {fields.map(([label, value], i) => (
          <div key={label} data-at={i} className="fx-up rounded-lg bg-white/[0.06] px-2.5 py-1.5">
            <p className="text-[0.5rem] uppercase tracking-[0.14em] text-white/45">{label}</p>
            <p className="text-[0.7rem] font-medium text-white">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 px-1 text-[0.5rem] uppercase tracking-[0.14em] text-white/45">Plan review</p>
      <div className="mt-1.5 space-y-1">
        {review.map((line, i) => (
          <div
            key={line}
            data-at={3 + i}
            className="fx-up flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[0.65rem] text-white/85"
          >
            {line}
            <Tick at={3 + i} />
          </div>
        ))}
      </div>
      <div
        data-at={6}
        className="fx-pop mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-confirm py-2 text-[0.7rem] font-semibold text-white"
      >
        <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
        Plan approved
      </div>
    </Screen>
  );
}

const MAP_TABLES = [
  [42, 104],
  [80, 104],
  [118, 104],
  [42, 140],
  [80, 140],
  [118, 140],
  [61, 172],
  [99, 172],
] as const;

/** 02 — the room draws itself, then the tables land. */
function SeatsDemo() {
  return (
    <Screen title="Seat map">
      <svg viewBox="0 0 160 200" aria-hidden className="w-full">
        <rect
          x="8"
          y="8"
          width="144"
          height="184"
          rx="14"
          pathLength={1}
          fill="none"
          stroke="#b08d57"
          strokeWidth="2"
          className="fx-draw"
          data-at={0}
        />
        <g className="fx-pop" data-at={1}>
          <rect x="40" y="22" width="80" height="22" rx="4" fill="#b08d57" />
          <text x="80" y="36.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#171716" fontWeight="600">
            STAGE
          </text>
        </g>
        <rect
          x="58"
          y="56"
          width="44"
          height="26"
          rx="3"
          fill="none"
          stroke="#f2eee6"
          strokeOpacity="0.35"
          strokeDasharray="3 3"
          className="fx-pop"
          data-at={1}
        />
        {MAP_TABLES.map(([x, y], i) => (
          <g key={`${x}-${y}`} className="fx-drop" data-at={2 + Math.floor(i / 2)}>
            {Array.from({ length: 6 }, (_, s) => {
              const a = (s / 6) * Math.PI * 2;
              return (
                <circle
                  key={s}
                  cx={+(x + Math.cos(a) * 12).toFixed(2)}
                  cy={+(y + Math.sin(a) * 12).toFixed(2)}
                  r="2.6"
                  fill="#d4af7a"
                />
              );
            })}
            <circle cx={x} cy={y} r="7.5" fill="#2a2622" stroke="#b08d57" strokeWidth="1" />
          </g>
        ))}
      </svg>
      <div
        data-at={6}
        className="fx-pop mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-white/[0.08] py-2 text-[0.65rem] font-medium text-white"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-confirm" />
        Seat map live · 48 seats
      </div>
    </Screen>
  );
}

/** A fixed QR-like pattern: three finder squares and a deterministic field. */
const QR_SIZE = 17;
const QR_CELLS = Array.from({ length: QR_SIZE * QR_SIZE }, (_, n) => {
  const x = n % QR_SIZE;
  const y = Math.floor(n / QR_SIZE);
  const inFinder = (fx: number, fy: number) => x >= fx && x < fx + 5 && y >= fy && y < fy + 5;
  if (inFinder(0, 0) || inFinder(QR_SIZE - 5, 0) || inFinder(0, QR_SIZE - 5)) return null;
  return (x * 7 + y * 13 + x * y) % 5 < 2 ? [x, y] : null;
}).filter((cell): cell is number[] => cell !== null);

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="5" height="5" fill="#171716" />
      <rect x={x + 1} y={y + 1} width="3" height="3" fill="#f2eee6" />
      <rect x={x + 1.75} y={y + 1.75} width="1.5" height="1.5" fill="#171716" />
    </g>
  );
}

/** 03 — the ticket's code is framed, swept, and let in. */
function TicketsDemo() {
  return (
    <Screen title="Door scan">
      <div className="rounded-xl bg-bone p-3 text-graphite">
        <p className="text-[0.5rem] uppercase tracking-[0.14em] text-graphite/55">Spring Gala</p>
        <p className="text-[0.7rem] font-semibold">GA · Row F · Seat 12</p>
        <div className="relative mx-auto mt-2.5 w-[72%]">
          <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} aria-hidden className="block w-full" shapeRendering="crispEdges">
            {QR_CELLS.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#171716" />
            ))}
            <Finder x={0} y={0} />
            <Finder x={QR_SIZE - 5} y={0} />
            <Finder x={0} y={QR_SIZE - 5} />
          </svg>
          {/* Scanner frame and the sweeping line */}
          <div data-at={0} className="fx-fade absolute -inset-2">
            {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map(
              (corner) => (
                <span key={corner} className={clsx("absolute h-3 w-3 rounded-[2px] border-champagne", corner)} />
              ),
            )}
          </div>
          {/* Full-height carrier, so its 100% travel is the code's height */}
          <span data-at={1} className="fx-scan absolute inset-0 [--scan-travel:97%]">
            <span className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-confirm shadow-[0_0_10px_2px_rgba(91,189,138,0.6)]" />
          </span>
        </div>
      </div>
      <div
        data-at={3}
        className="fx-pop mt-auto flex items-center gap-2.5 rounded-xl bg-confirm/15 px-3 py-2.5 ring-1 ring-confirm/50"
      >
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-confirm text-white">
          <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <span>
          <span className="block text-[0.7rem] font-semibold text-white">Valid, welcome in</span>
          <span className="block text-[0.55rem] text-white/55">Checked in at 7:02 PM</span>
        </span>
      </div>
    </Screen>
  );
}

const POSTS = [
  { post: "Entrance", initials: "JR", tone: "bg-[#b08d57]" },
  { post: "Bar", initials: "AL", tone: "bg-[#8f3b4f]" },
  { post: "Stage", initials: "MK", tone: "bg-[#55534e]" },
  { post: "VIP", initials: "SD", tone: "bg-[#d4af7a]" },
];

/** 04 — crew slide into their posts and confirm. */
function StaffDemo() {
  return (
    <Screen title="Tonight's crew">
      <div className="space-y-2">
        {POSTS.map(({ post, initials, tone }, i) => (
          <div key={post} className="flex items-center gap-2.5 rounded-lg bg-white/[0.05] px-2.5 py-2">
            <span className="w-12 text-[0.6rem] uppercase tracking-[0.12em] text-white/50">{post}</span>
            <span className="relative grid h-7 w-7 place-items-center rounded-full border border-dashed border-white/20">
              <span
                data-at={i}
                className={clsx(
                  "fx-in-left absolute inset-0 grid place-items-center rounded-full text-[0.55rem] font-semibold text-graphite",
                  tone,
                )}
              >
                {initials}
              </span>
            </span>
            <span data-at={i} className="fx-fade ml-auto text-[0.55rem] text-white/60 [transition-delay:220ms]">
              Confirmed
            </span>
            <Tick at={i} />
          </div>
        ))}
      </div>
      <div
        data-at={4}
        className="fx-pop mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-confirm py-2 text-[0.7rem] font-semibold text-white"
      >
        <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
        4 of 4 posts covered
      </div>
    </Screen>
  );
}

const DEMOS: Record<EmStepDemo, { Demo: () => React.ReactElement; steps: number }> = {
  create: { Demo: CreateDemo, steps: 6 },
  seats: { Demo: SeatsDemo, steps: 6 },
  tickets: { Demo: TicketsDemo, steps: 3 },
  staff: { Demo: StaffDemo, steps: 4 },
};

/** A drawn phone running one step's demo. */
export function PhoneDemo({ demo }: { demo: EmStepDemo }) {
  const ref = useRef<HTMLDivElement>(null);
  const { Demo, steps } = DEMOS[demo];
  useStepLoop(ref, { steps });

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative w-[11.5rem] shrink-0 rounded-[2.1rem] border border-white/10 bg-ink p-2 shadow-[0_40px_70px_-35px_rgba(10,10,11,0.75)] sm:w-[13rem]"
    >
      <span className="absolute left-1/2 top-3 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-ink" />
      <div className="flex aspect-[9/18.5] flex-col overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#1b1b1f,#111113)] px-3 pb-3.5 pt-3">
        <Demo />
      </div>
    </div>
  );
}
