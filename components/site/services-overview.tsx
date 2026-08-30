import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { whatWeDo, serviceBoxes } from "@/lib/site";

/**
 * The three service boxes double as the site's primary navigation into the
 * detail sections further down the page — each `href` is the same anchor the
 * top nav and footer already use, so there's one source of truth for where
 * "Event Management" etc. actually lives. Imagery carries the weight here;
 * the written copy is intentionally short.
 */
export function ServicesOverview() {
  return (
    <section className="relative -mt-8 rounded-t-[2rem] bg-paper py-20 shadow-[0_-24px_50px_-35px_rgba(23,23,22,0.12)] sm:py-28 lg:py-36">
      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="display max-w-3xl text-[clamp(2.5rem,6vw,4.25rem)] text-canvas-text">
            {whatWeDo.headline}
          </h2>
          <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.9] text-canvas-text-muted">
            {whatWeDo.description}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-3">
          {serviceBoxes.map((box, i) => (
            <Reveal key={box.title} delay={i * 0.1} className="h-full">
              <Link
                href={box.href}
                className={clsx(
                  "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 transition-all duration-700 ease-editorial sm:p-8",
                  box.invite
                    ? "border-graphite/15 bg-graphite hover:-translate-y-1.5 hover:border-elite-gold/50 hover:shadow-[0_36px_70px_-40px_rgba(13,11,10,0.55)]"
                    : "border-canvas-border bg-surface hover:-translate-y-1.5 hover:border-champagne/40 hover:shadow-[0_30px_60px_-40px_rgba(23,23,22,0.18)]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className={clsx(
                      "display text-[1.65rem] leading-[1.1]",
                      box.invite ? "text-elite-ivory" : "text-canvas-text",
                    )}
                  >
                    {box.title}
                  </h3>
                  {box.invite ? (
                    <span className="label shrink-0 rounded-full border border-elite-gold/40 px-3 py-1 text-elite-gold">
                      Invite Only
                    </span>
                  ) : null}
                </div>

                <p
                  className={clsx(
                    "mt-3 text-[0.9375rem] leading-[1.75]",
                    box.invite ? "text-linen/75" : "text-canvas-text-muted",
                  )}
                >
                  {box.description}
                </p>

                {/* Imagery does the persuading — not another list of features */}
                <div className="relative mt-7 aspect-[4/3] w-full overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={box.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 26rem, 90vw"
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                  />
                  <div
                    className={clsx(
                      "absolute inset-0",
                      box.invite
                        ? "bg-gradient-to-t from-elite-void/70 via-elite-void/0 to-transparent"
                        : "bg-gradient-to-t from-graphite/35 via-graphite/0 to-transparent",
                    )}
                  />
                </div>

                <span
                  className={clsx(
                    "label mt-7 inline-flex items-center gap-2 transition-colors duration-500",
                    box.invite
                      ? "text-elite-gold group-hover:text-elite-ivory"
                      : "text-champagne group-hover:text-canvas-text",
                  )}
                >
                  {box.cta}
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
