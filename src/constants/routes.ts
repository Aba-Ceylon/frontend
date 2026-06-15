export const routes = {
  home: "/",
  about: "/about",
  activities: "/activities",
  contact: "/contact",
  destinations: "/destinations",
  fleet: "/fleet",
  packages: "/packages",
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
  customPlanner: "/#custom-planner",
} as const;

export const primaryNavLinks = [
  { label: "Holiday Packages", href: routes.packages },
  { label: "Destinations", href: routes.destinations },
  { label: "Plan With Us", href: routes.customPlanner },
  { label: "Fleet", href: routes.fleet },
  { label: "Stays", href: routes.stays },
  { label: "About", href: routes.about },
] as const;

export const footerLinkGroups = [
  {
    title: "Curation",
    links: [
      { label: "Holiday Packages", href: routes.packages },
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
