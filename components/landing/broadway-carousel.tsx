"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import type { ReelCard } from "@/lib/broadway-reel";

/** Resting drift, in px per second, right to left. */
const DRIFT = 34;
/** Drift while the pointer rests on the reel — slows so a card can be read, never stops dead. */
const HOVER_DRIFT = 9;
/** Space between cards, as a share of a card's width. */
const GAP = 0.13;
/** Perspective depth. Must stay well above the deepest `z` below, or edge cards blow up. */
const PERSPECTIVE = 1100;
/** How far an edge card swings toward the viewer: degrees of turn per unit of distance from centre. */
const TURN = 30;
const MAX_TURN = 56;
/** How far an edge card comes forward, in card widths, at the edge of the screen. */
const LIFT = 1.2;
/** Share of perspective's outward spread taken back out of x — see `place`. */
const HOLD = 0.62;
/** Momentum left after one second of coasting — lower stops sooner. */
const FRICTION = 0.035;
/** Pointer travel, in px, past which a press counts as a drag and the click is swallowed. */
const DRAG_SLOP = 6;

/**
 * The landing hero's reel: one endless row of portrait cards that drifts
 * sideways across the full width, curved like the inside of a cylinder — the
 * cards at the centre sit back and face you flat, the ones at either edge
 * swing in and come forward, so the row reads as a panorama you're standing
 * inside rather than a strip sliding past.
 *
 * Everything per-frame happens in one rAF loop writing `transform` straight to
 * each card, so React never re-renders while it moves. Position is a single
 * `offset`; each card's x is its slot minus that offset, wrapped around the
 * loop, which is what makes it seamless.
 *
 * Input: drag (mouse, pen, touch) with momentum on release, horizontal
 * trackpad scroll, and keyboard focus — tabbing to a card glides it to the
 * centre. Vertical page scroll is never captured (`touch-action: pan-y`, and
 * the wheel handler only claims mostly-horizontal gestures).
 *
 * Under reduced motion there is no drift, no coasting and no float — the reel
 * holds still and moves only as far as the visitor moves it. Off screen, or in
 * a background tab, the loop stops.
 */
