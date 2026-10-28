import type { TestimonialItem } from "@/components/testimonials/TestimonialsCarousel";

// Recommendations from the Aba Ceylon Facebook page. Facebook only exposes
// page reviews through the Graph API with a page access token, so these are
// copied in by hand; add new ones here as they come in.
export const facebookReviews: TestimonialItem[] = [
  {
    name: "Zoe Yang",
    quote:
      "It was great working together. Very reliable and professional travel service. I would happily recommend them.",
    source: "facebook",
  },
  {
    name: "Cris Zheng",
    quote: "This is a great experience.",
    source: "facebook",
  },
  {
    name: "MaccaB2B",
    quote: "We recommended Aba Ceylon.",
    source: "facebook",
  },
];
