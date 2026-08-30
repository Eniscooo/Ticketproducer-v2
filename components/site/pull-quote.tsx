import { Reveal } from "@/components/ui/reveal";

/**
 * The one recurring "pause" motif in the light body — used twice (the
 * original pull quote, and again near the close with the brand tagline) so
 * the linen ground itself signals "this is a statement, not a testimonial."
 */
export function PullQuote({ quote }: { quote: string }) {
  return (
    <section className="grain relative isolate overflow-hidden border-t border-canvas-border bg-canvas-alt py-28 sm:py-40 lg:py-52">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_50%,rgba(176,141,87,0.1),transparent_70%)]"
      />
      <figure className="relative mx-auto w-full max-w-5xl px-6 text-center sm:px-10">
        <Reveal>
          <span aria-hidden className="mx-auto block h-px w-16 bg-champagne/70" />
        </Reveal>
        <Reveal delay={0.12}>
          <blockquote className="display mt-14 text-balance-tight text-[clamp(1.85rem,5.2vw,3.75rem)] leading-[1.15] text-canvas-text sm:mt-16">
            <span aria-hidden className="font-light text-taupe">
              &ldquo;
            </span>
            <span className="font-semibold">{quote}</span>
            <span aria-hidden className="font-light text-taupe">
              &rdquo;
            </span>
          </blockquote>
        </Reveal>
      </figure>
    </section>
  );
}
