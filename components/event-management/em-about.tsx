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
    <section className="tp-section relative bg-paper">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-card bg-graphite p-7 ring-1 ring-inset ring-white/10 sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_0%,rgba(255,255,255,0.12),transparent_70%)]"
              />
              <div>
                <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[0.75rem] font-semibold text-white">
                  Why us
                </p>
                <h2 className="ds-display mt-5 text-[clamp(1.85rem,3.6vw,2.5rem)] text-white">
                  {emAbout.headline}
                </h2>
                <p className="ds-body mt-5 text-linen/70">{emAbout.body}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.07} className="lg:col-span-7">
            <div className="relative isolate h-full overflow-hidden rounded-card bg-ink p-7 ring-1 ring-inset ring-white/10 sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_100%_100%,rgba(255,255,255,0.08),transparent_70%)]"
              />
              <ul className="flex h-full flex-col justify-center divide-y divide-white/10">
                {emAbout.points.map((point) => (
                  <li key={point.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/8 backdrop-blur">
                      <ArrowRight aria-hidden className="h-4 w-4 text-white" />
                    </span>
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

      {/* The wall — the rooms we work in, three across */}
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
