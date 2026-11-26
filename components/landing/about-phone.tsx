import type { CSSProperties } from "react";
import Image from "next/image";
import { ScanLine } from "lucide-react";
import { QrGlyph } from "@/components/ui/qr-glyph";
import { InView } from "./motion";

/**
 * The About section's visual: a phone resting tilted back on a dark stage,
 * showing a ticket for The Great Gatsby, with a restrained hologram of the
 * show rising out of its screen.
 *
 * All CSS 3D — no WebGL, no client JS beyond the InView trigger that starts
 * the projection when the panel scrolls in. The geometry:
 *
 *   phone      rotateX(52deg) rotateZ(-18deg) — lying back, turned a little
 *   anchor     a point on the poster, 30% down the screen (the emitter)
 *   projection rotateZ(18deg) rotateX(-52deg) — the exact inverse, so the
 *              plane stands upright and faces the viewer while its base stays
 *              on the screen. That is what makes it read as coming *out of*
 *              the phone rather than floating near it.
 *
 * Palette is the brand's own: charcoal and ink, bone light, and the TP Elite
 * golds for the Gatsby glow. No purple — the palette doesn't have one. The
 * stage photo is graded to sepia and champagne so it never shows as colour.
 *
 * Decorative; one `role="img"` label describes it and everything inside is
 * hidden from assistive tech.
 */

/** Lying back, and turned so the top of the phone leans to the right. */
const PHONE_TILT = "rotateX(52deg) rotateZ(18deg)";
/** The inverse of PHONE_TILT, in reverse order. */
const FACE_VIEWER = "rotateZ(-18deg) rotateX(-52deg)";

/** Monochrome grade for the stage photograph — the red curtain becomes silver and shadow. */
const GATSBY_GRADE = "[filter:grayscale(1)_brightness(1.05)_contrast(1.1)]";

const SHOW = {
  title: "The Great Gatsby",
  venue: "Broadway Theatre",
  date: "Sat, Dec 19",
  time: "8:00 PM",
  runtime: "2h 30m",
  section: "Orchestra",
  row: "C",
  seat: "8",
  image: "/shows/the-great-gatsby.jpg",
};

const d = (seconds: number) => ({ ["--d" as string]: `${seconds}s` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* The phone's screen                                                  */
/* ------------------------------------------------------------------ */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.4375rem] font-medium uppercase tracking-[0.16em] text-stone-dim">{label}</p>
      <p className="mt-0.5 truncate text-[0.625rem] font-semibold text-elite-ivory">{value}</p>
    </div>
  );
}

