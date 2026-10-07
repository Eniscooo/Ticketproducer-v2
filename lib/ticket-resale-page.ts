import {
  Drama,
  Goal,
  Guitar,
  Music,
  MoreHorizontal,
  Volleyball,
  type LucideIcon,
} from "lucide-react";

/**
 * NOTE: Every event below is illustrative sample data for laying out the
 * marketplace — names, dates, prices, and tiers are not real inventory. Swap
 * `resaleEvents` for a real catalog/API response before this goes live; every
 * component here reads from this shape so that's the only file that needs to
 * change. Card imagery is reused from the site's existing venue/theater
 * photography (there is no dedicated arena/stadium photography yet) with
 * distinct crops per card — replace with real event photography first.
 */

export const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const trHero = {
  headline: "Find your next event.",
  body: "Verified tickets for concerts, sports, and theater — without the markup games.",
  searchPlaceholder: "Search events, artists, teams or venues",
};

export type NavCategory = {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
  subcategories?: string[];
};

export const navCategories: NavCategory[] = [
  {
    key: "basketball",
    label: "Basketball",
    icon: Volleyball,
    href: "#sports",
    subcategories: ["NBA", "NCAA", "WNBA", "Other Basketball"],
  },
  {
    key: "football",
    label: "Football",
    icon: Goal,
    href: "#sports",
    subcategories: ["NFL", "College Football", "International"],
  },
  {
    key: "concerts",
    label: "Concerts",
    icon: Music,
    href: "#popular-concerts",
    subcategories: ["Pop", "Hip-Hop", "R&B", "Afrobeats", "Rock", "Other Concerts"],
  },
  {
    key: "music",
    label: "Music",
    icon: Guitar,
    href: "#music",
  },
  {
    key: "theater",
    label: "Theater",
    icon: Drama,
    href: "#theater",
    subcategories: ["Broadway", "Musicals", "Plays", "Family Shows"],
  },
  {
    key: "more",
    label: "More",
    icon: MoreHorizontal,
    href: "#suggested",
    subcategories: ["Comedy", "Festivals", "Family"],
  },
];

export type TicketTier = {
  name: string;
  price: number;
  availability: "Available" | "Limited" | "Almost gone";
};

export type ResaleEvent = {
  slug: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  image: string;
  imagePosition: string;
  startingPrice: number;
  tiers: TicketTier[];
};

type TierPreset = { name: string; multiplier: number; availability: TicketTier["availability"] }[];

const CONCERT_TIERS: TierPreset = [
  { name: "General Admission", multiplier: 1, availability: "Available" },
  { name: "Reserved Seating", multiplier: 1.55, availability: "Limited" },
  { name: "VIP Package", multiplier: 2.6, availability: "Almost gone" },
];

const THEATER_TIERS: TierPreset = [
  { name: "Rear Mezzanine", multiplier: 1, availability: "Available" },
  { name: "Orchestra", multiplier: 1.7, availability: "Limited" },
  { name: "Front Row Orchestra", multiplier: 2.8, availability: "Almost gone" },
];

const SPORTS_TIERS: TierPreset = [
  { name: "Upper Level", multiplier: 1, availability: "Available" },
  { name: "Lower Level", multiplier: 1.8, availability: "Limited" },
  { name: "Courtside Club", multiplier: 3.4, availability: "Almost gone" },
];

function tiersFor(category: string, startingPrice: number): TicketTier[] {
  const preset =
    category === "Theater" ? THEATER_TIERS : category === "Sports" ? SPORTS_TIERS : CONCERT_TIERS;
  return preset.map((tier) => ({
    name: tier.name,
    price: Math.round((startingPrice * tier.multiplier) / 1) ,
    availability: tier.availability,
  }));
}

type RawEvent = Omit<ResaleEvent, "tiers">;

