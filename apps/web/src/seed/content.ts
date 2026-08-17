import path from "path";
import { fileURLToPath } from "url";

import { richText } from "./lexical";

const dirname = path.dirname(fileURLToPath(import.meta.url));
export const seedDir = path.resolve(dirname, "../../public/seed");

export const mediaFiles = {
  emblemLime: { file: "EmblemLime.png", alt: "Sport is for Everyone" },
  emblemBlue: { file: "emblemBlue.png", alt: "Sport is for Everyone" },
  hero: { file: "IMG_1335.png", alt: "Athletes in motion" },
  admire: {
    file: "IMG_0405.jpg",
    alt: "Profile of a man in a beige hoodie, with a map of Newlands in the background, and white text reading 'Admire Muzopambwa Never Too Late'.",
  },
  dakar: { file: "DSC_0073.jpg", alt: "Vol. 01 — Dakar" },
  iten: { file: "DSC08685.jpg", alt: "Vol. 02 — Iten" },
  slowHike: { file: "IMG_0959.jpg", alt: "Slow Hike in Usedom" },
  easterHike: { file: "IMG_0961.jpg", alt: "Easter Hike" },
  oumou: {
    file: "sport-is-for-everyone.png",
    alt: "A young woman with curly hair holding a microphone with a sports activism logo, sitting on a green couch in front of a light wall with a red panel, speaking about sports stories.",
  },
  roots: {
    file: "oumou-x-roots.jpg",
    alt: "Oumou x Roots community hike for BAM 6 THE ORDINARY",
  },
} as const;

export const tags = [
  { name: "Asylum-seekers", group: "access" as const },
  { name: "BIPOC-led", group: "community" as const },
  { name: "Beginner", group: "access" as const },
  { name: "Environmental / Outdoor Focus", group: "focus" as const },
  { name: "Free/low-cost", group: "access" as const },
  { name: "LGBTQIA+", group: "community" as const },
  { name: "Mental Health Aware", group: "focus" as const },
  { name: "Migrant / Refugee support", group: "access" as const },
  { name: "Refugees", group: "access" as const },
  { name: "TNB+", group: "community" as const },
  { name: "Woman-led", group: "community" as const },
  { name: "Women", group: "community" as const },
  { name: "Youth", group: "community" as const },
  { name: "Black-Women", group: "community" as const },
];

export const projects = [
  {
    name: "Arctic Blizzard Running Club",
    city: "Tromsø",
    country: "Norway",
    region: "Nordics",
    tags: ["Environmental / Outdoor Focus"],
    instagram: "https://instagram.com/arcticblizzard",
    website: "https://www.instagram.com/arcticblizzard.runningclub",
  },
  {
    name: "Bikeygees e.V",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["Refugees"],
    instagram: "https://instagram.com/bikeygees",
    website: "https://bikeygees.org/",
  },
  {
    name: "Black FLINTA* Run",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["BIPOC-led"],
    instagram: "https://instagram.com/stillwerunbln",
  },
  {
    name: "Black Women Run Berlin",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: [],
    instagram: "https://instagram.com/blackwomenrunberlin",
    website: "https://www.instagram.com/blackwomenrunberlin/",
  },
  {
    name: "Black Women Run Hamburg",
    city: "Hamburg",
    country: "Germany",
    region: "Europe",
    tags: ["Black-Women"],
    instagram: "https://instagram.com/blackwomenrunhamburg",
  },
  {
    name: "Black Hike Hamburg",
    city: "Hamburg",
    country: "Germany",
    region: "Europe",
    tags: [],
    instagram: "https://instagram.com/blackhike_hamburg",
  },
  {
    name: "Chicane Bike Club",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["LGBTQIA+", "Woman-led"],
  },
  {
    name: "Climb2connect",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["Refugees", "Asylum-seekers"],
    instagram: "https://instagram.com/climb2connect",
  },
  {
    name: "FLINTA* Workout Club",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["Woman-led"],
    instagram: "https://instagram.com/flintaworkoutclub",
    website: "https://www.instagram.com/flintaworkoutclub/",
  },
  {
    name: "Free to Run",
    city: "",
    country: "",
    region: "Middle East",
    tags: [],
    instagram: "https://instagram.com/freetorunngo",
  },
  {
    name: "Queers Who Sweat",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["LGBTQIA+"],
    instagram: "https://instagram.com/queerswhosweat",
  },
  {
    name: "Panther Active Universe (PAU)",
    city: "Zürich",
    country: "Switzerland",
    region: "Europe",
    tags: ["Beginner", "Youth", "BIPOC-led", "Free/low-cost", "Mental Health Aware"],
    instagram: "https://instagram.com/panther.active.universe",
  },
  {
    name: "Refugee Ride Collective",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    tags: ["Migrant / Refugee support"],
    website: "https://www.refugeeridecollective.cc/",
  },
  {
    name: "Run N Rave",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["BIPOC-led", "Free/low-cost", "Beginner"],
    instagram: "https://instagram.com/run-n-rave",
  },
  {
    name: "Safe Sport e.V.",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: [],
  },
  {
    name: "Team Shoiert",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: [],
    instagram: "https://instagram.com/team.schoiert",
  },
  {
    name: "Terranga",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["BIPOC-led", "Women", "TNB+"],
    instagram: "https://instagram.com/terranga.tri",
  },
  {
    name: "The Rolling Mile",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    tags: ["Free/low-cost", "Beginner"],
    instagram: "https://instagram.com/therollingmile",
  },
  {
    name: "The Mountaincamp",
    city: "",
    country: "",
    region: "EU",
    tags: ["Environmental / Outdoor Focus"],
    instagram: "https://instagram.com/the_mountaincamp",
  },
];

