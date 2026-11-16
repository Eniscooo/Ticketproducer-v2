import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { sides } from "@/lib/site";

const PATHS = [
  {
    side: sides.events,
    prompt: "Planning an event?",
    line: "Staffing, venue mapping, ticketing and consulting — built around your room.",
    image: "/nyc/met-opera-interior.jpg",
    position: "object-[50%_50%]",
  },
  {
    side: sides.tickets,
    prompt: "Looking for tickets?",
    line: "Concerts, sports and Broadway, verified before they ever reach you.",
    image: "/nyc/times-square.jpg",
    position: "object-[50%_45%]",
  },
];

/**
 * The decision, asked a second time — now that the visitor has seen both
 * sides. Two full-height halves, each one big link. The photographs sit dim
 * and come up under the cursor, so the half you're leaning toward lights up.
 */
export function ChoosePath() {
  return (
    <section id="choose" className="relative -mt-8 scroll-mt-20 rounded-t-[2rem] bg-ink pt-20 sm:pt-28">
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-10">
        <Reveal>
          <p className="label text-brass-light">Your next step</p>
          <h2 className="display mt-4 max-w-3xl text-[clamp(2.4rem,5.6vw,4.25rem)] text-white">
            So, which are you here for?
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-[80rem] gap-3 px-3 pb-20 sm:mt-16 sm:px-6 sm:pb-28 md:grid-cols-2">
        {PATHS.map((path, i) => (
          <Reveal key={path.side.key} delay={i * 0.1}>
            <Link
              href={path.side.href}
              className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-card p-7 sm:min-h-[32rem] sm:p-10"
            >
              <Image
                src={path.image}
                alt=""
                fill
                sizes="(min-width: 768px) 40rem, 100vw"
                className={clsx(
                  "-z-20 object-cover brightness-[0.55] saturate-[0.85] transition duration-[900ms] ease-editorial group-hover:scale-[1.04] group-hover:brightness-[0.8] group-hover:saturate-100",
                  path.position,
                )}
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"
              />

              <span className="label text-bone/75">{path.side.audience}</span>
              <span className="display mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-white">
                {path.prompt}
              </span>
              <span className="mt-4 max-w-sm text-[0.9375rem] leading-[1.7] text-bone/80">
                {path.line}
              </span>
              <span className="label mt-8 inline-flex items-center gap-3 self-start rounded-full bg-brass px-5 py-3 text-ink transition-colors duration-300 ease-ui group-hover:bg-brass-light">
                Go to {path.side.label}
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 ease-ui group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
