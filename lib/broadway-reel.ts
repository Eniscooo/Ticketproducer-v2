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

export const broadwayReel: ReelCard[] = [
  {
    src: "/broadway/great-gatsby.jpg",
    title: "The Great Gatsby",
    place: "Broadway Theatre",
    alt: "The Great Gatsby's stage lit in blue and green before the show, the audience in the foreground",
    href: "/ticket-resale/the-great-gatsby",
  },
  {
    src: "/broadway/oh-mary.jpg",
    title: "Oh, Mary!",
    place: "Lyceum Theatre",
    alt: "The Lyceum Theatre's gilded proscenium framing the purple Oh, Mary! curtain",
    href: "/ticket-resale/oh-mary",
  },
  {
    src: "/broadway/lion-king.jpg",
    title: "The Lion King",
    place: "Minskoff Theatre",
    alt: "The Lion King's yellow marquee at the Minskoff Theatre at night",
    href: "/ticket-resale/the-lion-king",
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
    href: "/ticket-resale/wicked",
  },
  {
    src: "/broadway/radio-city-christmas.jpg",
    title: "Christmas Spectacular",
    place: "Radio City Music Hall",
    alt: "Radio City Music Hall's lit vertical sign and marquee at night, with the giant Christmas tree beside it",
    href: "/ticket-resale/radio-city-christmas-spectacular",
  },
  {
    src: "/broadway/aladdin.jpg",
    title: "Aladdin",
    place: "New Amsterdam Theatre",
    alt: "The purple Aladdin marquee under the New Amsterdam Theatre's vertical sign",
    href: "/ticket-resale/aladdin",
  },
  {
    src: "/broadway/hadestown-stage.jpg",
    title: "Hadestown",
    place: "Walter Kerr stage",
    alt: "The Hadestown set — a round wooden stage and band platform",
    href: "/ticket-resale/hadestown",
  },
  {
    src: "/broadway/chicago.jpg",
    title: "Chicago",
    place: "Ambassador Theatre",
    alt: "The lit Chicago marquee above the Ambassador Theatre at night",
    href: "/ticket-resale/chicago",
  },
  {
    src: "/broadway/times-square.jpg",
    title: "Times Square",
    place: "The Theater District",
    alt: "Times Square at night, looking toward One Times Square, billboards lit",
    href: "/ticket-resale#musicals",
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
    href: "/ticket-resale/hadestown",
  },
  {
    src: "/broadway/book-of-mormon.jpg",
    title: "The Book of Mormon",
    place: "Eugene O'Neill Theatre",
    alt: "The Book of Mormon marquee at the Eugene O'Neill Theatre",
    href: "/ticket-resale/the-book-of-mormon",
  },
  {
    src: "/broadway/chicago-banners.jpg",
    title: "Chicago",
    place: "West 49th Street",
    alt: "Red and black Chicago banners down the side of the Ambassador Theatre",
    href: "/ticket-resale/chicago",
  },
];
