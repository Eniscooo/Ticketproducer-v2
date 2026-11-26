/**
 * The landing hero's carousel: fifteen portrait frames of Broadway — the
 * marquees, the houses and the stages. Every image is pre-cropped to the card's
 * own 720×920 frame in /public/broadway, so the card never re-crops and the
 * subject stays where it was framed.
 *
 * Photography is real and openly licensed — marquee and theatre photos from
 * Wikimedia Commons (CC BY / CC BY-SA, credited in PHOTO-CREDITS.md) and our
 * own Unsplash set. Official production stills are owned by each show and are
 * not used here; when a show licenses us its press photography, swap it in.
 */
export type ReelCard = {
  src: string;
  /** What the card shows, as the hover caption names it. */
  title: string;
  /** Where — the house, or the street. */
  place: string;
  alt: string;
  href: string;
};

const THEATER = "/ticket-resale#theater";

export const broadwayReel: ReelCard[] = [
  {
    src: "/broadway/lion-king.jpg",
    title: "The Lion King",
    place: "Minskoff Theatre",
    alt: "The Lion King's yellow marquee at the Minskoff Theatre at night",
    href: THEATER,
  },
  {
    src: "/broadway/moulin-rouge-stage.jpg",
    title: "Moulin Rouge!",
    place: "Inside the Al Hirschfeld",
    alt: "The red, jewelled Moulin Rouge set inside the Al Hirschfeld Theatre",
    href: THEATER,
  },
  {
    src: "/broadway/hamilton.jpg",
    title: "Hamilton",
    place: "Richard Rodgers Theatre",
    alt: "The Hamilton marquee above the Richard Rodgers Theatre entrance",
    href: "/ticket-resale/hamilton",
  },
  {
    src: "/broadway/wicked.jpg",
    title: "Wicked",
    place: "Gershwin Theatre",
    alt: "Green Wicked banners on the front of the Gershwin Theatre",
    href: THEATER,
  },
  {
    src: "/broadway/radio-city-hall.jpg",
    title: "Radio City",
    place: "Music Hall",
    alt: "The golden arches and red seats of the Radio City Music Hall auditorium",
    href: "/ticket-resale/radio-city-late-show",
  },
  {
    src: "/broadway/aladdin.jpg",
    title: "Aladdin",
    place: "New Amsterdam Theatre",
    alt: "The purple Aladdin marquee under the New Amsterdam Theatre's vertical sign",
    href: THEATER,
  },
  {
    src: "/broadway/hadestown-stage.jpg",
    title: "Hadestown",
    place: "Walter Kerr stage",
    alt: "The Hadestown set — a round wooden stage and band platform",
    href: THEATER,
  },
  {
    src: "/broadway/chicago.jpg",
    title: "Chicago",
    place: "Ambassador Theatre",
    alt: "The lit Chicago marquee above the Ambassador Theatre at night",
    href: THEATER,
  },
  {
    src: "/broadway/times-square.jpg",
    title: "Times Square",
    place: "The Theater District",
    alt: "Times Square at night, billboards lit, crowds in motion",
    href: "/ticket-resale/broadway-nights",
  },
  {
    src: "/broadway/phantom.jpg",
    title: "The Majestic",
    place: "Home of Phantom, 1988–2023",
    alt: "The Phantom of the Opera sign above the Majestic Theatre's ornate marquee",
    href: THEATER,
  },
  {
    src: "/broadway/moulin-rouge.jpg",
    title: "Moulin Rouge!",
    place: "Al Hirschfeld Theatre",
    alt: "The Moulin Rouge marquee on the Al Hirschfeld Theatre at dusk",
    href: THEATER,
  },
  {
    src: "/broadway/richard-rodgers.jpg",
    title: "The Rodgers",
    place: "West 46th Street",
    alt: "Close-up of the bulb-lit Richard Rodgers Theatre sign",
    href: "/ticket-resale/hamilton",
  },
  {
    src: "/broadway/hadestown.jpg",
    title: "Hadestown",
    place: "Walter Kerr Theatre",
    alt: "The stained-glass Hadestown sign on the Walter Kerr Theatre",
    href: THEATER,
  },
  {
    src: "/broadway/book-of-mormon.jpg",
    title: "The Book of Mormon",
    place: "Eugene O'Neill Theatre",
    alt: "The Book of Mormon marquee at the Eugene O'Neill Theatre",
    href: THEATER,
  },
  {
    src: "/broadway/chicago-banners.jpg",
    title: "Chicago",
    place: "West 49th Street",
    alt: "Red and black Chicago banners down the side of the Ambassador Theatre",
    href: THEATER,
  },
];
