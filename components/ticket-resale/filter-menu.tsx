"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { HANDHELD, useMediaQuery } from "@/lib/use-media-query";
import { BottomSheet } from "./bottom-sheet";

const EASE = [0.16, 0.84, 0.28, 1] as const;

/**
 * Shared open/close behaviour for the filter menus: click outside, Escape, and
 * focus leaving the wrapper all close it, and the trigger takes focus back on
 * Escape so keyboard users don't lose their place.
 *
 * `dismissOnOutside` turns the pointer and blur handling off. In sheet mode the
 * panel renders through a portal, so it is *not* inside `wrapperRef` — leaving
 * these on would read the first tap inside the sheet as a tap outside it and
 * close it again immediately. The sheet's own backdrop and Escape key cover
 * dismissal there.
 */
export function usePopover<T extends HTMLElement>({
  dismissOnOutside = true,
}: { dismissOnOutside?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<T>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || !dismissOnOutside) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, dismissOnOutside]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const onBlur = (event: React.FocusEvent) => {
    if (!dismissOnOutside) return;
    if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  return { open, setOpen, wrapperRef, triggerRef, onKeyDown, onBlur };
}

/**
 * The trigger both filter menus sit under.
 *
 * Deliberately unbordered: these two are the page's opening line, sitting on
 * their own centred row above the listings, and a pair of outlined pills there
 * read as form controls rather than as a place statement. Selection is carried
 * by the text going champagne, not by a box appearing around it.
 */
export const TRIGGER_CLASS =
  "inline-flex shrink-0 items-center gap-2 rounded-control px-3 py-2.5 text-[0.9375rem] font-medium transition-colors duration-300 ease-editorial hover:bg-canvas-alt";

export function triggerTone(isAll: boolean) {
  return isAll ? "text-canvas-text" : "text-champagne";
}

/** The rounded panel both menus open with a cursor. */
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
 * A single-choice filter, as a popover with a cursor and a pull-up sheet on a
 * phone. Not a native `<select>`: the browser draws an OS menu for one, square
 * corners and all, which is the one part of a styled control CSS cannot reach.
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
  const handheld = useMediaQuery(HANDHELD);
  const { open, setOpen, wrapperRef, triggerRef, onKeyDown, onBlur } = usePopover<HTMLDivElement>({
    dismissOnOutside: !handheld,
  });
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
        onClick={() => setOpen((current) => !current)}
        className={clsx(TRIGGER_CLASS, triggerTone(isAll))}
      >
        {icon}
        <span className="whitespace-nowrap">{value}</span>
        <ChevronDown
          aria-hidden
          className={clsx(
            "h-4 w-4 text-taupe transition-transform duration-300 ease-editorial",
            open && "rotate-180",
          )}
        />
      </button>

      {handheld ? (
        <BottomSheet open={open} onClose={() => setOpen(false)} title={label}>
          <OptionList
            label={label}
            options={[allLabel, ...options]}
            value={value}
            roomy
            onChoose={choose}
          />
        </BottomSheet>
      ) : (
        <AnimatePresence>
          {open ? (
            <motion.div {...panelMotion(reduceMotion)} className={PANEL_CLASS}>
              <OptionList
                label={label}
                options={[allLabel, ...options]}
                value={value}
                onChoose={choose}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}

/**
 * The choices, rendered identically in the popover and in the sheet — only the
 * row height differs, because a thumb needs more of one than a cursor does.
 *
 * Split out rather than built inline so the rows are produced by this
 * component's own render. `onChoose` returns focus to the trigger, which means
 * touching a ref; assembling these in the parent's body put that ref access on
 * the render path.
 */
function OptionList({
  label,
  options,
  value,
  roomy = false,
  onChoose,
}: {
  label: string;
  options: string[];
  value: string;
  roomy?: boolean;
  onChoose: (next: string) => void;
}) {
  return (
    <ul role="listbox" aria-label={label}>
      {options.map((option) => {
        const selected = option === value;

        return (
          <li key={option}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChoose(option)}
              className={clsx(
                "flex w-full items-center justify-between gap-3 rounded-control px-3.5 text-left transition-colors duration-200 ease-editorial",
                roomy ? "py-3.5 text-[0.9375rem]" : "py-2.5 text-[0.875rem]",
                selected
                  ? "bg-champagne/12 text-canvas-text"
                  : "text-canvas-text-muted hover:bg-canvas-alt hover:text-canvas-text",
              )}
            >
              <span className="truncate">{option}</span>
              {selected ? <Check className="h-4 w-4 shrink-0 text-champagne" aria-hidden /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
