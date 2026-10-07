"use client";

import { useRef } from "react";

const WORDMARK = "Ticket Producer";

/**
 * The footer's sign-off: the name set huge in outline, running off both edges
 * and cut through by the foot of the page, so it reads as lettering on the
 * building rather than a logo.
 *
 * Two copies of the outline are stacked. The base copy is a faint hairline; the
 * top copy is drawn in brass and masked to a soft circle around the pointer, so
 * whatever letters sit under the cursor light up. The pointer position goes
 * into two custom properties once per frame and the browser does the rest. On
 * touch screens there is no hover, so the brass copy stays hidden.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    });
  };

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={onPointerMove}
      className="group/mark relative mt-10 h-[8vw] select-none overflow-hidden sm:mt-12"
    >
      {/* Each layer spans the strip and centres the word, so it overflows both
          edges evenly and the mask's coordinates match the pointer's. */}
      <div className="absolute inset-0 flex justify-center">
        <span className="footer-wordmark [-webkit-text-stroke:1px_rgba(242,238,230,0.16)]">{WORDMARK}</span>
      </div>
      <div className="footer-wordmark-spot absolute inset-0 flex justify-center opacity-0 transition-opacity duration-500 ease-editorial group-hover/mark:opacity-100">
        <span className="footer-wordmark [-webkit-text-stroke:1.5px_var(--color-brass-light)]">{WORDMARK}</span>
      </div>
    </div>
  );
}
