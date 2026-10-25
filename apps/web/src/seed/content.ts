import path from "path";
import { fileURLToPath } from "url";

import { richText } from "./lexical";

const dirname = path.dirname(fileURLToPath(import.meta.url));
export const seedDir = path.resolve(dirname, "../../public/seed");

export const mediaFiles = {
  emblemLime: { file: "EmblemLime.png", alt: "Sport is for Everyone" },
  emblemBlue: { file: "emblemBlue.png", alt: "Sport is for Everyone" },
  ed1Tee: { file: "shop/sife-ed1-tee.jpg", alt: "SIFE ED1 Tee with Running Fist print" },
  ed2Hoodie: { file: "shop/sife-ed2-hoodie.jpg", alt: "SIFE ED2 Hoodie with Running Fist print" },
  ed3Cap: { file: "shop/sife-ed3-cap.jpg", alt: "SIFE ED3 Cap with Running Fist mark" },
  ed4Tote: { file: "shop/sife-ed4-tote.jpg", alt: "SIFE ED4 Tote with Running Fist print" },
  ed5Print: { file: "shop/sife-ed5-print.jpg", alt: "SIFE ED5 Running Fist print" },
  ed6Socks: { file: "shop/sife-ed6-socks.jpg", alt: "SIFE ED6 socks" },
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
);

