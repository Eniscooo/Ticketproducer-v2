import type { MetadataRoute } from "next";
import { resaleEvents } from "@/lib/ticket-resale-page";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ticketproducer.com";

/** Every public page, plus one entry per show listing. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/ticket-resale", priority: 0.9 },
    { path: "/event-management", priority: 0.8 },
    { path: "/elite", priority: 0.6 },
    { path: "/credits", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/privacy", priority: 0.2 },
    { path: "/cookies", priority: 0.2 },
  ];
  return [
    ...pages.map(({ path, priority }) => ({ url: `${SITE}${path}`, priority })),
    ...resaleEvents.map((event) => ({ url: `${SITE}/ticket-resale/${event.slug}`, priority: 0.7 })),
  ];
}
