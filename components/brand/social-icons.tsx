/**
 * Minimal line-art social glyphs, drawn to match lucide's stroke weight —
 * not the official brand marks, so there's no logo-asset/trademark to
 * license. Recognizable enough for a footer row without importing an
 * icon-pack dependency for three icons.
 */

type IconProps = { className?: string };

export function InstagramGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M5 5 L19 19" />
      <path d="M19 5 L5 19" />
    </svg>
  );
}

export function LinkedInGlyph({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="8.2" cy="8.4" r="0.15" fill="currentColor" strokeWidth="1.8" />
      <path d="M8.2 11 V16.5" />
      <path d="M12 16.5 V13.2 C12 11.6 14.5 11.4 14.5 13.2 V16.5" />
    </svg>
  );
}
