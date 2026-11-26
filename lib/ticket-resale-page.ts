import { Drama, Hourglass, Music, Users, type LucideIcon } from "lucide-react";

/**
 * The ticket catalogue: Broadway only, every show real and verified as playing
 * in New York (Playbill's "Now on Broadway" list, cross-checked with
 * Broadway.com and each show's site, late November 2026 — sources per show are
 * in the research notes, and the official site is linked on each event page).
 *
 * What is real: the show, its theatre and address, its kind, its weekly
 * performance schedule, running time, age guidance and run dates. Each listing's
 * date and curtain time is a real performance taken from that schedule.
 *
 * What is NOT real yet: prices and tiers. `startingPrice` and the tier prices
 * are sample figures until a live inventory feed replaces them — resale prices
 * can only come from real listings. Swap `resaleEvents` for the feed; every
 * component reads this shape.
 *
 * Images are openly licensed photographs of each show's marquee or house
 * (credited in PHOTO-CREDITS.md and on /credits) — never official key art,
 * which belongs to the productions.
 */

export const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const trHero = {
  headline: "Find your next event.",
  body: "Verified tickets for every show on Broadway — without the markup games.",
  searchPlaceholder: "Search shows or theatres",
};

export type NavCategory = {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
  subcategories?: string[];
};

export const navCategories: NavCategory[] = [
  { key: "musicals", label: "Musicals", icon: Music, href: "#musicals" },
  { key: "plays", label: "Plays", icon: Drama, href: "#plays" },
  { key: "family", label: "Family", icon: Users, href: "#family" },
  { key: "last-chance", label: "Last chance", icon: Hourglass, href: "#last-chance" },
];

export type TicketTier = {
  name: string;
  price: number;
  availability: "Available" | "Limited" | "Almost gone";
};

export type ShowKind = "Musical" | "Play" | "Holiday";

export type ResaleEvent = {
  slug: string;
  name: string;
  /** One real performance from the show's schedule, e.g. "Fri, Dec 4, 2026". */
  date: string;
  /** Curtain time of that performance. */
  time: string;
  venue: string;
  /** Street address of the theatre. */
  address: string;
  city: string;
  category: ShowKind;
  image: string;
  imagePosition: string;
  /** SAMPLE until a live inventory feed is connected. */
  startingPrice: number;
  tiers: TicketTier[];
  /** The published weekly schedule. */
  schedule: string;
  runningTime: string;
  ageGuidance: string;
  description: string;
  /** Closing date or limited-run note, when there is one. */
  runNote?: string;
  officialUrl?: string;
};

type TierPreset = { name: string; multiplier: number; availability: TicketTier["availability"] }[];

const BROADWAY_TIERS: TierPreset = [
  { name: "Rear Mezzanine", multiplier: 1, availability: "Available" },
  { name: "Orchestra", multiplier: 1.7, availability: "Limited" },
  { name: "Front Row Orchestra", multiplier: 2.8, availability: "Almost gone" },
];

/* Radio City's own seating names. */
const RADIO_CITY_TIERS: TierPreset = [
  { name: "Third Mezzanine", multiplier: 1, availability: "Available" },
  { name: "First Mezzanine", multiplier: 1.6, availability: "Limited" },
  { name: "Orchestra", multiplier: 2.3, availability: "Almost gone" },
];

function tiersFor(category: ShowKind, startingPrice: number): TicketTier[] {
  const preset = category === "Holiday" ? RADIO_CITY_TIERS : BROADWAY_TIERS;
  return preset.map((tier) => ({
    name: tier.name,
    price: Math.round(startingPrice * tier.multiplier),
    availability: tier.availability,
  }));
}

/**
 * Listing artwork, in one place so HD replacements land here and nowhere else.
 * Every file is openly licensed and credited (PHOTO-CREDITS.md, /credits).
 */
