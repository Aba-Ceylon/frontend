import type { Activity } from "@/types/activity";

export const activities: Activity[] = [
  {
    id: "heritage-trails",
    name: "Heritage Trails",
    type: "Culture",
    summary:
      "Explore Sri Lanka's sacred cities, ancient kingdoms, cave temples, and UNESCO-listed strongholds with local historical context.",
    idealFor: "First-time travellers and culture-led itineraries",
    region: "Cultural Triangle",
    image: "/images/heritage/Hero1.jpg",
    highlights: [
      "Sigiriya and Pidurangala sunrise routes",
      "Dambulla cave temple and sacred city access",
      "Anuradhapura and Polonnaruwa heritage days",
    ],
  },
  {
    id: "wildlife-safaris",
    name: "Wildlife Safaris",
    type: "Wildlife",
    summary:
      "Build route days around leopard country, elephant habitats, wetlands, and birdlife with realistic transfer planning.",
    idealFor: "Nature lovers, photographers, and families",
    region: "Wildlife Belt",
    image: "/art2.png",
    highlights: [
      "Yala, Udawalawe, and Minneriya combinations",
      "Early departures timed to animal movement",
      "Driver-planned rest stops around park gates",
    ],
  },
  {
    id: "hill-country-journeys",
    name: "Hill Country Journeys",
    type: "Scenic",
    summary:
      "Slow down through tea country, cool-weather towns, scenic train stretches, and layered mountain roads.",
    idealFor: "Couples, relaxed scenic travel, and mixed itineraries",
    region: "Hill Country",
    image: "/Why.png",
    highlights: [
      "Kandy to Ella route planning",
      "Tea estates, viewpoints, and soft hiking stops",
      "Flexible pacing around train and road options",
    ],
  },
  {
    id: "south-coast-days",
    name: "South Coast Days",
    type: "Coastal",
    summary:
      "Balance beach time, fort towns, whale-watching hubs, and coastal food stops without turning the route into a rush.",
    idealFor: "Beach stays, honeymoon routes, and family downtime",
    region: "South Coast",
    image: "/staysbanner.png",
    highlights: [
      "Galle, Mirissa, Tangalle, and Bentota pairings",
      "Fort walks, beaches, and seafood stops",
      "Strong fit for end-of-trip recovery days",
    ],
  },
  {
    id: "water-and-lagoon",
    name: "Lagoon & River Escapes",
    type: "Leisure",
    summary:
      "Add gentler experiences like lagoon cruises, mangrove rides, and riverside sunsets where the pace matters as much as the view.",
    idealFor: "Families, slower itineraries, and soft-adventure travellers",
    region: "West and South Coasts",
    image: "/Who.png",
    highlights: [
      "Bentota and Madu River additions",
      "Negombo lagoon soft-arrival options",
      "Easy add-ons to coast-to-city transitions",
    ],
  },
  {
    id: "village-and-food",
    name: "Village & Food Encounters",
    type: "Local Life",
    summary:
      "Experience spice gardens, market walks, village kitchens, and small local stops that make a route feel lived-in rather than packaged.",
    idealFor: "Returning visitors and travellers wanting local texture",
    region: "Across the island",
    image: "/Founder.png",
    highlights: [
      "Small-stop route curation between major sights",
      "Food-led detours and market experiences",
      "Best paired with custom private itineraries",
    ],
  },
];
