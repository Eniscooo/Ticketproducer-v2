"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import {
  ActivityWidget,
  BudgetWidget,
  ChecklistWidget,
  GuestListWidget,
  RsvpWidget,
  SeatingWidget,
  SpendingWidget,
  TimelineWidget,
  VendorWidget,
} from "./dashboard-widgets";

/**
 * Three columns of widgets; the middle one runs the other way. Speeds differ
 * so the columns never fall into step. `hide` keeps the narrower layouts to
 * two columns on tablets and one on phones.
 */
const COLUMNS = [
  {
    duration: "40s",
    reverse: false,
    hide: "",
    widgets: (uid: string) => [
      <BudgetWidget key="budget" />,
      <GuestListWidget key="guests" />,
      <SpendingWidget key="spend" uid={uid} />,
    ],
  },
  {
    duration: "32s",
    reverse: true,
    hide: "hidden md:block",
    widgets: () => [<RsvpWidget key="rsvp" />, <TimelineWidget key="timeline" />, <ChecklistWidget key="tasks" />],
  },
  {
    duration: "46s",
    reverse: false,
    hide: "hidden lg:block",
    widgets: () => [<VendorWidget key="vendors" />, <ActivityWidget key="activity" />, <SeatingWidget key="seating" />],
  },
];

/**
 * The dashboard as a wall of constantly moving widgets.
 *
 * Each column holds its widgets twice, back to back, and a keyframe slides the
 * whole track from 0 to -50% on a loop (`.dash-track` in globals.css). The
 * second half is identical to the first, so the reset lands exactly where the
 * loop began and never jumps; each half carries its own trailing gap so the
 * seam spaces like every other gap. The copy is `aria-hidden`, so assistive
 * tech reads each widget once.
 *
 * A column pauses under the cursor so a widget can be read. The whole wall
 * pauses while the section is off screen (IntersectionObserver), and under
 * reduced motion it stands still.
 */
export function DashboardMarquee() {
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const observer = new IntersectionObserver(([entry]) => {
      wall.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-paper py-20">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="ds-display text-[clamp(2rem,4.4vw,2.75rem)] text-canvas-text">
            <span className="font-light">Every detail of your event, </span>
            <span className="font-semibold">in one dashboard</span>
          </h2>
          <p className="ds-body mx-auto mt-5 max-w-xl text-canvas-text-muted">
            Budget, guests, vendors and the run of show, live in one place from first brief to last call.
          </p>
        </Reveal>

        <div
          ref={wallRef}
          data-offscreen
          className="dash-wall mt-14 grid h-[600px] grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3"
        >
          {COLUMNS.map((column, c) => (
            <div key={c} className={clsx("dash-col min-w-0", column.hide)}>
              <div
                className="dash-track"
                style={
                  {
                    "--dash-duration": column.duration,
                    animationDirection: column.reverse ? "reverse" : "normal",
                  } as React.CSSProperties
                }
              >
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    aria-hidden={copy === 1 ? true : undefined}
                    className="flex flex-col gap-4 pb-4"
                  >
                    {column.widgets(`${c}-${copy}`)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
