"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * Shared open/close behaviour for the filter popovers: click outside, Escape,
 * and focus leaving the wrapper all close it, and the trigger takes focus back
 * on Escape so keyboard users don't lose their place.
 */
export function usePopover<T extends HTMLElement>() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<T>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const onBlur = (event: React.FocusEvent) => {
    if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  return { open, setOpen, wrapperRef, triggerRef, onKeyDown, onBlur };
}

/** The pill trigger both filter popovers sit under. */
export const TRIGGER_CLASS =
  "inline-flex shrink-0 items-center gap-2 rounded-ds-pill border bg-surface py-2.5 pl-4 pr-3.5 text-[0.875rem] transition-colors duration-300 ease-editorial";

/** The rounded panel both popovers open. */
export const PANEL_CLASS =
  "absolute left-0 top-[calc(100%+0.5rem)] z-40 min-w-[13rem] overflow-hidden rounded-feature border border-canvas-border bg-surface p-2 shadow-[0_34px_60px_-28px_rgba(23,23,22,0.4)]";

export function panelMotion(reduceMotion: boolean) {
  return {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 },
    transition: { duration: reduceMotion ? 0.01 : 0.22, ease: EASE },
  };
}

/**
 * A single-choice filter as a real popover rather than a native `<select>`:
 * the browser draws an OS menu for a select, square corners and all, which is
 * the one part of a styled control you cannot reach with CSS. This keeps the
 * whole thing — trigger and menu — on the design system's radii.
 */
export function FilterMenu({
  label,
  icon,
  value,
  options,
  onChange,
  allLabel,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  onChange: (next: string) => void;
  allLabel: string;
}) {
  const { open, setOpen, wrapperRef, triggerRef, onKeyDown, onBlur } =
    usePopover<HTMLDivElement>();
  const reduceMotion = useReducedMotionSafe();
  const isAll = value === allLabel;

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0" onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          TRIGGER_CLASS,
          isAll
            ? "border-canvas-border text-canvas-text hover:border-taupe/50"
            : "border-champagne bg-champagne/10 text-canvas-text",
        )}
      >
        {icon}
        <span className="whitespace-nowrap">{value}</span>
        <ChevronDown
          aria-hidden
          className={clsx(
            "h-3.5 w-3.5 text-taupe transition-transform duration-300 ease-editorial",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul role="listbox" aria-label={label} {...panelMotion(reduceMotion)} className={PANEL_CLASS}>
            {[allLabel, ...options].map((option) => {
              const selected = option === value;
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => choose(option)}
                    className={clsx(
                      "flex w-full items-center justify-between gap-3 rounded-control px-3.5 py-2.5 text-left text-[0.875rem] transition-colors duration-200 ease-editorial",
                      selected
                        ? "bg-champagne/12 text-canvas-text"
                        : "text-canvas-text-muted hover:bg-canvas-alt hover:text-canvas-text",
                    )}
                  >
                    <span className="truncate">{option}</span>
                    {selected ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
