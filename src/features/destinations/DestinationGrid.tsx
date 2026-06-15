import type { Destination } from "@/types/destination";
import DestinationCard from "./DestinationCard";

export function DestinationGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}