const RAW_EVENTS: RawEvent[] = [
  {
    slug: "summer-nights-live",
    name: "Drake",
    date: "Sat, Jun 13, 2026",
    time: "7:30 PM",
    venue: "Central Park SummerStage",
    city: "New York, NY",
    category: "Concerts",
    image: "/DRAKE.jpg",
    imagePosition: "object-[20%_35%]",
    startingPrice: 68,
  },
  {
    slug: "afrobeats-after-dark",
    name: "Kendrick",
    date: "Fri, Jul 10, 2026",
    time: "8:00 PM",
    venue: "Terminal 5",
    city: "New York, NY",
    category: "Music",
    image: "/kendrick.jpg",
    imagePosition: "object-[70%_55%]",
    startingPrice: 54,
  },
  {
    slug: "the-weeknd-live-in-nyc",
    name: "The Weeknd — Live in NYC",
    date: "Thu, Sep 3, 2026",
    time: "8:30 PM",
    venue: "Madison Square Garden",
    city: "New York, NY",
    category: "Concerts",
    image: "/weekend.jpg",
    imagePosition: "object-[30%_40%]",
    startingPrice: 129,
  },
  {
    slug: "rb-soul-sessions",
    name: "BTS",
    date: "Sat, Aug 8, 2026",
    time: "7:00 PM",
    venue: "Kings Theatre",
    city: "Brooklyn, NY",
    category: "Music",
    image: "/bts.jpg",
    imagePosition: "object-[45%_20%]",
    startingPrice: 61,
  },
  {
    slug: "broadway-nights",
    name: "Broadway Nights",
    date: "Fri, May 22, 2026",
    time: "7:30 PM",
    venue: "Shubert Theatre",
    city: "New York, NY",
    category: "Theater",
    image: "/bgd.png",
    imagePosition: "object-[50%_15%]",
    startingPrice: 89,
  },
  {
    slug: "the-great-gatsby",
    name: "The Great Gatsby",
    date: "Sat, Jun 6, 2026",
    time: "8:00 PM",
    venue: "Broadway Theatre",
    city: "New York, NY",
    category: "Theater",
    image: "/bgre.jpg",
    imagePosition: "object-[50%_10%]",
    startingPrice: 95,
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    date: "Wed, Jun 24, 2026",
    time: "7:00 PM",
    venue: "Richard Rodgers Theatre",
    city: "New York, NY",
    category: "Theater",
    image: "/bgd.png",
    imagePosition: "object-[20%_45%]",
    startingPrice: 149,
  },
  {
    slug: "new-york-comedy-night",
    name: "New York Comedy Night",
    date: "Fri, Jul 17, 2026",
    time: "9:30 PM",
    venue: "Gotham Comedy Club",
    city: "New York, NY",
    category: "Comedy",
    image: "/bgre.jpg",
    imagePosition: "object-[50%_70%]",
    startingPrice: 39,
  },
  {
    slug: "chicago-summer-concert",
    name: "Chicago Summer Concert",
    date: "Sat, Jul 25, 2026",
    time: "6:00 PM",
    venue: "Grant Park",
    city: "Chicago, IL",
    category: "Concerts",
    image: "/bgtwo.jpg",
    imagePosition: "object-[10%_60%]",
    startingPrice: 58,
  },
  {
    slug: "united-center-live",
    name: "United Center Live",
    date: "Fri, Nov 6, 2026",
    time: "7:00 PM",
    venue: "United Center",
    city: "Chicago, IL",
    category: "Sports",
    image: "/intro-bg.jpg",
    imagePosition: "object-[75%_50%]",
    startingPrice: 74,
  },
  {
    slug: "chicago-theater-night",
    name: "Chicago Theater Night",
    date: "Sat, Oct 3, 2026",
    time: "7:30 PM",
    venue: "Chicago Theatre",
    city: "Chicago, IL",
    category: "Theater",
    image: "/bgd.png",
    imagePosition: "object-[80%_30%]",
    startingPrice: 82,
  },
  {
    slug: "nba-night",
    name: "NBA Night",
    date: "Tue, Dec 1, 2026",
    time: "7:30 PM",
    venue: "Madison Square Garden",
    city: "New York, NY",
    category: "Sports",
    image: "/intro-bg.jpg",
    imagePosition: "object-[15%_65%]",
    startingPrice: 65,
  },
  {
    slug: "knicks-home-game",
    name: "Knicks Home Game",
    date: "Fri, Jan 9, 2027",
    time: "7:00 PM",
    venue: "Madison Square Garden",
    city: "New York, NY",
    category: "Sports",
    image: "/bgtwo.jpg",
    imagePosition: "object-[60%_10%]",
    startingPrice: 72,
  },
  {
    slug: "lakers-vs-knicks",
    name: "Lakers vs Knicks",
    date: "Sun, Feb 1, 2027",
    time: "6:00 PM",
    venue: "Madison Square Garden",
    city: "New York, NY",
    category: "Sports",
    image: "/intro-bg.jpg",
    imagePosition: "object-[50%_80%]",
    startingPrice: 118,
  },
  {
    slug: "college-basketball-classic",
    name: "College Basketball Classic",
    date: "Sat, Mar 7, 2027",
    time: "4:00 PM",
    venue: "United Center",
    city: "Chicago, IL",
    category: "Sports",
    image: "/bgtwo.jpg",
    imagePosition: "object-[85%_40%]",
    startingPrice: 45,
  },  {
    slug: "summer-fields-festival",
    name: "Summer Fields Festival",
    date: "Sat, Jun 27, 2026",
    time: "2:00 PM",
    venue: "Randall's Island Park",
    city: "New York, NY",
    category: "Concerts",
    image: "/day.jpg",
    imagePosition: "object-[50%_40%]",
    startingPrice: 89,
  },
  {
    slug: "harbor-lights-live",
    name: "Harbor Lights Live",
    date: "Sat, Aug 22, 2026",
    time: "7:00 PM",
    venue: "The Rooftop at Pier 17",
    city: "New York, NY",
    category: "Music",
    image: "/hero-poster.jpg",
    imagePosition: "object-[50%_50%]",
    startingPrice: 72,
  },
  {
    slug: "radio-city-late-show",
    name: "Radio City Late Show",
    date: "Sat, Sep 19, 2026",
    time: "10:00 PM",
    venue: "Radio City Music Hall",
    city: "New York, NY",
    category: "Concerts",
    image: "/intro-bg.jpg",
    imagePosition: "object-[40%_50%]",
    startingPrice: 84,
  },
  {
    slug: "midnight-jazz-sessions",
    name: "Midnight Jazz Sessions",
    date: "Fri, Jul 31, 2026",
    time: "11:30 PM",
    venue: "Blue Note",
    city: "New York, NY",
    category: "Music",
    image: "/conference.jpg",
    imagePosition: "object-[50%_40%]",
    startingPrice: 48,
  },
  {
    slug: "brooklyn-block-party",
    name: "Brooklyn Block Party",
    date: "Sat, Aug 15, 2026",
    time: "1:00 PM",
    venue: "Prospect Park Bandshell",
    city: "Brooklyn, NY",
    category: "Music",
    image: "/day.jpg",
    imagePosition: "object-[20%_70%]",
    startingPrice: 35,
  },
  {
    slug: "la-boheme",
    name: "La Bohème",
    date: "Fri, Oct 16, 2026",
    time: "7:30 PM",
    venue: "Metropolitan Opera House",
    city: "New York, NY",
    category: "Theater",
    image: "/bgone.jpg",
    imagePosition: "object-[50%_45%]",
    startingPrice: 110,
  },
  {
    slug: "midnight-at-the-majestic",
    name: "Midnight at the Majestic",
    date: "Sat, Nov 14, 2026",
    time: "8:00 PM",
    venue: "Majestic Theatre",
    city: "New York, NY",
    category: "Theater",
    image: "/bgre.jpg",
    imagePosition: "object-[50%_30%]",
    startingPrice: 99,
  },
  {
    slug: "bucks-vs-knicks",
    name: "Bucks vs Knicks",
    date: "Sat, Dec 12, 2026",
    time: "7:30 PM",
    venue: "Madison Square Garden",
    city: "New York, NY",
    category: "Sports",
    image: "/giannis.jpg",
    imagePosition: "object-[50%_25%]",
    startingPrice: 96,
  },
  {
    slug: "bengals-vs-jets",
    name: "Bengals vs Jets",
    date: "Sun, Nov 29, 2026",
    time: "1:00 PM",
    venue: "MetLife Stadium",
    city: "East Rutherford, NJ",
    category: "Sports",
    image: "/CHASE.jpg",
    imagePosition: "object-[50%_25%]",
    startingPrice: 135,
  },
  {
    slug: "bucks-vs-bulls",
    name: "Bucks vs Bulls",
    date: "Sun, Jan 17, 2027",
    time: "6:00 PM",
    venue: "United Center",
    city: "Chicago, IL",
    category: "Sports",
    image: "/gianni.jpg",
    imagePosition: "object-[50%_30%]",
    startingPrice: 64,
  },
  {
    slug: "brooklyn-arena-showcase",
    name: "Brooklyn Arena Showcase",
    date: "Sat, Feb 20, 2027",
    time: "7:00 PM",
    venue: "Barclays Center",
    city: "Brooklyn, NY",
    category: "Sports",
    image: "/venue.jpg",
    imagePosition: "object-[50%_50%]",
    startingPrice: 55,
  },
];

