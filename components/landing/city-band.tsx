import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/**
 * A breath between the explaining and the asking: the skyline at dusk, full
 * bleed, carrying one line. It replaces the old poster-fan pull quote — the
 * city stands in for the celebrity imagery, and says where we are without a
 * sentence about it.
 */
export function CityBand({ quote }: { quote: string }) {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-ink py-28">
      <Image
        src="/nyc/skyline-dusk.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_55%]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/45" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-transparent to-ink/70"
      />

      <figure className="mx-auto w-full max-w-5xl px-6 text-center sm:px-10">
        <Reveal>
          <span aria-hidden className="mx-auto block h-px w-16 bg-brass-light/80" />
        </Reveal>
        <Reveal delay={0.12}>
          <blockquote className="display mt-12 text-balance-tight text-[clamp(1.85rem,5vw,3.75rem)] leading-[1.15] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
            <span aria-hidden className="font-light text-brass-light">
              &ldquo;
            </span>
            <span className="font-semibold">{quote}</span>
            <span aria-hidden className="font-light text-brass-light">
              &rdquo;
            </span>
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <figcaption className="label mt-10 text-bone/70">1650 Broadway · New York</figcaption>
        </Reveal>
      </figure>
    </section>
  );
}
