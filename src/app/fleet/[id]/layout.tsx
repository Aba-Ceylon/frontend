import type { Metadata } from "next";
import { fetchVehicleById } from "@/services/fleetService";

const BASE_URL = "https://www.abaceylontours.com";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await fetchVehicleById(id);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
      description: "The requested fleet vehicle could not be found.",
    };
  }

  return {
    title: `${vehicle.name} | Chauffeur-Driven Fleet`,
    description: vehicle.shortDescription,
    alternates: {
      canonical: `${BASE_URL}/fleet/${id}`,
    },
  };
}

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
