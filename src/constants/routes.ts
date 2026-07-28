export const routes = {
  home: "/",
  about: "/about",
  activities: "/activities",
  contact: "/contact",
  destinations: "/destinations",
  fleet: "/fleet",
  customizeJourneys: "/customize-journeys",
  privacy: "/privacy",
  stays: "/stays",
  terms: "/terms",
  signIn: "/sign-in",
  signUp: "/sign-up",
  login: "/login",
  register: "/register",
  account: "/account",
  feedback: "/feedback",
  myInquiries: "/my-inquiries",
  myPlans: "/my-plans",
  planner: "/planner",
  packages: "/packages",
} as const;

export const primaryNavLinks = [
  { label: "Customize Journeys", href: routes.customizeJourneys },
  { label: "Tour Packages", href: routes.packages },
  { label: "Destinations", href: routes.destinations },
  { label: "Fleet", href: routes.fleet },
  { label: "Stays", href: routes.stays },
  { label: "About", href: routes.about },
] as const;

export const footerLinkGroups = [
  {
    title: "Curation",
    links: [
      { label: "Customize Journeys", href: routes.customizeJourneys },
      { label: "Stays & Retreats", href: routes.stays },
      { label: "Private Fleet", href: routes.fleet },
      { label: "Bespoke Activities", href: routes.activities },
    ],
  },
  {
    title: "Heritage",
    links: [
      { label: "Our Story", href: routes.about },
      { label: "Destinations", href: routes.destinations },
      { label: "Contact", href: routes.contact },
    ],
  },
] as const;