export const founderBio = richText(
  "Sport Is For Everyone was founded by Oumou Aidara, a Senegalese artist, writer, and triathlete based between Berlin and Dakar.",
  "As a Black athlete navigating multiple identities across continents, Oumou experienced firsthand the barriers and exclusions that shape many sporting spaces. What began as a personal response to these realities evolved into a broader collective vision: transforming frustration into action and creating a platform that connects people working toward more inclusive futures of sport.",
  "Across the world, communities are already redefining what sport can mean. From local run crews in Nairobi to cycling collectives in Berlin, from football pitches in Lagos to queer climbing groups in London, grassroots initiatives are building alternative sporting cultures grounded in solidarity, accessibility, and collective care. Sport Is For Everyone exists to connect, support, and amplify these efforts, bridging perspectives across the Global South and North so that the future of sport can truly belong to everyone.",
  "The need for this work is urgent. Across the world, inequalities continue to shape who gets to move. In Europe, 45% of men participate in sport weekly compared to 37% of women. Globally, 85% of adolescent girls do not meet recommended activity levels, according to UNESCO. By documenting lived experiences, supporting grassroots initiatives, and fostering dialogue between athletes, artists, and researchers, Sport Is For Everyone works to imagine and build more equitable sporting futures.",
);

export const aboutBody = richText(
  {
    type: "h3",
    text: "Sport Is For Everyone is a transdisciplinary platform exploring the cultural, social and structural conditions that shape who sport is truly for.",
  },
  "Sport Is For Everyone is a curatorial project and global cultural platform exploring sport as a social, cultural, and political space. Through interviews, artistic research, and collaborative initiatives, the platform documents how movement, bodies, and collective practices reveal broader social dynamics. By connecting athletes, artists, and researchers, Sport Is For Everyone fosters conversations around inclusion, identity, and alternative ways of understanding society through sport.",
  { type: "h2", text: "Founder & CURATOR" },
  "Sport Is For Everyone was founded by Oumou Aidara, a Senegalese artist, writer, and triathlete based between Berlin and Dakar.",
  "As a Black athlete navigating multiple identities across continents, Oumou experienced firsthand the barriers and exclusions that shape many sporting spaces. What began as a personal response to these realities evolved into a broader collective vision: transforming frustration into action and creating a platform that connects people working toward more inclusive futures of sport.",
  "Across the world, communities are already redefining what sport can mean. From local run crews in Nairobi to cycling collectives in Berlin, from football pitches in Lagos to queer climbing groups in London, grassroots initiatives are building alternative sporting cultures grounded in solidarity, accessibility, and collective care. Sport Is For Everyone exists to connect, support, and amplify these efforts, bridging perspectives across the Global South and North so that the future of sport can truly belong to everyone.",
  "The need for this work is urgent. Across the world, inequalities continue to shape who gets to move. In Europe, 45% of men participate in sport weekly compared to 37% of women. Globally, 85% of adolescent girls do not meet recommended activity levels, according to UNESCO. By documenting lived experiences, supporting grassroots initiatives, and fostering dialogue between athletes, artists, and researchers, Sport Is For Everyone works to imagine and build more equitable sporting futures.",
  { type: "h4", text: "OUR FRAMEWORK" },
  "WE OPERATE THROUGH THREE INTERCONNECTED DIMENSIONS",
  { type: "h4", text: "Embodiment" },
  "Sport as practice, discipline, endurance and collective experience.",
  { type: "h4", text: "Inclusion" },
  "Who gets to move, participate and be visible and under what conditions.",
  { type: "h4", text: "Relationality" },
  "How sport creates connections, communities and shared ways of being.",
  { type: "h2", text: "Contact us" },
  "Interested in working together? Fill out some info and we will be in touch shortly. We can’t wait to hear from you!",
  "Work with us, share initiatives, or join the conversation.",
  {
    type: "h3",
    text: "This platform is independent. Your support keeps it free, accessible, and ours.",
  },
  "Your support makes it possible to:",
  {
    type: "ul",
    items: [
      "film and edit interviews",
      "invite athletes and researchers into conversation",
      "keep the platform and database independent and accessible",
    ],
  },
  "Sport is for Everyone is an independent project built through conversations and community.",
  "Sport is for Everyone is an independent project. Contributions support the production of interviews and media work and are not tax-deductible donations.",
);

