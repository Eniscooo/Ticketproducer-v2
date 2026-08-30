import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

/**
 * The shared frame for /sign-in and /sign-up.
 *
 * These two pages deliberately drop `SiteNav` and `SiteFooter`. Both float over
 * whatever is beneath them, and a marketing bar sitting across a split-screen
 * form panel reads as chrome left on by accident — so the frame carries its own
 * minimal versions instead: the mark on the art side, one way back to the site,
 * and the legal row at the foot of the form column.
 *
 * There is exactly one `Image` in here, not one per breakpoint. The art is a
 * full-height column from `lg` and a banner strip below it — same element, same
 * request, different shape — because a hidden duplicate still gets fetched.
 */

/** Brand facts, not page copy — the same two lines the hero leads with. */
const CREDENTIALS = [
  { label: "Based in", value: "New York" },
  { label: "Track record", value: "10+ years of live events" },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export function AuthLayout({
  eyebrow,
  title,
  intro,
  art,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  art: { image: string; position?: string; quote: string };
  /** The form. */
  children: React.ReactNode;
  /** The cross-link line beneath it — sign-in points at sign-up, and back. */
  aside: React.ReactNode;
}) {
  return (
    <div className="page-in min-h-dvh bg-paper lg:grid lg:grid-cols-2">
      <aside className="relative isolate flex h-44 flex-col justify-between overflow-hidden bg-ink px-6 py-6 sm:h-52 sm:px-10 sm:py-8 lg:sticky lg:top-0 lg:h-dvh lg:self-start lg:px-12 lg:py-12 xl:px-16 xl:py-14">
        <Image
          src={art.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`-z-20 object-cover ${art.position ?? "object-center"} opacity-40`}
        />
        {/* The scrim does all the contrast work; the photograph stays a ground. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/65 to-ink/95"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(75%_55%_at_15%_100%,rgba(164,133,90,0.24),transparent_72%)]"
        />

        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="w-fit transition-opacity duration-500 hover:opacity-70"
        >
          <Logo variant="compact" />
        </Link>

        {/* The quote is the art side's whole message, and there is only room for it from `lg`. */}
        <div className="hidden lg:block">
          <p className="label label-brass">{eyebrow}</p>

          <p className="display mt-7 max-w-md text-[clamp(1.5rem,2.2vw,2.15rem)] leading-[1.25] text-bone">
            &ldquo;{art.quote}&rdquo;
          </p>

          <hr className="rule mt-10 border-0 border-t" />

          <dl className="mt-7 grid grid-cols-2 gap-6">
            {CREDENTIALS.map((item) => (
              <div key={item.label}>
                <dt className="label">{item.label}</dt>
                <dd className="mt-1.5 text-sm leading-snug text-stone">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Below `lg` the strip is too short for the quote — the tagline carries it. */}
        <p className="text-sm text-stone lg:hidden">{site.tagline}</p>
      </aside>

      <div className="flex min-h-dvh flex-col lg:min-h-dvh">
        <header className="flex justify-end px-6 py-6 sm:px-10 sm:py-8">
          <Link
            href="/"
            className="label tap-pad inline-flex items-center gap-2 text-taupe transition-colors duration-300 ease-editorial hover:text-canvas-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to site
          </Link>
        </header>

        <main className="flex flex-1 items-center px-6 py-6 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-[27rem]">
            <p className="label label-champagne lg:hidden">{eyebrow}</p>

            <h1 className="display mt-4 text-[clamp(2rem,4.6vw,2.75rem)] text-canvas-text lg:mt-0">
              {title}
            </h1>

            <p className="mt-5 text-[0.9375rem] leading-[1.8] text-canvas-text-muted">
              {intro}
            </p>

            {children}

            <div className="mt-8 text-center text-[0.9375rem] text-canvas-text-muted">
              {aside}
            </div>
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 pb-8 pt-4 sm:px-10">
          <p className="text-xs text-taupe">
            &copy; 2026 {site.name}
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-taupe transition-colors duration-300 ease-editorial hover:text-canvas-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}