const IMAGES: Record<string, { src: string; position: string }> = {
  chicago: { src: "/broadway/chicago.jpg", position: "object-[50%_35%]" },
  "the-great-gatsby": { src: "/bgre.jpg", position: "object-[50%_40%]" },
  "radio-city-christmas-spectacular": { src: "/nyc/marquee-radio-city.jpg", position: "object-[35%_40%]" },
  "oh-mary": { src: "/nyc/times-square.jpg", position: "object-[50%_40%]" },
  wicked: { src: "/broadway/wicked.jpg", position: "object-[50%_35%]" },
  hamilton: { src: "/nyc/marquee-hamilton.jpg", position: "object-[72%_35%]" },
  "the-lion-king": { src: "/broadway/lion-king.jpg", position: "object-[50%_35%]" },
  aladdin: { src: "/broadway/aladdin.jpg", position: "object-[50%_35%]" },
  hadestown: { src: "/broadway/hadestown.jpg", position: "object-[50%_35%]" },
  "the-book-of-mormon": { src: "/broadway/book-of-mormon.jpg", position: "object-[50%_35%]" },
  "mj-the-musical": { src: "/nyc/times-square.jpg", position: "object-[30%_45%]" },
  "harry-potter-and-the-cursed-child": { src: "/nyc/met-opera-interior.jpg", position: "object-[50%_50%]" },
  "maybe-happy-ending": { src: "/nyc/skyline-midtown.jpg", position: "object-[50%_50%]" },
  "the-outsiders": { src: "/broadway/richard-rodgers.jpg", position: "object-[50%_40%]" },
  "just-in-time": { src: "/nyc/met-opera-balcony.jpg", position: "object-[50%_50%]" },
  "operation-mincemeat": { src: "/broadway/times-square.jpg", position: "object-[50%_40%]" },
  six: { src: "/broadway/hadestown-stage.jpg", position: "object-[50%_45%]" },
};

type RawEvent = Omit<ResaleEvent, "tiers" | "image" | "imagePosition" | "city">;

const NY = "New York, NY";

