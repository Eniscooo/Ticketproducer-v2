import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { Reveal } from "@/components/ui/reveal";
import { emAbout } from "@/lib/event-management-page";

/**
 * design.md's Dark Feature Card + Breakthrough Image: the inverted block that
 * breaks the run of light sections, with the reasons as arrow-prefixed list
 * items, and — in place of the single wide photograph — a wall of nine portrait
 * frames beneath it.
 *
 * The wall is held down to a low brightness so it reads as one dim surface
 * rather than nine competing pictures, and each frame comes back up to full
 * under the cursor. It sits on a black slab rather than straight on the page's
 * paper: dimmed photographs on a light ground read as underexposed, where on
 * black they read as lit. The slab's padding matches the grid gap, so the frames
 * look inlaid into one panel instead of scattered over a backdrop. That is CSS-only (`group-hover`), so this stays a server
 * component; under `prefers-reduced-motion` the site's global rule collapses
 * the transition and the lift still happens, just instantly.
 */
export function EmAbout() {
  return (
    <section className="relative bg-paper py-20">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-card bg-graphite p-7 sm:p-9">
              <div>
                <h2 className="ds-display text-[clamp(1.85rem,3.6vw,2.5rem)] text-white">
                  {emAbout.headline}
                </h2>
                <p className="ds-body mt-5 text-linen/70">{emAbout.body}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.07} className="lg:col-span-7">
            <div className="h-full rounded-card bg-slate p-7 sm:p-9">
              <ul className="flex h-full flex-col justify-center gap-6">
                {emAbout.points.map((point) => (
                  <li key={point.title} className="flex gap-4">
                    <ArrowRight
                      aria-hidden
                      className="mt-1 h-4 w-4 shrink-0 text-champagne"
                    />
                    <div>
                      <p className="text-[1.125rem] font-medium leading-snug text-white">
                        {point.title}
                      </p>
                      <p className="ds-body mt-1.5 text-linen/60">{point.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* The wall — rooms and the people who run them, three across */}
      <Reveal delay={0.1} className="mt-4">
        <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
          <div className="rounded-card bg-ink p-2 sm:p-3 lg:p-4">
            <ul aria-hidden className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {emAbout.wall.map((frame) => (
                <li
                  key={frame.src + frame.position}
                  className="group relative aspect-[3/4] overflow-hidden rounded-control bg-ink sm:rounded-feature"
                >
                  <Image
                    src={frame.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24rem, 33vw"
                    className={clsx(
                      "object-cover brightness-[0.46] saturate-[0.8] transition duration-700 ease-editorial",
                      "group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100",
                      frame.position,
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
