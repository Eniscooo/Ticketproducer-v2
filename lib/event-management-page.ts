/**
 * Content and pricing model for the /event-management route.
 *
 * Kept separate from lib/site.ts (which holds brand-wide copy) so the deep-dive
 * page can carry its own structures without bloating the shared module. Service
 * titles and bodies are re-exported from `eventManagement` in lib/site.ts rather
 * than retyped, so the summary card on /services and this page can never drift.
 */
import { eventManagement } from "@/lib/site";

export const emHero = {
  label: "Event Management",
  headlineTop: "Built for the room.",
  headlineBottom: "Built for the event.",
  body: " Ticket-Producer is the corporate event planning agency trusted to design, produce, and run your most important moments - anywhere in the world.",
  primaryCta: { label: "Plan Your Event", href: "#event-guide" },
  secondaryCta: { label: "Explore Services", href: "#em-services" },
};

/** The three core services, with the detail this page has room for. */
export const emServices = [
  {
    index: "01",
    title: eventManagement.items[0].title,
    body: eventManagement.items[0].body,
    // Short by design — these render as design.md tag pills, not sentences.
    points: ["Doors", "Box office", "Floor crew", "Load-out"],
    image: "/cabin.jpg",
    imagePosition: "object-center",
  },
  {
    index: "02",
    title: eventManagement.items[1].title,
    body: eventManagement.items[1].body,
    points: ["Seating charts", "Sightlines", "Capacity modelling", "Custom platform"],
    image: "/venue.jpg",
    imagePosition: "object-top",
  },
  {
    index: "03",
    title: eventManagement.items[2].title,
    body: eventManagement.items[2].body,
    points: ["Pre-production", "Sequencing", "Ops review", "Producer support"],
    image: "/consult.jpg",
    imagePosition: "object-center",
  },
];

export type EventGuideItem = {
  slug: string;
  /** Plural, as shown on the card. */
  title: string;
  /**
   * Countable singular for the proposal dialog heading — "Planning a
   * Conference?" rather than "Planning a Conferences?". Every value is
   * deliberately countable so the article never has to be special-cased.
   */
  singular: string;
  body: string;
  image: string;
  /** Tailwind object-position class — several types share a source photo, so the crop is what distinguishes them. */
  imagePosition: string;
};

/**
 * NOTE — imagery: these reuse the venue photography already in /public, since
 * the brief asked to exhaust local assets before adding new ones. There are
 * only six genuinely suitable photos for eight categories, so `bgd.png` and
 * `bgtwo.jpg` each appear twice at different crops. Retreats, Trips, Day
 * Events, and Team Building in particular want dedicated photography before
 * launch. `bgone.jpg` is deliberately unused — it carries a visible
 * stock-library watermark.
 */
export const eventGuide: EventGuideItem[] = [
  {
    slug: "retreats",
    title: "Retreats",
    singular: "Retreat",
    body: "Multi-day offsites where the room, the schedule, and the travel all have to hold together.",
    image: "/retreat.jpg",
    imagePosition: "object-[12%_45%]",
  },
  {
    slug: "conferences",
    title: "Conferences",
    singular: "Conference",
    body: "Staged programming, tiered seating, and a ticketing map that matches the hall.",
    image: "/conference.jpg",
    imagePosition: "object-[22%_40%]",
  },
  {
    slug: "trips",
    title: "Trips",
    singular: "Trip",
    body: "Curated group travel with the logistics and access handled end to end.",
    image: "/trips.jpg",
    imagePosition: "object-[50%_62%]",
  },
  {
    slug: "client-events",
    title: "Client Events",
    singular: "Client Event",
    body: "Private gatherings where the guest list is short and nothing is allowed to slip.",
    image: "/events.jpg",
    imagePosition: "object-center",
  },
  {
    slug: "launch-events",
    title: "Launch Events",
    singular: "Launch Event",
    body: "A reveal built around a single moment, with the run-of-show to land it.",
    image: "/startup.jpg",
    imagePosition: "object-center",
  },
  {
    slug: "day-events",
    title: "Day Events",
    singular: "Day Event",
    body: "Daytime programming, activations, and single-session events with fast turnarounds.",
    image: "/day.jpg",
    imagePosition: "object-[88%_60%]",
  },
  {
    slug: "holidays",
    title: "Holidays",
    singular: "Holiday Party",
    body: "Seasonal parties and end-of-year gatherings at scale, without the scramble.",
    image: "/holiday.jpg",
    imagePosition: "object-center",
  },
  {
    slug: "team-building",
    title: "Team Building",
    singular: "Team Building Day",
    body: "Structured internal events designed around how the group actually works.",
    image: "/team.jpg",
    imagePosition: "object-[82%_75%]",
  },
];