export function BroadwayCarousel({ cards, label }: { cards: ReelCard[]; label: string }) {
  const stageRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const swallowClick = useRef(false);
  const reduceMotion = useReducedMotionSafe();
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const els = cardRefs.current.filter((el): el is HTMLLIElement => el !== null);
    if (!stage || els.length === 0) return;

    let cardW = 0;
    let step = 0;
    let loop = 0;
    let half = 0;
    const measure = () => {
      cardW = els[0].offsetWidth;
      step = cardW * (1 + GAP);
      loop = step * els.length;
      half = stage.clientWidth / 2;
    };
    measure();

    /* Start a little in, so the opening frame isn't perfectly symmetrical. */
    let offset = step * 0.35;
    let speed = reduceMotion ? 0 : DRIFT;
    let coast = 0;
    let hovering = false;
    let focusIndex: number | null = null;
    let drag: { x: number; t: number; moved: number; v: number } | null = null;

    const start = performance.now();
    let last = start;
    let raf = 0;
    let running = false;

    const place = (now: number) => {
      const time = (now - start) / 1000;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        let x = (((i * step - offset) % loop) + loop) % loop;
        if (x > loop / 2) x -= loop;

        const d = x / half;
        const reach = Math.abs(d);
        if (reach > 1.7) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "";

        const turn = Math.max(-MAX_TURN, Math.min(MAX_TURN, -d * TURN));
        const z = Math.min(reach * reach, 1.7) * cardW * LIFT;
        /*
         * Perspective pushes anything brought forward outward as well as up in
         * size, which would open wide gaps toward the edges. Pull x back in by
         * most of that spread so the row keeps an even rhythm edge to edge.
         */
        x *= 1 - (z / PERSPECTIVE) * HOLD;
        /* A slow, out-of-step float, so the row breathes rather than slides. */
        const float = reduceMotion ? 0 : Math.sin(time * 0.8 + i * 1.7) * 3;

        el.style.transform = `perspective(${PERSPECTIVE}px) translate3d(${x.toFixed(1)}px, ${float.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${turn.toFixed(2)}deg)`;
        /* Nearer cards paint over farther ones where the curve makes them overlap. */
        el.style.zIndex = String(Math.round(reach * 100));
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!drag) {
        if (focusIndex !== null) {
          /* Glide the focused card to the nearest copy of its centred position. */
          const base = focusIndex * step;
          const target = base + Math.round((offset - base) / loop) * loop;
          offset += (target - offset) * Math.min(1, dt * 7);
          speed = 0;
          coast = 0;
        } else {
          const want = reduceMotion ? 0 : hovering ? HOVER_DRIFT : DRIFT;
          speed += (want - speed) * Math.min(1, dt * 2.5);
          if (Math.abs(coast) > 2) {
            offset += coast * dt;
            coast *= Math.pow(FRICTION, dt);
          } else {
            coast = 0;
          }
          offset += speed * dt;
        }
      }

      place(now);
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    place(start);
    setReady(true);

    /* ── input ─────────────────────────────────────────────────────────── */

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      drag = { x: event.clientX, t: event.timeStamp, moved: 0, v: 0 };
      coast = 0;
      speed = 0;
      focusIndex = null;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dt = Math.max(1, event.timeStamp - drag.t);
      offset -= dx;
      drag.moved += Math.abs(dx);
      /* Smoothed release velocity, px/s — the last few moves, not just the final one. */
      drag.v = drag.v * 0.6 + ((-dx / dt) * 1000) * 0.4;
      drag.x = event.clientX;
      drag.t = event.timeStamp;
      if (drag.moved > DRAG_SLOP) {
        swallowClick.current = true;
        setDragging(true);
      }
      if (!running) place(performance.now());
    };

    const onPointerUp = () => {
      if (drag && !reduceMotion) coast = Math.max(-2600, Math.min(2600, drag.v));
      drag = null;
      setDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      /* The click (if any) fires right after pointerup; let it be swallowed, then reset. */
      setTimeout(() => (swallowClick.current = false), 0);
    };

    const onWheel = (event: WheelEvent) => {
      /* Only mostly-sideways gestures belong to the reel; vertical scroll passes straight through. */
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      offset += event.deltaX;
      focusIndex = null;
      if (!running) place(performance.now());
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    const onFocusIn = (event: FocusEvent) => {
      const index = els.findIndex((el) => el.contains(event.target as Node));
      focusIndex = index >= 0 ? index : null;
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!stage.contains(event.relatedTarget as Node | null)) focusIndex = null;
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("focusout", onFocusOut);

    const resize = new ResizeObserver(() => {
      measure();
      place(performance.now());
    });
    resize.observe(stage);

    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) run();
      else halt();
    });
    seen.observe(stage);

    return () => {
      halt();
      seen.disconnect();
      resize.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [reduceMotion]);

  return (
    <ul
      ref={stageRef}
      aria-label={label}
      onClickCapture={(event) => {
        if (!swallowClick.current) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      /*
       * `--card-w` is the one size knob; the stage is tall enough for an edge
       * card at full lift, so nothing reflows when the reel comes alive. It is
       * hidden until the first placement has run — before that every card sits
       * stacked at the centre — and then rises in.
       */
      className={clsx(
        "relative w-full touch-pan-y select-none overflow-clip [--card-w:clamp(6.5rem,10.4vw,10.5rem)]",
        "h-[calc(var(--card-w)*1.278*1.62)]",
        "transition-[opacity,translate] duration-1000 ease-editorial",
        ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      {/*
       * The set runs twice. One copy of fifteen spans a laptop screen but not
       * an ultrawide one, and a card can only stand in one place at a time —
       * so a single set would leave a hole at the wrap. The second copy is for
       * the eye only: hidden from assistive tech and out of the tab order.
       */}
      {[...cards, ...cards].map((card, i) => {
        const echo = i >= cards.length;
        return (
        <li
          key={`${card.src}-${echo ? "b" : "a"}`}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          aria-hidden={echo || undefined}
          className="absolute left-1/2 top-1/2 ml-[calc(var(--card-w)/-2)] mt-[calc(var(--card-w)*-0.639)] aspect-[720/920] w-(--card-w) will-change-transform"
        >
          <Link
            href={card.href}
            draggable={false}
            tabIndex={echo ? -1 : undefined}
            aria-label={`${card.title} — ${card.place}`}
            className={clsx(
              "group relative block h-full w-full overflow-hidden rounded-[0.9rem] bg-ink",
              "shadow-[0_18px_40px_-22px_rgba(23,23,22,0.55)] outline-none",
              "focus-visible:ring-2 focus-visible:ring-curtain-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-alt",
              dragging && "pointer-events-none",
            )}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              draggable={false}
              loading={i < 9 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 18rem, 11rem"
              className="object-cover transition-[scale,filter] duration-700 ease-editorial group-hover:scale-[1.06] group-hover:brightness-110 group-focus-visible:scale-[1.06]"
            />

            {/* Caption — rises in on hover or focus; the reel reads as pictures until you lean in */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span
              aria-hidden
              className="absolute inset-x-3 bottom-11 translate-y-2 opacity-0 transition-[opacity,translate] duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            >
              <span className="block font-display text-[0.9375rem] font-semibold leading-tight text-white">
                {card.title}
              </span>
              <span className="mt-0.5 block text-[0.6875rem] leading-snug text-white/70">
                {card.place}
              </span>
            </span>

            {/* The reel's play button, re-cut as a ticket */}
            <span
              aria-hidden
              className="absolute bottom-2.5 left-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur-sm transition-[background-color,color,scale] duration-300 ease-ui group-hover:scale-110 group-hover:bg-curtain group-hover:text-white"
            >
              <Ticket className="h-3.5 w-3.5" />
            </span>
          </Link>
        </li>
        );
      })}
    </ul>
  );
}