const RAW_EVENTS: RawEvent[] = [
  {
    slug: "chicago",
    name: "Chicago",
    date: "Fri, Dec 4, 2026",
    time: "8:00 PM",
    venue: "Ambassador Theatre",
    address: "219 West 49th Street, New York, NY 10019",
    category: "Musical",
    startingPrice: 89,
    schedule: "Mon, Tue & Thu 7pm · Fri 8pm · Sat 2:30pm & 8pm · Sun 2pm & 7pm",
    runningTime: "2h 30m, one intermission",
    ageGuidance: "May be inappropriate for 12 and under; under 4 not admitted",
    description: "Kander and Ebb's jazz-age musical about two murderesses in 1920s Chicago who turn their crimes into tabloid fame.",
    officialUrl: "https://chicagothemusical.com/",
  },
  {
    slug: "the-great-gatsby",
    name: "The Great Gatsby",
    date: "Sat, Dec 5, 2026",
    time: "8:00 PM",
    venue: "Broadway Theatre",
    address: "1681 Broadway, New York, NY 10019",
    category: "Musical",
    startingPrice: 99,
    schedule: "Mon & Wed 7pm · Thu 2pm & 8pm · Fri 7pm · Sat 2pm & 8pm · Sun 3pm",
    runningTime: "About 2h 30m, one intermission",
    ageGuidance: "Recommended 10+; under 4 not admitted",
    description: "A musical of F. Scott Fitzgerald's novel about the mysterious Jay Gatsby and his longing for Daisy Buchanan on 1920s Long Island.",
  },
  {
    slug: "radio-city-christmas-spectacular",
    name: "Christmas Spectacular Starring the Radio City Rockettes",
    date: "Sat, Dec 12, 2026",
    time: "Several shows daily",
    venue: "Radio City Music Hall",
    address: "1260 Avenue of the Americas, New York, NY 10020",
    category: "Holiday",
    startingPrice: 79,
    schedule: "Daily, up to four shows a day through the season — exact times on the Rockettes calendar",
    runningTime: "90 minutes, no intermission",
    ageGuidance: "All ages; under 2 free on a guardian's lap",
    description: "Radio City's annual holiday revue with the Rockettes — ten Rockettes numbers this season, including a new one.",
    runNote: "Season runs Nov 4, 2026 – Jan 4, 2027",
    officialUrl: "https://www.rockettes.com/christmas/",
  },
  {
    slug: "oh-mary",
    name: "Oh, Mary!",
    date: "Fri, Dec 11, 2026",
    time: "7:30 PM",
    venue: "Lyceum Theatre",
    address: "149 West 45th Street, New York, NY 10036",
    category: "Play",
    startingPrice: 109,
    schedule: "Tue–Fri 7:30pm · Sat 5pm & 8:30pm · Sun 3pm & 6:30pm",
    runningTime: "80 minutes, no intermission",
    ageGuidance: "Recommended 14+; under 4 not admitted",
    description: "Cole Escola's comedy imagining Mary Todd Lincoln as a frustrated would-be cabaret star in the days before Lincoln's assassination.",
    runNote: "Playing through July 10, 2027",
    officialUrl: "https://www.ohmaryplay.com/",
  },
  {
    slug: "wicked",
    name: "Wicked",
    date: "Sat, Dec 12, 2026",
    time: "2:00 PM",
    venue: "Gershwin Theatre",
    address: "222 West 51st Street, New York, NY 10019",
    category: "Musical",
    startingPrice: 119,
    schedule: "Tue–Fri 7pm · Sat 2pm & 8pm · Sun 2pm & 7pm",
    runningTime: "2h 45m, one intermission",
    ageGuidance: "Recommended 8+; under 5 not admitted",
    description: "The untold story of the witches of Oz, following the unlikely friendship between green-skinned Elphaba and popular Glinda.",
    officialUrl: "https://wickedthemusical.com/",
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    date: "Fri, Dec 18, 2026",
    time: "7:00 PM",
    venue: "Richard Rodgers Theatre",
    address: "226 West 46th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 159,
    schedule: "Tue–Fri 7pm · Sat 1pm & 7pm · Sun 1pm & 7pm",
    runningTime: "2h 45m, one intermission",
    ageGuidance: "Recommended 10+",
    description: "Lin-Manuel Miranda's hip-hop-infused musical biography of founding father Alexander Hamilton.",
    officialUrl: "https://hamiltonmusical.com/new-york/",
  },
  {
    slug: "the-lion-king",
    name: "The Lion King",
    date: "Sun, Dec 6, 2026",
    time: "1:00 PM",
    venue: "Minskoff Theatre",
    address: "200 West 45th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 129,
    schedule: "Tue–Fri 7pm · Sat 2pm & 7:30pm · Sun 1pm & 6:30pm",
    runningTime: "2h 30m, one intermission",
    ageGuidance: "Recommended 6+; under 2 not admitted",
    description: "Disney's stage adaptation of the animated film about the lion cub Simba's journey to claim his place as king.",
  },
  {
    slug: "aladdin",
    name: "Aladdin",
    date: "Wed, Dec 9, 2026",
    time: "1:00 PM",
    venue: "New Amsterdam Theatre",
    address: "214 West 42nd Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 99,
    schedule: "Tue 7pm · Wed 1pm · Thu & Fri 7pm · Sat 2pm & 7:30pm · Sun 1pm & 6:30pm",
    runningTime: "2h 30m, one intermission",
    ageGuidance: "Recommended 6+; everyone needs a ticket",
    description: "Disney's musical about a street-smart young man in Agrabah whose life changes when he frees a wish-granting Genie.",
  },
  {
    slug: "hadestown",
    name: "Hadestown",
    date: "Sat, Dec 19, 2026",
    time: "7:30 PM",
    venue: "Walter Kerr Theatre",
    address: "219 West 48th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 109,
    schedule: "Tue–Fri 7pm · Sat 2pm & 7:30pm · Sun 2pm & 7:30pm",
    runningTime: "2h 30m, one intermission",
    ageGuidance: "Recommended 8+; under 5 not admitted",
    description: "Anaïs Mitchell's folk-and-jazz retelling of the myths of Orpheus and Eurydice, and of Hades and Persephone.",
    officialUrl: "https://www.hadestown.com/",
  },
  {
    slug: "the-book-of-mormon",
    name: "The Book of Mormon",
    date: "Thu, Dec 10, 2026",
    time: "7:00 PM",
    venue: "Eugene O'Neill Theatre",
    address: "230 West 49th Street, New York, NY 10019",
    category: "Musical",
    startingPrice: 99,
    schedule: "Tue–Fri 7pm · Sat 2pm & 7pm · Sun 2pm & 7pm",
    runningTime: "About 2h 30m, one intermission",
    ageGuidance: "Adult themes and explicit language; under 4 not admitted",
    description: "The satirical musical comedy from the South Park creators and Robert Lopez about two young missionaries sent to Uganda.",
    officialUrl: "https://bookofmormonbroadway.com/",
  },
  {
    slug: "mj-the-musical",
    name: "MJ the Musical",
    date: "Wed, Dec 16, 2026",
    time: "7:00 PM",
    venue: "Neil Simon Theatre",
    address: "250 West 52nd Street, New York, NY 10019",
    category: "Musical",
    startingPrice: 119,
    schedule: "Tue 7pm · Wed 1pm & 7pm · Thu & Fri 7pm · Sat 2pm & 8pm · Sun 3pm",
    runningTime: "2h 30m, one intermission",
    ageGuidance: "Recommended 8+",
    description: "A musical built around Michael Jackson's songs, following the making of his 1992 Dangerous world tour.",
    officialUrl: "https://mjthemusical.com/",
  },
  {
    slug: "harry-potter-and-the-cursed-child",
    name: "Harry Potter and the Cursed Child",
    date: "Sat, Dec 19, 2026",
    time: "2:00 PM",
    venue: "Lyric Theatre",
    address: "214 West 43rd Street, New York, NY 10036",
    category: "Play",
    startingPrice: 89,
    schedule: "Tue–Fri 7pm · Sat 2pm & 8pm · Sun 1pm & 7pm",
    runningTime: "2h 55m, one intermission",
    ageGuidance: "Recommended 8+; under 5 not admitted",
    description: "The stage sequel set nineteen years after the final book, following an adult Harry Potter and his son Albus.",
    officialUrl: "https://broadway.harrypottertheplay.com/",
  },
  {
    slug: "maybe-happy-ending",
    name: "Maybe Happy Ending",
    date: "Sun, Dec 13, 2026",
    time: "2:00 PM",
    venue: "Belasco Theatre",
    address: "111 West 44th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 99,
    schedule: "Tue 7pm · Wed 2pm & 7pm · Thu & Fri 7pm · Sat 2pm & 7pm · Sun 2pm",
    runningTime: "About 1h 40m, no intermission",
    ageGuidance: "Recommended 8+; under 4 not admitted",
    description: "The Tony-winning Best Musical about two retired helper robots in near-future Seoul who form an unexpected bond.",
  },
  {
    slug: "the-outsiders",
    name: "The Outsiders",
    date: "Fri, Dec 11, 2026",
    time: "7:00 PM",
    venue: "Bernard B. Jacobs Theatre",
    address: "242 West 45th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 89,
    schedule: "Tue 7pm · Wed 2pm · Thu 1pm & 7pm · Fri 7pm · Sat 2pm & 8pm · Sun 3pm",
    runningTime: "2h 25m, one intermission",
    ageGuidance: "Recommended 10+; under 4 not admitted",
    description: "The Tony-winning musical of S.E. Hinton's novel about rival teenage gangs, the Greasers and the Socs, in 1960s Tulsa.",
    officialUrl: "https://www.outsidersmusical.com/",
  },
  {
    slug: "just-in-time",
    name: "Just in Time",
    date: "Sat, Jan 9, 2027",
    time: "8:00 PM",
    venue: "Circle in the Square Theatre",
    address: "235 West 50th Street, New York, NY 10019",
    category: "Musical",
    startingPrice: 109,
    schedule: "Tue 7pm · Wed 2pm · Thu 1pm & 7pm · Fri 8pm · Sat 2pm & 8pm · Sun 3pm",
    runningTime: "About 2h 15m, one intermission",
    ageGuidance: "Recommended 10+",
    description: "A nightclub-style musical about the life and music of 1950s and '60s pop singer Bobby Darin.",
    officialUrl: "https://justintimebroadway.com/",
  },
  {
    slug: "operation-mincemeat",
    name: "Operation Mincemeat",
    date: "Sun, Jan 10, 2027",
    time: "2:00 PM",
    venue: "John Golden Theatre",
    address: "252 West 45th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 89,
    schedule: "Tue 7pm · Wed 2pm · Thu 7pm · Fri 7:30pm · Sat 2pm & 7:30pm · Sun 2pm & 7:30pm",
    runningTime: "About 2h 35m, one intermission",
    ageGuidance: "Recommended 5+; under 4 not admitted",
    description: "The Olivier-winning musical comedy about the real wartime plan to fool the Nazis with a corpse carrying fake invasion papers.",
    runNote: "Limited run through July 4, 2027",
    officialUrl: "https://operationbroadway.com/",
  },
  {
    slug: "six",
    name: "SIX: The Musical",
    date: "Sun, Dec 20, 2026",
    time: "7:00 PM",
    venue: "Lena Horne Theatre",
    address: "256 West 47th Street, New York, NY 10036",
    category: "Musical",
    startingPrice: 79,
    schedule: "Mon 7pm · Wed–Fri 7pm · Sat 3pm & 8pm · Sun 2pm & 7pm",
    runningTime: "80 minutes, no intermission",
    ageGuidance: "Recommended 10+",
    description: "A pop-concert musical in which the six wives of Henry VIII take the mic to retell their own stories.",
    runNote: "Final performance Jan 3, 2027",
    officialUrl: "https://www.sixonbroadway.com/",
  },
];

