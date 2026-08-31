"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, User, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { clsx } from "@/lib/clsx";
import { site } from "@/lib/site";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const EASE = [0.16, 0.84, 0.28, 1] as const;

const NAV_LINKS = site.nav;

/** The always-visible desktop bar stays to the three services — FAQs and Contact live in the drawer and footer instead. */
const DESKTOP_LINKS = site.services;

const DRAWER_LINKS = [...NAV_LINKS, { label: "Sign In", href: "/sign-in" }];

/** Where the always-visible link row exists, and so where a section tracker has something to mark. */
const DESKTOP = "(min-width: 1024px)";

/** Only the hash-anchored links have a section to observe; whole-route links are matched on pathname instead. */
const SECTION_IDS = NAV_LINKS.map((link) => link.href.split("#")[1]).filter(
  (id): id is string => Boolean(id),
);

/**
 * A nav link is current either because its in-page section owns the viewport,
 * or — for links that point at a route of their own — because we're on it.
 */
function isCurrent(href: string, pathname: string, active: string | null) {
  const [path, hash] = href.split("#");
  if (hash) return pathname === path && active === hash;
  return pathname === path;
}

/**
 * Tracks which section owns the upper third of the viewport.
 *
 * Only runs when `enabled`. Below `lg` the desktop link row is not rendered, so
 * the only thing the tracker could mark is a drawer the reader has to open to
 * see — meanwhile it re-rendered the whole nav on every scroll and moved the
 * highlight under them between openings. It reports `null` there instead, which
 * leaves `isCurrent` matching on pathname alone: the current *route* still
 * marks itself, the current *section* no longer chases.
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: [0.08, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  /* Derived, not stored — clearing state in an effect would cost a second render. */
  return enabled ? active : null;
}

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const active = useActiveSection(useMediaQuery(DESKTOP));
  const reduceMotion = useReducedMotionSafe();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Only the video hero on `/event-management` gets a see-through nav — everywhere else keeps the glass pill so it reads over ordinary page content. */
  const transparentHero = pathname === "/event-management" && !scrolled;

  /**
   * Close the drawer whenever the route changes.
   *
   * Covers every navigation — including browser back/forward — rather than
   * relying on each link remembering to close it. Adjusted during render
   * rather than in an effect, so the drawer never paints over the new route.
   */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  /**
   * Scroll lock + Escape while the drawer is open.
   *
   * The original `overflow` value is preserved and restored rather than reset
   * to "", so a lock owned by another component is never clobbered. Escape
   * satisfies WCAG 2.1.2 — an overlay that takes the screen must be
   * dismissible from the keyboard.
   */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  /**
   * Focus stays on the trigger while the menu is open — the panel sits right
   * after it in the DOM, so Tab walks straight into the links — and comes back
   * to the trigger if a link inside took it and the menu then closed.
   */
  useEffect(() => {
    if (!isOpen && document.activeElement === document.body) {
      menuButtonRef.current?.focus();
    }
  }, [isOpen]);

  const duration = (seconds: number) => (reduceMotion ? 0.01 : seconds);

  return (
    <>
      <motion.header
        data-reveal
        initial={{ y: -96 }}
        animate={{ y: 0 }}
        transition={{ duration: duration(0.9), ease: EASE }}
        className={clsx(
          "fixed z-50 rounded-4xl transition-all duration-700 ease-editorial",
          "left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
          transparentHero
            ? // Genuinely transparent — the video's own scrim carries contrast here.
              "top-3 max-w-7xl border border-transparent bg-transparent sm:top-5 sm:w-[calc(100vw-4rem)]"
            : // Glassy and light-catching rather than architectural — a thin
              // inner highlight along the top edge is what sells "glass".
              //
              // The pill stays substantially opaque once scrolled or off the
              // video hero: it floats over light grounds (/sign-in, the legal
              // routes) as well as dark ones, and at low opacity its
              // bone-toned labels dropped to ~1:1 contrast against a pale canvas.
              scrolled
              ? "top-3 max-w-6xl border border-bone/12 bg-ink/25 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_50px_-30px_rgba(0,0,0,0.9)] sm:top-4 sm:w-[calc(100vw-3rem)]"
              : "top-3 max-w-7xl border border-bone/10 bg-ink/20 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:top-5 sm:w-[calc(100vw-4rem)]",
        )}
      >
        <nav className="w-full px-4 sm:px-6" aria-label="Main">
          <div className="flex h-12 items-center justify-between gap-4 sm:h-14">
            <Link
              href="/services#top"
              className="shrink-0 transition-opacity duration-500 hover:opacity-70"
              aria-label={`${site.name} — top of page`}
            >
              <Logo variant="compact" />
            </Link>

            {/* Desktop: links sit between the mark and the icons */}
            <div className="hidden items-center gap-7 lg:flex">
              {DESKTOP_LINKS.map((link) => {
                const isActive = isCurrent(link.href, pathname, active);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "label link-underline transition-colors duration-500",
                      isActive
                        ? "text-brass-light"
                        : "text-bone/75 hover:text-bone",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop actions: theme toggle, a message icon back to Contact, and account access */}
            <div className="hidden items-center gap-1.5 lg:flex">
              <ThemeToggle />
              <Link
                href="/services#contact"
                aria-label="Contact"
                className="flex h-9 w-9 items-center justify-center rounded-full text-bone/75 transition-colors duration-500 hover:text-bone"
              >
                <Mail className="h-[1.05rem] w-[1.05rem]" aria-hidden />
              </Link>
              <Link
                href="/sign-in"
                aria-label="Sign in or sign up"
                className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-bone/20 text-bone transition-colors duration-500 ease-editorial hover:border-brass/70"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-brass/15 transition-transform duration-700 ease-editorial group-hover:scale-y-100"
                />
                <User className="relative z-10 h-[1.05rem] w-[1.05rem]" aria-hidden />
              </Link>
            </div>

            <div className="flex items-center gap-0.5 lg:hidden">
              <ThemeToggle className="text-stone hover:text-bone" />

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls="tp-site-drawer"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="-mr-2 flex h-11 w-11 items-center justify-center text-stone transition-colors duration-500 hover:text-bone"
              >
                {isOpen ? (
                  <X className="h-5 w-5" aria-hidden />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Drops from under the pill rather than sliding in as a full-height sheet */}
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              id="tp-site-drawer"
              initial={{ opacity: 0, y: -10, scaleY: 0.97 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.97 }}
              transition={{ duration: duration(0.32), ease: EASE }}
              style={{ transformOrigin: "top" }}
              className="grain absolute left-0 right-0 top-full mt-2 origin-top overflow-hidden rounded-3xl border border-brass/25 bg-ink-deep/97 text-bone shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)] backdrop-blur-2xl lg:hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(164,133,90,0.12),transparent_60%)]"
              />

              <nav className="relative flex flex-col px-5 py-2" aria-label="Site">
                {DRAWER_LINKS.map((link, i) => {
                  const isActive = isCurrent(link.href, pathname, active);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: duration(0.4),
                        delay: reduceMotion ? 0 : 0.06 + i * 0.035,
                        ease: EASE,
                      }}
                      className="border-b border-bone/10 last:border-b-0"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={isActive ? "true" : undefined}
                        className={clsx(
                          "block py-3 text-[1.0625rem] leading-snug transition-colors duration-500",
                          isActive ? "text-brass-light" : "text-bone hover:text-brass-light",
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* The line, plainly stated */}
              <div className="relative border-t border-bone/10 px-5 py-4">
                <span className="label block text-stone-dim">Direct line</span>
                <a
                  href={site.contact.phoneHref}
                  className="mt-1.5 block text-[1.0625rem] leading-none tracking-wide text-bone transition-colors duration-500 hover:text-brass-light"
                >
                  {site.contact.phone}
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="label link-underline mt-3 inline-block break-anywhere text-stone transition-colors duration-500 hover:text-bone"
                >
                  {site.contact.email}
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      {/*
       * Tapping outside closes it. The scrim sits below the header's own z-50 so
       * the dropdown — which hangs off the header — paints over it.
       */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration(0.3), ease: EASE }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-ink-deep/60 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
