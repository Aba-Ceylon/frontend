import { Destination } from "@/types/destination";

export type MapLegendCategory =
  | "Heritage"
  | "Nature"
  | "Coastal"
  | "Adventure"
  | "City";

type MapCategoryStyle = {
  markerColor: string;
  bgClass: string;
  borderClass: string;
  softClass: string;
};

export const mapCategoryStyles: Record<MapLegendCategory, MapCategoryStyle> = {
  Heritage: {
    markerColor: "#C99A2B",
    bgClass: "bg-[#C99A2B]",
    borderClass: "border-[#C99A2B]/35",
    softClass: "border border-[#C99A2B]/22 bg-[#F7F1E5] text-[#182231]",
  },
  Nature: {
    markerColor: "#182231",
    bgClass: "bg-[#182231]",
    borderClass: "border-[#182231]/18",
    softClass: "border border-[#182231]/12 bg-white text-[#182231]",
  },
  Coastal: {
    markerColor: "#314055",
    bgClass: "bg-[#314055]",
    borderClass: "border-[#314055]/24",
    softClass: "border border-[#314055]/14 bg-white text-[#182231]",
  },
  Adventure: {
    markerColor: "#8B6B1F",
    bgClass: "bg-[#8B6B1F]",
    borderClass: "border-[#8B6B1F]/28",
    softClass: "border border-[#8B6B1F]/16 bg-[#FBF8F2] text-[#182231]",
  },
  City: {
    markerColor: "#05070A",
    bgClass: "bg-[#05070A]",
    borderClass: "border-[#05070A]/18",
    softClass: "border border-[#05070A]/10 bg-white text-[#182231]",
  },
};

export const mapLegendItems: Array<{
  category: MapLegendCategory;
  description: string;
}> = [
  {
    category: "Heritage",
    description: "Ancient cities, temples, forts, and cultural landmarks",
  },
  {
    category: "Nature",
    description: "Hill country, forests, lakes, and scenic landscapes",
  },
  {
    category: "Coastal",
    description: "Beaches, seaside towns, islands, and coastal gateways",
  },
  {
    category: "Adventure",
    description: "Wildlife, hiking, safaris, rafting, and rare experiences",
  },
  {
    category: "City",
    description: "Urban gateways, major towns, and travel hub destinations",
  },
];

export function getMapLegendCategory(
  destination: Destination,
): MapLegendCategory {
  switch (destination.category) {
    case "Heritage":
      return "Heritage";
    case "Nature":
      return "Nature";
    case "Coastal":
    case "Beach":
      return "Coastal";
    case "Adventure":
    case "Wildlife":
    case "Unique":
      return "Adventure";
    case "City":
      return "City";
    default:
      return "Nature";
  }
}
