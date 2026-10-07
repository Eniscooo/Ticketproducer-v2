/** Single source of truth for brand copy and contact details. */
export const site = {
  name: "Ticket Producer",
  tagline: "Live events, produced properly",
  eyebrow: ["New York", "Live Events", "Ticketing", "Resale", "Private Access"],
  credibility: "10+ years producing live events, based in New York.",
  description:
    "Ticket Producer runs the systems behind live events ",
  contact: {
    phone: "1-800-809-0443",
    phoneHref: "tel:+18008090443",
    email: "Admin@ticketproducer.com",
    addressLines: ["1650 Broadway, Suite 1010", "New York, NY 10019"],
  },
  nav: [
    { label: "Event Management", href: "/event-management" },
    { label: "Ticket Resale", href: "/ticket-resale" },
    { label: "TP Elite", href: "/services#tp-elite" },
    { label: "FAQs", href: "/services#faq" },
    { label: "Contact", href: "/services#contact" },
  ],
  /** The three core services, standalone — the desktop navbar and the footer's Services column both point here rather than filtering the full nav each time. */
  services: [
    { label: "Event Management", href: "/event-management" },
    { label: "Ticket Resale", href: "/ticket-resale" },
    { label: "TP Elite", href: "/services#tp-elite" },
  ],
  company: [
    { label: "FAQs", href: "/services#faq" },
    { label: "Contact", href: "/services#contact" },
    { label: "Sign In", href: "/sign-in" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
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
  headline: "Ticket Resale Services",
  description:
    "One platform for primary and secondary market resale, backed by real strategy.",
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
  cta: "Explore Ticket Resale",
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

/** The five posters that gather into a fan over the pull quote, left to right. */
export const pullQuotePosters = [
  "/DRAKE.jpg",
  "/kendrick.jpg",
  "/CHASE.jpg",
  "/giannis.jpg",
  "/bts.jpg",
] as const;

/**
 * NOTE: Placeholder figures for layout — every number here needs to be
 * swapped for the real one before this goes live.
 */
export const stats = [
  { value: 500, suffix: "+", label: "Events Produced" },
  { value: 50, suffix: "K+", label: "Tickets Moved" },
  { value: 10, suffix: "+", label: "Years in Business" },
  { value: 98, suffix: "%", label: "Client Retention" },
] as const;

export type Stat = (typeof stats)[number];

export type Partner = {
  name: string;
  src: string;
  /** Intrinsic size of the asset in public/logos, for a stable aspect box. */
  width: number;
  height: number;
  /**
   * Rendered mark height, relative to the plate's own font size so one
   * breakpoint knob scales the whole row. Tuned per logo rather than shared:
   * a stacked lockup or a boxed mark needs more height than a single-line
   * wordmark to carry the same optical weight.
   */
  em: number;
  /**
   * The artwork carries its own dark plate with light lettering. On the dark
   * band these are knocked out by brightness — plate dropped, lettering kept —
   * where the rest, dark marks on transparency, are simply turned white.
   */
  knockout?: boolean;
};

/**
 * Marketplaces the resale desk lists and moves inventory across, shown as
 * their own marks. Each `src` is a cleaned, tight-cropped copy of the supplied
 * brand file — see the NOTE in components/site/trusted-partners.tsx for what
 * was done to each one and why. AXS and TickPick are absent deliberately:
 * there is no asset for either, and a typeset stand-in next to six real marks
 * reads as a missing image rather than a design choice.
 */
export const trustedPartners: readonly Partner[] = [
  { name: "StubHub", src: "/logos/stubhub-mark.png", width: 793, height: 361, em: 2.375, knockout: true },
  { name: "Ticketmaster", src: "/logos/ticketmaster-mark.png", width: 794, height: 114, em: 1.125 },
  { name: "SeatGeek", src: "/logos/seatgeek-mark.png", width: 550, height: 390, em: 2.125 },
  { name: "Vivid Seats", src: "/logos/vivid-seats-mark.png", width: 540, height: 102, em: 1.1875 },
  { name: "Eventbrite", src: "/logos/eventbrite-mark.png", width: 534, height: 94, em: 1.1875 },
  { name: "Gametime", src: "/logos/gametime-mark.png", width: 495, height: 128, em: 2, knockout: true },
];

export const whatWeDo = {
  label: "What We Do",
  headline: "What Ticket-Producer Handles",
  description:
    "Ticket Producer runs three disciplines under one roof: the event management systems that build the room, the resale desk that moves the seat, and a private concierge line for the people who never miss a show.",
};

export type ServiceBox = {
  index: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
  /** TP Elite only — flags the invite-only treatment instead of a normal CTA. */
  invite?: boolean;
};

export const serviceBoxes: ServiceBox[] = [
  {
    index: eventManagement.index,
    title: eventManagement.headline,
    description: eventManagement.description,
    image: "/event.png",
    cta: eventManagement.cta,
    href: eventManagement.href,
  },
  {
    index: ticketResale.index,
    title: ticketResale.headline,
    description: ticketResale.description,
    image: "/resale.jpg",
    cta: ticketResale.cta,
    href: ticketResale.href,
  },
  {
    index: tpElite.index,
    title: tpElite.headline,
    description: tpElite.boxDescription,
    image: "/reserved.jpg",
    cta: "Discover TP Elite",
    href: "#tp-elite",
    invite: true,
  },
];

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

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /**
   * Client portrait in public/reviews. Optional: the featured carousel only
   * cycles testimonials that have one, and the scrolling column falls back to
   * an initials avatar — so a quote never has to borrow someone else's face.
   */
  image?: string;
  /**
   * Cover crop for the wide featured card. Each portrait is framed by hand:
   * the quote sits over a scrim along the bottom edge, so the face has to ride
   * high in the frame.
   */
  imageClass?: string;
  /**
   * Head crop for the 48px round avatar. These are half-body frames, so a
   * plain cover fit leaves the face tiny and high in the circle — the zoom and
   * offset pull it back to the middle.
   */
  avatarClass?: string;
};

/**
 * NOTE: Illustrative placeholder testimonials for layout — replace with real,
 * attributed client quotes (and real photography) before this goes live.
 * Names are initials-style and organizations are generic on purpose, so
 * nothing here reads as a claim about a specific real person or company.
 * Images reuse the venue photography already sitting in /public.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "They mapped the room before they mapped the seats. Doors were clean, load-out was clean — nobody upstairs ever knew how close it came to going sideways.",
    name: "R. Whitfield",
    role: "Talent Buyer, Independent Promotion",
    image: "/reviews/reviews1.jpg",
    imageClass: "object-[48%_24%]",
    avatarClass: "object-[48%_12%] scale-[1.6]",
  },
  {
    quote:
      "We handed them the resale side and stopped thinking about it. Volume went up, disputes went down, and the pricing calls were always right.",
    name: "M. Alvarez",
    role: "Venue Operations Director",
    image: "/reviews/reviews2.jpg",
    imageClass: "object-[48%_50%]",
    avatarClass: "object-[46%_50%] scale-[1.75] translate-y-[36%]",
  },
  {
    quote:
      "TP Elite got us into a room that was supposedly full an hour before doors. One call. That's the whole pitch, and it's true.",
    name: "S. Lindqvist",
    role: "Private Client, TP Elite",
    image: "/reviews/reviews3.jpg",
    imageClass: "object-[50%_40%]",
    avatarClass: "object-[50%_38%] scale-[1.95]",
  },
  {
    quote:
      "Consulting wasn't a deck. It was people who've actually run a box office telling us what would break in week three.",
    name: "J. Okafor",
    role: "Producer, Touring Production",
  },
  {
    quote:
      "Custom platform, custom seating chart, no templated nonsense. It looked like our venue because it was built for our venue.",
    name: "D. Marsh",
    role: "General Manager, Concert Hall",
  },
];

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "What does Ticket Producer do?",
    answer:
      "We run three disciplines for live events: event management (staffing, venue mapping, and a custom ticketing platform), ticket resale services across the primary and secondary markets, and TP Elite, a private concierge line for priority access.",
  },
  {
    question: "What is included in Event Management?",
    answer:
      "Event staffing from doors through load-out, venue mapping with a ticketing platform built around the room, and consulting for producers who want a second set of expert eyes.",
  },
  {
    question: "How does Ticket Resale Services work?",
    answer:
      "One platform covers primary and secondary market resale, paired with consulting on pricing, inventory, and resale strategy from people who've run the market.",
  },
 
  
  {
    question: "How does someone request TP Elite access?",
    answer:
      "By phone. Introductions and requests are taken directly on the line below — there is no online checkout for TP Elite.",
  },
  {
    question: "Does Ticket Producer work with producers and venues?",
    answer:
      "Yes. Event management and resale consulting are both built for producers and venues directly, alongside the individual clients TP Elite serves.",
  },
 
];
