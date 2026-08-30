import Image from "next/image";
import { testimonials } from "@/lib/site";

/** Every card is a portrait with the quote written over it, so quotes without one sit this out. */
const withPortraits = testimonials.filter((testimonial) => testimonial.image);

/** Fade the marquee's edges into the ground rather than cropping it hard. */
const EDGE_FADE = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
  maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
};

/**
 * The "always moving" counterpart to `Reviews` above: a continuous bar of
 * testimonial cards, quote written directly over each photo, drifting past
 * on a loop — same doubled-pass mechanic as `TrustedPartners`. Hover pauses
 * it via CSS alone. Rendered twice for the seamless loop; the visible pass
 * is aria-hidden and a plain sr-only list carries the real content once.
 */
export function ReviewsMarquee() {
  return (
    <section className="relative overflow-hidden bg-canvas-alt py-14 sm:py-16">
      <ul className="sr-only">
        {testimonials.map((testimonial) => (
          <li key={testimonial.name}>
            <blockquote>{testimonial.quote}</blockquote>
            <p>
              {testimonial.name}, {testimonial.role}
            </p>
          </li>
        ))}
      </ul>

      <div aria-hidden className="group relative" style={EDGE_FADE}>
        <div className="flex w-max animate-reviews-marquee gap-6 group-hover:[animation-play-state:paused] sm:gap-8">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex shrink-0 items-center gap-6 sm:gap-8">
              {withPortraits.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="relative aspect-[4/5] w-[19rem] shrink-0 overflow-hidden rounded-[1.75rem] sm:w-[21rem]"
                >
                  <Image
                    src={testimonial.image as string}
                    alt=""
                    fill
                    sizes="21rem"
                    className={`object-cover ${testimonial.imageClass ?? ""}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/40 to-graphite/5" />
                  <div className="absolute inset-x-6 bottom-6 sm:inset-x-7 sm:bottom-7">
                    <p className="line-clamp-5 text-[1rem] leading-[1.6] text-white sm:text-[1.0625rem]">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <p className="mt-4 text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="label mt-1 text-linen/75">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
