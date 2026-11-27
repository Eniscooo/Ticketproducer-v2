import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Faq } from "@/components/site/faq";
import { LandingHero } from "@/components/landing/landing-hero";
import { Services } from "@/components/landing/services";
import { Playbill } from "@/components/landing/playbill";
import { Process } from "@/components/landing/process";
import { About } from "@/components/landing/about";
import { Closing } from "@/components/landing/closing";

export const metadata: Metadata = {
  title: { absolute: "Ticket Producer — Broadway tickets and live events, New York" },
  description:
    "Verified Broadway tickets, and event management for producers, venues and companies. Based in New York.",
};

/**
 * The landing page, top to bottom: the Broadway reel and the hero's calls to action; the
 * two sides, explained; the programme (the ticket side, shown); the process
 * (the event side, shown); who we are; questions; and the close.
 *
 * Grounds alternate cream → paper → ink → paper → cream → paper → ink, each
 * section lapping the one above with a rounded top, so the page reads as a
 * stack of programme pages rather than one long scroll.
 */
export default function Page() {
  return (
    <div className="page-in flex min-h-dvh flex-col bg-canvas-alt">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-canvas-text focus:px-5 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>

      <SiteNav />

      <main className="flex-1">
        <LandingHero />
        <Services />
        <Playbill />
        <Process />
        <About />
        <Faq />
        <Closing />
      </main>

      <SiteFooter />
    </div>
  );
}