export const resaleEvents: ResaleEvent[] = RAW_EVENTS.map((event) => ({
  ...event,
  tiers: tiersFor(event.category, event.startingPrice),
}));

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
    id: "popular-concerts",
    title: "Popular Concerts",
    slugs: [
      "the-weeknd-live-in-nyc",
      "summer-nights-live",
      "summer-fields-festival",
      "afrobeats-after-dark",
      "radio-city-late-show",
      "rb-soul-sessions",
      "chicago-summer-concert",
      "harbor-lights-live",
    ],
  },
  {
    id: "theater",
    title: "Theater",
    slugs: [
      "hamilton",
      "the-great-gatsby",
      "la-boheme",
      "broadway-nights",
      "midnight-at-the-majestic",
      "chicago-theater-night",
    ],
    variant: "feature",
  },
  {
    id: "nyc-shows",
    title: "NYC Shows",
    slugs: [
      "broadway-nights",
      "hamilton",
      "radio-city-late-show",
      "the-great-gatsby",
      "midnight-jazz-sessions",
      "la-boheme",
      "new-york-comedy-night",
      "midnight-at-the-majestic",
    ],
  },
  {
    id: "sports",
    title: "Sports",
    slugs: [
      "bucks-vs-knicks",
      "nba-night",
      "bengals-vs-jets",
      "knicks-home-game",
      "lakers-vs-knicks",
      "brooklyn-arena-showcase",
      "bucks-vs-bulls",
      "college-basketball-classic",
      "united-center-live",
    ],
  },
  {
    id: "music",
    title: "Music",
    slugs: [
      "afrobeats-after-dark",
      "rb-soul-sessions",
      "midnight-jazz-sessions",
      "summer-nights-live",
      "brooklyn-block-party",
      "harbor-lights-live",
      "the-weeknd-live-in-nyc",
      "summer-fields-festival",
    ],
  },
];

