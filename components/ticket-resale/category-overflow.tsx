"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import type { NavCategory } from "@/lib/ticket-resale-page";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * The mobile bar's overflow control: every category that doesn't fit the three
 * visible slots, listed in a sheet that opens above the bar.
 *
 * Unlike `CategoryMenu` this opens on *click* rather than hover. It only ever
 * renders below `xl`, on the bar that touch reaches, where a hover flyout would
 * spring open on tap and then linger with no pointer-leave to close it. The rows are plain links for the
 * same reason — a nested flyout has nowhere to go on a phone.
 *
 * Open state is reported upward so the bar can hold itself visible while the
 * sheet is up, instead of idling out from under it.
 */
export function CategoryOverflow({
  categories,
  onOpenChange,
}: {
  categories: NavCategory[];
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotionSafe();

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (categories.length === 0) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More categories"
        className="flex h-11 w-11 items-center justify-center rounded-full text-canvas-text transition-colors duration-300 ease-editorial hover:bg-graphite hover:text-white aria-expanded:bg-graphite aria-expanded:text-white"
      >
        <MoreHorizontal className="h-[1.15rem] w-[1.15rem]" aria-hidden />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            aria-label="More categories"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: EASE }}
            className="absolute bottom-[calc(100%+0.6rem)] right-0 z-40 w-52 rounded-control border border-canvas-border bg-surface/95 p-1.5 shadow-[0_24px_50px_-30px_rgba(23,23,22,0.4)] backdrop-blur-xl"
          >
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.key}
                  href={category.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[0.8125rem] font-medium leading-snug text-canvas-text-muted transition-colors duration-200 ease-editorial hover:bg-canvas-alt hover:text-canvas-text"
                >
                  <Icon className="h-[1.05rem] w-[1.05rem] shrink-0 text-taupe" aria-hidden />
                  {category.label}
                </Link>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
