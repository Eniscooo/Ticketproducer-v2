import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/** Runs before hydration so a stored theme choice applies before first paint — no stored choice means "follow the OS," handled entirely by CSS. */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('tp-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

/** The one typeface for the whole site — hierarchy comes from weight and size, not from a second font. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ticket Producer — Live events, produced properly.",
    template: "%s · Ticket Producer",
  },
  description:
    "Ticket Producer runs the systems behind live events — staffing, venue mapping, and the platform that sells the seat — plus the resale market on the other side, and a concierge line for people who never miss a show. New York.",
  applicationName: "Ticket Producer",
  keywords: [
    "event production New York",
    "event staffing",
    "venue mapping",
    "ticketing platform",
    "ticket resale",
    "concierge access",
  ],
  openGraph: {
    title: "Ticket Producer — Live events, produced properly.",
    description:
      "Event management, ticket resale, and private concierge access. 10+ years producing live events, based in New York.",
    siteName: "Ticket Producer",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * `suppressHydrationWarning` is on the element the theme script writes to,
     * and only for that reason: `THEME_INIT_SCRIPT` stamps `data-theme` on
     * <html> before React hydrates, so the DOM legitimately carries an
     * attribute the server had no way to render. React compares the two and
     * reports a mismatch it cannot patch. The flag is one level deep — it
     * covers this element's own attributes, not the tree beneath it — so real
     * mismatches inside the app still surface.
     */
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-bone">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
