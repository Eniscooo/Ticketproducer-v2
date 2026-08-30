import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { InstagramGlyph, LinkedInGlyph, XGlyph } from "@/components/brand/social-icons";
import { site } from "@/lib/site";

const SOCIAL_GLYPHS = {
  Instagram: InstagramGlyph,
  X: XGlyph,
  LinkedIn: LinkedInGlyph,
} as const;

export function SiteFooter() {
  return (
    <footer className="relative -mt-8 overflow-hidden rounded-t-[2rem] bg-ink-deep pt-16 shadow-[0_-24px_50px_-35px_rgba(0,0,0,0.7)] sm:pt-20">
      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/services#top"
              className="inline-block transition-opacity duration-500 hover:opacity-70"
            >
              <Logo variant="compact" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone">
              {site.description}
            </p>
            <div className="mt-7 flex items-center gap-3">
              {site.social.map((item) => {
                const Glyph = SOCIAL_GLYPHS[item.label as keyof typeof SOCIAL_GLYPHS];
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-stone transition-colors duration-500 hover:border-brass/60 hover:text-brass-light"
                  >
                    <Glyph className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="label text-stone-dim">Services</p>
            <ul className="mt-5 space-y-6 sm:space-y-3">
              {site.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label link-underline tap-pad text-stone transition-colors duration-500 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="label text-stone-dim">Company</p>
            <ul className="mt-5 space-y-6 sm:space-y-3">
              {site.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label link-underline tap-pad text-stone transition-colors duration-500 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label text-stone-dim">Contact</p>
            <div className="mt-5 flex flex-col gap-5 sm:gap-3">
              <a
                href={site.contact.phoneHref}
                className="label tap-pad self-start text-bone transition-colors duration-500 hover:text-brass-light"
              >
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="label tap-pad break-anywhere self-start text-stone transition-colors duration-500 hover:text-bone"
              >
                {site.contact.email}
              </a>
              <span className="label text-stone-dim/80">
                {site.contact.addressLines.join(" · ")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-bone/10 pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-stone-dim/80">
            © 2026 {site.name}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-y-2">
            {site.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label link-underline tap-pad text-stone-dim transition-colors duration-500 hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
