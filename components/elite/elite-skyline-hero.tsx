import Image from "next/image";
import { KeyRound, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";
import { Reveal } from "@/components/ui/reveal";
import { tpElite } from "@/lib/site";

/**
 * TP Elite's hero: Manhattan across the Hudson, by day in the light theme and
 * by night in the dark one.
 *
 * Two real photographs, not one image filtered: the day view is Midtown from
 * Weehawken, the night view Lower Manhattan from Hudson River Park (credits on
 * /credits). Which one shows is decided by the same `dark:` variant as the
 * rest of the site — it follows the theme toggle, or the OS when no choice is
 * stored — so the right skyline is there from the first paint, and switching
 * themes crossfades between the two.
 *
 * Motion is CSS only and compositor-friendly: the skyline settles from a
 * slight zoom on load, and drifts a little slower than the page on scroll
 * where the browser supports scroll-driven animations. Text rises in with the
 * site's standard entrance. All of it stops under reduced motion.
 *
 * The copy is the brief's TP Elite headline and body, word for word, with
 * "Request access" first — browsing events is the secondary way out.
 *
 * Copy sits on the left; gradients (not a flat overlay) hold it off the image,
 * running from the left on wide screens; on phones the photograph sits below
 * the copy and fades into it, so the skyline is never hidden behind text.
 */
export function EliteSkylineHero() {
  return (
    <section
      aria-labelledby="elite-hero-heading"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-elite-void"
    >
      {/* Phones: the copy sits on clean ground that fades into the photograph's own sky below it */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 md:hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_45%,#c9d3e3_62%)] dark:bg-[linear-gradient(180deg,#05070f_0%,#0b1029_40%,#1c2550_62%)]" />
      </div>

      {/* The skyline: day and night stacked, one visible per theme */}
      <div aria-hidden className="tp-skyline-parallax pointer-events-none absolute inset-0 -z-20">
        <div className="tp-skyline-in absolute inset-x-0 bottom-0 top-[46%] [mask-image:linear-gradient(180deg,transparent,#000_26%)] md:top-0 md:[mask-image:none]">
          <Image
            src="/nyc/skyline-day.jpg"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover object-[56%_100%] opacity-100 transition-opacity duration-700 ease-ui md:object-[50%_55%] dark:opacity-0"
          />
          <Image
            src="/nyc/skyline-night.jpg"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover object-[62%_0%] opacity-0 transition-opacity duration-700 ease-ui md:object-[50%_50%] dark:opacity-100"
          />
        </div>
      </div>

      {/* Readability: from the left on wide screens, from the top on phones; never a flat wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Light: a white haze behind the copy, crossfading with the image */}
        <div className="absolute inset-0 opacity-100 transition-opacity duration-700 ease-ui max-md:hidden md:bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.8)_30%,rgba(255,255,255,0.25)_55%,transparent_70%)] dark:opacity-0" />
        {/* Dark: deep navy behind the copy, and a shade under the nav */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-ui dark:opacity-100">
          <div className="absolute inset-0 max-md:hidden md:bg-[linear-gradient(90deg,rgba(5,8,18,0.9)_0%,rgba(5,8,18,0.66)_32%,rgba(5,8,18,0.18)_58%,transparent_74%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(5,8,18,0.55),transparent)]" />
        </div>
        {/* The water fades into the ground of the section below: white by day, the dark room by night */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#ffffff_0%,rgba(255,255,255,0.6)_45%,transparent_100%)] dark:bg-[linear-gradient(0deg,var(--color-elite-void)_0%,rgba(13,11,10,0.55)_45%,transparent_100%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-[75rem] flex-1 items-start px-6 pb-36 pt-32 sm:px-10 sm:pt-40 md:items-center md:pb-40">
        <div className="max-w-[40rem]">
          <Reveal immediate>
            <p className="label tracking-[0.22em] text-canvas-text-muted">{tpElite.headline} · {tpElite.label}</p>
            <h1
              id="elite-hero-heading"
              className="mt-5 text-balance font-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-canvas-text"
            >
              {tpElite.description}
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mt-6 max-w-md text-pretty text-[1.0625rem] leading-relaxed text-canvas-text/80 sm:text-lg">
              {tpElite.body}
            </p>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <div className="mt-9 flex flex-row flex-wrap items-center gap-2.5 sm:gap-3">
              <ThemedFlowButton href="#request" icon={KeyRound}>
                Request access
              </ThemedFlowButton>
              <ThemedFlowButton href="/ticket-resale">Explore events</ThemedFlowButton>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Where we are: on the fade into the next section, so it takes the theme's text colour */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[75rem] px-6 pb-8 sm:px-10 sm:pb-10">
          
        </div>
      </div>
    </section>
  );
}

/**
 * The site's FlowButton in the tone that reads on this theme's photograph: an
 * ink pill on the daylight sky, a white one at night. Only one of each pair is
 * ever displayed (the other is `display: none`, so it is out of the tab order
 * and the accessibility tree).
 */
function ThemedFlowButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="contents dark:hidden">
        <FlowButton href={href} tone="ink" icon={icon}>
          {children}
        </FlowButton>
      </span>
      <span className="hidden dark:contents">
        <FlowButton href={href} tone="light" icon={icon}>
          {children}
        </FlowButton>
      </span>
    </>
  );
}
