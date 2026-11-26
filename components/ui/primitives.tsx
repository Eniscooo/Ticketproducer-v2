import Link from "next/link";
import { clsx } from "@/lib/clsx";

/**
 * Uppercase micro-label, optionally with the index rule beside it.
 *
 * `tone="light"` switches the whole thing to the editorial-body palette —
 * champagne index, taupe label, graphite hairline — for sections that sit
 * on the paper/linen ground rather than the dark ink ground.
 */
export function SectionLabel({
  children,
  index,
  brass,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  index?: string;
  brass?: boolean;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={clsx("flex items-center gap-5", className)}>
      {index ? (
        <span
          className={clsx("label tabular-nums", light ? "label-champagne" : "label-brass")}
        >
          {index}
        </span>
      ) : null}
      <span
        aria-hidden
        className={clsx("h-px w-10 sm:w-14", light ? "bg-canvas-text/15" : "bg-bone/20")}
      />
      <span
        className={clsx("label", light ? "label-taupe" : brass && "label-brass")}
      >
        {children}
      </span>
    </div>
  );
}

/** Full-bleed hairline used to separate sections. `tone="light"` for the paper/linen ground. */
export function Hairline({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <hr
      className={clsx(
        "border-0 border-t",
        tone === "light" ? "border-canvas-border" : "rule",
        className,
      )}
    />
  );
}

type ActionProps = {
  href: string;
  children: React.ReactNode;
  /**
   * `solid` is bone-on-ink; `brass` is the warm accent; `outline` is a hairline
   * frame — all three for the dark ground. `ink` is the inverse, for the
   * editorial light sections, and washes champagne rather than brass.
   */
  tone?: "solid" | "outline" | "brass" | "ink";
  /**
   * `lg` is the hero size — taller, wider, and a step up in type. A real prop
   * rather than passed-in overrides: `min-h-14` and `min-h-16` are utilities in
   * the same layer, so which one won would come down to their order in the
   * generated stylesheet, not the order they appear in `className`.
   */
  size?: "md" | "lg";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  prefetch?: boolean;
};

/**
 * Premium, intentionally-rounded actions with a brass wash on hover — a soft
 * corner, not a full pill, so it reads as considered rather than a generic
 * SaaS button.
 *
 * Timing is split by job: the text and border answer the cursor at once, the
 * wash rises a beat slower so it still reads as a wash, and a press scales the
 * whole control down for the frame the pointer is held. The wash used to take
 * 700ms, which made the hover feel like it was catching up with the pointer.
 */
export function Action({
  href,
  children,
  tone = "outline",
  size = "md",
  className,
  onClick,
  prefetch,
}: ActionProps) {
  const external = href.startsWith("tel:") || href.startsWith("mailto:");

  const classes = clsx(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-xl",
    size === "lg" ? "min-h-15 px-10 py-4.5 text-[0.75rem]" : "min-h-14 px-9 py-4",
    "label pressable",
    tone === "solid"
      ? "bg-bone text-ink hover:text-ink"
      : tone === "brass"
        ? "bg-brass text-ink hover:text-ink"
        : tone === "ink"
          ? "bg-graphite text-white ring-1 ring-graphite-dim"
          : "border border-bone/25 text-bone hover:border-brass/70 hover:text-ivory",
    className,
  );

  const inner = (
    <>
      {/* Brass wash rises from the baseline on hover */}
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 transition-transform duration-500 ease-editorial group-hover:scale-y-100",
          tone === "solid"
            ? "bg-ink/8"
            : tone === "brass"
              ? "bg-brass-light/70"
              : tone === "ink"
                ? "bg-graphite-dim"
                : "bg-brass/12",
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick} prefetch={prefetch}>
      {inner}
    </Link>
  );
}

/**
 * Two icons in one slot, crossfaded on a boolean — menu/close, sun/moon.
 *
 * Both glyphs stay mounted and trade opacity, scale, and a 2px blur, so the
 * swap reads as one icon changing shape rather than two icons trading places.
 * CSS transitions rather than a Framer exit/enter pair: toggles get tapped
 * twice in quick succession, and a transition retargets mid-flight where an
 * exit animation would restart from zero.
 */
export function IconSwap({
  active,
  off,
  on,
  className = "h-5 w-5",
}: {
  /** `true` shows `on`, `false` shows `off`. */
  active: boolean;
  off: React.ReactNode;
  on: React.ReactNode;
  className?: string;
}) {
  const layer =
    "absolute inset-0 flex items-center justify-center transition-[opacity,scale,filter] duration-200 ease-ui";
  return (
    <span aria-hidden className={clsx("relative inline-block", className)}>
      <span className={clsx(layer, active && "scale-[0.6] opacity-0 blur-[2px]")}>{off}</span>
      <span className={clsx(layer, !active && "scale-[0.6] opacity-0 blur-[2px]")}>{on}</span>
    </span>
  );
}
