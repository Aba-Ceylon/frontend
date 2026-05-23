import type { MetadataRoute } from "next";

const BASE_URL = "https://www.abaceylontours.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/account",
          "/my-inquiries",
          "/my-plans",
          "/planner",
          "/feedback",
          "/_next/",
        ],
      },
      {
        // Respect Googlebot specifically
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/account",
          "/my-inquiries",
          "/my-plans",
          "/planner",
          "/feedback",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
