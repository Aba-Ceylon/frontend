import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";

const Star = ({ className = "w-5 h-5 text-amber-500" }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.06 9.377c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.287-3.95z" />
  </svg>
);

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        '"Aba Ceylon curated the most incredible heritage journey through Sri Lanka. Our chauffeur guide was knowledgeable and passionate about the culture. The recommended stays were exceptional, blending authenticity with comfort. This wasn\'t just a tour - it was a cultural immersion."',
      name: "Emma Thompson",
      location: "United Kingdom",
    },
    {
      quote:
        '"We used the custom journey planner and couldn\'t be happier. Aba Ceylon helped us create the perfect 10-day itinerary combining ancient temples, tea country, and beach time. The attention to detail and personalized service exceeded all expectations."',
      name: "Michael & Sarah Johnson",
      location: "Australia",
    },
    {
      quote:
        '"As a history enthusiast, the Cultural Triangle tour was a dream come true. The expert knowledge shared about each heritage site, combined with comfortable transport and excellent accommodation recommendations, made this the trip of a lifetime."',
      name: "Hans Mueller",
      location: "Germany",
    },
  ];

  return (
    <section className="bg-slate-50 py-16">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold text-slate-800">Traveler Stories</h2>
          <p className="text-slate-500 mt-2">What our guests say about their heritage journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center gap-1 mb-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>

              <blockquote className="text-slate-600 italic text-sm mb-6">{t.quote}</blockquote>

              <hr className="border-t border-gray-200 mb-4" />

              <div>
                <div className="font-medium text-slate-800">{t.name}</div>
                <div className="text-sm text-slate-500">{t.location}</div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
