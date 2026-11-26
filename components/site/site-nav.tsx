"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { clsx } from "@/lib/clsx";
import { sideFor, sides, site } from "@/lib/site";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const EASE = [0.16, 0.84, 0.28, 1] as const;

type NavLink = { label: string; href: string };

/** Where the always-visible link row exists, and so where a section tracker has something to mark. */
const DESKTOP = "(min-width: 1024px)";

/** Routes whose hero is a full-bleed dark video — the nav starts see-through over it. */
const TRANSPARENT_HERO_ROUTES = new Set(["/event-management"]);

/** On the landing page, the primary button goes to the side most visitors want. */
const LANDING_CTA = sides.tickets.cta;

/** Only the hash-anchored links have a section to observe; whole-route links are matched on pathname instead. */
const sectionIdsOf = (links: readonly NavLink[]) =>
  links.map((link) => link.href.split("#")[1]).filter((id): id is string => Boolean(id));

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
 * Tracks which section owns the upper third of the viewport. Only runs on
 * desktop, where the link row it marks is actually on screen.
 */
function useActiveSection(enabled: boolean, ids: string) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !ids) return;

    const sections = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

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
  }, [enabled, ids]);

  return enabled ? active : null;
}

/**
 * The site nav, built on the resizable navbar: a full-width glass bar at the
 * top that draws in to a floating pill on scroll.
 *
 * It belongs to whichever side the visitor is on. Inside Event Management or
 * Tickets it carries that side's links, a tag beside the logo, one crossover
 * link to the other side and that side's call to action; on the landing page
 * it carries the two doors plus the company links.
 */
export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotionSafe();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const side = sideFor(pathname);
  const current = side ? sides[side] : null;
  const links: readonly NavLink[] = current ? current.links : site.nav;
  const cta = current ? current.cta : LANDING_CTA;
  const drawerLinks: readonly NavLink[] = current
    ? [...current.links, current.crossover, { label: "Ticket Producer Home", href: "/" }]
    : site.nav;

  /* Joined to a string so the observer effect only re-subscribes when the set actually changes. */
  const tracked = useActiveSection(useMediaQuery(DESKTOP), sectionIdsOf(links).join(","));

  /* Section highlighting waits until the page has moved — at the very top no section owns the viewport. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const active = scrolled ? tracked : null;

  /** Close the menu on every navigation, including back/forward — adjusted during render so it never paints over the new route. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  /** Scroll lock and Escape while the menu is open; the previous overflow is restored, not reset. */
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

  /** Focus comes back to the toggle if a link inside the menu took it and the menu then closed. */
  useEffect(() => {
    if (!isOpen && document.activeElement === document.body) {
      menuButtonRef.current?.focus();
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const tag = current ? (
    <Link
      href={current.href}
      className="label rounded-full border border-brass/40 px-2.5 py-1 text-brass-light transition-colors duration-300 ease-ui hover:border-brass hover:text-bone"
    >
      {current.tag}
    </Link>
  ) : null;

  return (
    <>
      <Navbar transparent={TRANSPARENT_HERO_ROUTES.has(pathname)}>
        {/* Desktop */}
        <NavBody>
          <div className="flex shrink-0 items-center gap-3">
            <NavbarLogo />
            {tag}
          </div>

          <NavItems
            items={links.map((link) => ({
              name: link.label,
              link: link.href,
              active: isCurrent(link.href, pathname, active),
            }))}
          />

          <div className="flex shrink-0 items-center gap-1.5">
            {current ? (
              <Link
                href={current.crossover.href}
                className="group label mr-2 hidden items-center gap-1.5 whitespace-nowrap text-bone/60 transition-colors duration-300 ease-ui hover:text-brass-light xl:inline-flex"
              >
                {current.crossover.label}
                <ArrowUpRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-ui group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            ) : null}
            <ThemeToggle />
            <NavbarButton variant="secondary" href="/sign-in">
              Sign In
            </NavbarButton>
            <NavbarButton variant="primary" href={cta.href}>
              {cta.label}
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex min-w-0 items-center gap-3">
              <NavbarLogo />
              {tag}
            </div>
            <div className="flex items-center gap-0.5">
              <ThemeToggle className="text-stone hover:text-bone" />
              <MobileNavToggle
                ref={menuButtonRef}
                isOpen={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                controls="tp-site-drawer"
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu id="tp-site-drawer" isOpen={isOpen} onClose={close}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(255,255,255,0.12),transparent_60%)]"
            />

            <nav className="relative flex flex-col px-5 py-2" aria-label="Site">
              {drawerLinks.map((link, i) => {
                const isActive = isCurrent(link.href, pathname, active);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0.01 : 0.4,
                      delay: reduceMotion ? 0 : 0.06 + i * 0.035,
                      ease: EASE,
                    }}
                    className="border-b border-bone/10 last:border-b-0"
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={isActive ? "true" : undefined}
                      className={clsx(
                        "block py-3 text-[1.0625rem] leading-snug transition-colors duration-300 ease-ui",
                        isActive ? "text-brass-light" : "text-bone hover:text-brass-light",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="relative flex flex-col gap-2 px-5 pb-4 pt-1 sm:flex-row">
              <NavbarButton variant="dark" href="/sign-in" onClick={close} className="h-11 w-full sm:flex-1">
                Sign In
              </NavbarButton>
              <NavbarButton variant="primary" href={cta.href} onClick={close} className="h-11 w-full sm:flex-1">
                {cta.label}
              </NavbarButton>
            </div>

            {/* The line, plainly stated */}
            <div className="relative border-t border-bone/10 px-5 py-4">
              <span className="label block text-stone-dim">Direct line</span>
              <a
                href={site.contact.phoneHref}
                className="mt-1.5 block text-[1.0625rem] leading-none tracking-wide text-bone transition-colors duration-300 ease-ui hover:text-brass-light"
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
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Tapping outside closes the menu. It sits below the header's z-50 so the menu paints over it. */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: EASE }}
            onClick={close}
            className="fixed inset-0 z-40 bg-ink-deep/60 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
