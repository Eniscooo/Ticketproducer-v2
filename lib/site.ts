/** Single source of truth for brand copy and contact details. */
export const site = {
  name: "Ticket Producer",
  tagline: "Live events, produced properly",
  eyebrow: ["New York", "Live Events", "Ticketing", "Resale", "Private Access"],
  credibility: "10+ years producing live events, based in New York.",
  description:
    "Ticket Producer plans and runs live events for the people putting them on, and sells verified tickets to the people going to them. New York.",
  contact: {
    phone: "1-800-809-0443",
    phoneHref: "tel:+18008090443",
    email: "Admin@ticketproducer.com",
    addressLines: ["1650 Broadway, Suite 1010", "New York, NY 10019"],
  },
  /** The landing page's own links: the two doors, then the company sections that live on `/`. */
  nav: [
    { label: "Event Management", href: "/event-management" },
    { label: "Tickets", href: "/ticket-resale" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  company: [
    { label: "About", href: "/#about" },
    { label: "FAQs", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
    { label: "Sign In", href: "/sign-in" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Photo Credits", href: "/credits" },
  ],
  /**
   * NOTE: No real social accounts exist yet — hrefs are "#" on purpose
   * rather than a guessed handle, since a wrong guess could point visitors
   * at an unrelated real account. Fill in before launch.
   */
  social: [
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
} as const;

export type SideKey = "events" | "tickets";

export type Side = {
  key: SideKey;
  /** Full name, as the landing page and footer print it. */
  label: string;
  /** The tag that sits beside the logo once a visitor is inside this side. */
  tag: string;
  href: string;
  /** Who this side is for, in one line. */
  audience: string;
  /** In-page links for this side's own nav. */
  links: readonly { label: string; href: string }[];
  /** The one action this side exists to get. */
  cta: { label: string; href: string };
  /** The way across to the other side, always one click away. */
  crossover: { label: string; href: string };
};

/**
 * The site is two businesses under one name: event management sells to the
 * people putting an event on, the ticket side sells to the people going to
 * one. Each gets its own section, nav, call to action and FAQ; the landing
 * page at `/` explains both and lets the visitor pick. Every route under a
 * side's `href` wears that side's nav.
 */
export const sides: Record<SideKey, Side> = {
  events: {
    key: "events",
    label: "Event Management",
    tag: "Events",
    href: "/event-management",
    audience: "For producers, venues and companies",
    links: [
      { label: "Services", href: "/event-management#em-services" },
      { label: "Budget", href: "/event-management#budget-calculator" },
      { label: "Event Types", href: "/event-management#event-guide" },
      { label: "FAQs", href: "/event-management#em-faq" },
    ],
    cta: { label: "Plan Your Event", href: "/event-management#event-guide" },
    crossover: { label: "Looking for tickets?", href: "/ticket-resale" },
  },
  tickets: {
    key: "tickets",
    label: "Tickets",
    tag: "Tickets",
    href: "/ticket-resale",
    audience: "For fans and ticket buyers",
    links: [
      { label: "Browse Events", href: "/ticket-resale#suggested" },
      { label: "TP Elite", href: "/ticket-resale#tp-elite" },
      { label: "FAQs", href: "/ticket-resale#tr-faq" },
    ],
    cta: { label: "Find Tickets", href: "/ticket-resale#suggested" },
    crossover: { label: "Planning an event?", href: "/event-management" },
  },
};

/** Which side a pathname belongs to, or `null` for the landing page and shared routes. */
export function sideFor(pathname: string): SideKey | null {
  if (pathname.startsWith(sides.events.href)) return "events";
  if (pathname.startsWith(sides.tickets.href)) return "tickets";
  return null;
}

export type ServiceItem = {
  title: string;
  body: string;
};

export const eventManagement = {
  index: "01",
  headline: "Event Management",
  description:
    "Staffing, venue mapping, and a ticketing platform built for the room, not a template.",
  items: [
    {
      title: "Event Staffing",
      body: "On-site crews who know how a room actually runs, from doors to load-out.",
    },
    {
      title: "Venue Mapping & Custom Ticketing Platform",
      body: "Seating charts and a ticketing platform built around the venue.",
    },
    {
      title: "Consulting",
      body: "Planning and strategy for producers who want a second set of expert eyes.",
    },
  ] satisfies ServiceItem[],
  cta: "Explore Event Management",
  href: "/event-management",
  /**
   * The homepage floor-plan story: each step owns a slice of the section's
   * scroll progress, starting at `at`. The caption sits under the plan while
   * that step is current.
   */
  steps: [
    {
      at: 0,
      title: "Discovery",
      body: "We learn what you want guests to feel and remember.",
      caption: "Your brief: a gala dinner on the waterfront",
    },
    {
      at: 0.22,
      title: "Design",
      body: "Layout, stage, colours and flow, shaped around your brief.",
      caption: "Design: layout, stage and colour palette",
    },
    {
      at: 0.45,
      title: "Planning",
      body: "Seating, vendors and timelines, all handled by us.",
      caption: "Planning: tables placed, vendors booked",
    },
    {
      at: 0.7,
      title: "Delivery",
      body: "We run the day so you can be a guest at your own event.",
      caption: "Event day: lights up, every seat filled",
    },
  ],
};

export const ticketResale = {
  index: "02",
  headline: "Tickets",
  description:
    "Verified seats for concerts, sports and Broadway, on one platform built for the primary and secondary markets.",
  items: [
    {
      title: "Resale Platform",
      body: "Built for the primary and secondary markets alike — volume, trust, and control.",
    },
    {
      title: "Consulting",
      body: "Pricing, inventory, and resale strategy from people who've run the market.",
    },
  ] satisfies ServiceItem[],
  cta: "Find Tickets",
  href: "/ticket-resale",
};

export const tpElite = {
  index: "03",
  label: "By Invitation",
  headline: "TP Elite",
  description: "Concierge access for people who live for live events.",
  boxDescription:
    "High-end concierge access for people who live for live events.",
  body: "Some clients don't need an event managed — they need a seat, a table, or a suite handled quietly and well. TP Elite is the line we pick up first.",
  items: [
    {
      title: "Priority Access",
      body: "Priority access to sold-out events, front-of-line seating, and hard-to-get tables.",
    },
    {
      title: "Dedicated Line",
      body: "A dedicated line for last-minute requests, group plans, and travel around the show.",
    },
  ] satisfies ServiceItem[],
  /** The two items above, exploded into the short access points the peak section lists individually. */
  bullets: [
    "Priority access to sold-out events",
    "Front-of-line seating",
    "Hard-to-get tables",
    "Last-minute requests",
    "Group plans",
    "Travel around the show",
  ],
};

export const pullQuote = "Every seat has a story. We make sure it gets told right.";

export const whyChoose = {
  label: "Why Ticket Producer",
  headline: "Built for the details others overlook.",
  reasons: [
    { title: "Experience", body: "10+ years producing live events." },
    {
      title: "Control",
      body: "Systems built around the room rather than generic templates.",
    },
    { title: "Strategy", body: "Expert thinking across production and resale." },
    {
      title: "Access",
      body: "A private concierge line for clients who require more.",
    },
  ],
};

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "What does Ticket Producer do?",
    answer:
      "Two things. Event management for the people putting an event on — staffing, venue mapping, a custom ticketing platform and consulting. And tickets for the people going — verified resale seats for concerts, sports and Broadway, plus TP Elite, a private concierge line.",
  },
  {
    question: "Which side of the site is for me?",
    answer:
      "If you are producing, hosting or running an event, start with Event Management. If you want a seat at one, start with Tickets. Each has its own pages, FAQs and contact path, and you can switch between them from the menu at any time.",
  },
  {
    question: "What is included in Event Management?",
    answer:
      "Event staffing from doors through load-out, venue mapping with a ticketing platform built around the room, and consulting for producers who want a second set of expert eyes.",
  },
  {
    question: "How does buying tickets work?",
    answer:
      "Find the event, pick a seat tier, and check out. Every listing is verified before it goes live and again before transfer, so what you buy is what gets scanned at the door.",
  },
  {
    question: "How does someone request TP Elite access?",
    answer:
      "By phone. Introductions and requests are taken directly on our line — there is no online checkout for TP Elite.",
  },
];
