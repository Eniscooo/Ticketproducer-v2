import { clsx } from "@/lib/clsx";

type LogoProps = {
  /** `stacked` mirrors the primary lockup; `compact` is the navigation mark. */
  variant?: "stacked" | "compact";
  className?: string;
};

/**
 * The lockup is typographic by design — set live rather than shipped as an
 * image so it stays crisp at any size and inherits the page's ink color.
 */
export function Logo({ variant = "stacked", className }: LogoProps) {
  const stacked = variant === "stacked";

  return (
    <span
      className={clsx(
        "inline-flex flex-col items-center font-display font-light text-bone",
        stacked ? "gap-[0.34em]" : "gap-[0.28em]",
        className,
      )}
    >
      <span
        className={clsx(
          "block leading-none",
          stacked
            ? "text-[clamp(2rem,7.2vw,4.75rem)] tracking-[0.24em] indent-[0.24em]"
            : "text-[0.9375rem] tracking-[0.32em] indent-[0.32em] sm:text-base",
        )}
      >
        Ticket
      </span>
      <span
        aria-hidden
        className={clsx(
          "block h-px w-full bg-brass",
          stacked ? "opacity-90" : "opacity-70",
        )}
      />
      <span
        className={clsx(
          "block leading-none",
          stacked
            ? "text-[clamp(2rem,7.2vw,4.75rem)] tracking-[0.16em] indent-[0.16em]"
            : "text-[0.9375rem] tracking-[0.2em] indent-[0.2em] sm:text-base",
        )}
      >
        Producer
      </span>
    </span>
  );
}
