"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { IconSwap } from "@/components/ui/primitives";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

/**
 * Resizable navbar: a full-width bar at the top of the page that draws in to
 * a narrower floating pill once the page scrolls. Same API as the
 * Aceternity-style `resizable-navbar` (Navbar, NavBody, NavItems, MobileNav,
 * …), restyled in the site's ink-and-bone glass so it reads over both the
 * cream and the dark grounds.
 *
 * `Navbar` owns the scrolled state and hands it to its parts through context,
 * so any of them can be composed freely inside it.
 */

const EASE = [0.16, 0.84, 0.28, 1] as const;

type NavbarState = {
  /** Scrolled past the threshold: the bar has drawn in to a pill. */
  visible: boolean;
  /** Sitting over a full-bleed dark hero: no glass until the page scrolls. */
  transparent: boolean;
};

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const NavbarContext =React.createContext<NavbarState>({ visible: false, transparent: false });

/** Read the navbar's scrolled state from anywhere inside `<Navbar>`. */
export function useNavbar() {
  return React.useContext(NavbarContext);
}

/**
 * Glass for the bar and the pill; transparent only over a dark hero, at rest.
 *
 * The see-through comes from the blur and saturation pulling colour up from
 * whatever is behind; the "glass" from the lit top edge, a faint sheen falling
 * down the face, and a hairline rim. The tint stays at 65% ink on purpose: the
 * labels are bone-coloured and the bar also floats over the cream pages, and
 * below about 62% they drop under 4.5:1 there.
 */
function glass({ visible, transparent }: NavbarState) {
  if (transparent && !visible) return "border-transparent bg-transparent";
  return cn(
    "border-white/15 bg-ink/65 backdrop-blur-2xl backdrop-saturate-[1.8]",
    "bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.03)_45%,rgba(255,255,255,0)_100%)]",
    visible
      ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.06),0_18px_50px_-28px_rgba(0,0,0,0.85),0_4px_14px_-8px_rgba(0,0,0,0.35)]"
      : "shadow-[inset_0_1px_0_rgba(255,255,255,0.24),inset_0_-1px_0_rgba(255,255,255,0.05),0_10px_30px_-20px_rgba(0,0,0,0.6)]",
  );
}

export type NavbarProps = {
  children: React.ReactNode;
  className?: string;
  /** How far the page scrolls, in px, before the bar draws in. */
  threshold?: number;
  /** Start see-through, for routes whose hero is a full-bleed dark image or video. */
  transparent?: boolean;
};

export function Navbar({ children, className, threshold = 80, transparent = false }: NavbarProps) {
  // Read straight from the window, so a reload part-way down the page starts drawn in too.
  const visible = React.useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
  const reduceMotion = useReducedMotionSafe();

  const state = React.useMemo(() => ({ visible, transparent }), [visible, transparent]);

  return (
    <NavbarContext.Provider value={state}>
      <motion.header
        initial={{ y: -96 }}
        animate={{ y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.9, ease: EASE }}
        className={cn("fixed inset-x-0 top-3 z-50 px-4 sm:top-5 sm:px-8", className)}
      >
        {children}
      </motion.header>
    </NavbarContext.Provider>
  );
}

/** Desktop bar, shown from `lg`. Draws in from 80rem to 70rem wide and drops a touch once scrolled. */
export function NavBody({ children, className }: { children: React.ReactNode; className?: string }) {
  const state = useNavbar();
  const reduceMotion = useReducedMotionSafe();

  return (
    <motion.div
      animate={{ maxWidth: state.visible ? 1120 : 1280, y: state.visible ? -4 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-60 mx-auto hidden h-14 w-full items-center justify-between gap-4 rounded-full border px-6",
        "transition-[background-color,border-color,box-shadow] duration-500 ease-editorial lg:flex",
        glass(state),
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export type NavItem = { name: string; link: string; active?: boolean };

/** The desktop links, with a soft pill that follows the pointer between them. */
export function NavItems({
  items,
  className,
  onItemClick,
}: {
  items: readonly NavItem[];
  className?: string;
  onItemClick?: () => void;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const pillId = React.useId();

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn("flex flex-1 items-center justify-center gap-1", className)}
    >
      {items.map((item, idx) => (
        <Link
          key={item.link}
          href={item.link}
          onClick={onItemClick}
          onMouseEnter={() => setHovered(idx)}
          aria-current={item.active ? "true" : undefined}
          className={cn(
            "label relative whitespace-nowrap rounded-full px-3.5 py-2 transition-colors duration-300 ease-ui",
            item.active ? "text-brass-light" : "text-bone/75 hover:text-bone",
          )}
        >
          {hovered === idx ? (
            <motion.span
              layoutId={`nav-hover-${pillId}`}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-full bg-bone/10"
            />
          ) : null}
          <span className="relative z-10">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}

/** Mobile bar, shown below `lg`. Narrows slightly once scrolled; the menu drops from under it. */
export function MobileNav({ children, className }: { children: React.ReactNode; className?: string }) {
  const state = useNavbar();
  const reduceMotion = useReducedMotionSafe();

  return (
    <motion.div
      animate={{ width: state.visible ? "94%" : "100%", y: state.visible ? -4 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-50 mx-auto flex flex-col rounded-4xl border lg:hidden",
        "transition-[background-color,border-color,box-shadow] duration-500 ease-editorial",
        glass(state),
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function MobileNavHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-12 w-full items-center justify-between gap-3 px-4 sm:h-14 sm:px-5", className)}>
      {children}
    </div>
  );
}

export const MobileNavToggle = React.forwardRef<
  HTMLButtonElement,
  { isOpen: boolean; onClick: () => void; controls?: string; className?: string }
>(function MobileNavToggle({ isOpen, onClick, controls, className }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controls}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className={cn(
        "pressable -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-stone hover:text-bone",
        className,
      )}
    >
      <IconSwap active={isOpen} off={<Menu className="h-5 w-5" />} on={<X className="h-5 w-5" />} />
    </button>
  );
});

/** The dropdown under the mobile bar. Closing on outside tap, Escape and route change is the caller's job. */
export function MobileNavMenu({
  children,
  isOpen,
  id,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  /** Kept for API parity with the demo; the caller wires closing. */
  onClose?: () => void;
  id?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotionSafe();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: -10, scaleY: 0.97 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10, scaleY: 0.97 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: EASE }}
          style={{ transformOrigin: "top" }}
          className={cn(
            // Same glass as the bar. It can be lighter than the bar: it always opens over the dark, blurred scrim.
            "grain absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-white/15 bg-ink-deep/75 text-bone",
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0)_40%)] backdrop-blur-2xl backdrop-saturate-[1.8]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_30px_60px_-25px_rgba(0,0,0,0.85)]",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function NavbarLogo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Ticket Producer — home"
      className={cn("shrink-0 transition-opacity duration-300 ease-ui hover:opacity-70", className)}
    >
      <Logo variant="compact" />
    </Link>
  );
}

type ButtonVariant = "primary" | "secondary" | "dark";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-bone text-ink hover:bg-brass-light",
  secondary: "text-bone/80 hover:bg-bone/8 hover:text-bone",
  dark: "border border-bone/20 bg-ink text-bone hover:border-brass/70",
};

export type NavbarButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  /** With an href it renders a link; without one, a button. */
  href?: string;
  onClick?: () => void;
};

export function NavbarButton({ variant = "primary", className, children, href, onClick }: NavbarButtonProps) {
  const classes = cn(
    "pressable inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-semibold",
    VARIANTS[variant],
    className,
  );
  return href ? (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
