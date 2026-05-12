import { Destination } from "@/types/destination";

export type MapLegendCategory =
  | "Heritage"
  | "Nature"
  | "Coastal"
  | "Adventure"
  | "City";

type MapCategoryStyle = {
  markerColor: string;
  markerIcon: string;
  bgClass: string;
  borderClass: string;
  softClass: string;
};

export const mapCategoryStyles: Record<MapLegendCategory, MapCategoryStyle> = {
  Heritage: {
    markerColor: "#D97706",
    markerIcon: "🏛️",
    bgClass: "bg-amber-600",
    borderClass: "border-amber-600",
    softClass: "bg-amber-50 text-amber-900",
  },
  Nature: {
    markerColor: "#059669",
    markerIcon: "🌿",
    bgClass: "bg-emerald-600",
    borderClass: "border-emerald-600",
    softClass: "bg-emerald-50 text-emerald-900",
  },
  Coastal: {
    markerColor: "#0284C7",
    markerIcon: "🏖️",
    bgClass: "bg-sky-600",
    borderClass: "border-sky-600",
    softClass: "bg-sky-50 text-sky-900",
  },
  Adventure: {
    markerColor: "#DC2626",
    markerIcon: "🦁",
    bgClass: "bg-red-600",
    borderClass: "border-red-600",
    softClass: "bg-red-50 text-red-900",
  },
  City: {
    markerColor: "#475569",
    markerIcon: "🏙️",
    bgClass: "bg-slate-600",
    borderClass: "border-slate-600",
    softClass: "bg-slate-100 text-slate-800",
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