export const resaleEvents: ResaleEvent[] = RAW_EVENTS.map((event) => ({
  ...event,
  city: NY,
  image: IMAGES[event.slug].src,
  imagePosition: IMAGES[event.slug].position,
  tiers: tiersFor(event.category, event.startingPrice),
}));

/** "Popular events" — the row the Tickets page opens on, in this order. */
export const popularSlugs = [
  "chicago",
  "the-great-gatsby",
  "radio-city-christmas-spectacular",
  "oh-mary",
  "wicked",
];

export type EventRail = {
  id: string;
  title: string;
  subtitle?: string;
  slugs: string[];
  /** "feature" runs two wide landscape banners across instead of a row of square tiles. */
  variant?: "tile" | "feature";
};

export const eventRails: EventRail[] = [
  {
    id: "musicals",
    title: "Musicals",
    slugs: [
      "wicked",
      "hamilton",
      "the-great-gatsby",
      "chicago",
      "the-lion-king",
      "hadestown",
      "mj-the-musical",
      "maybe-happy-ending",
      "the-outsiders",
      "the-book-of-mormon",
      "aladdin",
      "just-in-time",
      "operation-mincemeat",
      "six",
    ],
  },
  {
    id: "plays",
    title: "Plays",
    slugs: ["oh-mary", "harry-potter-and-the-cursed-child"],
    variant: "feature",
  },
  {
    id: "family",
    title: "Family",
    subtitle: "Recommended for ages 6 and up, or all ages.",
    slugs: ["radio-city-christmas-spectacular", "the-lion-king", "aladdin", "operation-mincemeat"],
  },
  {
    id: "last-chance",
    title: "Last chance",
    subtitle: "Closing dates and limited runs.",
    slugs: ["six", "radio-city-christmas-spectacular", "operation-mincemeat"],
  },
];

