"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { emHero } from "@/lib/event-management-page";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * Full-bleed video hero, exactly one viewport: `100svh` accounts for mobile
 * browser chrome so the section never grows taller than the visible screen.
 *
 * The poster is the film's own first frame (extracted at t=0.12 into
 * public/hero-poster.jpg), not a stand-in photograph. It used to be
 * /intro-bg.jpg — a different room entirely — which read as a flash of the wrong
 * image every time the page loaded. Re-cut the poster if the video is replaced.
 * SiteNav overlays this transparently via its own `/event-management` check
 * rather than this section reserving layout space for the bar.
 *
 * The film is /HERO-web.mp4 at 2.8MB. It was encoded from a 3840x2160, 36 Mbps
 * master — a mastering bitrate for eight seconds of muted, scrimmed background,
 * and 34.6MB of deploy weight. That master is deliberately NOT in this repo;
 * see the README for where it lives and the exact ffmpeg line, and re-cut both
 * the film and the poster together if it is ever replaced.
 *
 * The rest of this is about the gap before any of it arrives:
 *
 * - The poster is a real optimised `next/image`, not the `<video poster>`
 *   attribute, so it is served at the viewport's own size and paints straight
 *   away. It is the hero's ground; the film only ever covers it.
 * - The `<video>` plays at every width. It was briefly desktop-only to spare
 *   phones the download, which did save the bytes and also meant the hero had
 *   no film on a phone — not the trade that was wanted.
 * - It fades in once it can actually play, so the swap off the poster is never
 *   a flash of black. Three events arm that fade, not one: a cached video can
 *   reach `canplay` before React attaches its handler, and a single missed
 *   event would strand the film at `opacity-0` — invisible, which reads as
 *   "the video is broken" rather than "the video is still loading".
 * - Reduced motion still gets the poster alone. That one is a preference, not
 *   an optimisation.
 *
 * Together those cover the gap; the encode above is what removed most of it.
 */
export function EmHero() {
  const reduceMotion = useReducedMotionSafe();
  const [filmReady, setFilmReady] = useState(false);

  /* `useReducedMotionSafe` reports `false` on the server, so the first paint is
     the poster alone and the film mounts on hydration. */
  const showVideo = !reduceMotion;

  const revealFilm = () => setFilmReady(true);

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      id="top"
      className="relative isolate flex h-[100svh] min-h-[100svh] items-center justify-center overflow-hidden bg-graphite"
    >
      <Image
        src="/hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {showVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={revealFilm}
          onLoadedData={revealFilm}
          onPlaying={revealFilm}
          aria-hidden
          className={clsx(
            "absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ease-editorial",
            filmReady ? "opacity-100" : "opacity-0",
          )}
        >
          <source src="/HERO-web.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Scrim carries all the contrast work — darkest where the transparent nav sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/75 sm:from-black/65 sm:via-black/30 sm:to-black/70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_90%,rgba(176,141,87,0.18),transparent_74%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[46rem] flex-col items-center px-6 text-center sm:px-10">
        <motion.h1
          {...rise(0.12)}
          data-reveal
          className="ds-display text-[clamp(2.25rem,6.4vw,4rem)] text-white"
        >
          <span className="block font-light">{emHero.headlineTop}</span>
          <span className="block font-semibold">{emHero.headlineBottom}</span>
        </motion.h1>

        <motion.p
          {...rise(0.22)}
          data-reveal
          className="ds-body mt-6 max-w-xl text-linen/75"
        >
          {emHero.body}
        </motion.p>

        <motion.div
          {...rise(0.32)}
          data-reveal
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href={emHero.primaryCta.href} className="ds-btn-ghost">
            {emHero.primaryCta.label}
          </Link>
          <Link
            href={emHero.secondaryCta.href}
            className="ds-btn-neutral border border-white/35 bg-white/10 text-linen hover:bg-white/20"
          >
            {emHero.secondaryCta.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
