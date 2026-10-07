"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const BALANCE = 24850;
const COUNT_MS = 1600;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/**
 * Back to front. `rest` is tucked into the pocket, `open` is risen out of it —
 * as a share of the card's own height, so it scales with the wallet. The
 * back card rises furthest so all three tops show, fanned.
 */
const CARDS = [
  {
    surface: "bg-[linear-gradient(135deg,#e3c08a,#a4855a)] text-elite-void",
    chip: "bg-elite-void/25",
    last4: "2041",
    open: "-40%",
    delay: "0ms",
  },
  {
    surface: "bg-[linear-gradient(135deg,#6b2639,#2a0f17)] text-elite-ivory",
    chip: "bg-elite-gold/70",
    last4: "7316",
    open: "-21%",
    delay: "110ms",
  },
  {
    surface: "bg-[linear-gradient(135deg,#f8f1e5,#d6c8b0)] text-elite-void",
    chip: "bg-elite-gold",
    last4: "0588",
    open: "-2%",
    delay: "220ms",
  },
] as const;

/**
 * TP Elite's side visual: three payment cards tucked into a wallet pocket —
 * back panel, then the cards, then the front panel layered over them — that
 * rise with a staggered bounce when the section scrolls into view and lift a
 * little further under the cursor; beside them, a tilted phone whose balance
 * counts up from zero. The motion is CSS (`.wallet-card` in globals.css) keyed
 * off one `is-open` class. Under reduced motion it renders open, with the
 * final balance.
 */
export function EliteWallet() {
  const ref = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotionSafe();
  const open = inView || reduceMotion;

  useEffect(() => {
    const node = balanceRef.current;
    if (!node) return;
    if (reduceMotion) {
      node.textContent = money.format(BALANCE);
      return;
    }
    if (!inView) return;

    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      node.textContent = money.format(BALANCE * (1 - (1 - t) ** 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-elite-gold/25 bg-[radial-gradient(90%_70%_at_70%_20%,rgba(74,27,40,0.55),transparent_70%),linear-gradient(180deg,#1b1311,#0d0b0a)]"
    >
      {/* The phone, tilted, behind the wallet */}
      <div className="absolute right-[7%] top-[7%] w-[44%] rotate-[8deg] rounded-[1.6rem] border border-elite-gold/30 bg-elite-void p-1.5 shadow-[0_40px_70px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex aspect-[9/17] flex-col rounded-[1.25rem] bg-[linear-gradient(180deg,#1f1613,#120d0b)] px-3 pb-3 pt-6 sm:px-4">
          <span aria-hidden className="mx-auto -mt-3.5 mb-4 block h-1 w-8 rounded-full bg-white/15" />
          <span className="label text-[0.55rem] text-elite-gold">TP Elite</span>
          <span className="mt-3 text-[0.65rem] text-elite-ivory/55">Available balance</span>
          <span
            ref={balanceRef}
            className="mt-1 font-display text-[clamp(0.95rem,2.6vw,1.35rem)] font-semibold leading-none tabular-nums text-elite-ivory"
          >
            {money.format(0)}
          </span>
          <div aria-hidden className="mt-auto space-y-1.5">
            {["Courtside · Fri", "Table for 6 · Sat", "Suite · Sun"].map((line) => (
              <div
                key={line}
                className="flex items-center justify-between rounded-md bg-white/[0.05] px-2 py-1.5 text-[0.55rem] text-elite-ivory/70"
              >
                {line}
                <span className="h-1.5 w-1.5 rounded-full bg-elite-gold" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The wallet: back panel, cards, front panel */}
      <div
        aria-hidden
        className={clsx("group absolute bottom-[7%] left-[7%] aspect-[5/4] w-[68%]", open && "is-open")}
      >
        <div className="absolute inset-0 rounded-[1.25rem] border border-elite-gold/15 bg-[linear-gradient(160deg,#3a2a21,#1e1511)]" />

        {CARDS.map((card) => (
          <div
            key={card.last4}
            className={clsx(
              "wallet-card absolute inset-x-[7%] top-[8%] flex aspect-[1.586] flex-col justify-between rounded-[0.8rem] p-[6%] shadow-[0_-10px_24px_-14px_rgba(0,0,0,0.7)]",
              card.surface,
            )}
            style={
              {
                "--rest": "30%",
                "--open": card.open,
                "--delay": card.delay,
              } as React.CSSProperties
            }
          >
            <div className="flex items-center justify-between">
              <span className="label text-[0.5rem]">TP Elite</span>
              <span className={clsx("h-3 w-4 rounded-[3px] sm:h-3.5 sm:w-5", card.chip)} />
            </div>
            <span className="text-right text-[0.6rem] tracking-[0.2em] tabular-nums opacity-70">
              •••• {card.last4}
            </span>
          </div>
        ))}

        {/* Front pocket, stitched, over the cards' lower halves */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] rounded-b-[1.25rem] rounded-t-[0.7rem] bg-[linear-gradient(170deg,#4a362a,#251a14)] shadow-[0_-14px_26px_-12px_rgba(0,0,0,0.75)]">
          <div className="absolute inset-[7%] rounded-[0.7rem] border border-dashed border-elite-gold/30" />
          <span className="label absolute bottom-[16%] left-1/2 -translate-x-1/2 text-[0.55rem] text-elite-gold/70">
            TP
          </span>
        </div>
      </div>
    </div>
  );
}
