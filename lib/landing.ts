/**
 * Content for the landing page's own sections. Brand-wide copy (contact,
 * the two sides, FAQ) stays in lib/site.ts; the hero reel lives in
 * lib/broadway-reel.ts.
 *
 * Nothing here is a statistic or a testimonial — v1's placeholders were cut on
 * purpose, and real ones should only come back once they can be sourced.
 */

export type PlaybillShow = {
  title: string;
  theatre: string;
  /** Portrait crop from /public/broadway, shown as the hover preview. */
  image: string;
  href: string;
};

const THEATER = "/ticket-resale#theater";

/**
 * The programme: Broadway's long-running anchors, in the order a visitor is
 * most likely to look for them. Confirm each is still running before launch —
 * the list is editorial, not pulled from live inventory.
 */
export const playbill: PlaybillShow[] = [
  { title: "Hamilton", theatre: "Richard Rodgers Theatre", image: "/broadway/hamilton.jpg", href: "/ticket-resale/hamilton" },
  { title: "The Lion King", theatre: "Minskoff Theatre", image: "/broadway/lion-king.jpg", href: THEATER },
  { title: "Wicked", theatre: "Gershwin Theatre", image: "/broadway/wicked.jpg", href: THEATER },
  { title: "Moulin Rouge!", theatre: "Al Hirschfeld Theatre", image: "/broadway/moulin-rouge-stage.jpg", href: THEATER },
  { title: "Aladdin", theatre: "New Amsterdam Theatre", image: "/broadway/aladdin.jpg", href: THEATER },
  { title: "Chicago", theatre: "Ambassador Theatre", image: "/broadway/chicago.jpg", href: THEATER },
  { title: "Hadestown", theatre: "Walter Kerr Theatre", image: "/broadway/hadestown-stage.jpg", href: THEATER },
  { title: "The Book of Mormon", theatre: "Eugene O'Neill Theatre", image: "/broadway/book-of-mormon.jpg", href: THEATER },
];

export type Door = {
  key: "tickets" | "events";
  audience: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const doors: Door[] = [
  {
    key: "tickets",
    audience: "For fans and theatregoers",
    title: "Get a seat.",
    body: "Verified tickets for Broadway's musicals, plays and holiday shows — checked before they're listed and again before they reach you.",
    points: ["Every show on Broadway", "Every listing verified twice", "TP Elite concierge for the hard-to-get"],
    cta: "Find tickets",
    href: "/ticket-resale",
    image: "/nyc/marquee-richard-rodgers.jpg",
    imageAlt: "The bulb-lit Richard Rodgers Theatre sign on West 46th Street",
  },
  {
    key: "events",
    audience: "For producers, venues and companies",
    title: "Put on a show.",
    body: "Staffing, venue mapping and a ticketing platform built around your room — run by people who've worked the door.",
    points: ["Event staffing, doors to load-out", "Venue mapping and custom ticketing", "Consulting before you commit"],
    cta: "Plan an event",
    href: "/event-management",
    image: "/nyc/met-opera-interior.jpg",
    imageAlt: "The gold-and-red auditorium of the Metropolitan Opera House",
  },
];

/** The event-management process, in four beats. */
export const eventProcess = [
  { title: "Discovery", body: "We learn the room, the audience and what the night has to feel like." },
  { title: "Design", body: "Layout, stage, seating and flow — drawn to the building in front of us." },
  { title: "Planning", body: "Vendors, staffing, ticketing and timelines, booked and confirmed." },
  { title: "Delivery", body: "We run the night so you can stand at the back and watch it land." },
];

/** What we hold ourselves to — stated plainly, no numbers we can't source. */
export const principles = [
  { title: "Built for the room", body: "Every map, crew and seating chart starts from the actual building — never a template." },
  { title: "Verified, every time", body: "Tickets are checked against the venue before listing and again before transfer." },
  { title: "A person on the line", body: "Call and someone who knows the shows picks up. TP Elite clients get a direct line." },
];