/**
 * NOTE — pricing: every rate below is an illustrative placeholder so the
 * calculator produces plausible arithmetic. Replace all of them with real
 * internal rate cards before this page goes live, and keep the "planning
 * estimate, not a quote" disclaimer in the UI regardless.
 */
export type CalcEventType = {
  value: string;
  label: string;
  /** Baseline cost per guest, before duration and add-ons. */
  perGuest: number;
};

export const calcEventTypes: CalcEventType[] = [
  { value: "conference", label: "Conference", perGuest: 185 },
  { value: "retreat", label: "Retreat", perGuest: 420 },
  { value: "client-event", label: "Client Event", perGuest: 260 },
  { value: "launch-event", label: "Launch Event", perGuest: 310 },
  { value: "day-event", label: "Day Event", perGuest: 120 },
  { value: "holidays", label: "Holiday Party", perGuest: 200 },
  { value: "team-building", label: "Team Building Day", perGuest: 145 },
  { value: "trip", label: "Trip", perGuest: 560 },
];

export type CalcOption = {
  value: string;
  label: string;
  /** Fixed engagement cost. */
  flat: number;
  /** Additional cost scaled by head count. */
  perGuest: number;
};

export type CalcGroup = {
  key: "venue" | "staffing" | "ticketing" | "production";
  label: string;
  options: CalcOption[];
};

export const calcGroups: CalcGroup[] = [
  {
    key: "venue",
    label: "Venue requirements",
    options: [
      { value: "none", label: "Venue already secured", flat: 0, perGuest: 0 },
      { value: "map", label: "Seating map only", flat: 3500, perGuest: 2 },
      { value: "full", label: "Full venue mapping", flat: 9500, perGuest: 6 },
    ],
  },
  {
    key: "staffing",
    label: "Staffing requirements",
    options: [
      { value: "none", label: "Client-supplied crew", flat: 0, perGuest: 0 },
      { value: "core", label: "Core crew", flat: 4800, perGuest: 14 },
      { value: "full", label: "Full crew, doors to load-out", flat: 12500, perGuest: 28 },
    ],
  },
  {
    key: "ticketing",
    label: "Ticketing requirements",
    options: [
      { value: "none", label: "No ticketing", flat: 0, perGuest: 0 },
      { value: "standard", label: "Standard ticketing", flat: 2500, perGuest: 4 },
      { value: "custom", label: "Custom platform + seating", flat: 14000, perGuest: 9 },
    ],
  },
  {
    key: "production",
    label: "Production requirements",
    options: [
      { value: "minimal", label: "Minimal", flat: 0, perGuest: 0 },
      { value: "standard", label: "Standard AV + lighting", flat: 7500, perGuest: 12 },
      { value: "full", label: "Full production build", flat: 26000, perGuest: 30 },
    ],
  },
];

/** Each additional day adds 55% of the first day's baseline. */
export const DURATION_FACTOR_PER_EXTRA_DAY = 0.55;

/** The estimate is shown as a ±15% band — a single figure would imply precision we don't have. */
export const ESTIMATE_SPREAD = 0.15;

export type BudgetRange = {
  value: string;
  label: string;
  /** Inclusive bounds in USD; `null` means open-ended. `unsure` has neither. */
  min: number | null;
  max: number | null;
};

export const budgetRanges: BudgetRange[] = [
  { value: "under-50k", label: "Under $50k", min: 0, max: 50_000 },
  { value: "50k-150k", label: "$50k – $150k", min: 50_000, max: 150_000 },
  { value: "150k-400k", label: "$150k – $400k", min: 150_000, max: 400_000 },
  { value: "400k-1m", label: "$400k – $1M", min: 400_000, max: 1_000_000 },
  { value: "1m-plus", label: "$1M+", min: 1_000_000, max: null },
  { value: "unsure", label: "Not sure yet", min: null, max: null },
];

export const GUEST_BOUNDS = { min: 10, max: 20_000 } as const;
export const DURATION_BOUNDS = { min: 1, max: 14 } as const;

export type CalcSelection = {
  eventType: string;
  guests: number;
  days: number;
  venue: string;
  staffing: string;
  ticketing: string;
  production: string;
};

export type EstimateLine = { label: string; amount: number };

export type Estimate = {
  lines: EstimateLine[];
  subtotal: number;
  low: number;
  high: number;
};

/**
 * Pure so the arithmetic stays inspectable and the UI can re-render it on every
 * keystroke without side effects. Returns a band rather than a point figure —
 * see ESTIMATE_SPREAD.
 */