export const workWithUsBody = richText(
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

/** Long-form demo bodies — editable/deletable in Payload admin. */
export const dakarStoryBody = richText(
  { type: "h2", text: "Arrival" },
  "Dakar does not introduce itself quietly. The Atlantic is loud, the markets are louder, and sport sits between both — informal pitches in the sand, school tracks at dusk, and the long preparation for a Games that will ask the city to host the world.",
  "This first volume of Stories Across Borders follows that tension. Who gets to train in daylight? Who watches from the stands? Who is written into the Olympic narrative, and who remains a backdrop?",
  { type: "h2", text: "Bodies and borders" },
  "Across conversations with athletes, coaches, and organisers, a pattern returns: infrastructure is never only concrete. It is permission. A floodlit pitch is a timetable. A clubhouse is a network. A ferry fare is the difference between training and staying home.",
  "We walk neighbourhoods where football is less a product than a daily language. Kids invent rules mid-game. Elders keep score from plastic chairs. The field is public until it isn’t — until a sponsor, a fence, or a municipal schedule redraws who can stay.",
  { type: "h3", text: "What we carried home" },
  "This piece is not a travel diary. It is field notes toward a different map of sport — one that starts from lived practice rather than from medals alone.",
  {
    type: "ul",
    items: [
      "Access is negotiated daily, not granted once.",
      "Visibility without resources creates pressure without care.",
      "Grassroots organisers already hold the curriculum the institutions later claim.",
    ],
  },
  { type: "h2", text: "Toward the Youth Olympic Games" },
  "When Dakar hosts, cameras will arrive with ready-made frames. Our work is to keep asking what those frames leave out: the coaches unpaid between seasons, the girls who train before school, the clubs that share balls because buying a new set means skipping rent.",
  "Vol. 01 ends where the next conversation begins — not with a conclusion, but with a set of names, places, and open questions for editors and readers to keep returning to.",
  "Seed note for editors: replace or delete this demo text in Admin → Stories whenever real copy is ready.",
);

export const itenStoryBody = richText(
  { type: "h2", text: "Altitude and expectation" },
  "Iten is famous for producing champions. That fame can flatten a place into a factory myth — as if thin air alone manufactures excellence. On the ground, the story is more relational: lodging, coaching lineages, family economies, and the quiet labour of people who never appear on a finish-line graphic.",
  "Vol. 02 listens for those quieter frequencies. What does it mean to train where the world’s gaze already expects gold? What happens to athletes who arrive without the right passport, sponsor, or storyline?",
  { type: "h2", text: "The road before dawn" },
  "Before sunrise, groups form by habit more than by branding. Some runners share rooms; some share plans; some share silence. The road is a commons until traffic and tourism intervene.",
  "We speak with a coach who measures success not only in podiums but in whether athletes leave with enough money to return home with dignity. We speak with a runner who left a city job to chase times that may never convert into a contract.",
  { type: "h3", text: "Care as infrastructure" },
  "Injury care, nutrition, and rest are often framed as personal discipline. In Iten they are also logistics — who cooks, who pays for physio, who decides when a body must stop.",
  "Sport Is For Everyone uses these notes to argue that inclusion is not a soft add-on to performance. It is the condition under which performance can be ethical.",
  { type: "h2", text: "Leaving with questions" },
  "This volume does not close the file on Iten. It asks readers to hold two truths at once: extraordinary excellence, and the uneven ground that produces it.",
  "Editors: this is seed copy for layout QA. Delete or rewrite freely in the CMS.",
);

export const whereSheStandsBody = richText(
  { type: "h2", text: "Standing in the frame" },
  "Where She Stands gathers stories by women, for women — not as a niche corner of the platform, but as a lens on how sport distributes risk, joy, and visibility.",
  "This demo essay follows a fictionalised composite drawn from recurring themes in SIFE conversations: safety on evening runs, coaching that takes women’s strength seriously, and media that still treats women’s sport as secondary.",
  { type: "h2", text: "The commute is part of the sport" },
  "For many athletes, the hardest kilometre is not on the track. It is the walk to the bus after dark, the negotiation with family schedules, the calculation of whether a kit bag makes you a target.",
  "When institutions talk about participation rates, they rarely budget for street lighting, childcare, or changing rooms that assume more than one body type.",
  { type: "h3", text: "What solidarity looks like" },
  {
    type: "ul",
    items: [
      "Crews that wait at corners instead of racing ahead.",
      "Coaches who schedule sessions around school runs.",
      "Editors who publish women’s races as main stories, not sidebars.",
    ],
  },
  { type: "h2", text: "A living series" },
  "Future pieces will centre named voices with consent and care. For now, this long-form seed exists so you can judge typography, spacing, and how a full article sits on cream against Bolting Blue chrome.",
  "Remove this document anytime under Admin → Stories.",
);

export const educationStoryBody = richText(
  { type: "h2", text: "A starter curriculum" },
  "Academy / Education is where SIFE collects teachable notes — workshop outlines, reading lists, and prompts for hosts who want to run conversations without reinventing the wheel.",
  "This demo module is long enough to stress-test the reading layout: headings, lists, and consecutive paragraphs on a cream surface.",
  { type: "h2", text: "Session one — Who is sport for?" },
  "Open with a five-minute free write. Ask participants to list every place they have felt welcome moving their body, and every place they have felt watched or excluded. Share in pairs, then map themes on a wall.",
  "Facilitator note: do not rush to solutions. The point is to make structural patterns audible.",
  { type: "h3", text: "Materials" },
  {
    type: "ul",
    items: [
      "Paper and pens",
      "A simple map of the neighbourhood or campus",
      "Optional: a short SIFE film clip (under three minutes)",
    ],
  },
  { type: "h2", text: "Session two — Designing access" },
  "Invite the group to redesign one familiar sporting space: a school gym, a park loop, a climbing hall. Constraints: same budget, clearer hospitality. What changes first — signage, staffing, timing, or pricing?",
  "Close by drafting one actionable ask participants can take to a club, school, or city office.",
  "Seed content — delete when real Academy materials are uploaded.",
);

export const odeFilmBody = richText(
  { type: "h2", text: "About the film" },
  odeExcerpt,
  "Berlin appears here not as postcard, but as a rhythm of streets friends share until they don’t. The camera stays close enough to feel casual, then pulls back just when nostalgia threatens to freeze the moment.",
  { type: "h2", text: "Why it sits in the archive" },
  "SIFE screens work that treats friendship, play, and urban movement as political without becoming didactic. Ode to Friendship belongs in that lane: short, warm, and precise about what it means to hold each other in a city that keeps moving.",
  { type: "h3", text: "Credits context" },
  "Full credits live in the Credits field in Admin. This body text is seed copy so the film page can show a readable article column beneath the player.",
);

export const neverTooLateBody = richText(
  { type: "h2", text: "Starting later" },
  neverTooLateExcerpt,
  "The film refuses the tidy arc of talent discovered young. Instead it stays with the awkward middle — visas, injuries, self-doubt — and the community that keeps a runner upright when the story isn’t cinematic yet.",
  { type: "h2", text: "Trail as testimony" },
  "Ultras are often sold as individual will. Here the mountain is also a ledger of care: who paces, who drives, who believes when ranking lists do not.",
  "Editors can expand this with interviews, stills, and links once rights are cleared. Until then, this longer seed body lets you preview the film article layout.",
);

export const laneLinesBody = richText(
  { type: "h2", text: "A stage, not only a pipeline" },
  laneLinesExcerpt,
  "Lane lines organise more than races. They organise who is centre and who is margin. As Dakar prepares, SIFE asks how hosting can redistribute attention without extracting local labour as unpaid spectacle.",
  { type: "h2", text: "Listening on the ground" },
  "Between training sessions and municipal briefings, athletes describe pride and pressure in the same breath. Coaches ask whether temporary venues will leave lasting clubs. Parents ask whether girls will still have space after the cameras leave.",
  { type: "h3", text: "Questions we keep open" },
  {
    type: "ul",
    items: [
      "Who owns the narrative when the Games arrive?",
      "What infrastructure remains public afterward?",
      "How do we archive local knowledge without flattening it into tourism?",
    ],
  },
  "This seed article is longer on purpose — delete or rewrite in Admin → Films.",
);

export const interviewAdmireBody = richText(
  { type: "h2", text: "Field notes" },
  "This demo field interview is written as a long-form conversation so editors can judge how Q&A and narrative paragraphs sit on the interview template.",
  { type: "h3", text: "On beginning" },
  "“People love an early prodigy story. Mine starts later. I had to learn that late is still a time.”",
  "We speak about migration, work, and the first months of learning to trust a coach. The answers are not polished press lines; they circle back to family and rent and the strange relief of a long climb.",
  { type: "h3", text: "On community" },
  "“You don’t finish an ultra alone. Even when the photos show one body, there is a whole kitchen and a whole group chat behind it.”",
  "The second half of the interview turns toward representation — what it means to be seen as exceptional while still negotiating ordinary barriers to training time.",
  { type: "h2", text: "Closing" },
  "SIFE will replace this seed interview with a consented, edited transcript. Until then, keep or delete it from Admin → Field Interviews.",
);

export const interviewOumouBody = richText(
  { type: "h2", text: "Why the platform exists" },
  "In this long demo conversation, Oumou Aidara (composite seed voice for layout) reflects on building Sport Is For Everyone between Berlin and Dakar — as artist, athlete, and organiser.",
  { type: "h3", text: "On anger that becomes structure" },
  "“Anger is information. The work is to turn it into rooms, films, and a database that outlive a single viral moment.”",
  "She describes early gatherings that looked like hikes and felt like research: silence, shared pace, and the politics of who feels safe in public space.",
  { type: "h3", text: "On bilingual publishing" },
  "“Chrome can be translated. Lived stories need care. We show English originals when German isn’t ready yet — honesty over fake completeness.”",
  { type: "h2", text: "What comes next" },
  "Academy materials, more field interviews, and a shop that funds independence without pretending merch is a donation. Editors: rewrite this seed interview whenever the real transcript is approved.",
);

export const upcomingPanelBody = richText(
  { type: "h2", text: "An evening of film and talk" },
  "Join SIFE for a screening night and open conversation on inclusion in urban sport. This upcoming event is seed content so the homepage strip and events calendar can show a future date.",
  "Programme (demo): short films, a moderated exchange, and time to meet organisers from the database.",
  { type: "h3", text: "Practical" },
  {
    type: "ul",
    items: [
      "Doors open 18:30",
      "Accessible entrance via courtyard",
      "Sliding-scale tickets; no one turned away for lack of funds (demo policy)",
    ],
  },
  "Delete or reschedule in Admin → Events.",
);

export const upcomingWalkBody = richText(
  { type: "h2", text: "Slow walk, city edges" },
  "A weekend gathering for collective movement at an easy pace — less race, more relation. Seed event for layout and CMS testing.",
  "We meet, walk, pause for a short reading, and end with tea. Bring water and whatever body you arrived with.",
  "Editors can remove this anytime under Events.",
);