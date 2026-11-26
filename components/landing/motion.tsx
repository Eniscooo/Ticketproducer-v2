"use client";

import { useEffect, useRef } from "react";

type Kind = "rise" | "unveil" | "draw";

type InViewProps = {
  /** Which entrance — see the "Landing motion" block in globals.css. */
  kind?: Kind;
  as?: "div" | "section" | "li" | "ul" | "ol" | "p" | "span" | "h2" | "h3" | "figure";
  /** Stagger, in ms. Keep sibling steps between 40 and 80. */
  delay?: number;
  /** Fire on mount rather than on scroll — for the hero, which is already in view. */
  immediate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * Marks its element with `data-in` the first time it scrolls into view; the
 * CSS does the rest. One observer per element, disconnected after it fires.
 *
 * The motion itself is CSS transitions rather than a JS animation library:
 * they run on the compositor, so a page that is still decoding photographs
 * doesn't drop frames, and there is nothing to hydrate before they can play.
 */
export function InView({
  kind = "rise",
  as = "div",
  delay = 0,
  immediate = false,
  className,
  style,
  children,
}: InViewProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      /* Two frames: let the hidden state paint once so the transition has a start. */
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => el.setAttribute("data-in", "")),
      );
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-in", "");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  const Tag = as as React.ElementType;
  const data = { [`data-${kind}`]: "" };
  return (
    <Tag
      ref={ref}
      className={className}
      {...data}
      style={delay ? { ...style, ["--d" as string]: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
