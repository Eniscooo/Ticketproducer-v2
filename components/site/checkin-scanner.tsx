"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Check } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const CAPACITY = 500;
const START_COUNT = 412;
/** One ticket enters every SPAWN_EVERY ms and takes PASS_MS to cross the lane. */
const SPAWN_EVERY = 1800;
const PASS_MS = 3600;

const GUESTS = [
  { name: "Maya Chen", type: "VIP" },
  { name: "Jordan Ellis", type: "General Admission" },
  { name: "Priya Shah", type: "Floor" },
  { name: "Marcus Bell", type: "Balcony" },
  { name: "Sofia Alvarez", type: "VIP" },
  { name: "Theo Grant", type: "General Admission" },
] as const;

type Ticket = { id: number; guest: (typeof GUESTS)[number]; checked: boolean };

function TicketCard({
  guest,
  checked,
  className,
  style,
  cardRef,
}: {
  guest: Ticket["guest"];
  checked: boolean;
  className?: string;
  style?: React.CSSProperties;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={cardRef}
      style={style}
      className={clsx(
        "absolute top-1/2 left-0 w-[9rem] -translate-y-1/2 rounded-xl border-l-2 border-dashed border-graphite/25 bg-bone px-3.5 py-3 text-graphite shadow-[0_14px_30px_-18px_rgba(0,0,0,0.6)] sm:w-[10.5rem]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="label text-[0.6rem] text-champagne-ink">{guest.type}</span>
        <span
          className={clsx(
            "fx-pop grid h-5 w-5 shrink-0 place-items-center rounded-full bg-confirm text-white",
            checked && "on",
          )}
        >
          <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
        </span>
      </div>
      <p className="mt-1.5 truncate text-[0.9375rem] font-semibold leading-tight">{guest.name}</p>
    </div>
  );
}

/**
 * One ticket's pass through the lane, run with the Web Animations API so the
 * distance can be measured: in from the right edge, a beat at the scanner bar,
 * and out past the left edge. The bar sits at the lane's centre, so a ticket is
 * centred on it exactly halfway through — which is when it checks in.
 */
function MovingTicket({
  ticket,
  onCheck,
  onDone,
}: {
  ticket: Ticket;
  onCheck: (id: number) => void;
  onDone: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    const lane = card?.parentElement;
    if (!card || !lane) return;
    const laneWidth = lane.clientWidth;
    const width = card.offsetWidth;
    const atBar = laneWidth / 2 - width / 2;
    // Horizontal only: the card's vertical centring is the `translate` property
    // from its class, which composes with this `transform`.
    const at = (x: number) => ({ transform: `translateX(${x}px)` });

    const animation = card.animate(
      [
        { ...at(laneWidth), offset: 0 },
        { ...at(atBar + 10), offset: 0.4 },
        { ...at(atBar - 10), offset: 0.6 },
        { ...at(-width - 8), offset: 1 },
      ],
      { duration: PASS_MS, easing: "linear", fill: "both" },
    );
    const check = window.setTimeout(() => onCheck(ticket.id), PASS_MS / 2);
    animation.onfinish = () => onDone(ticket.id);
    return () => {
      window.clearTimeout(check);
      animation.cancel();
    };
  }, [ticket.id, onCheck, onDone]);

  return <TicketCard cardRef={ref} guest={ticket.guest} checked={ticket.checked} />;
}

/**
 * Door check-in, as a loop: tickets slide through a scanner bar, the bar
 * flashes green as each one crosses, a tick lands on the ticket, and the
 * checked-in count and capacity ring step up. Runs only while the panel is on
 * screen; under reduced motion it is a still frame of the same scene.
 */
export function CheckinScanner() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotionSafe();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [count, setCount] = useState(START_COUNT);
  const [flash, setFlash] = useState(0);

  const onCheck = useCallback((id: number) => {
    setTickets((all) => all.map((t) => (t.id === id ? { ...t, checked: true } : t)));
    setCount((c) => (c >= CAPACITY ? START_COUNT : c + 1));
    setFlash((f) => f + 1);
  }, []);
  const onDone = useCallback((id: number) => {
    setTickets((all) => all.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!visible || reduceMotion) return;
    let next = 0;
    const spawn = () => {
      const id = Date.now() + next;
      setTickets((all) => [
        ...all,
        { id, guest: GUESTS[next++ % GUESTS.length], checked: false },
      ]);
    };
    spawn();
    const timer = window.setInterval(spawn, SPAWN_EVERY);
    return () => window.clearInterval(timer);
  }, [visible, reduceMotion]);

  return (
    <div
      ref={ref}
      className="flex h-full flex-col rounded-[1.75rem] bg-graphite p-6 text-linen sm:p-8"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="label text-stone">Door check-in</p>
          <p className="mt-3 font-display text-[2.25rem] font-semibold leading-none tabular-nums text-white">
            {count}
          </p>
          <p className="mt-2 text-[0.8125rem] text-linen/55">checked in of {CAPACITY}</p>
        </div>
        <svg viewBox="0 0 64 64" aria-hidden className="h-16 w-16 shrink-0 -rotate-90">
          <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            className="stroke-confirm transition-[stroke-dashoffset] duration-700 ease-editorial"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - count / CAPACITY}
          />
        </svg>
      </div>

      <div
        aria-hidden
        className="relative mt-7 min-h-[7.5rem] flex-1 overflow-hidden rounded-2xl bg-white/[0.04]"
      >
        {reduceMotion ? (
          <>
            <TicketCard guest={GUESTS[0]} checked style={{ left: "6%" }} />
            <TicketCard guest={GUESTS[1]} checked={false} style={{ left: "auto", right: "6%" }} />
          </>
        ) : (
          tickets.map((ticket) => (
            <MovingTicket key={ticket.id} ticket={ticket} onCheck={onCheck} onDone={onDone} />
          ))
        )}

        {/* The scanner bar, above the tickets */}
        <span className="absolute inset-y-3 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-champagne/80 shadow-[0_0_14px_rgba(176,141,87,0.6)]" />
        {flash > 0 ? (
          <span
            key={flash}
            className="absolute inset-y-2 left-1/2 w-2 -translate-x-1/2 rounded-full bg-confirm shadow-[0_0_24px_6px_rgba(91,189,138,0.55)] [animation:tp-flash_0.7s_ease-out_both]"
          />
        ) : null}
      </div>

      <p className="label mt-5 text-linen/45">Scanned at the door, counted live</p>
    </div>
  );
}
