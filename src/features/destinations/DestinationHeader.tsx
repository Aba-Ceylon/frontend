export function DestinationHeader({
  destinationCount,
  categoryCount,
  regionCount,
}: {
  destinationCount: number;
  categoryCount: number;
  regionCount: number;
}) {
  const stats = [
    { label: "Destinations", value: destinationCount },
    { label: "Categories", value: categoryCount },
    { label: "Regions", value: regionCount },
  ];

  return (
    <section className="mb-12 border border-[#182231]/10 bg-white px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#C99A2B]">
            Island guide
          </p>
          <h2 className="mt-3 font-cinzel text-3xl text-[#182231] sm:text-4xl">
            Explore Sri Lanka by region, route, and travel mood
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#182231]/68">
            These destination notes are designed for real private route
            planning, not generic bucket lists. Use them to understand what
            belongs together, what works seasonally, and where a custom journey
            gains depth.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="border border-[#182231]/10 px-4 py-5 text-center">
              <p className="font-cinzel text-3xl text-[#182231]">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#182231]/58">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
