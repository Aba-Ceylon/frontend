import { Destination } from "@/types/destination";

const destinationSeeds: Omit<Destination, "id">[] = [
  {
    name: "Colombo",
    slug: "colombo",
    category: "City",
    region: "West Coast",
    province: "Western Province",
    district: "Colombo",
    coordinates: [79.8612, 6.9271],
    summary: "Sri Lanka's commercial capital and main arrival hub",
    description:
      "Colombo blends oceanfront promenades, markets, heritage buildings, temples, and luxury hotels, making it the island's easiest urban starting point.",
    highlights: [
      "Galle Face Green and seafront dining",
      "Pettah Market and colonial streets",
      "Easy airport and highway access",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It works perfectly as a first or last stop for travelers wanting city energy, shopping, and smooth transport links.",
  },
  {
    name: "Gampaha",
    slug: "gampaha",
    category: "City",
    region: "West Coast",
    province: "Western Province",
    district: "Gampaha",
    coordinates: [79.9994, 7.0873],
    summary: "Western gateway district close to the airport and wetlands",
    description:
      "Gampaha is a practical west coast base with quick access to Bandaranaike International Airport, wetlands, temples, and the broader Negombo area.",
    highlights: [
      "Fast airport access",
      "Wetland and lagoon landscapes",
      "Good connection to the west coast",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is useful for arrivals, departures, and short west coast stays that need convenience without entering central Colombo first.",
  },
  {
    name: "Kalutara",
    slug: "kalutara",
    category: "City",
    region: "West Coast",
    province: "Western Province",
    district: "Kalutara",
    coordinates: [79.9607, 6.5854],
    summary: "Relaxed southwest district with beaches, river views, and temples",
    description:
      "Kalutara pairs river scenery with palm-lined beaches and Buddhist landmarks, giving travelers an easy coastal stop south of Colombo.",
    highlights: [
      "Kalutara Bodhiya",
      "Kalu Ganga river scenery",
      "Quick access to southwest beaches",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is a convenient coastal break for travelers moving between Colombo and the southern beach belt.",
  },
  {
    name: "Negombo",
    slug: "negombo",
    category: "City",
    region: "West Coast",
    province: "Western Province",
    district: "Gampaha",
    coordinates: [79.8412, 7.2083],
    summary: "Beach town near the airport with canals, seafood, and lagoon life",
    description:
      "Negombo is one of Sri Lanka's most useful entry towns, known for lagoon cruises, seafood restaurants, colonial churches, and easy airport access.",
    highlights: [
      "Negombo Lagoon boat rides",
      "Seafood restaurants and beach hotels",
      "Best airport access on the island",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is ideal for soft landings and final nights when you want a beach atmosphere without a long transfer.",
  },
  {
    name: "Bentota",
    slug: "bentota",
    category: "Beach",
    region: "West Coast",
    province: "Southern Province",
    district: "Galle",
    coordinates: [79.9959, 6.4218],
    summary: "West coast beach resort zone known for comfort and water sports",
    description:
      "Bentota combines wide golden beaches, riverside leisure, and upscale resorts, making it one of Sri Lanka's classic luxury beach stops.",
    highlights: [
      "Wide sandy beach",
      "Bentota River activities",
      "Luxury resorts and spas",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is one of the easiest beach destinations for travelers wanting comfort, water activities, and quick road access from Colombo.",
  },
  {
    name: "Kalpitiya",
    slug: "kalpitiya",
    category: "Beach",
    region: "West Coast",
    province: "North Western Province",
    district: "Puttalam",
    coordinates: [79.7818, 8.2333],
    summary: "Windy peninsula known for kitesurfing, dolphins, and sandbanks",
    description:
      "Kalpitiya is a laid-back coastal peninsula famous for kitesurfing, dolphin watching, and quiet beaches away from the busier south coast.",
    highlights: [
      "Kitesurfing season and lagoon winds",
      "Dolphin and whale watching trips",
      "Remote beach atmosphere",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is one of the best alternatives for travelers who want a more open, less commercial coastal experience.",
  },
  {
    name: "Kurunegala",
    slug: "kurunegala",
    category: "City",
    region: "West Coast",
    province: "North Western Province",
    district: "Kurunegala",
    coordinates: [80.3647, 7.4863],
    summary: "Northwest transit city with rock outcrops and heritage links",
    description:
      "Kurunegala is a practical inland base in the northwest, known for elephant-shaped hills, regional markets, and access to Yapahuwa and the cultural heartland.",
    highlights: [
      "Rock outcrop landscapes",
      "Regional food and local markets",
      "Gateway to Yapahuwa and northwest routes",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It helps connect western arrivals with heritage sites and the northwestern districts without backtracking through Colombo.",
  },
  {
    name: "Puttalam",
    slug: "puttalam",
    category: "City",
    region: "West Coast",
    province: "North Western Province",
    district: "Puttalam",
    coordinates: [79.8411, 8.0362],
    summary: "Lagoon district linking Kalpitiya, Wilpattu, and the northwest coast",
    description:
      "Puttalam is a broad lagoon district that connects the northwest coast to safari country, especially Kalpitiya and Wilpattu National Park.",
    highlights: [
      "Large lagoon landscapes",
      "Route to Kalpitiya and Wilpattu",
      "Useful northwestern stopover",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is a strong gateway district when itineraries combine west coast beaches with wildlife or northern travel.",
  },
  {
    name: "Wilpattu National Park",
    slug: "wilpattu-national-park",
    category: "Wildlife",
    region: "Wildlife Belt",
    province: "North Western Province",
    district: "Puttalam",
    coordinates: [80.0088, 8.4625],
    summary: "Sri Lanka's largest national park with lakes, forest, and leopards",
    description:
      "Wilpattu is known for its natural lakes, dry forest, and quieter safari experience, with strong chances of spotting leopards, sloth bears, and deer.",
    highlights: [
      "Natural villu lakes",
      "Leopard and sloth bear sightings",
      "Less crowded safari atmosphere",
    ],
    bestTimeToVisit: "February to October",
    whyVisit:
      "It is ideal for travelers who want a wilder, calmer safari than the busier southern parks.",
  },
  {
    name: "Kandy",
    slug: "kandy",
    category: "City",
    region: "Hill Country",
    province: "Central Province",
    district: "Kandy",
    coordinates: [80.6337, 7.2906],
    summary: "Hill capital of Sri Lanka known for culture, lake views, and royal history",
    description:
      "Kandy is Sri Lanka's cultural hill capital, combining royal heritage, lakefront walks, traditional arts, and easy access to the central highlands.",
    highlights: [
      "Kandy Lake and city walks",
      "Traditional dance and cultural heritage",
      "Gateway to the hill country",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is one of the island's essential cultural towns and a natural bridge between heritage circuits and mountain itineraries.",
  },
  {
    name: "Temple of the Tooth Relic",
    slug: "temple-of-tooth-relic",
    category: "Heritage",
    region: "Hill Country",
    province: "Central Province",
    district: "Kandy",
    coordinates: [80.64, 7.2936],
    summary: "Sacred Buddhist temple in Kandy",
    description:
      "Located in the royal palace complex of Kandy, the Temple of the Tooth Relic houses the relic of the tooth of Buddha and remains one of Sri Lanka's most revered pilgrimage sites.",
    highlights: [
      "Sacred tooth relic of Buddha",
      "Daily puja ceremonies",
      "Royal complex and Kandy Lake views",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is the spiritual centerpiece of Kandy and one of the most culturally important sites in the country.",
  },
  {
    name: "Matale",
    slug: "matale",
    category: "City",
    region: "Cultural Triangle",
    province: "Central Province",
    district: "Matale",
    coordinates: [80.6244, 7.4675],
    summary: "Gateway district between Kandy and the Cultural Triangle",
    description:
      "Matale is a strategic and scenic district linking Kandy with Sigiriya and Dambulla, known for spice gardens, temples, and cultural stopovers.",
    highlights: [
      "Spice garden visits",
      "Easy access to Sigiriya and Dambulla",
      "Cultural and scenic road stop",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It sits on one of Sri Lanka's most useful travel corridors and adds flavor to heritage routes through the island interior.",
  },
  {
    name: "Sigiriya",
    slug: "sigiriya",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "Central Province",
    district: "Matale",
    coordinates: [80.7597, 7.957],
    summary: "Ancient rock fortress and UNESCO World Heritage Site",
    description:
      "Sigiriya, also known as Lion Rock, is an ancient rock fortress and one of Sri Lanka's most iconic archaeological landmarks, rising dramatically above the surrounding plains.",
    highlights: [
      "Lion Rock summit climb",
      "Frescoes and Mirror Wall",
      "Water gardens and panoramic views",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It is the signature image of Sri Lanka tourism, combining archaeology, engineering, and unforgettable scenery in one stop.",
  },
  {
    name: "Pidurangala",
    slug: "pidurangala",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "Central Province",
    district: "Matale",
    coordinates: [80.7603, 7.966],
    summary: "Rock temple and viewpoint facing Sigiriya",
    description:
      "Pidurangala is an ancient monastic site and a favorite sunrise climb, best known for its sweeping view of Sigiriya Rock across the jungle plain.",
    highlights: [
      "Best panoramic view of Sigiriya",
      "Ancient cave temple setting",
      "Popular sunrise and sunset hike",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It gives travelers a more adventurous climb and one of the best viewpoints in the Cultural Triangle.",
  },
  {
    name: "Dambulla",
    slug: "dambulla",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "Central Province",
    district: "Matale",
    coordinates: [80.6517, 7.8567],
    summary: "Golden Temple and ancient cave complex",
    description:
      "The Dambulla Cave Temple is the largest and best-preserved cave temple complex in Sri Lanka, filled with statues, murals, and centuries of Buddhist heritage.",
    highlights: [
      "Five cave shrines",
      "Ancient murals and Buddha statues",
      "Hilltop views over the plains",
    ],
    bestTimeToVisit: "January to September",
    whyVisit:
      "It is one of Sri Lanka's most complete and atmospheric temple experiences in the heart of the heritage circuit.",
  },
  {
    name: "Habarana",
    slug: "habarana",
    category: "City",
    region: "Cultural Triangle",
    province: "North Central Province",
    district: "Anuradhapura",
    coordinates: [80.7471, 8.0362],
    summary: "Central junction town linking Sigiriya, Dambulla, and nearby safaris",
    description:
      "Habarana is one of the most practical bases in the Cultural Triangle, surrounded by lakes, forests, heritage sites, and quick safari access.",
    highlights: [
      "Easy access to Sigiriya and Dambulla",
      "Near Minneriya safari country",
      "Strong base for village and nature experiences",
    ],
    bestTimeToVisit: "January to September",
    whyVisit:
      "It is one of the smartest overnight bases for travelers who want archaeology, wildlife, and short transfer times in one place.",
  },
  {
    name: "Anuradhapura",
    slug: "anuradhapura",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "North Central Province",
    district: "Anuradhapura",
    coordinates: [80.3956, 8.3114],
    summary: "Ancient capital with sacred Buddhist sites",
    description:
      "Anuradhapura was Sri Lanka's first great kingdom and remains a sacred city of stupas, monasteries, reservoirs, and the revered Sri Maha Bodhi tree.",
    highlights: [
      "Sri Maha Bodhi",
      "Ruwanwelisaya and Jetavanaramaya",
      "Ancient monasteries and reservoirs",
    ],
    bestTimeToVisit: "February to September",
    whyVisit:
      "It is one of the island's deepest historical experiences and a core UNESCO stop for heritage travelers.",
  },
  {
    name: "Mihintale",
    slug: "mihintale",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "North Central Province",
    district: "Anuradhapura",
    coordinates: [80.5103, 8.3547],
    summary: "Sacred hill where Buddhism is believed to have arrived in Sri Lanka",
    description:
      "Mihintale is one of Sri Lanka's most important pilgrimage sites, centered on a rocky hill with shrines, stairways, and a major place in Buddhist history.",
    highlights: [
      "Historic Buddhist pilgrimage site",
      "Rocky summit viewpoints",
      "Monastic ruins and dagobas",
    ],
    bestTimeToVisit: "January to September",
    whyVisit:
      "It adds spiritual depth and elevated views to any Anuradhapura visit.",
  },
  {
    name: "Ritigala Monastery",
    slug: "ritigala-monastery",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "North Central Province",
    district: "Anuradhapura",
    coordinates: [80.6692, 8.1369],
    summary: "Forest monastery ruins hidden in a strict nature reserve",
    description:
      "Ritigala is an atmospheric monastic site tucked into dense forest, where stone pathways and meditation platforms sit beneath a misty mountain ridge.",
    highlights: [
      "Forest monastery ruins",
      "Quiet jungle setting",
      "Offbeat heritage atmosphere",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It offers a calmer and more mysterious alternative to the larger archaeological sites in the Cultural Triangle.",
  },
  {
    name: "Polonnaruwa",
    slug: "polonnaruwa",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "North Central Province",
    district: "Polonnaruwa",
    coordinates: [81.0, 7.9403],
    summary: "Medieval capital with stunning stone sculptures",
    description:
      "Polonnaruwa was Sri Lanka's medieval capital and remains one of the island's best-preserved archaeological cities, filled with royal ruins and sacred monuments.",
    highlights: [
      "Gal Vihara stone Buddhas",
      "Royal palace and Vatadage",
      "Easy cycling around the ruins",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It delivers one of the most complete ancient-city experiences in South Asia with remarkable preservation.",
  },
  {
    name: "Minneriya National Park",
    slug: "minneriya-national-park",
    category: "Wildlife",
    region: "Wildlife Belt",
    province: "North Central Province",
    district: "Polonnaruwa",
    coordinates: [80.8917, 8.0404],
    summary: "Famous elephant park in the Cultural Triangle",
    description:
      "Minneriya is best known for the seasonal elephant gathering, when large herds assemble around the tank in one of Sri Lanka's most impressive wildlife spectacles.",
    highlights: [
      "Large elephant gatherings",
      "Tank-side safari landscapes",
      "Easy add-on from Sigiriya or Polonnaruwa",
    ],
    bestTimeToVisit: "July to October",
    whyVisit:
      "It is one of the easiest and most rewarding wildlife experiences for travelers already touring the heritage heartland.",
  },
  {
    name: "Yapahuwa Rock Fortress",
    slug: "yapahuwa-rock-fortress",
    category: "Heritage",
    region: "Cultural Triangle",
    province: "North Western Province",
    district: "Kurunegala",
    coordinates: [80.303, 7.8196],
    summary: "Ancient rock citadel with one of Sri Lanka's finest stone stairways",
    description:
      "Yapahuwa was once a medieval capital and is especially admired for its dramatic rock setting and intricately carved stone stairway.",
    highlights: [
      "Iconic carved staircase",
      "Rock fortress ruins",
      "Less crowded heritage stop",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It is a rewarding side trip for heritage travelers who want a quieter, lesser-known ancient capital.",
  },
  {
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    category: "Nature",
    region: "Hill Country",
    province: "Central Province",
    district: "Nuwara Eliya",
    coordinates: [80.7891, 6.9497],
    summary: "Cool hill station of tea estates, gardens, and colonial charm",
    description:
      "Nuwara Eliya is Sri Lanka's best-known hill station, loved for its cool weather, tea gardens, lake scenery, and old-world architecture.",
    highlights: [
      "Tea estates and tastings",
      "Cool mountain climate",
      "Colonial architecture and Gregory Lake",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It is a classic base for tea-country scenery and a strong contrast to the island's warmer lowlands.",
  },
  {
    name: "Tea Plantations",
    slug: "tea-plantations",
    category: "Nature",
    region: "Hill Country",
    province: "Central Province",
    district: "Nuwara Eliya",
    coordinates: [80.7718, 6.9497],
    summary: "Lush highland tea estates and factory trails",
    description:
      "Sri Lanka's central highlands are carpeted with emerald tea fields, offering factory tours, tastings, and some of the island's most photogenic road journeys.",
    highlights: [
      "Rolling tea-covered hills",
      "Factory tours and tastings",
      "Cool, misty viewpoints",
    ],
    bestTimeToVisit: "January to March",
    whyVisit:
      "It captures the signature visual identity of the hill country and the story behind Ceylon tea.",
  },
  {
    name: "Horton Plains",
    slug: "horton-plains",
    category: "Nature",
    region: "Hill Country",
    province: "Central Province",
    district: "Nuwara Eliya",
    coordinates: [80.802, 6.8094],
    summary: "High-altitude plateau with grasslands, cloud forest, and World's End",
    description:
      "Horton Plains National Park is a dramatic upland landscape of montane forest and open grassland, best known for the cliff-edge viewpoint called World's End.",
    highlights: [
      "World's End viewpoint",
      "Cool high-elevation hiking",
      "Cloud forest and wildlife",
    ],
    bestTimeToVisit: "January to March",
    whyVisit:
      "It is one of the island's most distinctive walks and a must for mountain scenery in the central highlands.",
  },
  {
    name: "Knuckles Mountain Range",
    slug: "knuckles-mountain-range",
    category: "Nature",
    region: "Hill Country",
    province: "Central Province",
    district: "Matale",
    coordinates: [80.779, 7.463],
    summary: "UNESCO-listed mountain wilderness for trekking and scenery",
    description:
      "The Knuckles range offers forest trails, dramatic ridgelines, traditional villages, and some of Sri Lanka's best trekking terrain.",
    highlights: [
      "Serious trekking routes",
      "UNESCO conservation landscape",
      "Cloud forest and mountain views",
    ],
    bestTimeToVisit: "January to March",
    whyVisit:
      "It is one of the strongest choices for travelers who want a more rugged and immersive mountain experience.",
  },
  {
    name: "Ella",
    slug: "ella",
    category: "Nature",
    region: "Hill Country",
    province: "Uva Province",
    district: "Badulla",
    coordinates: [81.0463, 6.8667],
    summary: "Popular hill-country village of hikes, viewpoints, and train scenery",
    description:
      "Ella is a compact mountain town framed by tea estates, dramatic gaps, waterfalls, and easy hiking routes, making it one of Sri Lanka's most loved highland stops.",
    highlights: [
      "Little Adam's Peak and Ella Gap",
      "Tea-country scenery",
      "Relaxed mountain-town atmosphere",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It combines easy adventure, iconic scenery, and a very approachable hill-country vibe in one place.",
  },
  {
    name: "Nine Arch Bridge",
    slug: "nine-arch-bridge",
    category: "Nature",
    region: "Hill Country",
    province: "Uva Province",
    district: "Badulla",
    coordinates: [81.0458, 6.8719],
    summary: "Iconic colonial railway bridge in Ella",
    description:
      "The Nine Arch Bridge is one of Sri Lanka's most photographed rail landmarks, set amid thick greenery and tea-country hills near Ella.",
    highlights: [
      "Historic stone railway bridge",
      "Train photography hotspot",
      "Short hike from Ella town",
    ],
    bestTimeToVisit: "December to March",
    whyVisit:
      "It is one of the easiest and most memorable viewpoints on the scenic Kandy-Ella rail corridor.",
  },
  {
    name: "Haputale",
    slug: "haputale",
    category: "Nature",
    region: "Hill Country",
    province: "Uva Province",
    district: "Badulla",
    coordinates: [80.951, 6.765],
    summary: "Misty ridge town known for Lipton's Seat and tea-country views",
    description:
      "Haputale sits along a mountain ridge with sweeping panoramas over the southern plains and access to Lipton's Seat and nearby tea estates.",
    highlights: [
      "Lipton's Seat sunrise views",
      "Cool ridge-top climate",
      "Tea-country road journeys",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It is one of the best places to experience Sri Lanka's high-elevation tea landscape without the crowds of larger towns.",
  },
  {
    name: "Badulla",
    slug: "badulla",
    category: "City",
    region: "Hill Country",
    province: "Uva Province",
    district: "Badulla",
    coordinates: [81.055, 6.9934],
    summary: "Uva highland capital linking Ella, waterfalls, and tea routes",
    description:
      "Badulla is a practical hill-country town surrounded by tea slopes, valleys, bridges, and waterfalls, serving as a wider gateway to the Uva region.",
    highlights: [
      "Gateway to Ella and Haputale",
      "Hill-country rail and road routes",
      "Local town life beyond tourist hubs",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It broadens an Ella itinerary with a more local view of the eastern hill country.",
  },
  {
    name: "Adam's Peak",
    slug: "adams-peak",
    category: "Unique",
    region: "Hill Country",
    province: "Sabaragamuwa Province",
    district: "Ratnapura",
    coordinates: [80.4994, 6.8096],
    summary: "Sacred mountain climbed for sunrise and pilgrimage",
    description:
      "Adam's Peak, also known as Sri Pada, is a sacred mountain climbed overnight by pilgrims and hikers who gather at the summit for dawn views.",
    highlights: [
      "Overnight pilgrimage climb",
      "Sacred summit footprint shrine",
      "Sunrise above the cloud line",
    ],
    bestTimeToVisit: "December to May",
    whyVisit:
      "It is one of Sri Lanka's most powerful shared travel experiences, combining faith, effort, and mountain drama.",
  },
  {
    name: "Kitulgala",
    slug: "kitulgala",
    category: "Unique",
    region: "Hill Country",
    province: "Sabaragamuwa Province",
    district: "Kegalle",
    coordinates: [80.4177, 6.9892],
    summary: "Rainforest river town known for rafting and outdoor adventure",
    description:
      "Kitulgala sits on the Kelani River and is Sri Lanka's best-known destination for white-water rafting, canyoning, and wet-zone forest scenery.",
    highlights: [
      "White-water rafting",
      "River and rainforest setting",
      "Adventure base near Colombo",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It is the easiest place in the country to add a dose of soft adventure to a culture or hill-country itinerary.",
  },
  {
    name: "Ratnapura",
    slug: "ratnapura",
    category: "City",
    region: "Hill Country",
    province: "Sabaragamuwa Province",
    district: "Ratnapura",
    coordinates: [80.4037, 6.6828],
    summary: "Gem capital of Sri Lanka and gateway to rainforest foothills",
    description:
      "Ratnapura is known for gem trading, river valleys, and access to Adam's Peak and Sinharaja, making it an important foothill town in the southwest interior.",
    highlights: [
      "Gem markets and mining heritage",
      "Gateway to Adam's Peak",
      "Foothill landscapes and rivers",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It adds local character and gem-country identity to routes that move between the hills and the southern forests.",
  },
  {
    name: "Kegalle",
    slug: "kegalle",
    category: "City",
    region: "Hill Country",
    province: "Sabaragamuwa Province",
    district: "Kegalle",
    coordinates: [80.3488, 7.2513],
    summary: "Foothill district that links Colombo to Kitulgala and the hills",
    description:
      "Kegalle is a useful inland stop in the western foothills, connecting Colombo with Kitulgala, the hill country, and the Sabaragamuwa interior.",
    highlights: [
      "Western foothill scenery",
      "Route into Kitulgala and hill country",
      "Convenient inland stopover",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It strengthens west-to-hill-country itineraries by opening the greener interior beyond the main expressway corridor.",
  },
  {
    name: "Sinharaja Rainforest",
    slug: "sinharaja-rainforest",
    category: "Unique",
    region: "South Coast",
    province: "Sabaragamuwa Province",
    district: "Ratnapura",
    coordinates: [80.4636, 6.406],
    summary: "UNESCO rainforest rich in endemic birds and wet-zone biodiversity",
    description:
      "Sinharaja is Sri Lanka's most famous lowland rainforest, celebrated for endemic birdlife, dense canopy, streams, and guided jungle walks.",
    highlights: [
      "UNESCO rainforest reserve",
      "Endemic birds and biodiversity",
      "Guided jungle trekking",
    ],
    bestTimeToVisit: "January to April",
    whyVisit:
      "It is the country's most iconic rainforest experience and a strong counterpoint to the dry-zone parks and beach circuits.",
  },
  {
    name: "Galle",
    slug: "galle",
    category: "City",
    region: "South Coast",
    province: "Southern Province",
    district: "Galle",
    coordinates: [80.217, 6.0535],
    summary: "Southern coastal city mixing heritage streets, cafes, and beach access",
    description:
      "Galle is the main urban anchor of Sri Lanka's south coast, known for its fort, boutique hotels, cafes, and easy reach to nearby beaches.",
    highlights: [
      "Historic old town atmosphere",
      "Good base for the south coast",
      "Boutique stays and dining",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It combines convenience, style, and heritage better than almost any other coastal stop in Sri Lanka.",
  },
  {
    name: "Galle Fort",
    slug: "galle-fort",
    category: "Heritage",
    region: "South Coast",
    province: "Southern Province",
    district: "Galle",
    coordinates: [80.2176, 6.026],
    summary: "UNESCO-listed colonial fort on the southern coast",
    description:
      "Galle Fort is a living colonial citadel of ramparts, churches, villas, boutiques, and sea views, and one of Sri Lanka's best-preserved urban heritage sites.",
    highlights: [
      "Rampart walks and lighthouse views",
      "UNESCO fort architecture",
      "Boutiques, cafes, and museums",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It delivers a rare blend of history, atmosphere, and modern hospitality in a walkable oceanfront setting.",
  },
  {
    name: "Hikkaduwa",
    slug: "hikkaduwa",
    category: "Beach",
    region: "South Coast",
    province: "Southern Province",
    district: "Galle",
    coordinates: [80.1018, 6.14],
    summary: "Lively south coast beach town with surf and reef-side stays",
    description:
      "Hikkaduwa is a classic beach stop with a busier, more energetic feel, known for surf breaks, beach cafes, and accessible reef-lined shoreline.",
    highlights: [
      "Surf and beach cafes",
      "Snorkeling and reef areas",
      "Easy stop between Colombo and Galle",
    ],
    bestTimeToVisit: "November to April",
    whyVisit:
      "It suits travelers who want a more active and social beach atmosphere on the southwest coast.",
  },
  {
    name: "Unawatuna",
    slug: "unawatuna",
    category: "Beach",
    region: "South Coast",
    province: "Southern Province",
    district: "Galle",
    coordinates: [80.2503, 6.0117],
    summary: "Sheltered beach near Galle with easy swimming and laid-back energy",
    description:
      "Unawatuna is one of Sri Lanka's most accessible beach towns, combining a curved bay, easy swims, and quick access to Galle Fort.",
    highlights: [
      "Calm bay for swimming",
      "Beach restaurants and stays",
      "Quick trip from Galle Fort",
    ],
    bestTimeToVisit: "November to April",
    whyVisit:
      "It works perfectly for travelers who want beach time without giving up access to Galle's heritage core.",
  },
  {
    name: "Mirissa",
    slug: "mirissa",
    category: "Coastal",
    region: "South Coast",
    province: "Southern Province",
    district: "Matara",
    coordinates: [80.4686, 5.9467],
    summary: "Beach paradise and whale-watching hub",
    description:
      "Mirissa is a lively south coast beach town known for whale watching, palm-backed beaches, surf breaks, and sunsets from Coconut Tree Hill.",
    highlights: [
      "Blue whale watching trips",
      "Surf and relaxed beach life",
      "Coconut Tree Hill viewpoint",
    ],
    bestTimeToVisit: "November to April",
    whyVisit:
      "It is one of the easiest places to combine beach time, nightlife, and marine excursions on the south coast.",
  },
  {
    name: "Matara",
    slug: "matara",
    category: "City",
    region: "South Coast",
    province: "Southern Province",
    district: "Matara",
    coordinates: [80.546, 5.9485],
    summary: "Southern regional city with beaches, temples, and fort history",
    description:
      "Matara is a working southern city with historic fort remnants, local life, and quick access to Mirissa, Polhena, and the wider south coast.",
    highlights: [
      "Regional city culture",
      "Nearby beaches and reefs",
      "Good base on the southern highway",
    ],
    bestTimeToVisit: "November to April",
    whyVisit:
      "It adds local southern character to beach itineraries that otherwise stay inside resort zones.",
  },
  {
    name: "Tangalle",
    slug: "tangalle",
    category: "Beach",
    region: "South Coast",
    province: "Southern Province",
    district: "Hambantota",
    coordinates: [80.7974, 6.0243],
    summary: "Quieter southern beach area with long bays and boutique stays",
    description:
      "Tangalle is a more spacious and less crowded southern beach destination, favored for long sandy coves, boutique resorts, and a slower pace.",
    highlights: [
      "Long uncrowded beaches",
      "Boutique resorts and villas",
      "Easy access to Hambantota wildlife sites",
    ],
    bestTimeToVisit: "November to April",
    whyVisit:
      "It is ideal for travelers who want a more secluded beach stop without leaving the southern circuit.",
  },
  {
    name: "Hambantota",
    slug: "hambantota",
    category: "City",
    region: "South Coast",
    province: "Southern Province",
    district: "Hambantota",
    coordinates: [81.1212, 6.124],
    summary: "Dry-zone southern district linking beaches, birdlife, and safari parks",
    description:
      "Hambantota connects Sri Lanka's southeastern coast with Yala, Bundala, and Tangalle, making it a useful base for nature-focused southern travel.",
    highlights: [
      "Access to Yala and Bundala",
      "Dry-zone coastal scenery",
      "Regional transport hub in the southeast",
    ],
    bestTimeToVisit: "December to April",
    whyVisit:
      "It is a practical southeastern anchor for combining coast, birdlife, and safari experiences.",
  },
  {
    name: "Yala Safari",
    slug: "yala-safari",
    category: "Adventure",
    region: "Wildlife Belt",
    province: "Southern Province",
    district: "Hambantota",
    coordinates: [81.5167, 6.3667],
    summary: "Premier wildlife safari destination",
    description:
      "Yala National Park is Sri Lanka's most famous safari destination, known for leopards, elephants, sloth bears, birdlife, and varied dry-zone terrain.",
    highlights: [
      "Leopard spotting potential",
      "Elephants, birds, and crocodiles",
      "Classic Sri Lankan safari experience",
    ],
    bestTimeToVisit: "February to July",
    whyVisit:
      "It is the island's headline safari and one of the main reasons wildlife travelers include the southeast.",
  },
  {
    name: "Udawalawe National Park",
    slug: "udawalawe-national-park",
    category: "Wildlife",
    region: "Wildlife Belt",
    province: "Uva Province",
    district: "Monaragala",
    coordinates: [80.821, 6.4749],
    summary: "Elephant-rich park with open grassland and reservoir scenery",
    description:
      "Udawalawe is one of Sri Lanka's most reliable parks for seeing elephants in open terrain, making sightings easier and drives more relaxed.",
    highlights: [
      "Excellent elephant sightings",
      "Open safari landscapes",
      "Good stop between hills and south coast",
    ],
    bestTimeToVisit: "Year-round, especially December to April",
    whyVisit:
      "It is one of the best parks for travelers who want a strong safari experience without the density and pressure of Yala.",
  },
  {
    name: "Bundala National Park",
    slug: "bundala-national-park",
    category: "Wildlife",
    region: "Wildlife Belt",
    province: "Southern Province",
    district: "Hambantota",
    coordinates: [81.214, 6.195],
    summary: "Bird-rich coastal wetland park with lagoons and migratory flocks",
    description:
      "Bundala is a UNESCO biosphere reserve of lagoons, scrub, and shoreline, best known for birdlife, wetlands, and a softer-paced safari atmosphere.",
    highlights: [
      "Migratory birdlife and flamingos",
      "Lagoons and coastal wetlands",
      "Less crowded nature drives",
    ],
    bestTimeToVisit: "September to March",
    whyVisit:
      "It is one of the island's top choices for birdwatchers and travelers who enjoy wetland landscapes as much as big mammals.",
  },
  {
    name: "Trincomalee",
    slug: "trincomalee",
    category: "City",
    region: "East Coast",
    province: "Eastern Province",
    district: "Trincomalee",
    coordinates: [81.2335, 8.5874],
    summary: "Historic east coast harbor city with temples and beaches nearby",
    description:
      "Trincomalee is a major natural harbor and cultural coastal town with Hindu heritage, whale-watching waters, and quick access to Nilaveli.",
    highlights: [
      "Harbor and temple viewpoints",
      "Access to Nilaveli beaches",
      "East coast marine activities",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It is the best cultural and logistical anchor for east coast beach itineraries.",
  },
  {
    name: "Nilaveli",
    slug: "nilaveli",
    category: "Beach",
    region: "East Coast",
    province: "Eastern Province",
    district: "Trincomalee",
    coordinates: [81.1994, 8.6959],
    summary: "Calm east coast beach with clear water and island excursions",
    description:
      "Nilaveli is one of Sri Lanka's calmest beach zones, known for pale sand, clear water, and boat trips toward Pigeon Island.",
    highlights: [
      "Calm water and broad beach",
      "Snorkeling-friendly coastline",
      "Easy trip from Trincomalee",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It is a top choice for travelers seeking quieter east coast beach time with gentle sea conditions.",
  },
  {
    name: "Pasikudah",
    slug: "pasikudah",
    category: "Beach",
    region: "East Coast",
    province: "Eastern Province",
    district: "Batticaloa",
    coordinates: [81.5612, 7.9297],
    summary: "Shallow turquoise bay ideal for relaxed east coast beach stays",
    description:
      "Pasikudah is known for its calm, shallow waters and resort-friendly coastline, making it one of the easiest family beaches on the east coast.",
    highlights: [
      "Calm shallow bay",
      "Resort-friendly beach zone",
      "Good for gentle swimming",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It is one of the safest and most relaxing beach stretches for travelers who prioritize calm water over surf.",
  },
  {
    name: "Batticaloa",
    slug: "batticaloa",
    category: "City",
    region: "East Coast",
    province: "Eastern Province",
    district: "Batticaloa",
    coordinates: [81.6924, 7.717],
    summary: "Lagoon city on the east coast with music, bridges, and beach access",
    description:
      "Batticaloa is a distinctive east coast city shaped by its lagoon, long bridge approaches, local Tamil culture, and access to nearby beaches.",
    highlights: [
      "Large lagoon landscapes",
      "Distinct east coast town culture",
      "Good link to Pasikudah and Ampara",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It broadens an east coast trip beyond resorts and shows a more lived-in regional coastal identity.",
  },
  {
    name: "Ampara",
    slug: "ampara",
    category: "City",
    region: "East Coast",
    province: "Eastern Province",
    district: "Ampara",
    coordinates: [81.6747, 7.2975],
    summary: "Eastern district gateway to lagoons, beaches, and wildlife parks",
    description:
      "Ampara links inland eastern landscapes with Arugam Bay, Gal Oya, and a broader region of lagoons, temples, and farming country.",
    highlights: [
      "Route to Arugam Bay and Gal Oya",
      "Large eastern district landscapes",
      "Mix of coast, villages, and wilderness",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It is a useful eastern hub when building a broader itinerary beyond a single beach stop.",
  },
  {
    name: "Arugam Bay",
    slug: "arugam-bay",
    category: "Coastal",
    region: "East Coast",
    province: "Eastern Province",
    district: "Ampara",
    coordinates: [81.8361, 6.8403],
    summary: "World-renowned surfing destination",
    description:
      "Arugam Bay is Sri Lanka's best-known surf town, balancing laid-back beach life with iconic point breaks and a strong seasonal energy.",
    highlights: [
      "World-class surf breaks",
      "Laid-back beach-town vibe",
      "Nearby lagoons and wildlife",
    ],
    bestTimeToVisit: "April to October",
    whyVisit:
      "It is the strongest surf destination in Sri Lanka and one of the anchors of the east coast season.",
  },
  {
    name: "Jaffna",
    slug: "jaffna",
    category: "City",
    region: "Northern Sri Lanka",
    province: "Northern Province",
    district: "Jaffna",
    coordinates: [80.0074, 9.6615],
    summary: "Northern cultural capital with Tamil heritage and island routes",
    description:
      "Jaffna is the cultural heart of northern Sri Lanka, known for Hindu temples, seafood, island connections, local markets, and a distinct Tamil identity.",
    highlights: [
      "Nallur Kandaswamy Temple",
      "Northern food and culture",
      "Base for island excursions",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It shows a very different side of Sri Lanka and rewards travelers looking for depth beyond the classic south-west circuit.",
  },
  {
    name: "Delft Island",
    slug: "delft-island",
    category: "Unique",
    region: "Northern Sri Lanka",
    province: "Northern Province",
    district: "Jaffna",
    coordinates: [79.721, 9.4881],
    summary: "Remote northern island known for coral walls and wild ponies",
    description:
      "Delft Island is one of the most unusual excursions in northern Sri Lanka, with open landscapes, coral-stone walls, and a remote island atmosphere.",
    highlights: [
      "Wild ponies and open plains",
      "Remote island boat trip",
      "Distinctive northern character",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It adds a memorable off-grid island day to any Jaffna itinerary.",
  },
  {
    name: "Mannar",
    slug: "mannar",
    category: "City",
    region: "Northern Sri Lanka",
    province: "Northern Province",
    district: "Mannar",
    coordinates: [79.9045, 8.981],
    summary: "Northern coastal district of lagoons, birdlife, and long causeways",
    description:
      "Mannar is known for lagoons, salt flats, birdlife, quiet roads, and a frontier-like atmosphere unlike the busier parts of the island.",
    highlights: [
      "Lagoon and causeway scenery",
      "Birdlife and seasonal migration",
      "Less explored northern coast",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It is one of Sri Lanka's most under-visited cultural landscapes and pairs well with Jaffna exploration.",
  },
  {
    name: "Kilinochchi",
    slug: "kilinochchi",
    category: "City",
    region: "Northern Sri Lanka",
    province: "Northern Province",
    district: "Kilinochchi",
    coordinates: [80.3982, 9.3803],
    summary: "Northern plains district with tanks, history, and overland route links",
    description:
      "Kilinochchi sits on the main northern corridor and offers a wider view of northern Sri Lanka's agricultural plains, reservoirs, and post-war recovery.",
    highlights: [
      "Northern overland gateway",
      "Reservoir and plain landscapes",
      "Useful stop between Vavuniya and Jaffna",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It helps complete a fuller northern route instead of reducing the north to Jaffna alone.",
  },
  {
    name: "Mullaitivu",
    slug: "mullaitivu",
    category: "City",
    region: "Northern Sri Lanka",
    province: "Northern Province",
    district: "Mullaitivu",
    coordinates: [80.8128, 9.2676],
    summary: "Quiet northeastern coast of beaches, lagoons, and remote landscapes",
    description:
      "Mullaitivu is a remote northern coastal district with long beaches, lagoons, and a quieter feel than Sri Lanka's better-known resort coasts.",
    highlights: [
      "Remote beach stretches",
      "Lagoon and coastal scenery",
      "Low-traffic northern landscapes",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It is valuable for travelers who want a less explored coastal edge of the island.",
  },
  {
    name: "Vavuniya",
    slug: "vavuniya",
    category: "City",
    region: "Northern Sri Lanka",
    province: "Northern Province",
    district: "Vavuniya",
    coordinates: [80.4971, 8.7514],
    summary: "Northern gateway town connecting the south to Jaffna country",
    description:
      "Vavuniya is the main threshold town between the northern region and the rest of Sri Lanka, useful for overland travel and broader northern itineraries.",
    highlights: [
      "Key northern transit hub",
      "Route connection to Jaffna and Mannar",
      "Useful overland stop",
    ],
    bestTimeToVisit: "May to September",
    whyVisit:
      "It helps organize realistic road journeys into northern Sri Lanka.",
  },
  {
    name: "Monaragala",
    slug: "monaragala",
    category: "City",
    region: "Wildlife Belt",
    province: "Uva Province",
    district: "Monaragala",
    coordinates: [81.3507, 6.872],
    summary: "Large southeastern district linking the hills to Sri Lanka's safari country",
    description:
      "Monaragala stretches across forests, farms, and dry-zone landscapes, acting as a useful bridge between the Uva highlands and eastern-southern wildlife areas.",
    highlights: [
      "Gateway to Udawalawe and Gal Oya regions",
      "Dry-zone landscapes and forest edges",
      "Useful inland connection district",
    ],
    bestTimeToVisit: "January to September",
    whyVisit:
      "It helps map the southeastern interior, especially on itineraries that connect hill country and wildlife.",
  },
];

export const destinations: Destination[] = destinationSeeds.map(
  (destination, index) => ({
    id: String(index + 1),
    ...destination,
  }),
);