/**
 * "Popular on Broadway": quick links to the shows people ask for most, each
 * cropped into a circle from its listing artwork.
 */
const fave = (name: string, slug: string) => ({
  name,
  image: IMAGES[slug].src,
  position: IMAGES[slug].position,
  href: `/ticket-resale/${slug}`,
});

export const faves = [
  fave("Chicago", "chicago"),
  fave("The Great Gatsby", "the-great-gatsby"),
  fave("Rockettes", "radio-city-christmas-spectacular"),
  fave("Oh, Mary!", "oh-mary"),
  fave("Wicked", "wicked"),
  fave("Hamilton", "hamilton"),
  fave("The Lion King", "the-lion-king"),
  fave("Hadestown", "hadestown"),
  fave("MJ", "mj-the-musical"),
  fave("Harry Potter", "harry-potter-and-the-cursed-child"),
  fave("Aladdin", "aladdin"),
];

export const trFaq = [
  {
    question: "How does ticket resale work?",
    answer:
      "Sellers list tickets they already hold for an event. We verify the listing, move it through our platform, and transfer it to you before the event — the seat is real and reserved the moment your order goes through.",
  },
  {
    question: "Are resale tickets verified?",
    answer:
      "Yes. Every listing is checked against the venue's system before it goes live, and again before transfer, so what you buy matches what gets scanned at the door.",
  },
  {
    question: "When will I receive my tickets?",
    answer:
      "Most transfers land in your account within minutes of purchase. Mobile transfers for some venues only unlock closer to the event date — we'll tell you which at checkout.",
  },
  {
    question: "Can I choose my exact seats?",
    answer:
      "Yes — the ticket tiers on each event page break down section and row where the venue provides it, so you can see what you're buying before you commit.",
  },
  {
    question: "What happens if an event is cancelled?",
    answer:
      "You're refunded in full. Postponed events roll your tickets over to the new date automatically, and we'll email you either way.",
  },
  {
    question: "Can I resell a ticket I purchased?",
    answer:
      "Yes, once it's transferred to your account. List it from your order history and we'll handle verification the same way we did for your original purchase.",
  },
  {
    question: "How are ticket prices determined?",
    answer:
      "Sellers set their own asking price and it moves with demand, the same way any resale market works. We show the starting price for each event upfront so there's no surprise at checkout.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Major credit and debit cards today, with more options on the way. Every transaction is encrypted end to end.",
  },
];