export const workWithUsBody = richText(
  { type: "h3", text: "Activations & Gatherings" },
  "Sport/walks, hikes, and collective formats exploring embodiment and community.",
  { type: "h3", text: "TALK & PANEL" },
  "Talks & Lectures — Keynotes and talks exploring sport, identity, culture and social dynamics.",
  "Panel Moderation — Research-driven moderation for conversations, panels and public programs.",
  { type: "h3", text: "STORYTELLING & CONCEPTS" },
  "Conversations and interviews with athletes, coaches, artists and researchers, told with depth and intention and new Story-led concepts for brands and creative projects.",
  { type: "h2", text: "How we work" },
  "Interested in working together?",
  "Each collaboration is shaped through dialogue and grounded in SIFE’s framework.",
  { type: "h4", text: "Embodiment" },
  "Movement, practice and lived experience",
  { type: "h4", text: "Inclusion" },
  "Who gets to participate and be visible",
  { type: "h4", text: "Relationality" },
  "Connection, community and shared experience",
  { type: "h4", text: "APPROACH" },
  "Each collaboration is shaped through dialogue and grounded in SIFE’s framework.",
  { type: "h4", text: "WHO IT’S FOR" },
  {
    type: "ul",
    items: [
      "Cultural institutions",
      "Brands and creative studios",
      "Festivals and public programs",
      "Research and academic spaces",
    ],
  },
  { type: "h4", text: "CONTEXT" },
  "Each project is developed in dialogue and responds to specific contexts, communities and questions.",
);

export const impressumBody = richText(
  "Impressum",
  "Angaben gemäß § 5 TMG (Telemediengesetz):",
  "Sport is for Everyone",
  "Verantwortlich für den Inhalt dieser Seite:",
  "Oumou Aidara",
  "Herrfurthplatz 2",
  "12049 Berlin",
  "Deutschland",
  "Kontakt:",
  "E-Mail: hi@oumou.de",
  "Instagram: @sportisforevery1",
  "Haftungsausschluss (Disclaimer)",
  "Die Inhalte dieser Webseite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehme ich jedoch keine Gewähr.",
  "Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.",
  "Urheberrecht",
  "Die auf dieser Webseite erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
  "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
  "Oumou Aidara",
  "Herrfurthplatz 2",
  "12049 Berlin",
);

export const privacyBody = richText(
  "Datenschutzerklärung",
  "Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Webseite kann ohne Angabe personenbezogener Daten genutzt werden. Soweit auf unseren Seiten personenbezogene Daten (z. B. Name, E-Mail-Adresse) erhoben werden, erfolgt dies stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.",
  "Server-Logfiles",
  "Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Logfiles, die Ihr Browser automatisch übermittelt. Dies sind:",
  {
    type: "ul",
    items: [
      "Browsertyp und Browserversion",
      "Verwendetes Betriebssystem",
      "Referrer URL",
      "Hostname des zugreifenden Rechners",
      "Uhrzeit der Serveranfrage",
    ],
  },
  "Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.",
  "Cookies",
  "Unsere Website verwendet ggf. Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.",
  "Kontaktformular / E-Mail",
  "Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
  "Social Media Links",
  "Diese Website kann Links zu sozialen Netzwerken (Instagram etc.) enthalten. Beim Anklicken dieser Links verlassen Sie unsere Website. Für die Verarbeitung personenbezogener Daten auf den Plattformen sind ausschließlich die jeweiligen Anbieter verantwortlich.",
  "Recht auf Auskunft, Löschung, Sperrung",
  "Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.",
);

export const joinBody = richText(
  "We’re in our launch phase right now, building the first version of our platform. You’re very welcome to apply to have your project featured in our Community Database or contribute to our shared Resources.",
);

export const odeExcerpt =
  "This short is a nostalgic reflection on created memories. As we follow three friends around the beautiful city of Berlin, we’re holding on the days we may only understand once they passed. Embracing the importance of true friendship and living in the moment.";

export const neverTooLateExcerpt =
  '"Never Too Late" tells the remarkable story of professional trail runner Admire Muzopambwa: from humble beginnings and his journey to South Africa, to finding running later than most. A story intertwined with his battle at the 2025 UTCT 100miler. A powerful reminder to us all that your start doesn\'t dictate your finish.';

export const laneLinesExcerpt =
  "Senegal is stepping into a rare and historic moment. In 2026, Dakar is scheduled to host the Youth Olympic Games — the first Olympic event ever held on African soil. This matters not only because of symbolism, but because it shifts the geography of global sport. For once, the world is being asked to look toward Africa not only as a reservoir of talent, but as a stage, a host, and a center.";
