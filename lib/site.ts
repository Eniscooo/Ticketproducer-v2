/** Single source of truth for brand copy and contact details. */
export const site = {
  name: "Ticket Producer",
  tagline: "Live events, produced properly",
  credibility: "10+ years producing live events, based in New York.",
  /** The landing hero's subtext, word for word from the brief. */
  intro:
    "Ticket Producer runs the systems behind live events — staffing, venue mapping, and the platform that sells the seat — plus the resale market on the other side, and a concierge line for people who never miss a show.",
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
    { label: "Ticket Resale", href: "/ticket-resale" },
    { label: "TP Elite", href: "/elite" },
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
  href: string;
  /** In-page links for this side's own nav. */
  links: readonly { label: string; href: string }[];
};

/**
 * The site is two businesses under one name: event management sells to the
 * people putting an event on, the ticket side sells to the people going to
 * one. Each gets its own section, nav, call to action and FAQ; the landing
 * page at `/` explains both and lets the visitor pick. The footer lists each
 * side's links in its own column.
 */
export const sides: Record<SideKey, Side> = {
  events: {
    key: "events",
    label: "Event Management",
    href: "/event-management",
    links: [
      { label: "Services", href: "/event-management#em-services" },
      { label: "Budget", href: "/event-management#budget-calculator" },
      { label: "Event Types", href: "/event-management#event-guide" },
      { label: "TP Elite", href: "/elite" },
      { label: "FAQs", href: "/event-management#em-faq" },
    ],
  },
  tickets: {
    key: "tickets",
    label: "Ticket Resale",
    href: "/ticket-resale",
    links: [
      { label: "Browse Events", href: "/ticket-resale#suggested" },
      { label: "TP Elite", href: "/elite" },
      { label: "FAQs", href: "/ticket-resale#tr-faq" },
    ],
  },
};

export type ServiceItem = {
  title: string;
  body: string;
};

export const eventManagement = {
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
};

export const ticketResale = {
  headline: "Ticket Resale Services",
  description: "One platform for primary and secondary market resale, backed by real strategy.",
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
};

export const tpElite = {
  label: "By Invitation",
  headline: "TP Elite",
  description: "Concierge access for people who never miss a show.",
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

/**
 * /elite membership tiers. Every feature here is one TP Elite already offers
 * (see `tpElite.bullets`) — nothing new is promised.
 *
 * PRICES: set `monthly` and `yearly` (per-month price when billed annually)
 * for each tier. While any is `null` the cards read "By invitation" (as the brief asks: not a generic pricing tier) and
 * the billing toggle is hidden; once all six are numbers, the toggle, the rolling
 * prices and the "save up to X%" line (computed from these numbers) switch on.
 */
export const eliteTiers = [
  {
    name: "Access",
    monthly: null,
    yearly: null,
    description: "For the shows you can't find a seat for.",
    features: ["Priority access to sold-out events", "Front-of-line seating"],
    cta: "Request access",
    href: "#request",
  },
  {
    name: "Concierge",
    monthly: null,
    yearly: null,
    description: "A direct line for the nights that need handling.",
    features: [
      "Everything in Access",
      "Hard-to-get tables",
      "A dedicated line",
      "Last-minute requests",
    ],
    cta: "Request access",
    href: "#request",
    isPopular: true,
  },
  {
    name: "Private",
    monthly: null,
    yearly: null,
    description: "The whole night, handled — for you and your guests.",
    features: ["Everything in Concierge", "Group plans", "Travel around the show"],
    cta: "Request access",
    href: "#request",
  },
] satisfies {
  name: string;
  monthly: number | null;
  yearly: number | null;
  description: string;
  features: string[];
  cta: string;
  href: string;
  isPopular?: boolean;
}[];

/** /elite: how a request becomes access. Stated as the business works today — by conversation, not checkout. */
export const eliteSteps = [
  {
    title: "Request",
    body: "Tell us who you are and what you're after — a show, a date, a table, a group. The form takes a minute; the line is faster.",
  },
  {
    title: "A call",
    body: "Someone from the line calls you back to talk it through. Access is confirmed on that call, not at a checkout.",
  },
  {
    title: "Handled",
    body: "From then on, requests go to your direct line — seats, tables, last-minute changes and the travel around the show.",
  },
];

export const eliteFaq: FaqItem[] = [
  {
    question: "What is TP Elite?",
    answer:
      "A concierge line for people who go to a lot of live events. Instead of searching listings, you tell us what you want and we handle it — seats, tables, group plans and the travel around the show.",
  },
  {
    question: "How do I get access?",
    answer:
      "By request. Send the form on this page or call the line; we call you back, talk it through, and confirm access on that call. There is no online checkout for TP Elite.",
  },
  {
    question: "Is it only for Broadway?",
    answer:
      "No. Members use it for Broadway and for other events across New York — the line is about having someone handle it, whatever the night is.",
  },
  {
    question: "Can I still buy tickets the normal way?",
    answer:
      "Yes. Every listing on the Tickets side stays open to everyone. TP Elite is for the requests a listing can't answer.",
  },
];

export const pullQuote ="Every seat has a story. We make sure it gets told right.";

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "What does Ticket Producer do?",
    answer:
      "Two things. Event management for the people putting an event on — staffing, venue mapping, a custom ticketing platform and consulting. And tickets for the people going — verified resale seats for Broadway shows, plus TP Elite, a private concierge line.",
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
