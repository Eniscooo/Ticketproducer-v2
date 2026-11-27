import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The site's one button. On hover a circle grows from the centre to fill it,
 * the arrow slides in from the left as the one on the right slides out, the
 * label shifts across, and the pill's corners tighten. On press it settles 5%.
 *
 * Generalised from the pasted FlowButton so every action on the site can use it:
 *  - `href` renders a link (Next `Link` for site routes; a plain `<a>` for
 *    tel:, mailto:, #anchors and external URLs); without it, a `<button>`.
 *  - `tone` picks the ink for its ground: "ink" (theme-aware, for light
 *    grounds), "light" (white, for dark grounds), "curtain" (the landing
 *    hero's red).
 *  - `icon` swaps the arrow for another lucide icon (a phone for calls).
 *  - The fill circle is sized as a share of the button with a square aspect,
 *    so full-width buttons fill completely, not only the 220px the original
 *    circle reached.
 *
 * Deliberately not a client component: it holds no state, and the hover is
 * pure CSS. That lets server components pass it an `icon` (a component, which
 * can't cross into a client boundary) while client components can still pass
 * `onClick`.
 */

type Tone = "ink" | "light" | "curtain";

const TONES: Record<Tone, { base: string; fill: string; icon: string }> = {
  ink: {
    base: "border-canvas-text/40 text-canvas-text hover:text-paper focus-visible:text-paper",
    fill: "bg-canvas-text",
    icon: "group-hover:text-paper group-focus-visible:text-paper",
  },
  light: {
    base: "border-white/45 text-white hover:text-ink focus-visible:text-ink",
    fill: "bg-white",
    icon: "group-hover:text-ink group-focus-visible:text-ink",
  },
  curtain: {
    base: "border-curtain-ink/60 text-curtain-ink hover:text-white focus-visible:text-white",
    fill: "bg-curtain",
    icon: "group-hover:text-white group-focus-visible:text-white",
  },
};

type CommonProps = {
  children: React.ReactNode;
  tone?: Tone;
  /** A lucide icon for the arrow slots; `null` for a text-only button. */
  icon?: LucideIcon | null;
  size?: "md" | "sm";
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
};

type AsLink = CommonProps & {
  href: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

type AsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export type FlowButtonProps = AsLink | AsButton;

const isPlainAnchor = (href: string) => /^(tel:|mailto:|#|https?:)/.test(href);

export function FlowButton(props: FlowButtonProps) {
  const { children, tone = "ink", size = "md", fullWidth = false, className } = props;
  const Icon = props.icon === undefined ? ArrowRight : props.icon;
  const t = TONES[tone];

  const classes = cn(
    "group relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 overflow-hidden whitespace-nowrap",
    "rounded-[100px] border-[1.5px] bg-transparent font-semibold",
    "transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
    "hover:rounded-[12px] hover:border-transparent focus-visible:rounded-[12px] focus-visible:border-transparent active:scale-[0.95]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
    "disabled:pointer-events-none disabled:opacity-60",
    size === "md"
      ? "h-11 px-7 text-sm sm:h-12 sm:px-9 sm:text-[0.9375rem]"
      : Icon
        ? "h-10 px-7 text-sm"
        : "h-10 px-5 text-sm",
    fullWidth && "w-full",
    t.base,
    className,
  );

  const iconClass = cn(
    "absolute z-[9] h-4 w-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    t.icon,
  );

  const inner = (
    <>
      {/* Incoming icon, from the left */}
      {Icon ? <Icon aria-hidden className={cn(iconClass, "left-[-25%] group-hover:left-4 group-focus-visible:left-4")} /> : null}

      <span
        className={cn(
          "relative z-[1] transition-all duration-[800ms] ease-out",
          Icon && "-translate-x-3 group-hover:translate-x-3 group-focus-visible:translate-x-3",
        )}
      >
        {children}
      </span>

      {/* The fill: grows from a dot at the centre to cover the whole button */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 top-1/2 -z-0 aspect-square w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-0",
          "transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          "group-hover:w-[160%] group-hover:min-w-[220px] group-hover:opacity-100",
          "group-focus-visible:w-[160%] group-focus-visible:min-w-[220px] group-focus-visible:opacity-100",
          t.fill,
        )}
      />

      {/* Outgoing icon, to the right */}
      {Icon ? <Icon aria-hidden className={cn(iconClass, "right-4 group-hover:right-[-25%] group-focus-visible:right-[-25%]")} /> : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, onClick, target, rel } = props;
    if (isPlainAnchor(href)) {
      return (
        <a href={href} onClick={onClick} target={target} rel={rel} aria-label={props["aria-label"]} className={classes}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} aria-label={props["aria-label"]} className={classes}>
        {inner}
      </Link>
    );
  }

  const { type = "button", disabled, onClick } = props;
  return (
    <button type={type} disabled={disabled} onClick={onClick} aria-label={props["aria-label"]} className={classes}>
      {inner}
    </button>
  );
}

/** A non-interactive stand-in with the same look, for when the whole parent is already the link. */
export function FlowButtonLook({
  children,
  tone = "ink",
  icon,
  className,
}: Pick<CommonProps, "children" | "tone" | "icon" | "className">) {
  const t = TONES[tone];
  const Icon = icon ?? ArrowRight;
  return (
    <span
      className={cn(
        "relative isolate inline-flex h-12 shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-[100px] border-[1.5px] px-9 text-[0.9375rem] font-semibold",
        "transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rounded-[12px] group-hover:border-transparent",
        t.base.replace(/hover:/g, "group-hover:"),
        className,
      )}
    >
      <Icon aria-hidden className={cn("absolute z-[9] h-4 w-4 left-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4", t.icon)} />
      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3">{children}</span>
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 top-1/2 aspect-square w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
          "group-hover:w-[160%] group-hover:min-w-[220px] group-hover:opacity-100",
          t.fill,
        )}
      />
      <Icon aria-hidden className={cn("absolute z-[9] h-4 w-4 right-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]", t.icon)} />
    </span>
  );
}
