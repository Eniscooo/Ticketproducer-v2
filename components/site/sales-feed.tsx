"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const TYPES = [
  { name: "VIP", price: 250 },
  { name: "General Admission", price: 85 },
  { name: "Floor", price: 140 },
  { name: "Balcony", price: 95 },
] as const;
const AREAS = ["Brooklyn", "Manhattan", "Queens", "Hoboken", "Jersey City", "The Bronx"];

/** Visible rows; one more renders below them while it fades out. */
const SHOWN = 5;
const ROW_PX = 60;
const NEW_ORDER_EVERY = 2000;
const START_TOTAL = 48320;

type Order = { id: number; qty: number; type: string; area: string; amount: number; fresh: boolean };

const order = (id: number, qty: number, t: number, area: string, fresh = false): Order => ({
  id,
  qty,
  type: TYPES[t].name,
  area,
  amount: qty * TYPES[t].price,
  fresh,
});

/** Fixed so the server and the first client render agree. */
const INITIAL: Order[] = [
  order(5, 2, 0, "Brooklyn"),
  order(4, 4, 1, "Queens"),
  order(3, 1, 2, "Manhattan"),
  order(2, 3, 3, "Hoboken"),
  order(1, 2, 1, "The Bronx"),
];

/**
 * A live order book: a new sale drops into the top of the list every two
 * seconds, the list holds five with the oldest fading out beneath, and the
 * revenue total counts up to each new figure. Rows are absolutely placed and
 * moved with `transform`, so the shuffle down never triggers layout. Runs only
 * while on screen; under reduced motion it is a still list and a fixed total.
 */
export function SalesFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const shownTotal = useRef(START_TOTAL);
  const visible = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotionSafe();
  const [orders, setOrders] = useState(INITIAL);
  const [total, setTotal] = useState(START_TOTAL);

  useEffect(() => {
    if (!visible || reduceMotion) return;
    const timer = window.setInterval(() => {
      const next = order(
        Date.now(),
        1 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * TYPES.length),
        AREAS[Math.floor(Math.random() * AREAS.length)],
        true,
      );
      setOrders((all) => [next, ...all].slice(0, SHOWN + 1));
      setTotal((t) => t + next.amount);
    }, NEW_ORDER_EVERY);
    return () => window.clearInterval(timer);
  }, [visible, reduceMotion]);

  // Count the total up to its new value — written straight to the node, so the
  // tween doesn't re-render the list every frame.
  useEffect(() => {
    const node = totalRef.current;
    if (!node) return;
    const from = shownTotal.current;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const value = Math.round(from + (total - from) * (1 - (1 - t) ** 3));
      shownTotal.current = value;
      node.textContent = usd.format(value);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  return (
    <div ref={ref} className="flex h-full flex-col rounded-[1.75rem] bg-graphite p-6 text-linen sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="label flex items-center gap-2 text-stone">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-confirm [animation:tp-live_1.6s_ease-in-out_infinite]"
            />
            Live sales
          </p>
          <p className="mt-3 font-display text-[2.25rem] font-semibold leading-none tabular-nums text-white">
            <span ref={totalRef}>{usd.format(START_TOTAL)}</span>
          </p>
          <p className="mt-2 text-[0.8125rem] text-linen/55">revenue tonight</p>
        </div>
      </div>

      <ul aria-hidden className="relative mt-7" style={{ height: SHOWN * ROW_PX }}>
        {orders.map((o, i) => (
          <li
            key={o.id}
            className="absolute inset-x-0 top-0 transition-[transform,opacity] duration-500 ease-editorial"
            style={{
              transform: `translateY(${i * ROW_PX}px)`,
              opacity: i >= SHOWN ? 0 : 1,
            }}
          >
            <div
              className="flex h-[3.25rem] items-center justify-between gap-4 rounded-xl bg-white/[0.04] px-4"
              style={o.fresh ? { animation: "tp-drop-in 0.5s var(--ease-bounce) both" } : undefined}
            >
              <span className="min-w-0 truncate text-[0.875rem]">
                <span className="font-semibold text-white">
                  {o.qty} {o.type} {o.qty === 1 ? "ticket" : "tickets"}
                </span>
                <span className="text-linen/50"> · {o.area}</span>
              </span>
              <span className="shrink-0 text-[0.875rem] font-semibold tabular-nums text-confirm">
                +{usd.format(o.amount)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
