"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import type { NavCategory } from "@/lib/ticket-resale-page";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * One category trigger plus its hover/focus flyout. `orientation="right"`
 * flies the flyout out beside a vertical rail item; `orientation="down"`
 * drops it beneath a horizontal bar item; `orientation="up"` lifts it above one,
 * for the bar that sits at the foot of the window. All are absolutely
 * positioned, so none ever shifts surrounding layout.
 *
 * `iconOnly` renders a bare circular icon button (the floating desktop rail)
 * and always opens the flyout on hover/focus — since there's no visible
 * label at rest, the flyout is what surfaces the category name, with any
 * subcategories listed beneath it. Without `iconOnly` the label sits inline
 * next to the icon and the flyout only opens when there's something to list.
 */
export function CategoryMenu({
  category,
  orientation = "right",
  compact = false,
  iconOnly = false,
}: {
  category: NavCategory;
  orientation?: "right" | "down" | "up";
  compact?: boolean;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotionSafe();
  const hasSubmenu = Boolean(category.subcategories?.length);
  const opensFlyout = iconOnly || hasSubmenu;
  const Icon = category.icon;

  const close = () => setOpen(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) close();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      close();
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => opensFlyout && setOpen(true)}
      onMouseLeave={() => opensFlyout && setOpen(false)}
      onFocus={() => opensFlyout && setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <Link
        ref={triggerRef}
        href={category.href}
        aria-haspopup={opensFlyout ? "menu" : undefined}
        aria-expanded={opensFlyout ? open : undefined}
        aria-label={iconOnly ? category.label : undefined}
        className={
          iconOnly
            ? "flex h-11 w-11 items-center justify-center rounded-full text-canvas-text transition-colors duration-300 ease-editorial hover:bg-graphite hover:text-white"
            : clsx(
                "group flex items-center gap-2.5 rounded-control text-canvas-text-muted transition-colors duration-300 ease-editorial hover:bg-canvas-alt hover:text-canvas-text",
                compact
                  ? "shrink-0 whitespace-nowrap px-3.5 py-2.5 text-[0.8125rem] font-medium"
                  : "w-full px-3.5 py-2.5 text-[0.875rem] font-medium",
              )
        }
      >
        <Icon
          className={clsx(
            "shrink-0 transition-colors duration-300 ease-editorial",
            iconOnly
              ? "h-[1.15rem] w-[1.15rem]"
              : "h-[1.05rem] w-[1.05rem] text-taupe group-hover:text-champagne",
          )}
          aria-hidden
        />
        {iconOnly ? null : <span>{category.label}</span>}
      </Link>

      <AnimatePresence>
        {open && opensFlyout ? (
          <motion.div
            role="menu"
            aria-label={`${category.label} categories`}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: orientation === "right" ? -6 : 0,
                    y: orientation === "down" ? -6 : orientation === "up" ? 6 : 0,
                    scale: 0.98,
                  }
            }
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: orientation === "right" ? -6 : 0,
                    y: orientation === "down" ? -6 : orientation === "up" ? 6 : 0,
                    scale: 0.98,
                  }
            }
            transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: EASE }}
            className={clsx(
              "absolute z-40 w-44 rounded-control border border-canvas-border bg-surface/95 p-1.5 shadow-[0_24px_50px_-30px_rgba(23,23,22,0.4)] backdrop-blur-xl",
              orientation === "right"
                ? "left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2"
                : orientation === "up"
                  ? "bottom-[calc(100%+0.6rem)] left-1/2 -translate-x-1/2"
                  : "left-0 top-[calc(100%+0.6rem)]",
            )}
          >
            {iconOnly ? (
              <p className="px-3 py-2 text-[0.8125rem] font-semibold text-canvas-text">
                {category.label}
              </p>
            ) : null}
            {hasSubmenu
              ? category.subcategories!.map((sub) => (
                  <Link
                    key={sub}
                    href={category.href}
                    role="menuitem"
                    className="block rounded-[10px] px-3 py-2 text-[0.8125rem] leading-snug text-canvas-text-muted transition-colors duration-200 ease-editorial hover:bg-canvas-alt hover:text-canvas-text"
                  >
                    {sub}
                  </Link>
                ))
              : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