export function calculateEstimate(selection: CalcSelection): Estimate {
  const type =
    calcEventTypes.find((t) => t.value === selection.eventType) ?? calcEventTypes[0];

  const guests = clamp(selection.guests, GUEST_BOUNDS.min, GUEST_BOUNDS.max);
  const days = clamp(selection.days, DURATION_BOUNDS.min, DURATION_BOUNDS.max);
  const durationFactor = 1 + (days - 1) * DURATION_FACTOR_PER_EXTRA_DAY;

  const lines: EstimateLine[] = [
    {
      label: `${type.label} baseline · ${guests.toLocaleString("en-US")} guests · ${days} ${days === 1 ? "day" : "days"}`,
      amount: Math.round(type.perGuest * guests * durationFactor),
    },
  ];

  for (const group of calcGroups) {
    const chosen = group.options.find((o) => o.value === selection[group.key]);
    if (!chosen || (chosen.flat === 0 && chosen.perGuest === 0)) continue;
    lines.push({
      label: `${group.label.replace(" requirements", "")} · ${chosen.label}`,
      amount: Math.round(chosen.flat + chosen.perGuest * guests),
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);

  return {
    lines,
    subtotal,
    low: Math.round((subtotal * (1 - ESTIMATE_SPREAD)) / 1000) * 1000,
    high: Math.round((subtotal * (1 + ESTIMATE_SPREAD)) / 1000) * 1000,
  };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** Maps an estimate onto the user's stated target so the UI can say something useful about the gap. */
export function compareToTarget(
  estimateHigh: number,
  estimateLow: number,
  rangeValue: string,
): "unknown" | "below" | "within" | "above" {
  const range = budgetRanges.find((r) => r.value === rangeValue);
  if (!range || range.min === null) return "unknown";
  const targetMax = range.max ?? Number.POSITIVE_INFINITY;
  if (estimateLow > targetMax) return "above";
  if (estimateHigh < range.min) return "below";
  return "within";
}

export const emAbout = {
  label: "About Us",
  headline: "We have stood in the room before.",
  body: "Ticket Producer did not start as software. It started on floors and loading docks, running doors for other people's events and watching where the plan met the building. That is still how we work — the systems came after the shifts, not instead of them.",
  points: [
    {
      title: "Real event experience",
      body: "Ten-plus years of live events in New York, on-site rather than advisory.",
    },
    {
      title: "Operational expertise",
      body: "We plan against how a room empties, not just how it fills.",
    },
    {
      title: "Venue-specific planning",
      body: "Every map is drawn to the building in front of us — sightlines, access, capacity.",
    },
    {
      title: "Producer support",
      body: "We work alongside teams that already exist rather than displacing them.",
    },
  ],
  /*
   * The wall under the block: nine portrait frames, three rooms per row with
   * the people down the middle. Every tile is a distinct asset — the six
   * venue photographs in /public plus the three client portraits in
   * /public/reviews — so nothing repeats across a grid where all nine are
   * visible at once. `position` is the cover crop that turns a landscape
   * source into a portrait frame; swap these for dedicated production
   * photography when it exists.
   */
  wall: [
    { src: "/bts.jpg", position: "object-[50%_50%]" },
    { src: "/reviews/reviews1.jpg", position: "object-[50%_20%]" },
    { src: "/CHASE.jpg", position: "object-[50%_55%]" },
    { src: "/DRAKE.jpg", position: "object-[92%_50%]" },
    { src: "/reviews/reviews3.jpg", position: "object-[50%_30%]" },
    { src: "/bgre.jpg", position: "object-[50%_40%]" },
    { src: "/giannis.jpg", position: "object-[55%_50%]" },
    { src: "/reviews/reviews2.jpg", position: "object-[44%_50%]" },
    { src: "/weekend.jpg", position: "object-[50%_50%]" },
  ],
};

export const emFaq = [
  {
    question: "What types of events do you support?",
    answer:
      "Conferences, retreats, client and private events, launches, day events, seasonal parties, team building, and group trips. The common thread is a room with real operational requirements rather than a specific category.",
  },
  {
    question: "Do you provide on-site event staff?",
    answer:
      "Yes. Event staffing is one of the three core services — door, box office, and floor crews who are briefed on the specific room, covering load-in through load-out.",
  },

  {
    question: "Can you create ticketing around an existing venue?",
    answer:
      "That is the intended use. The ticketing platform is built around the venue map, so the chart your buyers see matches the room they walk into.",
  },

  {
    question: "Can you help with event planning and strategy?",
    answer:
      "Yes, through consulting: pre-production planning, sequencing, and operational review for producers who want expert eyes before they commit.",
  },
  {
    question: "How does the proposal process work?",
    answer:
      "Send a proposal request from the Event Guide above with your event type, date, location, guest count, and budget range. We review the requirements and follow up to discuss scope before anything is quoted.",
  }, 
];

export const emFinalCta = {
  headlineTop: "Your event is different.",
  headlineBottom: "Your infrastructure should be too.",
  body: "We build the staffing, the venue map, the ticketing, and the strategy around the actual room, the actual audience, and the producer already running it.",
  primaryCta: { label: "Start Planning", href: "#event-guide" },
};
