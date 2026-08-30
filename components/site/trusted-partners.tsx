import Image from "next/image";
import { clsx } from "@/lib/clsx";
import { Reveal } from "@/components/ui/reveal";
import { trustedPartners, type Partner } from "@/lib/site";

/** Fade the marquee's edges into the ground rather than cropping it hard. */
const EDGE_FADE = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  maskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
};

/**
 * NOTE: These are the real brand marks now, supplied for this site rather than
 * fetched. Two of the source files could not be used as delivered and were
 * normalised into the `-mark.png` copies this row points at:
 *
 *   - StubHub arrived with a transparency checkerboard baked into its pixels,
 *     so the light tone was keyed out by border-connectivity — a plain colour
 *     match would also have erased the white wordmark inside the bubble.
 *   - Gametime arrived as a brand-guidelines clearspace diagram: guide rules,
 *     hatched corner blocks, and dimension marks around the logo. Those were
 *     detected geometrically and cleared, keeping its dark plate.
 *
 * The rest were trimmed to their content box, and flat white or coral grounds
 * were keyed to transparent with a feathered edge so no logo carries a visible
 * box on the plate. Originals stay in public/logos as the sources.
 *
 * Every mark sits on the same fixed light plate in both tones: four of the six
 * are dark-on-light artwork, so a plate that inverted with the section would
 * make them disappear. Showing a marketplace's mark states that the desk works
 * across it, not that it endorses Ticket Producer.
 */
const PLATE =
  "inline-flex h-12 w-[10rem] shrink-0 items-center justify-center rounded-badge border border-graphite/10 bg-bone px-4 text-[0.9rem] transition-colors duration-500 ease-editorial hover:border-champagne/50 sm:h-14 sm:w-[11.5rem] sm:px-5 sm:text-[1rem]";

const TONE = {
  dark: {
    section:
      "relative isolate -mt-8 overflow-hidden rounded-t-[2rem] bg-ink-deep pb-14 pt-10 shadow-[0_-24px_50px_-35px_rgba(0,0,0,0.7)] sm:pb-16 sm:pt-12",
    label: "label text-center text-stone-dim",
    seam: "bg-gradient-to-b from-transparent to-paper",
  },
  light: {
    section: "relative overflow-hidden bg-paper py-9 sm:py-10",
    label: "label text-center text-taupe",
    seam: "",
  },
} as const;

/** One plate; `em` sizing means the row scales from the plate's font size alone. */
function Mark({ partner }: { partner: Partner }) {
  return (
    <span className={PLATE}>
      <Image
        src={partner.src}
        alt=""
        width={partner.width}
        height={partner.height}
        style={{ height: `${partner.em}em` }}
        className="w-auto max-w-full object-contain"
      />
    </span>
  );
}

/**
 * Marks rendered twice back to back so the marquee can loop by translating
 * exactly one pass width; the whole strip is aria-hidden and a plain sr-only
 * list carries the real content for assistive tech. Shared by `/services` and
 * `/ticket-resale` — `tone="light"` sits on the same paper ground as the rest
 * of that route and drops the dark-to-paper seam trick that
 * only makes sense between the homepage's dark hero band and its light
 * editorial body.
 */
export function TrustedPartners({
  partners = trustedPartners,
  tone = "dark",
  label = "Trusted Partners",
  id = "trusted-partners",
}: {
  partners?: readonly Partner[];
  tone?: "dark" | "light";
  label?: string;
  id?: string;
} = {}) {
  const palette = TONE[tone];
  const labelId = `${id}-label`;

  return (
    <section aria-labelledby={labelId} className={palette.section}>
      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <Reveal>
          <p id={labelId} className={palette.label}>
            {label}
          </p>
        </Reveal>
      </div>

      <ul className="sr-only">
        {partners.map((partner) => (
          <li key={partner.name}>{partner.name}</li>
        ))}
      </ul>

      <div aria-hidden className="group relative mt-7 sm:mt-8" style={EDGE_FADE}>
        <div className="flex w-max animate-tp-marquee gap-5 group-hover:[animation-play-state:paused] sm:gap-6">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex shrink-0 items-center gap-5 sm:gap-6">
              {partners.map((partner) => (
                <Mark key={partner.name} partner={partner} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {palette.seam ? (
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 sm:h-32",
            palette.seam,
          )}
        />
      ) : null}
    </section>
  );
}
