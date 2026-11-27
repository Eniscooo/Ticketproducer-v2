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

/**
 * The programme: Broadway's long-running anchors, in the order a visitor is
 * most likely to look for them — all verified as playing (November 2026), each
 * linking to its own listing. Editorial, not pulled from live inventory.
 */
export const playbill: PlaybillShow[] = [
  { title: "Hamilton", theatre: "Richard Rodgers Theatre", image: "/posters/hamilton.jpg", href: "/ticket-resale/hamilton" },
  { title: "The Lion King", theatre: "Minskoff Theatre", image: "/posters/the-lion-king.jpg", href: "/ticket-resale/the-lion-king" },
  { title: "Wicked", theatre: "Gershwin Theatre", image: "/posters/wicked.jpg", href: "/ticket-resale/wicked" },
  { title: "The Great Gatsby", theatre: "Broadway Theatre", image: "/posters/the-great-gatsby.jpg", href: "/ticket-resale/the-great-gatsby" },
  { title: "Aladdin", theatre: "New Amsterdam Theatre", image: "/posters/aladdin.png", href: "/ticket-resale/aladdin" },
  { title: "Chicago", theatre: "Ambassador Theatre", image: "/posters/chicago.jpg", href: "/ticket-resale/chicago" },
  { title: "Hadestown", theatre: "Walter Kerr Theatre", image: "/broadway/hadestown-stage.jpg", href: "/ticket-resale/hadestown" },
  { title: "The Book of Mormon", theatre: "Eugene O'Neill Theatre", image: "/posters/the-book-of-mormon.jpg", href: "/ticket-resale/the-book-of-mormon" },
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
