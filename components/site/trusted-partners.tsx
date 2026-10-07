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
 * On the dark band the marks sit straight on the ground, no plate, in one dim
 * white so the row blends into the band instead of reading as six stickers;
 * each comes up under the cursor. Four of the six are dark-on-transparent
 * artwork and are simply turned white. StubHub and Gametime carry their own
 * dark plate, which a plain whitening would turn into a solid block, so those
 * go through the `knockout` SVG filter below: brightness becomes alpha, the
 * dark plate drops out and the light lettering stays. The light tone keeps the
 * fixed light plate, where the original colours read. Showing a marketplace's
 * mark states that the desk works across it, not that it endorses Ticket
 * Producer.
 */
const SLOT =
  "inline-flex h-12 w-[10rem] shrink-0 items-center justify-center px-4 text-[0.9rem] sm:h-14 sm:w-[11.5rem] sm:px-5 sm:text-[1rem]";

const TONE = {
  dark: {
    plate: "group/mark",
    mark: "opacity-55 transition-opacity duration-500 ease-editorial group-hover/mark:opacity-90",
    section:
      "relative isolate -mt-8 overflow-hidden rounded-t-[2rem] bg-ink-deep pb-14 pt-10 shadow-[0_-24px_50px_-35px_rgba(0,0,0,0.7)] sm:pb-16 sm:pt-12",
    label: "label text-center text-stone-dim",
    seam: "bg-gradient-to-b from-transparent to-paper",
  },
  light: {
    plate:
      "rounded-badge border border-graphite/10 bg-bone transition-colors duration-500 ease-editorial hover:border-champagne/50",
    mark: "",
    section: "relative overflow-hidden bg-paper py-9 sm:py-10",
    label: "label text-center text-taupe",
    seam: "",
  },
} as const;

/** One slot; `em` sizing means the row scales from the slot's font size alone. */
function Mark({
  partner,
  tone,
  knockoutId,
}: {
  partner: Partner;
  tone: keyof typeof TONE;
  knockoutId: string;
}) {
  const whiten = tone === "dark";
  return (
    <span className={clsx(SLOT, TONE[tone].plate)}>
      <Image
        src={partner.src}
        alt=""
        width={partner.width}
        height={partner.height}
        style={{
          height: `${partner.em}em`,
          filter:
            whiten && partner.knockout ? `url(#${knockoutId})` : undefined,
        }}
        className={clsx(
          "w-auto max-w-full object-contain",
          whiten && !partner.knockout && "brightness-0 invert",
          TONE[tone].mark,
        )}
      />
    </span>
  );
}

/**
 * White, with alpha taken from the pixel's brightness and then pushed so the
 * dark plates — and the lighter fringe the keying left round StubHub's
 * bubble — fall to nothing (below ~0.5) while the lettering (~0.9) stays solid.
 * Composited back inside the source alpha so the transparent surround stays
 * transparent whatever colour it was keyed from.
 */
function KnockoutFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2126 0.7152 0.0722 0 0"
        />
        <feComponentTransfer>
          <feFuncA type="linear" slope="2.5" intercept="-1.2" />
        </feComponentTransfer>
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
    </svg>
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
  const knockoutId = `${id}-knockout`;

  return (
    <section aria-labelledby={labelId} className={palette.section}>
      {tone === "dark" ? <KnockoutFilter id={knockoutId} /> : null}
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
                <Mark
                  key={partner.name}
                  partner={partner}
                  tone={tone}
                  knockoutId={knockoutId}
                />
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