/**
 * "Check out your Faves": artists, players, teams, and shows, each linking to
 * their event page. `position` frames the subject in a circle cropped from
 * the listing artwork.
 */
export const faves = [
  { name: "Drake", image: "/DRAKE.jpg", position: "object-[50%_32%]", href: "/ticket-resale/summer-nights-live" },
  { name: "Kendrick", image: "/kendrick.jpg", position: "object-[50%_78%]", href: "/ticket-resale/afrobeats-after-dark" },
  { name: "The Weeknd", image: "/weekend.jpg", position: "object-[50%_45%]", href: "/ticket-resale/the-weeknd-live-in-nyc" },
  { name: "BTS", image: "/bts.jpg", position: "object-[50%_85%]", href: "/ticket-resale/rb-soul-sessions" },
  { name: "Ja'Marr Chase", image: "/CHASE.jpg", position: "object-[50%_22%]", href: "/ticket-resale/bengals-vs-jets" },
  { name: "Giannis", image: "/giannis.jpg", position: "object-[50%_28%]", href: "/ticket-resale/bucks-vs-knicks" },
  { name: "Hamilton", image: "/bgd.png", position: "object-[50%_35%]", href: "/ticket-resale/hamilton" },
  { name: "Summer Fields", image: "/day.jpg", position: "object-[50%_50%]", href: "/ticket-resale/summer-fields-festival" },
  { name: "La Bohème", image: "/bgone.jpg", position: "object-[50%_45%]", href: "/ticket-resale/la-boheme" },
  { name: "Knicks", image: "/venue.jpg", position: "object-[50%_50%]", href: "/ticket-resale/knicks-home-game" },
  { name: "Midnight Jazz", image: "/conference.jpg", position: "object-[50%_40%]", href: "/ticket-resale/midnight-jazz-sessions" },
  { name: "The Great Gatsby", image: "/bgre.jpg", position: "object-[50%_30%]", href: "/ticket-resale/the-great-gatsby" },
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

export const trSubscribe = {
  label: "Stay in the loop",
  headline: "Know before it sells out.",
  body: "One email when tickets drop for the artists, teams, and shows you follow — plus price moves on events you've viewed. No daily blasts.",
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
