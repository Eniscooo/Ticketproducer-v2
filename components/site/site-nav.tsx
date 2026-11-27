"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
import { site } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/** Routes whose hero is a full-bleed dark video — the nav starts see-through over it. */
const TRANSPARENT_HERO_ROUTES = new Set(["/event-management"]);

/**
 * A route link is current on its own page and everything under it (a show page
 * belongs to Ticket Resale); in-page anchors (#contact) never mark themselves.
 */
const isCurrent = (href: string, pathname: string) =>
  !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

/**
 * The site nav: one set of links on every page — the three services and
 * Contact — so it never rearranges itself as you move between them. The page
 * you're on is simply highlighted. Built on the resizable navbar: a full-width
 * glass bar that draws in to a floating pill on scroll.
 */
export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotionSafe();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const links = site.nav;

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

  return (
    <>
      <Navbar transparent={TRANSPARENT_HERO_ROUTES.has(pathname)}>
        {/* Desktop */}
        <NavBody>
          <NavbarLogo />

          <NavItems
            items={links.map((link) => ({
              name: link.label,
              link: link.href,
              active: isCurrent(link.href, pathname),
            }))}
          />

          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle />
            <NavbarButton href="/sign-in" icon={null}>
              Sign In
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
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
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(255,255,255,0.08),transparent_60%)]"
            />

            <nav className="relative flex flex-col px-5 py-2" aria-label="Site">
              {links.map((link, i) => {
                const isActive = isCurrent(link.href, pathname);
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
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "block py-3 text-[1.0625rem] leading-snug transition-colors duration-300 ease-ui",
                        isActive ? "text-white underline underline-offset-8" : "text-bone/85 hover:text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="relative px-5 pb-4 pt-1">
              <NavbarButton href="/sign-in" onClick={close} icon={null} fullWidth>
                Sign In
              </NavbarButton>
            </div>

            {/* The line, plainly stated */}
            <div className="relative border-t border-bone/10 px-5 py-4">
              <span className="label block text-stone-dim">Direct line</span>
              <a
                href={site.contact.phoneHref}
                className="mt-1.5 block text-[1.0625rem] leading-none tracking-wide text-bone transition-colors duration-300 ease-ui hover:text-white"
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