function Screen() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2.1rem] bg-[#0b0b0d] px-3.5 pb-3 pt-2.5 text-elite-ivory">
      {/* Status bar and island */}
      <div className="flex items-center justify-between px-1.5 text-[0.5625rem] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1" aria-hidden>
          <span className="h-1.5 w-3 rounded-[2px] border border-elite-ivory/70" />
        </span>
      </div>
      <span className="absolute left-1/2 top-2 h-[1.15rem] w-[4.6rem] -translate-x-1/2 rounded-full bg-black" />

      {/* Wallet header */}
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[0.4375rem] font-semibold uppercase tracking-[0.3em] text-elite-gold">
          <span className="h-px w-2.5 bg-elite-gold/70" />
          Ticket Producer
        </span>
        <span className="text-[0.5rem] text-stone">Admit one</span>
      </div>

      {/* Poster — the hologram's emitter sits at its centre */}
      <div className="relative mt-2.5 h-[8.5rem] shrink-0 overflow-hidden rounded-[1.1rem] ring-1 ring-inset ring-elite-gold/20">
        <Image src={SHOW.image} alt="" fill sizes="210px" className={`object-cover object-[50%_45%] ${GATSBY_GRADE}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,7,0.1),rgba(6,6,7,0.65))]" />
        {/* Emitter: the patch of screen the light leaves from */}
        <div className="tp-glow-breathe absolute left-1/2 top-1/2 h-24 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),rgba(255,255,255,0.22)_45%,transparent)]" />
        <p className="absolute inset-x-0 bottom-2 text-center text-[0.5rem] font-semibold uppercase tracking-[0.34em] text-elite-gold">
          Broadway
        </p>
      </div>

      <p className="mt-3 font-display text-[1.05rem] font-bold leading-none tracking-[-0.02em]">{SHOW.title}</p>
      <p className="mt-1 text-[0.5625rem] text-stone">{SHOW.venue} · New York</p>

      <div className="mt-3 grid grid-cols-3 gap-x-2 gap-y-2 border-t border-elite-ivory/10 pt-2.5">
        <Detail label="Date" value={SHOW.date} />
        <Detail label="Time" value={SHOW.time} />
        <Detail label="Runtime" value={SHOW.runtime} />
        <Detail label="Section" value={SHOW.section} />
        <Detail label="Row" value={SHOW.row} />
        <Detail label="Seat" value={SHOW.seat} />
      </div>

      <div className="mt-auto flex items-center justify-center gap-1.5 rounded-full border border-elite-gold/30 bg-elite-gold/10 py-1.5 text-[0.5625rem] font-semibold text-elite-gold">
        <ScanLine aria-hidden className="h-3 w-3" />
        Entry pass projected
      </div>
      <span className="mx-auto mt-2 h-1 w-16 rounded-full bg-elite-ivory/50" />

      {/* Glass: a faint diagonal reflection across the whole screen */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.04)_100%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The hologram                                                        */
/* ------------------------------------------------------------------ */

/** Art Deco proscenium: a stepped arch, a sunburst from the stage floor, and a fan of footlight rays. */
function DecoFrame() {
  return (
    <svg viewBox="0 0 220 128" className="absolute inset-0 h-full w-full text-champagne-ink" fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.85">
        <path d="M8 126V30h14V18h18V8h140v10h18v12h14v96" />
        <path d="M16 126V36h12V24h18V14h128v10h18v12h12v90" opacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.4">
        {Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI * (0.12 + (0.76 * i) / 10);
          return <line key={i} x1="110" y1="126" x2={110 - Math.cos(a) * 92} y2={126 - Math.sin(a) * 92} />;
        })}
      </g>
      <path d="M86 8l24-6 24 6" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

/** One floating holographic chip: glass, a hairline of gold, light text. */
function Chip({ className, style, children }: { className: string; style?: CSSProperties; children: React.ReactNode }) {
  return (
    <div
      className={`tp-holo-rise absolute rounded-lg border border-champagne/45 bg-surface/55 px-2 py-1.5 text-canvas-text shadow-[0_0_18px_-4px_rgba(140,140,140,0.45),0_8px_18px_-12px_rgba(23,23,22,0.35)] backdrop-blur-[2px] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function Hologram() {
  return (
    <div
      className="absolute bottom-0 left-[-7.5rem] h-[15.5rem] w-[15rem] origin-bottom [transform-style:preserve-3d]"
      style={{ transform: FACE_VIEWER }}
    >
      {/* The beam: narrow where it leaves the screen, widening up into the stage */}
      <div
        className="tp-holo-rise tp-holo-shimmer absolute bottom-0 left-1/2 h-[7.5rem] w-[13.5rem] -translate-x-1/2 bg-[linear-gradient(0deg,rgba(140,140,140,0.42),rgba(140,140,140,0.14)_45%,rgba(140,140,140,0.02))] [clip-path:polygon(43%_100%,57%_100%,100%_0,0_0)]"
        style={d(0.2)}
      />
      {/* Motes rising through it */}
      {[
        { left: "47%", dur: 4.2, delay: 1.2, dx: -6 },
        { left: "52%", dur: 5.1, delay: 2.4, dx: 8 },
        { left: "50%", dur: 4.6, delay: 3.3, dx: 2 },
      ].map((m) => (
        <span
          key={m.left}
          className="tp-holo-mote absolute bottom-1 h-1 w-1 rounded-full bg-champagne shadow-[0_0_6px_1px_rgba(140,140,140,0.7)]"
          style={
            { left: m.left, "--dur": `${m.dur}s`, "--d": `${m.delay}s`, "--dx": `${m.dx}px` } as CSSProperties
          }
        />
      ))}

      {/* The stage — the show itself, projected */}
      <div className="tp-holo-rise absolute bottom-[6.75rem] left-1/2 h-32 w-[13.75rem] -translate-x-1/2" style={d(0.45)}>
        <div className="tp-holo-shimmer relative h-full w-full">
          <div className="tp-holo-reveal absolute inset-0 overflow-hidden rounded-t-[0.4rem] [mask-image:linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)]" style={d(0.6)}>
            <Image
              src={SHOW.image}
              alt=""
              fill
              sizes="220px"
              className={`object-cover object-[50%_42%] opacity-80 ${GATSBY_GRADE}`}
            />
            {/* Fade the bottom into the beam and the sides into air */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(140,140,140,0.3),transparent_40%)]" />
            {/* Scan lines, drifting up */}
            <div className="tp-holo-scan absolute -inset-x-0 -bottom-6 top-0 bg-[repeating-linear-gradient(0deg,rgba(140,140,140,0.14)_0_1px,transparent_1px_3px)]" />
          </div>
          <DecoFrame />
        </div>
      </div>

      {/* Title, hovering over the proscenium */}
      <p
        className="tp-holo-rise absolute bottom-[14.4rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.42em] text-champagne-ink [text-shadow:0_0_10px_rgba(140,140,140,0.45)]"
        style={{ ...d(1.1), transform: "translateZ(24px)" }}
      >
        The Great Gatsby
      </p>

      {/* Ticket details, drifting out in front at different depths */}
      <Chip className="bottom-[9.2rem] left-[-1.6rem]" style={{ ...d(1.4), transform: "translateZ(46px)" }}>
        <p className="text-[0.4375rem] uppercase tracking-[0.18em] text-champagne-ink">{SHOW.venue}</p>
        <p className="mt-0.5 whitespace-nowrap text-[0.625rem] font-semibold">
          {SHOW.date} · {SHOW.time}
        </p>
      </Chip>
      <Chip className="bottom-[6.6rem] right-[-1.9rem]" style={{ ...d(1.65), transform: "translateZ(38px)" }}>
        <p className="text-[0.4375rem] uppercase tracking-[0.18em] text-champagne-ink">Seat</p>
        <p className="mt-0.5 whitespace-nowrap text-[0.625rem] font-semibold">
          {SHOW.section} · {SHOW.row}{SHOW.seat}
        </p>
      </Chip>
      <Chip className="bottom-[11.6rem] right-[-0.9rem] p-1.5" style={{ ...d(1.9), transform: "translateZ(62px)" }}>
        <QrGlyph seed={1925} className="h-11 w-11 text-canvas-text/85" />
      </Chip>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The phone                                                           */
/* ------------------------------------------------------------------ */

function Phone() {
  return (
    <div
      className="absolute left-1/2 top-[61%] h-[29.5rem] w-[14.5rem] [transform-style:preserve-3d]"
      style={{ transform: `translate(-50%, -50%) ${PHONE_TILT}` }}
    >
      {/* Contact shadow, on the surface the phone hovers over */}
      <div className="absolute inset-x-[6%] inset-y-[4%] rounded-[2.6rem] bg-ink/35 blur-2xl [transform:translateZ(-56px)]" />

      {/* Thickness: the frame's edge, built from a few stacked slices */}
      {[2, 4, 6, 8].map((z) => (
        <div
          key={z}
          className="absolute inset-0 rounded-[2.6rem] bg-[linear-gradient(145deg,#4a4845,#18181a_50%,#3a3936)]"
          style={{ transform: `translateZ(-${z}px)` }}
        />
      ))}

      {/* Body: brushed graphite frame around the glass */}
      <div className="absolute inset-0 rounded-[2.6rem] bg-[linear-gradient(145deg,#5a5752,#1c1c1f_42%,#2c2b2e_70%,#4d4a45)] p-[0.45rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.6)]">
        <Screen />
      </div>

      {/* The emitter point — 30% down the screen, on the poster */}
      <div className="absolute left-1/2 top-[30%] h-0 w-0 [transform-style:preserve-3d]" style={{ transform: "translateZ(1px)" }}>
        <Hologram />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The panel                                                           */
/* ------------------------------------------------------------------ */

/**
 * Stands alone on the section's own ground — no panel. The box only reserves
 * room (a 4:5 area) and gives the scene a container to scale against.
 */
export function AboutPhone({ className }: { className?: string }) {
  return (
    <InView className={`relative @container aspect-[4/5] ${className ?? ""}`}>
      <div
        role="img"
        aria-label="A phone showing a ticket for The Great Gatsby on Broadway, with a soft gold hologram of the stage rising from its screen"
        className="absolute inset-0"
      >
        <div aria-hidden className="absolute inset-0">
          {/* The scene is drawn at 440×560 and scaled to the box's width */}
          <div className="absolute left-1/2 top-1/2 h-[35rem] w-[27.5rem] -translate-x-1/2 -translate-y-1/2 scale-[0.72] @[24rem]:scale-[0.82] @[28rem]:scale-[0.92] @[30rem]:scale-100">
            <div className="relative h-full w-full [perspective:1300px] [perspective-origin:50%_25%]">
              <div className="tp-phone-float absolute inset-0 [transform-style:preserve-3d]">
                <Phone />
              </div>
            </div>
          </div>
        </div>
      </div>
    </InView>
  );
}
