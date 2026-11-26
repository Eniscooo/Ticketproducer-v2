/**
 * Attribution for the openly licensed photography on the site, rendered at
 * /credits. CC BY and CC BY-SA require visible credit — photographer, source
 * and licence — so this list is public, not just a note in the repo. Every
 * Commons image below was cropped to a portrait frame for the landing reel;
 * under CC BY-SA those crops carry the same licence as the original.
 *
 * Unsplash photography needs no attribution, but is listed in PHOTO-CREDITS.md.
 */
export type Credit = {
  subject: string;
  author: string;
  license: "CC BY 2.0" | "CC BY-SA 2.0" | "CC BY-SA 4.0";
  source: string;
};

export const LICENSE_URLS: Record<Credit["license"], string> = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
};

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

export const commonsCredits: Credit[] = [
  {
    subject: "The Lion King at the Minskoff Theatre",
    author: "BroadwaySpain",
    license: "CC BY-SA 4.0",
    source: `${COMMONS}The_Lion_King_at_Minskoff_Theatre_in_Broadway.jpg`,
  },
  {
    subject: "Wicked at the Gershwin Theatre",
    author: "Ajay Suresh",
    license: "CC BY 2.0",
    source: `${COMMONS}Gershwin_Theatre_-_Wicked_(54077363135).jpg`,
  },
  {
    subject: "Moulin Rouge! set, Al Hirschfeld Theatre",
    author: "Epicgenius",
    license: "CC BY-SA 4.0",
    source: `${COMMONS}Al_Hirschfeld_Theatre_Nov_2025_17.jpg`,
  },
  {
    subject: "Moulin Rouge! at the Al Hirschfeld Theatre",
    author: "Corey Seeman",
    license: "CC BY-SA 4.0",
    source: `${COMMONS}Moulin_Rouge!_-_Al_Hirschfeld_Theatre_-_New_York_City,_September_28th,_2025.jpg`,
  },
  {
    subject: "The Phantom of the Opera at the Majestic Theatre",
    author: "Dennis Beck / Broadway Tour",
    license: "CC BY-SA 2.0",
    source: `${COMMONS}Phantom_of_the_Opera_@_Majestic_Theatre_on_Broadway_(7645449960).jpg`,
  },
  {
    subject: "Aladdin at the New Amsterdam Theatre",
    author: "BroadwaySpain",
    license: "CC BY-SA 4.0",
    source: `${COMMONS}Aladdin_at_New_Amsterdam_Theatre_in_Broadway.jpg`,
  },
  {
    subject: "Hadestown set, Walter Kerr Theatre",
    author: "Harp369",
    license: "CC BY-SA 4.0",
    source: `${COMMONS}Stage_of_the_Walter_Kerr_Theatre_with_the_set_of_Hadestown.jpg`,
  },
  {
    subject: "Hadestown at the Walter Kerr Theatre",
    author: "Ajay Suresh",
    license: "CC BY 2.0",
    source: `${COMMONS}Walter_Kerr_Theatre_-_Hadestown_(48295952136).jpg`,
  },
  {
    subject: "Chicago at the Ambassador Theatre",
    author: "Jim.henderson",
    license: "CC BY-SA 4.0",
    source: `${COMMONS}Ambassador_Theater_nite_2023_jeh.jpg`,
  },
  {
    subject: "Chicago banners on Broadway",
    author: "Broadway Tour",
    license: "CC BY-SA 2.0",
    source: `${COMMONS}Chicago_the_Musical_Banners_on_Broadway_(6284881463).jpg`,
  },
  {
    subject: "The Book of Mormon at the Eugene O'Neill Theatre",
    author: "Ajay Suresh",
    license: "CC BY 2.0",
    source: `${COMMONS}Eugene_O%27Neill_Theatre_-_Book_of_Mormon_(48295951286).jpg`,
  },
];