export const trFinalCta = {
  headlineTop: "Your next night out",
  headlineBottom: "starts here.",
  body: "Find the event. Choose your seats. Make the night yours.",
  cta: { label: "Explore Events", href: "#suggested" },
};

/**
 * Which seat map an event gets. Sports sit around a court; everything else
 * faces a stage, and the tier presets are already ordered cheapest-to-closest
 * in both cases, so the map can read the seating order straight off the tiers.
 */
export const seatLayoutFor = (category: string): "arena" | "stage" =>
  category === "Sports" ? "arena" : "stage";

/** "Musical" -> "Musicals", for headings like "More Musicals". */
export const categoryPlural = (category: string) =>
  category === "Holiday" ? "Holiday shows" : `${category}s`;

export const trSubscribe = {
  label: "Stay in the loop",
  headline: "Know before it sells out.",
  body: "One email when tickets drop for the shows you follow — plus price moves on events you've viewed. No daily blasts.",
  placeholder: "you@email.com",
  cta: "Subscribe",
  note: "Unsubscribe in one click. We never sell your address.",
};

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "Sat, Jun 13, 2026" -> "2026-06-13". One parser for the whole route, so the
 * calendar and the filter agree on what day an event falls on. Returns null
 * rather than guessing if the catalogue's date shape ever changes.
 */
export function eventDateKey(date: string): string | null {
  const match = date.match(/([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;

  const month = MONTH_ABBR.indexOf(match[1]);
  if (month < 0) return null;

  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

/** Local-time key for a Date, matching `eventDateKey`'s shape without UTC drift. */
export const dateKeyOf = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

/** "2026-06-13" -> "Jun 13, 2026", for the filter pill's label. */
export function formatDateKey(key: string) {
  const [year, month, day] = key.split("-");
  return `${MONTH_ABBR[Number(month) - 1]} ${Number(day)}, ${year}`;
}
