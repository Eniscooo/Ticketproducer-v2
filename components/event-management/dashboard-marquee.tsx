"use client";

import { useEffect, useRef } from "react";
import { GridPulse } from "@/components/ui/grid-pulse";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { EmSectionHeader } from "./em-section-header";
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
    <section className="relative isolate overflow-hidden bg-paper py-24">
      {/* The pointer lights the grid behind the wall, as on the landing hero */}
      <GridPulse className="-z-10" />

      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <EmSectionHeader
          center
          eyebrow="Live dashboard"
          light="Every detail of your event,"
          bold="in one dashboard"
          body={
            <span data-grid-avoid>
              Budget, guests, vendors and the run of show, live in one place from first brief to last call.
            </span>
          }
        />

        {/*
         * The wall lies back in 3D, like a live screen seen from just above it,
         * and fades out at the top and bottom edges so the columns read as
         * endless. The tilt is a static transform on a wrapper — the scrolling
         * itself stays the same compositor-only keyframe.
         */}
        <Reveal delay={0.1} className="mt-14 [perspective:2200px]">
          <div className="origin-top [transform:rotateX(18deg)] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_80%,transparent)] motion-reduce:[transform:none]">
            <div
              ref={wallRef}
              data-offscreen
              className="dash-wall grid h-[640px] grid-cols-1 gap-4 overflow-hidden rounded-card md:grid-cols-2 lg:grid-cols-3"
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
        </Reveal>
      </div>
    </section>
  );
}
