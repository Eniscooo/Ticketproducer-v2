import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";

/**
 * The page's one section header: an eyebrow pill with a live dot — the same
 * badge the Tickets hero opens with — then the light/bold headline the page has
 * always used, and an optional line of body copy. Left-aligned by default;
 * `center` for sections that run full width beneath it.
 */
export function EmSectionHeader({
  eyebrow,
  light,
  bold,
  body,
  center = false,
  className,
}: {
  eyebrow: string;
  light?: string;
  bold: string;
  body?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={clsx(center && "mx-auto text-center", "max-w-2xl", className)}>
      <p className="inline-flex items-center gap-2 rounded-full border border-canvas-border bg-surface/75 px-3.5 py-1.5 text-[0.8125rem] font-medium text-canvas-text-muted backdrop-blur">
        <span aria-hidden className="relative flex h-2 w-2">
          <span className="tp-live-ring absolute inset-0 rounded-full bg-canvas-text" />
          <span className="relative h-2 w-2 rounded-full bg-canvas-text" />
        </span>
        {eyebrow}
      </p>
      <h2 className="ds-display mt-5 text-balance text-[clamp(2.1rem,4.6vw,3.25rem)] text-canvas-text">
        {light ? <span className="font-light">{light} </span> : null}
        <span className="font-semibold">{bold}</span>
      </h2>
      {body ? (
        <p className={clsx("ds-body mt-5 max-w-xl text-pretty text-canvas-text-muted", center && "mx-auto")}>
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

/**
 * Stands its child up in 3D: turned a few degrees toward the copy beside it,
 * bobbing gently, with a soft contact shadow on the "floor". Pure CSS — the
 * float stops for reduced motion (`.tp-float` in globals.css).
 */
export function Tilt3D({
  children,
  side = "right",
  className,
}: {
  children: React.ReactNode;
  /** Which side of the card the object sits on; it turns to face the middle. */
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={clsx("relative [perspective:1400px]", className)}>
      {/* Contact shadow */}
      <div
        aria-hidden
        className="absolute inset-x-[18%] -bottom-6 h-10 rounded-[50%] bg-ink/30 blur-2xl dark:bg-black/60"
      />
      <div
        className="tp-float [transform-style:preserve-3d]"
        style={{ ["--float-dur" as string]: "7s", ["--float-y" as string]: "-12px" }}
      >
        <div
          className="transition-transform duration-700 ease-editorial"
          style={{
            transform: side === "right" ? "rotateY(-16deg) rotateX(6deg)" : "rotateY(16deg) rotateX(6deg)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
