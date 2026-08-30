import Image from "next/image";
import Link from "next/link";
import { clsx } from "@/lib/clsx";
import { Reveal } from "@/components/ui/reveal";
import { popularCategories } from "@/lib/ticket-resale-page";

/**
 * Popular categories in the same card the event-management guide uses:
 * photograph, name over the bottom-left corner, scrim between the two, nothing
 * else. Each one is an anchor to a rail further down this page, so the section
 * is a shortcut through the listings rather than a second navigation to keep in
 * sync.
 */
export function TrCategories() {
  return (
    <section id="categories" className="scroll-mt-28 bg-paper py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="ds-display text-[clamp(1.5rem,2.6vw,2rem)] text-canvas-text">
            Popular categories
          </h2>
          <p className="ds-body mt-1.5 text-canvas-text-muted">
            Jump straight to what you came for.
          </p>
        </Reveal>

        <ul className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {popularCategories.map((category, i) => (
            <Reveal as="li" key={category.title} delay={(i % 6) * 0.05}>
              <Link
                href={category.href}
                className={clsx(
                  "ds-card group block w-full overflow-hidden text-left",
                  "transition-[transform,border-color] duration-500 ease-editorial",
                  "hover:-translate-y-1 hover:border-champagne/40",
                  "focus-visible:-translate-y-1 focus-visible:border-champagne/40",
                )}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 12rem, (min-width: 640px) 30vw, 45vw"
                    className={clsx(
                      "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]",
                      category.imagePosition,
                    )}
                  />

                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/20 to-transparent"
                  />

                  <h3 className="absolute bottom-3.5 left-4 right-4 text-[0.9375rem] font-medium leading-snug text-white">
                    {category.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
