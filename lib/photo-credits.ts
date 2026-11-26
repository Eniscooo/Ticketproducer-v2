/**
 * Attribution for the openly licensed photography on the site, rendered at
 * /credits. CC BY and CC BY-SA require visible credit — photographer, source
 * and licence — so this list is public, not just a note in the repo. These are
 * the Commons photographs behind the show listings (public/shows/) and the
 * landing reel's portrait crops (public/broadway/); resized and cropped copies
 * of CC BY-SA images carry the same licence as the original. CC0 needs no
 * credit but is listed anyway.
 *
 * Unsplash photography needs no attribution, but is listed in PHOTO-CREDITS.md.
 */
export type Credit = {
  subject: string;
  author: string;
  license: "CC BY 2.0" | "CC BY-SA 2.0" | "CC BY-SA 4.0" | "CC0 1.0";
  source: string;
};

export const LICENSE_URLS: Record<Credit["license"], string> = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC0 1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
};

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

const c = (subject: string, author: string, license: Credit["license"], file: string): Credit => ({
  subject,
  author,
  license,
  source: `${COMMONS}${file}`,
});

export const commonsCredits: Credit[] = [
  c("Chicago at the Ambassador Theatre", "Jim.henderson", "CC BY-SA 4.0", "Ambassador_Theater_nite_2023_jeh.jpg"),
  c("Chicago banners on Broadway", "Broadway Tour", "CC BY-SA 2.0", "Chicago_the_Musical_Banners_on_Broadway_(6284881463).jpg"),
  c("The Great Gatsby at the Broadway Theatre", "Clyde Charles Brown", "CC BY-SA 4.0", "The_Great_Gatsby_at_Broadway_Theatre,_Manhattan,_New_York,_US.jpg"),
  c("Radio City Music Hall and its Christmas tree", "Ethan Long", "CC BY-SA 4.0", "Radio_City_Music_Hall,_Christmas_Tree_(55005844275).jpg"),
  c("Oh, Mary! curtain, Lyceum Theatre", "Epicgenius", "CC BY-SA 4.0", "Lyceum_Theatre_NYC_Aug_2025_01.jpg"),
  c("Wicked at the Gershwin Theatre", "Ajay Suresh", "CC BY 2.0", "Gershwin_Theatre_-_Wicked_(54077363135).jpg"),
  c("Hamilton at the Richard Rodgers Theatre", "Epicgenius", "CC BY-SA 4.0", "W_46_St_Dec_2021_02.jpg"),
  c("The Lion King at the Minskoff Theatre", "BroadwaySpain", "CC BY-SA 4.0", "The_Lion_King_at_Minskoff_Theatre_in_Broadway.jpg"),
  c("Aladdin at the New Amsterdam Theatre", "BroadwaySpain", "CC BY-SA 4.0", "Aladdin_at_New_Amsterdam_Theatre_in_Broadway.jpg"),
  c("Hadestown at the Walter Kerr Theatre", "Ajay Suresh", "CC BY 2.0", "Walter_Kerr_Theatre_-_Hadestown_(48295952136).jpg"),
  c("Hadestown set, Walter Kerr Theatre", "Harp369", "CC BY-SA 4.0", "Stage_of_the_Walter_Kerr_Theatre_with_the_set_of_Hadestown.jpg"),
  c("The Book of Mormon at the Eugene O'Neill Theatre", "Ajay Suresh", "CC BY 2.0", "Eugene_O%27Neill_Theatre_-_Book_of_Mormon_(48295951286).jpg"),
  c("MJ the Musical stage, Neil Simon Theatre", "Fishwish58", "CC BY-SA 4.0", "MJ_the_musical_-_stage.jpg"),
  c("Harry Potter and the Cursed Child at the Lyric Theatre", "Ajay Suresh", "CC BY 2.0", "Lyric_Theatre_-_Harry_Potter_and_the_Cursed_Child_(48193409386).jpg"),
  c("Maybe Happy Ending curtain, Belasco Theatre", "Epicgenius", "CC BY-SA 4.0", "Belasco_Theatre_May_2025_12.jpg"),
  c("The Outsiders curtain, Bernard B. Jacobs Theatre", "Epicgenius", "CC BY-SA 4.0", "Bernard_B_Jacobs_Theatre_Aug_2025_04.jpg"),
  c("Just in Time at Circle in the Square", 'Casey "Poppins" Nedelka', "CC BY-SA 4.0", "Circle_in_the_Square_Theatre_June_2026.jpg"),
  c("Operation Mincemeat at the John Golden Theatre", "Engrigg22", "CC0 1.0", "John_Golden_Theatre_Operation_Mincemeat_Marquis.jpg"),
  c("SIX on stage, Lena Horne Theatre", "Epicgenius", "CC BY-SA 4.0", "Lena_Horne_Theatre_Sep_2025_39.jpg"),
  c("Times Square at night", "Paulinabial", "CC BY-SA 4.0", "1_times_square_night_2013_anonymized.jpg"),
];
