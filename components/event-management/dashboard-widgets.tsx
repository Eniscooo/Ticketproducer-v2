import { Check } from "lucide-react";
import { clsx } from "@/lib/clsx";

/*
 * Dashboard widgets for the scrolling dashboard on /event-management, drawn in
 * HTML/CSS/SVG with placeholder data for one evening event. Every column is
 * rendered twice for the seamless loop, so anything with an SVG `id` takes a
 * `uid` to keep ids unique across the two copies.
 */

const GOLD = "#d4af7a";
const CHAMPAGNE = "#b08d57";
const BURGUNDY = "#8f3b4f";

function Widget({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-graphite p-5 text-linen shadow-[0_24px_50px_-36px_rgba(10,10,11,0.7)]">
      <div className="flex items-center justify-between gap-3">
        <p className="label text-[0.625rem] text-stone">{title}</p>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

type PillTone = "green" | "gold" | "stone" | "amber";
const PILL: Record<PillTone, string> = {
  green: "bg-confirm/15 text-confirm",
  gold: "bg-elite-gold/15 text-elite-gold",
  stone: "bg-white/10 text-linen/75",
  amber: "bg-champagne/15 text-[#e0b877]",
};

function Pill({ tone, children }: { tone: PillTone; children: React.ReactNode }) {
  return (
    <span className={clsx("shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium", PILL[tone])}>
      {children}
    </span>
  );
}

export function BudgetWidget() {
  return (
    <Widget title="Budget tracker" aside={<Pill tone="green">On track</Pill>}>
      <p className="text-[0.75rem] text-linen/55">Total budget $125,000</p>
      <p className="mt-1 font-display text-[1.75rem] font-semibold leading-none tabular-nums text-white">
        $82,400 <span className="text-[0.875rem] font-normal text-linen/55">spent</span>
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[66%] rounded-full bg-[linear-gradient(90deg,#b08d57,#d4af7a)]" />
      </div>
      <div className="mt-2.5 flex justify-between text-[0.6875rem] text-linen/50">
        <span>66% used</span>
        <span>$42,600 left</span>
      </div>
    </Widget>
  );
}

const RSVP = [
  { label: "Confirmed", value: 186, color: "#5bbd8a" },
  { label: "Pending", value: 42, color: GOLD },
  { label: "Declined", value: 12, color: BURGUNDY },
];
const RSVP_TOTAL = RSVP.reduce((sum, s) => sum + s.value, 0);
/** Where each arc starts round the ring: the sum of the arcs before it. */
const RSVP_ARCS = RSVP.map((s, i) => ({
  ...s,
  start: RSVP.slice(0, i).reduce((sum, prev) => sum + prev.value, 0),
}));

export function RsvpWidget() {
  const total = RSVP_TOTAL;
  return (
    <Widget title="Guest RSVPs" aside={<span className="text-[0.6875rem] text-linen/50">{total} invited</span>}>
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            {RSVP_ARCS.map((s) => (
                <circle
                  key={s.label}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="12"
                  pathLength={total}
                  strokeDasharray={`${s.value - 1.5} ${total - s.value + 1.5}`}
                  strokeDashoffset={-s.start}
                />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <span>
              <span className="block font-display text-[1.4rem] font-semibold leading-none text-white">186</span>
              <span className="text-[0.625rem] text-linen/50">confirmed</span>
            </span>
          </div>
        </div>
        <ul className="space-y-2 text-[0.75rem]">
          {RSVP.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="text-linen/70">{s.label}</span>
              <span className="font-semibold tabular-nums text-white">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Widget>
  );
}

const GUESTS = [
  { name: "Maya Chen", table: 4, status: "VIP", tone: "gold", avatar: GOLD },
  { name: "Jordan Ellis", table: 7, status: "Confirmed", tone: "green", avatar: "#5bbd8a" },
  { name: "Priya Shah", table: 2, status: "Plus one", tone: "stone", avatar: BURGUNDY },
  { name: "Marcus Bell", table: 9, status: "Confirmed", tone: "green", avatar: CHAMPAGNE },
] as const;

export function GuestListWidget() {
  return (
    <Widget title="Guest list" aside={<span className="text-[0.6875rem] text-linen/50">Spring Gala</span>}>
      <ul className="divide-y divide-white/[0.07]">
        {GUESTS.map((g) => (
          <li key={g.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.625rem] font-semibold text-graphite"
              style={{ background: g.avatar }}
            >
              {g.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] font-medium text-white">{g.name}</span>
              <span className="text-[0.6875rem] text-linen/50">Table {g.table}</span>
            </span>
            <Pill tone={g.tone}>{g.status}</Pill>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

const VENDORS = [
  { name: "Catering", status: "Booked", tone: "green" },
  { name: "Décor", status: "Confirmed", tone: "green" },
  { name: "Lighting", status: "Confirmed", tone: "green" },
  { name: "Sound", status: "Pending", tone: "amber" },
  { name: "Security", status: "Booked", tone: "green" },
] as const;

export function VendorWidget() {
  return (
    <Widget title="Vendor status" aside={<span className="text-[0.6875rem] text-linen/50">4 of 5 locked</span>}>
      <ul className="space-y-2">
        {VENDORS.map((v) => (
          <li key={v.name} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
            <span className="text-[0.8125rem] text-white">{v.name}</span>
            <Pill tone={v.tone}>{v.status}</Pill>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

const RUN_OF_SHOW = [
  { time: "4:00 PM", item: "Guests arrive" },
  { time: "5:30 PM", item: "Opening remarks" },
  { time: "7:00 PM", item: "Dinner served" },
  { time: "9:00 PM", item: "Live band" },
];
const NOW = 1;

export function TimelineWidget() {
  return (
    <Widget title="Today's run of show" aside={<Pill tone="green">Live</Pill>}>
      <ol className="relative space-y-4 pl-5 before:absolute before:bottom-1.5 before:left-[4px] before:top-1.5 before:w-px before:bg-white/15">
        {RUN_OF_SHOW.map((row, i) => (
          <li key={row.time} className="relative">
            <span
              className={clsx(
                "absolute -left-5 top-1 h-[9px] w-[9px] rounded-full border",
                i < NOW && "border-champagne bg-champagne",
                i === NOW && "border-confirm bg-confirm shadow-[0_0_0_4px_rgba(91,189,138,0.2)]",
                i > NOW && "border-white/30 bg-graphite",
              )}
            />
            <p className="text-[0.6875rem] tabular-nums text-linen/50">{row.time}</p>
            <p className={clsx("text-[0.8125rem]", i === NOW ? "font-semibold text-white" : "text-linen/75")}>
              {row.item}
              {i === NOW ? <span className="ml-2 text-[0.6875rem] font-normal text-confirm">Now</span> : null}
            </p>
          </li>
        ))}
      </ol>
    </Widget>
  );
}

const WEEK = ["May 8", "9", "10", "11", "12", "13", "14"];
const SPEND = [3.2, 4.1, 3.6, 5.2, 4.8, 6.4, 7.1];

/** Catmull-Rom through the points, as cubic Béziers — a smooth line that still passes through every value. */
function smoothPath(points: [number, number][]) {
  return points.reduce((d, [x, y], i, all) => {
    if (i === 0) return `M${x},${y}`;
    const [x0, y0] = all[i - 2] ?? all[i - 1];
    const [x1, y1] = all[i - 1];
    const [x3, y3] = all[i + 1] ?? [x, y];
    const c1 = [x1 + (x - x0) / 6, y1 + (y - y0) / 6];
    const c2 = [x - (x3 - x1) / 6, y - (y3 - y1) / 6];
    return `${d} C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${x},${y}`;
  }, "");
}

export function SpendingWidget({ uid }: { uid: string }) {
  const w = 280;
  const h = 96;
  const max = 8;
  const points = SPEND.map((v, i): [number, number] => [
    +((i / (SPEND.length - 1)) * w).toFixed(1),
    +(h - (v / max) * h).toFixed(1),
  ]);
  const line = smoothPath(points);
  return (
    <Widget title="Spending this week" aside={<span className="text-[0.6875rem] text-linen/50">$34.4k</span>}>
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full" aria-hidden>
        <defs>
          <linearGradient id={`spend-${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="rgba(255,255,255,0.06)" />
        ))}
        <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#spend-${uid})`} />
        <path d={line} fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
        <circle cx={points.at(-1)![0] - 1} cy={points.at(-1)![1]} r="3.5" fill={GOLD} stroke="#171716" strokeWidth="2" />
        {WEEK.map((d, i) => (
          <text
            key={d}
            x={(i / (WEEK.length - 1)) * w}
            y={h + 14}
            fontSize="9"
            fill="rgba(241,237,228,0.45)"
            textAnchor={i === 0 ? "start" : i === WEEK.length - 1 ? "end" : "middle"}
          >
            {d}
          </text>
        ))}
      </svg>
    </Widget>
  );
}

const ACTIVITY = [
  [18, 12, 4],
  [22, 15, 3],
  [16, 19, 5],
  [28, 17, 6],
  [24, 22, 4],
  [34, 26, 7],
  [38, 29, 5],
];
const SERIES = [
  { label: "Tickets", color: GOLD },
  { label: "RSVPs", color: "#5bbd8a" },
  { label: "Waitlist", color: BURGUNDY },
];

export function ActivityWidget() {
  const w = 280;
  const h = 90;
  const max = 40;
  const group = w / ACTIVITY.length;
  const bar = 7;
  return (
    <Widget title="Daily activity" aside={<span className="text-[0.6875rem] font-medium text-confirm">Up 19% this week</span>}>
      <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full" aria-hidden>
        <line x1="0" x2={w} y1={h} y2={h} stroke="rgba(255,255,255,0.1)" />
        {ACTIVITY.map((day, d) =>
          day.map((v, s) => {
            const bh = (v / max) * h;
            return (
              <rect
                key={`${d}-${s}`}
                x={d * group + (group - bar * 3 - 4) / 2 + s * (bar + 2)}
                y={h - bh}
                width={bar}
                height={bh}
                rx="2"
                fill={SERIES[s].color}
              />
            );
          }),
        )}
        {WEEK.map((label, d) => (
          <text key={label} x={d * group + group / 2} y={h + 14} fontSize="9" fill="rgba(241,237,228,0.45)" textAnchor="middle">
            {label}
          </text>
        ))}
      </svg>
      <div className="mt-3 flex gap-4 text-[0.6875rem] text-linen/60">
        {SERIES.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </Widget>
  );
}

const TASKS = [
  { task: "Venue walk-through", done: true },
  { task: "Final headcount to caterer", done: true },
  { task: "Approve stage plot", done: true },
  { task: "Print seating cards", done: false },
  { task: "Brief security team", done: false },
];

export function ChecklistWidget() {
  const done = TASKS.filter((t) => t.done).length;
  return (
    <Widget
      title="Planning tasks"
      aside={
        <span className="text-[0.6875rem] text-linen/50">
          {done} of {TASKS.length} done
        </span>
      }
    >
      <ul className="space-y-2.5">
        {TASKS.map((t) => (
          <li key={t.task} className="flex items-center gap-3 text-[0.8125rem]">
            <span
              className={clsx(
                "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border",
                t.done ? "border-confirm bg-confirm text-white" : "border-white/25",
              )}
            >
              {t.done ? <Check aria-hidden className="h-3 w-3" strokeWidth={3} /> : null}
            </span>
            <span className={t.done ? "text-linen/45 line-through decoration-white/25" : "text-white"}>{t.task}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

const SEATS = 60;
const ASSIGNED = 52;

export function SeatingWidget() {
  return (
    <Widget title="Seating chart" aside={<span className="text-[0.6875rem] text-linen/50">312 of 360 seated</span>}>
      <div className="grid grid-cols-12 gap-1.5">
        {Array.from({ length: SEATS }, (_, i) => (
          <span
            key={i}
            className="aspect-square rounded-full"
            style={{ background: i < ASSIGNED ? (i % 9 === 0 ? GOLD : CHAMPAGNE) : "rgba(255,255,255,0.1)" }}
          />
        ))}
      </div>
      <div className="mt-3.5 flex gap-4 text-[0.6875rem] text-linen/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CHAMPAGNE }} />
          Assigned
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: GOLD }} />
          VIP
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/10" />
          Open
        </span>
      </div>
    </Widget>
  );
}
