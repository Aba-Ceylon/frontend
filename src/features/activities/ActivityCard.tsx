import Image from "next/image";
import type { Activity } from "@/types/activity";

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="card-lift card-zoom group flex h-full flex-col overflow-hidden border border-[#182231]/10 bg-white hover:border-[#c99a2b]/50">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#182231]" data-spotlight>
        <Image
          src={activity.image}
          alt={activity.name}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d141e]/85 via-[#0d141e]/15 to-transparent" />
        <p className="absolute left-5 top-5 z-10 rounded-full border border-white/25 bg-[#0d141e]/45 px-3.5 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
          {activity.region}
        </p>
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
          <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#e2c27a]">
            {activity.type}
          </p>
          <h3 className="mt-2 font-cinzel text-3xl leading-tight text-white">{activity.name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <p className="inline-flex w-fit rounded-full bg-[var(--ivory)] px-3.5 py-1.5 text-xs text-[#182231]/75">
          Ideal for {activity.idealFor.charAt(0).toLowerCase() + activity.idealFor.slice(1)}
        </p>

        <p className="text-[15px] leading-7 text-[#182231]/70">{activity.summary}</p>

        <ul className="mt-auto space-y-2.5 border-t border-[#182231]/10 pt-5 text-sm text-[#182231]/68">
          {activity.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span className="mt-2.5 h-px w-5 shrink-0 bg-[#c99a2b]" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
