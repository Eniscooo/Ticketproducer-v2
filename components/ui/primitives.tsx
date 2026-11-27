import { clsx } from "@/lib/clsx";

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
