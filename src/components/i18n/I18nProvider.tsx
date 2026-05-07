"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type TranslationVars = Record<string, string | number>;
type TranslationFormatter = (vars: TranslationVars) => string;

interface TranslationMessages {
  [key: string]: string | TranslationFormatter | TranslationMessages;
}

type TranslationValue = string | TranslationFormatter | TranslationMessages;

export type Locale =
  | "en"
  | "si"
  | "de"
  | "fr"
  | "nl"
  | "it"
  | "es"
  | "ru"
  | "zh"
  | "ja"
  | "ko";

const STORAGE_KEY = "aba-locale";

export const LANGUAGE_OPTIONS: Array<{
  locale: Locale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
}> = [
  { locale: "en", label: "English", nativeLabel: "English", shortLabel: "EN" },
  { locale: "si", label: "Sinhala", nativeLabel: "සිංහල", shortLabel: "සි" },
  { locale: "de", label: "German", nativeLabel: "Deutsch", shortLabel: "DE" },
  { locale: "fr", label: "French", nativeLabel: "Français", shortLabel: "FR" },
  { locale: "nl", label: "Dutch", nativeLabel: "Nederlands", shortLabel: "NL" },
  { locale: "it", label: "Italian", nativeLabel: "Italiano", shortLabel: "IT" },
  { locale: "es", label: "Spanish", nativeLabel: "Español", shortLabel: "ES" },
  { locale: "ru", label: "Russian", nativeLabel: "Русский", shortLabel: "RU" },
  { locale: "zh", label: "Chinese", nativeLabel: "中文", shortLabel: "中" },
  { locale: "ja", label: "Japanese", nativeLabel: "日本語", shortLabel: "日" },
  { locale: "ko", label: "Korean", nativeLabel: "한국어", shortLabel: "한" },
];

const LOCALES = new Set<Locale>(LANGUAGE_OPTIONS.map((option) => option.locale));

function isLocale(value: string | null): value is Locale {
  return Boolean(value && LOCALES.has(value as Locale));
}

const messages: Partial<Record<Locale, TranslationMessages>> = {
  en: {
    common: {
      close: "Close",
      cancel: "Cancel",
      continue: "Continue",
      previous: "Previous",
      next: "Next",
      loading: "Loading...",
      ready: "Ready",
      selected: "Selected",
      select: "Select",
      viewMap: "View Map",
      addToPlanner: "Add to Planner",
      remove: "Remove",
      yes: "Yes",
      no: "No",
      availableOnRequest: "Available on request",
      notSpecified: "Not specified",
      signIn: "Sign In",
      signUp: "Sign Up",
      feedback: "Feedback",
      enquireNow: "Enquire Now",
      discover: "Discover",
      requestViaWhatsApp: "Request via WhatsApp",
      openWhatsAppRequest: "Open WhatsApp Request",
      systemAdministrator: "system administrator",
      requiredDetail: "Required Detail",
      noEmailAvailable: "No email available",
      signedInTraveler: "Signed-in traveler",
      days: ({ count }) => `${count} day${Number(count) === 1 ? "" : "s"}`,
      dateRange: ({ start, end }) => `${start} to ${end}`,
    },
    language: {
      label: "Language",
      english: "English",
      sinhala: "Sinhala",
    },
    navbar: {
      holidayPackages: "Holiday Packages",
      planWithUs: "Plan With Us",
      fleet: "Fleet",
      stays: "Stays",
      toggleMenu: "Toggle menu",
    },
    footer: {
      establishment: "Establishment of Excellence",
      headline: "THE FINEST WAY to experience THE ISLAND.",
      curateJourney: "Curate Your Journey",
      curation: "Curation",
      heritage: "Heritage",
      headquarters: "Headquarters",
      copyright: "© 2026 Aba Ceylon Travels & Tours",
      privacy: "Privacy",
      terms: "Terms",
      developedBy: "Developed by",
      developedByName: "Vernox Labs Sri Lanka",
      links: {
        packages: "Holiday Packages",
        stays: "Stays & Retreats",
        fleet: "Private Fleet",
        activities: "Bespoke Activities",
        story: "Our Story",
        destinations: "Destinations",
        sustainability: "Sustainability",
        contact: "Contact",
      },
    },
    home: {
      hero: {
        titleLine1: "Aba Ceylon",
        titleLine2: "Tours and Travels",
        subtitle: "The Ultimate Heritage Experience",
        viewPackages: "View Our Packages",
        planJourney: "Plan Your Journey",
        scroll: "SCROLL",
      },
      loader: {
        tagline: "The Ultimate Heritage Experience",
        preparing:
          "Preparing immersive journeys, curated stays, and signature routes across the island.",
        entering: "Entering the island story",
      },
      packages: {
        title: "Curated Journeys",
        description:
          "Explore handcrafted travel experiences across Sri Lanka's heritage, hills, and coastlines.",
        viewAll: "View Available Packages",
        previous: "Previous",
        next: "Next",
      },
      stays: {
        title: "Accommodation in Sri Lanka",
        description: "Stay within the story of Sri Lanka, not outside it",
        viewAll: "Discover All Stays",
        previous: "Previous",
        next: "Next",
      },
      fleet: {
        title: "Premium Fleet",
        description:
          "Chauffeured luxury vehicles for seamless journeys across Sri Lanka.",
        loading: "Loading fleet...",
        empty: "No fleet vehicles available right now.",
        explore: "Explore Full Fleet",
        previous: "Previous",
        next: "Next",
      },
      customPlanner: {
        eyebrow: "Plan Your Journey",
        title: "Custom Journey Planner",
        description:
          "Design your perfect Sri Lankan adventure with our personalized planning service",
        routePlanning: "Route Planning",
        chauffeurMatching: "Chauffeur Matching",
        whatsappReady: "WhatsApp Ready",
        startPlanning: "Start Planning",
      },
      testimonials: {
        title: "Traveler Stories",
        description:
          "What our guests say about their heritage journey",
      },
      map: {
        title: "Interactive Map",
        subtitle:
          "Explore destinations across Sri Lanka and plan your perfect journey",
        legends: "Legends",
        loading: "Loading map...",
        exploreTitle: "Explore Sri Lanka",
        exploreDescription:
          "Click on destinations to learn more about each location",
        categories: {
          Heritage: {
            label: "Heritage",
            description: "Explore Sri Lanka's rich cultural heritage sites",
          },
          Nature: {
            label: "Nature",
            description: "Discover stunning natural landscapes and wildlife",
          },
          Coastal: {
            label: "Coastal",
            description: "Relax on pristine beaches and coastal areas",
          },
          Adventure: {
            label: "Adventure",
            description:
              "Experience thrilling adventures and outdoor activities",
          },
          City: {
            label: "City",
            description: "Explore vibrant cities and urban destinations",
          },
        },
      },
      destinationPanel: {
        about: "About",
        highlights: "Key Highlights",
        bestTime: "Best Time to Visit",
        whyVisit: "Why Visit",
        close: "Close",
        addToPlanner: "Add to Planner",
      },
      buddhaLotus: {
        heritageJourneys: "Aba Ceylon · Heritage Journeys",
        scrollReveal: "Scroll Down to Reveal",
        scroll: "Scroll",
        sacredAncient: "Sacred · Ancient",
        purityPeace: "Purity · Peace",
        yearsOfBuddhism: "Years of Buddhism",
        noblePetals: "Noble Petals",
        sacredFlower: "Sacred flower of the Buddha",
        wheelOfDharma: "Wheel of the Dharma",
        quote:
          "Just as the lotus rises from muddy waters, Sri Lanka rises in timeless beauty.",
        purity: "Purity",
        enlightenment: "Enlightenment",
        rebirth: "Rebirth",
        sacredLotus:
          "The Sacred Lotus Symbol of Purity & Enlightenment",
        brand: "Aba Ceylon Tours & Travels",
      },
    },
    packages: {
      packageLabel: ({ id }) => `Package ${String(id).padStart(2, "0")}`,
      curatedPackage: "Curated Package",
      distanceKm: ({ km }) => `${km} KM`,
      requestPackage: "Request Package",
      requested: "Requested",
      viewPackage: "View Package",
      pageTitle: "Explore Our Curated Travel Packages",
      pageSubtitle:
        "Handcrafted journeys across Sri Lanka's heritage, hills, wildlife, and coastlines.",
      overview: "Overview",
      itinerary: "Day-by-Day Itinerary",
      includedServices: "Included Services",
      recommendedVehicle: "Recommended Vehicle",
      requestThisPackage: "Request This Package",
      duration: "Duration",
      distance: "Distance",
      route: "Route",
    },
    stays: {
      stayLabel: ({ id }) => `Stay ${String(id).padStart(2, "0")}`,
      viewStay: "View Stay",
      pageTitle: "Curated Heritage Stays",
      pageSubtitle: "Stay within the story of Sri Lanka, not outside it!",
      category: "Category",
      owner: "Owner",
      about: "About This Stay",
      amenities: "Amenities",
      whatsappContact: "WhatsApp Contact",
      contactWhatsApp: "Contact on WhatsApp",
      viewOnMap: "View on Map",
      location: "Location",
    },
    fleet: {
      viewMoreDetails: "View More Details",
      premiumFleet: "Premium Fleet",
      pageTitle: "Explore Our Premium Fleet",
      pageSubtitle:
        "Chauffeured vehicles designed for comfort, elegance, and seamless travel across Sri Lanka.",
      loading: "Loading fleet vehicles...",
      empty: "No fleet vehicles available right now.",
      notFound: "Vehicle not found.",
      loadingVehicle: "Loading vehicle...",
      overview: "Overview",
      features: "Features",
      aboutVehicle: "About This Vehicle",
      requestVehicle: "Request This Vehicle",
      requestDescription:
        "Our concierge team will contact you to confirm availability and arrange your booking.",
      models: "Models",
      passengers: ({ count }) => `${count} passengers`,
      luggage: ({ count }) => `${count} luggage`,
      pax: ({ count }) => `${count} pax`,
      bags: ({ count }) => `${count} bags`,
      passengerCount: ({ count }) =>
        `${count} passenger${Number(count) === 1 ? "" : "s"}`,
    },
    planner: {
      eyebrow: "Protected Journey Planner",
      title: "Curate A Fully Custom Sri Lanka Journey",
      description:
        "Build your own route, match it with the right chauffeur vehicle, decide how accommodation should work, and send the full request straight to the ABA Ceylon team through WhatsApp.",
      signedInAccess: "Signed-in planner access",
      multiDestination: "Multi-destination custom route",
      whatsappReady: "WhatsApp-ready request summary",
      loadingTitle: "Loading Planner Data",
      loadingDescription:
        "Fetching vehicles, stays, and route recommendations for your custom trip.",
      loadErrorTitle: "Planner Data Couldn't Load",
      continueHint: "Complete the required details in this step to continue.",
      noEmailAvailable: "No email available",
      trip: {
        eyebrow: "Step 1",
        title: "Trip Details",
        description:
          "Tell us when you arrive in Sri Lanka, how long you plan to stay, and how many days of guided travel you want us to arrange.",
        arrivalDate: "Arrival Date In Sri Lanka",
        totalDays: "Total Days In Sri Lanka",
        travelStartDate: "Travel Start Date",
        travelDays: "Travel Days With Driver",
        travelWindow: "Travel Window",
        departure: "Sri Lanka Departure",
        minimumStay: "Minimum Stay Needed",
        signedInTraveler: "Signed-in Traveler",
        chooseTravelStart: "Choose a travel start date",
        chooseArrivalStay: "Choose your arrival and stay duration",
        basedOnTrip:
          "Based on your arrival date, route start date, and route duration.",
        validTitle: "Trip details look valid",
        validDescription:
          "Your current stay window supports this guided route, so you can continue to destination selection.",
        fixTitle: "Please fix these details before continuing",
      },
      destination: {
        eyebrow: "Step 2",
        title: "Select Your Destinations",
        selectedCount: ({ count }) =>
          `${count} destination${Number(count) === 1 ? "" : "s"} selected`,
        tapToAdd: "Tap to add",
        selected: "Selected",
      },
      vehicle: {
        eyebrow: "Step 3",
        title: "Select your preferred vehicle type and comfort level",
        vehicleType: "Vehicle Type",
        comfortLevel: "Comfort Level",
        matchingVehicles: "Matching Vehicles",
        matchingDescription:
          "Choose from the existing fleet that matches your type and comfort preference.",
        options: ({ count }) => `${count} option${Number(count) === 1 ? "" : "s"}`,
        seats: "Seats",
        luggage: "Luggage",
        chosen: "Chosen",
        select: "Select",
        empty:
          "Please select both a vehicle type and comfort level to continue",
      },
      accommodation: {
        eyebrow: "Step 4",
        title: "Accommodation Preference",
        ownTitle: "I Already Have Accommodation",
        ownDescription:
          "Continue only with vehicle hire and chauffeur guide support for the destinations you selected.",
        recommendedTitle: "Recommend Stays For My Route",
        recommendedDescription:
          "Show me system-recommended accommodations based on my selected destinations and route timing.",
        plannerNote: "Planner Note",
        recommendedStays: "Recommended Stays",
        chooseAccommodation:
          "Choose your accommodation for each destination",
        staysSelected: ({ count }) =>
          `${count} Stay${Number(count) === 1 ? "" : "s"} Selected`,
        addStay: "Add Stay",
        checkIn: "Check In",
        checkOut: "Check Out",
        noStays:
          "No recommended stays available for your selected destinations",
        fromRoute: ({ km }) => `~${km} km from route`,
      },
      review: {
        eyebrow: "Step 5",
        title: "Review your custom journey details and send your request",
        summary: "Custom Journey Summary",
        traveler: "Traveler",
        trip: "Trip",
        destinations: "Destinations",
        vehicle: "Vehicle",
        accommodation: "Accommodation",
        whatsappRequest: "WhatsApp Request",
        whatsappDescription:
          "Your planner request will open a pre-filled WhatsApp message ready to send to the system administrator.",
        adminWhatsApp: "Admin WhatsApp",
      },
      steps: {
        trip: {
          title: "Trip Details",
          caption: "Arrival, total stay, and travel duration",
        },
        destinations: {
          title: "Destinations",
          caption: "Build your own route",
        },
        vehicle: {
          title: "Vehicle",
          caption: "Type, comfort, and exact vehicle",
        },
        accommodation: {
          title: "Accommodation",
          caption: "Own stay or recommended stays",
        },
        review: {
          title: "Review & Request",
          caption: "Confirm and send to WhatsApp",
        },
        pending: "Pending",
      },
    },
    feedback: {
      title: "Share Your Feedback",
      subtitle:
        "We value your opinion and would love to hear about your experience",
      thankYou: "Thank You!",
      success: "Your feedback has been submitted successfully",
      submitAnother: "Submit Another Review",
      rateExperience: "Rate Your Experience",
      tellUs: "Tell us about your experience",
      placeholder: "Share your thoughts about our service...",
      submit: "Submit Feedback",
      submitting: "Submitting...",
      ratingLabels: {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent",
      },
      errors: {
        selectRating: "Please select a rating",
        minimumMessage: "Message must be at least 20 characters",
        generic: "An error occurred. Please try again.",
      },
    },
    chat: {
      welcome:
        "Ayubowan! I'm Aba, your personal Sri Lanka travel guide. Where are you thinking of heading?",
      error:
        "Samawenna! I'm having a little trouble connecting right now. Please try again in a moment.",
      dialogLabel: "Aba travel assistant chat",
      guide: "Sri Lanka Travel Guide",
      online: "Online",
      close: "Close chat",
      open: "Open Aba travel assistant",
      typingLabel: "Type your message",
      send: "Send message",
      placeholder: "Ask me anything about Sri Lanka...",
      poweredBy: "Powered by Aba Ceylon Tours",
      suggestions: {
        places: "Best places to visit",
        sevenDay: "Plan a 7-day trip",
        budget: "Budget tips",
        beaches: "Best beaches",
      },
    },
    booking: {
      secure: "Secure Booking",
      requestPackage: "Request Package",
      requestVehicle: "Request Vehicle",
      checkingStatus: "Checking account status...",
      pleaseSignIn: ({ type }) =>
        `Please sign in to send a ${type} request to ABA Ceylon.`,
      preferredDate: "Preferred Booking Date",
      noIdeaDate: "No Idea About Date",
      dateLater: "Date Will Be Decided Later",
      continueWhatsApp: "Continue to WhatsApp",
      confirmDate:
        "Confirm your preferred booking date before we open WhatsApp.",
      selectBookingDate: "Please select a booking date",
    },
    contact: {
      eyebrow: "Travel Concierge",
      title: "Let's Plan Your Trip",
      description:
        "Share your travel idea with ABA Ceylon and our team will guide you with the right route, vehicle, stays, and local support.",
      name: "Your Name",
      email: "Your Email",
      phone: "Your Phone",
      message: "What's on your mind?",
      messagePlaceholder:
        "Tell us about your dates, group size, route ideas, or the style of journey you would like to create.",
      consent:
        "ABA Ceylon may contact me by WhatsApp, phone, or email about this enquiry.",
      submit: "Submit",
      submitHint:
        "Your enquiry opens as a pre-filled WhatsApp message to our team.",
      callUs: "Call Us",
      callDescription:
        "The best call you'll make for your Sri Lanka journey.",
      whatsappUs: "WhatsApp Us",
      phoneLabel: "Phone",
      emailLabel: "Email",
      basedIn: "Based In",
      openingHours: "Opening Hours",
      openingDescription:
        "Our Sri Lanka office hours are below. Outside these hours, you can still reach us on WhatsApp or email.",
      weekdays: "Weekdays",
      saturday: "Saturday",
      sunday: "Sunday",
      consentError:
        "Please confirm that ABA Ceylon can contact you about this enquiry.",
      requiredError:
        "Please complete all required details before sending your enquiry.",
    },
    auth: {
      desktopTitle: "Your journey through paradise begins here.",
      desktopDescription:
        "From golden beaches to misty hill country, ancient temples to vibrant city life, Sri Lanka is a story waiting to be explored.",
      signInHighlight:
        "Sign in to discover hidden gems, plan unforgettable experiences, and travel smarter across every corner of the island.",
      signUpHighlight:
        "Sign up to discover hidden gems, plan unforgettable experiences, and travel smarter across every corner of the island.",
      mobileTitle: "Your journey begins here.",
      mobileSignIn: "Sign in to discover hidden gems and travel smarter.",
      mobileSignUp: "Join us to discover hidden gems and travel smarter.",
    },
    pagination: {
      prev: "Prev",
      next: "Next",
    },
    account: {
      title: "My Account",
      feedbackTitle: "Share Feedback",
      myPlans: "My Plans",
      myInquiries: "My Inquiries",
    },
    placeholders: {
      about: "About",
      activities: "Activities",
      destinations: "Destinations",
      destination: ({ slug }) => `Destination: ${slug}`,
    },
  },
  si: {
    common: {
      close: "වසන්න",
      cancel: "අවලංගු කරන්න",
      continue: "ඉදිරියට",
      previous: "පෙර",
      next: "ඊළඟ",
      loading: "පූරණය වෙමින්...",
      ready: "සූදානම්",
      selected: "තෝරා ඇත",
      select: "තෝරන්න",
      viewMap: "සිතියම බලන්න",
      addToPlanner: "සැලසුමට එක් කරන්න",
      remove: "ඉවත් කරන්න",
      yes: "ඔව්",
      no: "නැහැ",
      availableOnRequest: "ඉල්ලීම මත ලබාගත හැක",
      notSpecified: "සඳහන් කර නැත",
      signIn: "ඇතුල් වන්න",
      signUp: "ලියාපදිංචි වන්න",
      feedback: "ප්‍රතිචාර",
      enquireNow: "දැන් විමසන්න",
      discover: "සොයා බලන්න",
      requestViaWhatsApp: "WhatsApp හරහා ඉල්ලන්න",
      openWhatsAppRequest: "WhatsApp ඉල්ලීම විවෘත කරන්න",
      systemAdministrator: "පද්ධති පරිපාලක",
      requiredDetail: "අවශ්‍ය විස්තර",
      noEmailAvailable: "විද්‍යුත් තැපෑලක් නොමැත",
      signedInTraveler: "ඇතුළු වූ සංචාරකයා",
      days: ({ count }) => `${count} දින${Number(count) === 1 ? "" : ""}`,
      dateRange: ({ start, end }) => `${start} සිට ${end} දක්වා`,
    },
    language: {
      label: "භාෂාව",
      english: "English",
      sinhala: "සිංහල",
    },
    navbar: {
      holidayPackages: "නිවාඩු පැකේජ",
      planWithUs: "අප සමඟ සැලසුම් කරන්න",
      fleet: "වාහන",
      stays: "නවාතැන්",
      toggleMenu: "මෙනුව විවෘත කරන්න",
    },
    footer: {
      establishment: "ප්‍රමුඛත්වයේ ස්ථාපිතය",
      headline: "දිවයින අත්විඳීමට හොඳම මාර්ගය.",
      curateJourney: "ඔබගේ ගමන සකස් කරන්න",
      curation: "සැකසුම්",
      heritage: "උරුමය",
      headquarters: "ප්‍රධාන කාර්යාලය",
      copyright: "© 2026 Aba Ceylon Travels & Tours",
      privacy: "රහස්‍යතා",
      terms: "නියමයන්",
      developedBy: "සංවර්ධනය කළේ",
      developedByName: "Vernox Labs Sri Lanka",
      links: {
        packages: "නිවාඩු පැකේජ",
        stays: "නවාතැන් සහ විවේක ස්ථාන",
        fleet: "පෞද්ගලික වාහන",
        activities: "විශේෂ ක්‍රියාකාරකම්",
        story: "අපේ කතාව",
        destinations: "ගමනාන්ත",
        sustainability: "තිරසාරත්වය",
        contact: "සම්බන්ධ වන්න",
      },
    },
    home: {
      hero: {
        titleLine1: "Aba Ceylon",
        titleLine2: "Tours and Travels",
        subtitle: "අතිශය උරුම අත්දැකීම",
        viewPackages: "අපගේ පැකේජ බලන්න",
        planJourney: "ඔබගේ ගමන සැලසුම් කරන්න",
        scroll: "ස්ක්‍රෝල්",
      },
      loader: {
        tagline: "අතිශය උරුම අත්දැකීම",
        preparing:
          "දිවයින පුරා සුවිශේෂී ගමන්, තෝරාගත් නවාතැන් සහ සුවිශේෂී මාර්ග සූදානම් කරමින්.",
        entering: "දිවයිනේ කතාවට පිවිසෙමින්",
      },
      packages: {
        title: "තෝරාගත් ගමන්",
        description:
          "ශ්‍රී ලංකාවේ උරුමය, කඳුකරය සහ වෙරළ තීරය හරහා සකස් කළ සංචාර අත්විඳින්න.",
        viewAll: "ලබා ගත හැකි පැකේජ බලන්න",
        previous: "පෙර",
        next: "ඊළඟ",
      },
      stays: {
        title: "ශ්‍රී ලංකාවේ නවාතැන්",
        description:
          "ශ්‍රී ලංකාවේ කතාවෙන් පිටත නොව, එහිම ඇතුළත නතර වන්න",
        viewAll: "සියලු නවාතැන් බලන්න",
        previous: "පෙර",
        next: "ඊළඟ",
      },
      fleet: {
        title: "ප්‍රිමියම් වාහන",
        description:
          "ශ්‍රී ලංකාව පුරා සුවපහසු ගමන් සඳහා රියදුරු සමඟ ලග්ජරි වාහන.",
        loading: "වාහන පූරණය වෙමින්...",
        empty: "දැනට වාහන නොමැත.",
        explore: "සම්පූර්ණ වාහන එකතුව බලන්න",
        previous: "පෙර",
        next: "ඊළඟ",
      },
      customPlanner: {
        eyebrow: "ඔබගේ ගමන සැලසුම් කරන්න",
        title: "අභිරුචි ගමන් සැලසුම්කරු",
        description:
          "අපගේ පුද්ගලික සැලසුම් සේවාව සමඟ ඔබගේ පරිපූර්ණ ශ්‍රී ලංකා සංචාරය නිර්මාණය කරන්න",
        routePlanning: "මාර්ග සැලසුම්",
        chauffeurMatching: "රියදුරු ගැලපීම",
        whatsappReady: "WhatsApp සූදානම්",
        startPlanning: "සැලසුම් ආරම්භ කරන්න",
      },
      testimonials: {
        title: "සංචාරක කථා",
        description: "අපගේ අමුත්තන් ඔවුන්ගේ උරුම ගමන ගැන කියන දේ",
      },
      map: {
        title: "අන්තර්ක්‍රියාකාරී සිතියම",
        subtitle:
          "ශ්‍රී ලංකාව පුරා ගමනාන්ත සොයා බලමින් ඔබගේ පරිපූර්ණ ගමන සැලසුම් කරන්න",
        legends: "ලෙජන්ඩ්",
        loading: "සිතියම පූරණය වෙමින්...",
        exploreTitle: "ශ්‍රී ලංකාව සොයා බලන්න",
        exploreDescription:
          "එක් එක් ස්ථානය ගැන වැඩිදුර දැනගැනීමට ගමනාන්ත මත ක්ලික් කරන්න",
        categories: {
          Heritage: {
            label: "උරුමය",
            description: "ශ්‍රී ලංකාවේ උරුම ස්ථාන සොයා බලන්න",
          },
          Nature: {
            label: "ස්වභාවය",
            description: "ස්වභාවික භූ දර්ශන සහ වනජීවීන් සොයා බලන්න",
          },
          Coastal: {
            label: "වෙරළ",
            description: "සුන්දර වෙරළ හා වෙරළබඩ ප්‍රදේශවල විවේක ගන්න",
          },
          Adventure: {
            label: "අත්දැකීම්",
            description: "උද්යෝගිමත් පිටත ක්‍රියාකාරකම් අත්විඳින්න",
          },
          City: {
            label: "නගරය",
            description: "ජීවන්ත නගර සහ නාගරික ගමනාන්ත සොයා බලන්න",
          },
        },
      },
      destinationPanel: {
        about: "විස්තර",
        highlights: "විශේෂ කරුණු",
        bestTime: "යන්න හොඳම කාලය",
        whyVisit: "ඇයි යා යුතුද",
        close: "වසන්න",
        addToPlanner: "සැලසුමට එක් කරන්න",
      },
      buddhaLotus: {
        heritageJourneys: "Aba Ceylon · Heritage Journeys",
        scrollReveal: "හෙළි කිරීමට පහළට ස්ක්‍රෝල් කරන්න",
        scroll: "ස්ක්‍රෝල්",
        sacredAncient: "පූජනීය · පැරණි",
        purityPeace: "පවිත්‍රත්වය · ශාන්තිය",
        yearsOfBuddhism: "බෞද්ධ වසර",
        noblePetals: "මහත් පෙති",
        sacredFlower: "බුදුන්ගේ පූජනීය මල",
        wheelOfDharma: "ධර්ම චක්‍රය",
        quote:
          "නෙලුම් මල කැළැල් ජලයෙන් නැගී එන ලෙස, ශ්‍රී ලංකාව සදාකාලික අලංකාරයෙන් නැගී එයි.",
        purity: "පවිත්‍රත්වය",
        enlightenment: "බෝධිය",
        rebirth: "නව උත්පත්තිය",
        sacredLotus: "පවිත්‍රත්වය සහ බෝධිය සංකේත කරන පූජනීය නෙලුම",
        brand: "Aba Ceylon Tours & Travels",
      },
    },
    packages: {
      packageLabel: ({ id }) => `පැකේජ ${String(id).padStart(2, "0")}`,
      curatedPackage: "තෝරාගත් පැකේජය",
      distanceKm: ({ km }) => `${km} කි.මී.`,
      requestPackage: "පැකේජය ඉල්ලන්න",
      requested: "ඉල්ලා ඇත",
      viewPackage: "පැකේජය බලන්න",
      pageTitle: "අපගේ තෝරාගත් සංචාර පැකේජ සොයා බලන්න",
      pageSubtitle:
        "ශ්‍රී ලංකාවේ උරුමය, කඳුකරය, වනජීවීන් සහ වෙරළ තීරය හරහා සකස් කළ සංචාර.",
      overview: "සාරාංශය",
      itinerary: "දිනෙන් දින වැඩසටහන",
      includedServices: "ඇතුළත් සේවා",
      recommendedVehicle: "නිර්දේශිත වාහනය",
      requestThisPackage: "මෙම පැකේජය ඉල්ලන්න",
      duration: "කාලය",
      distance: "දුර",
      route: "මාර්ගය",
    },
    stays: {
      stayLabel: ({ id }) => `නවාතැන් ${String(id).padStart(2, "0")}`,
      viewStay: "නවාතැන් බලන්න",
      pageTitle: "තෝරාගත් උරුම නවාතැන්",
      pageSubtitle:
        "ශ්‍රී ලංකාවේ කතාවෙන් පිටත නොව, එහිම ඇතුළත නතර වන්න!",
      category: "වර්ගය",
      owner: "හිමිකරු",
      about: "මෙම නවාතැන් ගැන",
      amenities: "පහසුකම්",
      whatsappContact: "WhatsApp සම්බන්ධතාව",
      contactWhatsApp: "WhatsApp හරහා සම්බන්ධ වන්න",
      viewOnMap: "සිතියමේ බලන්න",
      location: "ස්ථානය",
    },
    fleet: {
      viewMoreDetails: "වැඩි විස්තර බලන්න",
      premiumFleet: "ප්‍රිමියම් වාහන",
      pageTitle: "අපගේ ප්‍රිමියම් වාහන සොයා බලන්න",
      pageSubtitle:
        "ශ්‍රී ලංකාව පුරා සුමට හා උසස් ගමන් සඳහා රියදුරු සමඟ වාහන.",
      loading: "වාහන පූරණය වෙමින්...",
      empty: "දැනට වාහන නොමැත.",
      notFound: "වාහනය හමු නොවීය.",
      loadingVehicle: "වාහනය පූරණය වෙමින්...",
      overview: "සාරාංශය",
      features: "විශේෂාංග",
      aboutVehicle: "මෙම වාහනය ගැන",
      requestVehicle: "මෙම වාහනය ඉල්ලන්න",
      requestDescription:
        "ලබාගත හැකි බව තහවුරු කර වෙන් කිරීම සැකසීමට අපගේ කන්සියර්ජ් කණ්ඩායම ඔබව සම්බන්ධ කර ගනී.",
      models: "මාදිලි",
      passengers: ({ count }) => `${count} මගීන්`,
      luggage: ({ count }) => `${count} බෑග්`,
      pax: ({ count }) => `${count} pax`,
      bags: ({ count }) => `${count} බෑග්`,
    },
    planner: {
      eyebrow: "ආරක්ෂිත ගමන් සැලසුම්කරු",
      title: "අභිරුචි ශ්‍රී ලංකා ගමනක් සකස් කරන්න",
      description:
        "ඔබගේම මාර්ගය තනන්න, සුදුසු රියදුරු වාහනයක් තෝරන්න, නවාතැන් සැකසුම් තීරණය කරන්න, සහ සම්පූර්ණ ඉල්ලීම WhatsApp හරහා ABA Ceylon කණ්ඩායමට යවන්න.",
      signedInAccess: "පුරනය වී ඇති සැලසුම් ප්‍රවේශය",
      multiDestination: "බහු ගමනාන්ත අභිරුචි මාර්ගය",
      whatsappReady: "WhatsApp සූදානම් ඉල්ලීම",
      loadingTitle: "සැලසුම් දත්ත පූරණය වෙමින්",
      loadingDescription:
        "ඔබගේ අභිරුචි ගමන සඳහා වාහන, නවාතැන් සහ මාර්ග නිර්දේශ ලබාගනිමින්.",
      loadErrorTitle: "සැලසුම් දත්ත පූරණය කළ නොහැකි විය",
      continueHint: "ඉදිරියට යාම සඳහා මෙම පියවරේ අවශ්‍ය විස්තර සම්පූර්ණ කරන්න.",
      trip: {
        eyebrow: "පියවර 1",
        title: "ගමන් විස්තර",
        description:
          "ඔබ ශ්‍රී ලංකාවට පැමිණෙන දිනය, සිටින කාලය, සහ අප විසින් සැකසිය යුතු රියදුරු සමඟ ගමන් දින ගණන අපට කියන්න.",
        arrivalDate: "ශ්‍රී ලංකාවට පැමිණෙන දිනය",
        totalDays: "ශ්‍රී ලංකාවේ මුළු දින ගණන",
        travelStartDate: "ගමන ආරම්භ වන දිනය",
        travelDays: "රියදුරු සමඟ ගමන් දින",
        travelWindow: "ගමන් කාල පරාසය",
        departure: "ශ්‍රී ලංකාවෙන් පිටවන දිනය",
        minimumStay: "අවශ්‍ය අවම නවාතැන් කාලය",
        signedInTraveler: "පුරනය වී ඇති සංචාරකයා",
        chooseTravelStart: "ගමන ආරම්භ දිනය තෝරන්න",
        chooseArrivalStay: "පැමිණීම සහ නවාතැන් කාලය තෝරන්න",
        basedOnTrip:
          "ඔබගේ පැමිණීමේ දිනය, මාර්ග ආරම්භ දිනය සහ මාර්ග කාලය මත පදනම් වේ.",
        validTitle: "ගමන් විස්තර වලංගුයි",
        validDescription:
          "ඔබගේ වර්තමාන නවාතැන් කාලය මෙම මාර්ගයට සරිලන බැවින්, ගමනාන්ත තේරීමට ඉදිරියට යා හැක.",
        fixTitle: "ඉදිරියට යාමට පෙර මේවා සකස් කරන්න",
      },
      destination: {
        eyebrow: "පියවර 2",
        title: "ඔබගේ ගමනාන්ත තෝරන්න",
        selectedCount: ({ count }) =>
          `${count} ගමනාන්ත${Number(count) === 1 ? "" : ""} තෝරා ඇත`,
        tapToAdd: "එක් කිරීමට ස්පර්ශ කරන්න",
        selected: "තෝරා ඇත",
      },
      vehicle: {
        eyebrow: "පියවර 3",
        title: "ඔබ කැමති වාහන වර්ගය සහ සුවපහසු මට්ටම තෝරන්න",
        vehicleType: "වාහන වර්ගය",
        comfortLevel: "සුවපහසු මට්ටම",
        matchingVehicles: "ගැලපෙන වාහන",
        matchingDescription:
          "ඔබගේ වර්ගය සහ සුවපහසු මට්ටමට ගැලපෙන පවතින වාහන වලින් තෝරන්න.",
        options: ({ count }) =>
          `${count} විකල්ප${Number(count) === 1 ? "" : ""}`,
        seats: "ආසන",
        luggage: "බෑග්",
        chosen: "තෝරා ඇත",
        select: "තෝරන්න",
        empty:
          "ඉදිරියට යාමට වාහන වර්ගයක් සහ සුවපහසු මට්ටමක් තෝරන්න",
      },
      accommodation: {
        eyebrow: "පියවර 4",
        title: "නවාතැන් කැමැත්ත",
        ownTitle: "මට දැනටමත් නවාතැන් ඇත",
        ownDescription:
          "ඔබ තෝරාගත් ගමනාන්ත සඳහා වාහන සහ රියදුරු මාර්ගෝපදේශ සේවාව පමණක් ලබාගන්න.",
        recommendedTitle: "මගේ මාර්ගයට නවාතැන් නිර්දේශ කරන්න",
        recommendedDescription:
          "මම තෝරාගත් ගමනාන්ත සහ ගමන් කාලයට අනුව පද්ධති නිර්දේශිත නවාතැන් පෙන්වන්න.",
        plannerNote: "සැලසුම් සටහන",
        recommendedStays: "නිර්දේශිත නවාතැන්",
        chooseAccommodation: "එක් එක් ගමනාන්ත සඳහා නවාතැන් තෝරන්න",
        staysSelected: ({ count }) =>
          `${count} නවාතැන්${Number(count) === 1 ? "" : ""} තෝරා ඇත`,
        addStay: "නවාතැන් එක් කරන්න",
        checkIn: "ඇතුල් වීම",
        checkOut: "පිටවීම",
        noStays:
          "ඔබ තෝරාගත් ගමනාන්ත සඳහා නිර්දේශිත නවාතැන් නොමැත",
      },
      review: {
        eyebrow: "පියවර 5",
        title: "ඔබගේ අභිරුචි ගමන සමාලෝචනය කර ඉල්ලීම යවන්න",
        summary: "අභිරුචි ගමන් සාරාංශය",
        traveler: "සංචාරකයා",
        trip: "ගමන",
        destinations: "ගමනාන්ත",
        vehicle: "වාහනය",
        accommodation: "නවාතැන්",
        whatsappRequest: "WhatsApp ඉල්ලීම",
        whatsappDescription:
          "ඔබගේ සැලසුම් ඉල්ලීම පද්ධති පරිපාලකයාට යැවීමට සූදානම් WhatsApp පණිවිඩයක් විවෘත කරයි.",
        adminWhatsApp: "පරිපාලක WhatsApp",
      },
      steps: {
        trip: {
          title: "ගමන් විස්තර",
          caption: "පැමිණීම, මුළු නවාතැන් කාලය සහ ගමන් කාලය",
        },
        destinations: {
          title: "ගමනාන්ත",
          caption: "ඔබගේම මාර්ගය ගොඩනගන්න",
        },
        vehicle: {
          title: "වාහනය",
          caption: "වර්ගය, සුවපහසු මට්ටම සහ නිශ්චිත වාහනය",
        },
        accommodation: {
          title: "නවාතැන්",
          caption: "ඔබගේම නවාතැන් හෝ නිර්දේශිත නවාතැන්",
        },
        review: {
          title: "සමාලෝචනය සහ ඉල්ලීම",
          caption: "තහවුරු කර WhatsApp හරහා යවන්න",
        },
        pending: "අපේක්ෂිත",
      },
    },
    feedback: {
      title: "ඔබගේ ප්‍රතිචාරය බෙදා ගන්න",
      subtitle:
        "ඔබගේ අදහස අපට වැදගත්යි. ඔබගේ අත්දැකීම ගැන ඇසීමට අපි කැමතියි.",
      thankYou: "ස්තුතියි!",
      success: "ඔබගේ ප්‍රතිචාරය සාර්ථකව යවා ඇත",
      submitAnother: "තවත් එකක් යවන්න",
      rateExperience: "ඔබගේ අත්දැකීම අගය කරන්න",
      tellUs: "ඔබගේ අත්දැකීම අපට කියන්න",
      placeholder: "අපගේ සේවාව ගැන ඔබගේ අදහස් බෙදා ගන්න...",
      submit: "ප්‍රතිචාරය යවන්න",
      submitting: "යවමින්...",
      ratingLabels: {
        1: "දුර්වලයි",
        2: "සාමාන්‍යයි",
        3: "හොඳයි",
        4: "ඉතා හොඳයි",
        5: "අති විශිෂ්ටයි",
      },
      errors: {
        selectRating: "කරුණාකර ඇගයීමක් තෝරන්න",
        minimumMessage: "පණිවිඩය අවම වශයෙන් අක්ෂර 20ක් විය යුතුය",
      },
    },
    booking: {
      secure: "ආරක්ෂිත වෙන් කිරීම",
      requestPackage: "පැකේජය ඉල්ලන්න",
      requestVehicle: "වාහනය ඉල්ලන්න",
      checkingStatus: "ගිණුම් තත්ත්වය පරීක්ෂා කරමින්...",
      pleaseSignIn: ({ type }) =>
        `ABA Ceylon වෙත ${type} ඉල්ලීමක් යැවීමට කරුණාකර පුරනය වන්න.`,
      preferredDate: "කැමති වෙන් කිරීමේ දිනය",
      noIdeaDate: "දිනය ගැන අදහසක් නැත",
      dateLater: "දිනය පසුව තීරණය කරනු ඇත",
      continueWhatsApp: "WhatsApp වෙත යන්න",
      confirmDate:
        "WhatsApp විවෘත කිරීමට පෙර ඔබගේ කැමති වෙන් කිරීමේ දිනය තහවුරු කරන්න.",
      selectBookingDate: "කරුණාකර වෙන් කිරීමේ දිනය තෝරන්න",
    },
    contact: {
      eyebrow: "සංචාර සහායක",
      title: "අපි ඔබගේ ගමන සැලසුම් කරමු",
      description:
        "ඔබගේ සංචාර අදහස ABA Ceylon සමඟ බෙදා ගන්න, සහ අපගේ කණ්ඩායම නිවැරදි මාර්ගය, වාහනය, නවාතැන් සහ ප්‍රාදේශීය සහාය සමඟ ඔබට මග පෙන්වනු ඇත.",
      name: "ඔබගේ නම",
      email: "ඔබගේ විද්‍යුත් තැපෑල",
      phone: "ඔබගේ දුරකථනය",
      message: "ඔබගේ අදහස කුමක්ද?",
      messagePlaceholder:
        "ඔබගේ දිනයන්, කණ්ඩායම් ප්‍රමාණය, මාර්ග අදහස්, හෝ ඔබ නිර්මාණය කිරීමට කැමති ගමන් විලාසය ගැන අපට කියන්න.",
      consent:
        "මෙම විමසීම සම්බන්ධයෙන් ABA Ceylon විසින් WhatsApp, දුරකථන හෝ විද්‍යුත් තැපෑල මගින් මාව සම්බන්ධ කර ගත හැක.",
      submit: "යවන්න",
      submitHint:
        "ඔබගේ විමසීම අපගේ කණ්ඩායමට පෙර පුරවා ඇති WhatsApp පණිවිඩයක් ලෙස විවෘත වේ.",
      callUs: "අපට අමතන්න",
      callDescription:
        "ඔබගේ ශ්‍රී ලංකා ගමන සඳහා ඔබ කරන හොඳම ඇමතුම මෙය විය හැක.",
      whatsappUs: "WhatsApp කරන්න",
      phoneLabel: "දුරකථන",
      emailLabel: "විද්‍යුත් තැපෑල",
      basedIn: "පදනම් වී ඇත්තේ",
      openingHours: "විවෘත වේලාවන්",
      openingDescription:
        "අපගේ ශ්‍රී ලංකා කාර්යාල වේලාවන් පහත ඇත. ඒවාට පිටතදීත් WhatsApp හෝ විද්‍යුත් තැපෑලෙන් අප වෙත ළඟා විය හැක.",
      weekdays: "සතියේ දින",
      saturday: "සෙනසුරාදා",
      sunday: "ඉරිදා",
      consentError:
        "මෙම විමසීම ගැන ABA Ceylon විසින් ඔබව සම්බන්ධ කරගැනීමට කරුණාකර අනුමැතිය ලබා දෙන්න.",
      requiredError:
        "විමසීම යැවීමට පෙර අවශ්‍ය සියලු විස්තර සම්පූර්ණ කරන්න.",
    },
    auth: {
      desktopTitle: "ස්වර්ගය හරහා ඔබගේ ගමන මෙතැනින් ආරම්භ වේ.",
      desktopDescription:
        "රන් වෙරළවල් සිට මීදුම් කඳුකරය දක්වා, පැරණි පන්සල් සිට ජීවන්ත නගර ජීවිතය දක්වා, ශ්‍රී ලංකාව සොයා බලන්න බලා සිටින කතාවකි.",
      signInHighlight:
        "සැඟවුණු මැණික් සොයා ගැනීමට, අමතක නොවන අත්දැකීම් සැලසුම් කිරීමට සහ දිවයින පුරා බුද්ධිමත්ව සංචාරය කිරීමට පුරනය වන්න.",
      signUpHighlight:
        "සැඟවුණු මැණික් සොයා ගැනීමට, අමතක නොවන අත්දැකීම් සැලසුම් කිරීමට සහ දිවයින පුරා බුද්ධිමත්ව සංචාරය කිරීමට ලියාපදිංචි වන්න.",
      mobileTitle: "ඔබගේ ගමන මෙතැනින් ආරම්භ වේ.",
      mobileSignIn:
        "සැඟවුණු මැණික් සොයා ගැනීමට සහ බුද්ධිමත්ව සංචාරය කිරීමට පුරනය වන්න.",
      mobileSignUp:
        "සැඟවුණු මැණික් සොයා ගැනීමට සහ බුද්ධිමත්ව සංචාරය කිරීමට අප සමඟ එකතු වන්න.",
    },
    pagination: {
      prev: "පෙර",
      next: "ඊළඟ",
    },
    account: {
      title: "මගේ ගිණුම",
      feedbackTitle: "ප්‍රතිචාර බෙදා ගන්න",
      myPlans: "මගේ සැලසුම්",
      myInquiries: "මගේ විමසීම්",
    },
    placeholders: {
      about: "අප ගැන",
      activities: "ක්‍රියාකාරකම්",
      destinations: "ගමනාන්ත",
      destination: ({ slug }) => `ගමනාන්තය: ${slug}`,
    },
  },
};

const flatMessages: Partial<Record<Locale, Record<string, string | TranslationFormatter>>> = {
  de: {
    "language.label": "Sprache",
    "common.close": "Schließen",
    "common.continue": "Weiter",
    "common.previous": "Zurück",
    "common.next": "Weiter",
    "common.loading": "Wird geladen...",
    "common.ready": "Bereit",
    "common.selected": "Ausgewählt",
    "common.select": "Auswählen",
    "common.remove": "Entfernen",
    "common.viewMap": "Karte ansehen",
    "common.requestViaWhatsApp": "Über WhatsApp anfragen",
    "common.openWhatsAppRequest": "WhatsApp-Anfrage öffnen",
    "common.requiredDetail": "Erforderliche Angaben",
    "common.notSpecified": "Nicht angegeben",
    "common.signedInTraveler": "Angemeldeter Reisender",
    "common.noEmailAvailable": "Keine E-Mail verfügbar",
    "common.days": ({ count }) => `${count} Tag${Number(count) === 1 ? "" : "e"}`,
    "common.dateRange": ({ start, end }) => `${start} bis ${end}`,
    "navbar.holidayPackages": "Reisepakete",
    "navbar.planWithUs": "Mit uns planen",
    "navbar.fleet": "Fuhrpark",
    "navbar.stays": "Unterkünfte",
    "navbar.toggleMenu": "Menü umschalten",
    "home.hero.subtitle": "Das ultimative Kulturerlebnis",
    "home.hero.viewPackages": "Pakete ansehen",
    "home.hero.planJourney": "Reise planen",
    "home.hero.scroll": "SCROLLEN",
    "home.loader.tagline": "Das ultimative Kulturerlebnis",
    "home.loader.preparing": "Wir bereiten immersive Reisen, ausgewählte Unterkünfte und besondere Routen auf der Insel vor.",
    "home.loader.entering": "Die Inselgeschichte öffnet sich",
    "home.packages.title": "Kuratierte Reisen",
    "home.packages.description": "Entdecken Sie handgefertigte Reiseerlebnisse durch Sri Lankas Kulturerbe, Berge und Küsten.",
    "home.packages.viewAll": "Verfügbare Pakete ansehen",
    "home.stays.title": "Unterkünfte in Sri Lanka",
    "home.stays.description": "Wohnen Sie mitten in der Geschichte Sri Lankas.",
    "home.stays.viewAll": "Alle Unterkünfte entdecken",
    "home.fleet.title": "Premium-Fuhrpark",
    "home.fleet.description": "Chauffierte Luxusfahrzeuge für nahtlose Reisen durch Sri Lanka.",
    "home.fleet.loading": "Fuhrpark wird geladen...",
    "home.fleet.empty": "Derzeit sind keine Fahrzeuge verfügbar.",
    "home.fleet.explore": "Gesamten Fuhrpark ansehen",
    "home.customPlanner.eyebrow": "Reise planen",
    "home.customPlanner.title": "Individueller Reiseplaner",
    "home.customPlanner.description": "Gestalten Sie Ihr perfektes Sri-Lanka-Abenteuer mit unserer persönlichen Planung.",
    "home.customPlanner.routePlanning": "Routenplanung",
    "home.customPlanner.chauffeurMatching": "Chauffeur-Abstimmung",
    "home.customPlanner.whatsappReady": "WhatsApp-bereit",
    "home.customPlanner.startPlanning": "Planung starten",
    "home.testimonials.title": "Reiseerlebnisse",
    "home.testimonials.description": "Was unsere Gäste über ihre Kulturreise sagen",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · Kulturreisen",
    "home.buddhaLotus.scrollReveal": "Scrollen zum Entdecken",
    "home.buddhaLotus.scroll": "Scrollen",
    "home.buddhaLotus.sacredAncient": "Heilig · Antik",
    "home.buddhaLotus.purityPeace": "Reinheit · Frieden",
    "home.buddhaLotus.yearsOfBuddhism": "Jahre Buddhismus",
    "home.buddhaLotus.noblePetals": "Edle Blütenblätter",
    "home.buddhaLotus.sacredFlower": "Heilige Blume des Buddha",
    "home.buddhaLotus.wheelOfDharma": "Rad des Dharma",
    "home.buddhaLotus.quote": "Wie der Lotus aus schlammigem Wasser aufsteigt, erhebt sich Sri Lanka in zeitloser Schönheit.",
    "home.buddhaLotus.purity": "Reinheit",
    "home.buddhaLotus.enlightenment": "Erleuchtung",
    "home.buddhaLotus.rebirth": "Wiedergeburt",
    "home.buddhaLotus.sacredLotus": "Der heilige Lotus als Symbol für Reinheit und Erleuchtung",
    "home.buddhaLotus.brand": "Aba Ceylon Tours & Travels",
    "packages.pageTitle": "Entdecken Sie unsere kuratierten Reisepakete",
    "packages.pageSubtitle": "Handgefertigte Reisen durch Kultur, Berge, Wildnis und Küsten Sri Lankas.",
    "packages.requestPackage": "Paket anfragen",
    "packages.viewPackage": "Paket ansehen",
    "stays.pageTitle": "Kuratierte Kulturunterkünfte",
    "stays.pageSubtitle": "Wohnen Sie mitten in der Geschichte Sri Lankas.",
    "stays.viewStay": "Unterkunft ansehen",
    "fleet.pageTitle": "Entdecken Sie unseren Premium-Fuhrpark",
    "fleet.pageSubtitle": "Chauffierte Fahrzeuge für Komfort, Eleganz und nahtlose Reisen durch Sri Lanka.",
    "fleet.viewMoreDetails": "Mehr Details ansehen",
    "planner.eyebrow": "Geschützter Reiseplaner",
    "planner.title": "Gestalten Sie eine vollständig individuelle Sri-Lanka-Reise",
    "planner.description": "Erstellen Sie Ihre Route, wählen Sie das passende Chauffeur-Fahrzeug, entscheiden Sie über Unterkünfte und senden Sie die Anfrage direkt per WhatsApp an ABA Ceylon.",
    "planner.signedInAccess": "Zugang für angemeldete Nutzer",
    "planner.multiDestination": "Individuelle Route mit mehreren Zielen",
    "planner.whatsappReady": "WhatsApp-fertige Anfrage",
    "planner.loadingTitle": "Planungsdaten werden geladen",
    "planner.loadingDescription": "Fahrzeuge, Unterkünfte und Routenempfehlungen werden geladen.",
    "planner.continueHint": "Vervollständigen Sie die erforderlichen Angaben, um fortzufahren.",
    "planner.trip.eyebrow": "Schritt 1",
    "planner.trip.title": "Reisedetails",
    "planner.destination.eyebrow": "Schritt 2",
    "planner.destination.title": "Ziele auswählen",
    "planner.destination.selectedCount": ({ count }) => `${count} Ziel${Number(count) === 1 ? "" : "e"} ausgewählt`,
    "planner.vehicle.eyebrow": "Schritt 3",
    "planner.vehicle.title": "Fahrzeugtyp und Komfortstufe auswählen",
    "planner.accommodation.eyebrow": "Schritt 4",
    "planner.accommodation.title": "Unterkunftswunsch",
    "planner.review.eyebrow": "Schritt 5",
    "planner.review.title": "Reise prüfen und Anfrage senden",
    "feedback.title": "Feedback teilen",
    "feedback.subtitle": "Ihre Meinung ist uns wichtig.",
    "feedback.submit": "Feedback senden",
    "feedback.submitting": "Wird gesendet...",
    "contact.eyebrow": "Reise-Concierge",
    "contact.title": "Lassen Sie uns Ihre Reise planen",
    "contact.description": "Teilen Sie Ihre Reiseidee mit ABA Ceylon und unser Team hilft Ihnen bei Route, Fahrzeug, Unterkünften und lokaler Unterstützung.",
    "contact.submit": "Senden",
    "chat.welcome": "Ayubowan! Ich bin Aba, Ihr persönlicher Sri-Lanka-Reiseführer. Wohin möchten Sie reisen?",
    "chat.placeholder": "Fragen Sie mich alles über Sri Lanka...",
    "chat.guide": "Sri-Lanka-Reiseführer",
    "account.title": "Mein Konto",
    "account.myPlans": "Meine Pläne",
    "account.myInquiries": "Meine Anfragen",
    "placeholders.about": "Über uns",
    "placeholders.activities": "Aktivitäten",
    "placeholders.destinations": "Reiseziele",
    "placeholders.destination": ({ slug }) => `Reiseziel: ${slug}`,
  },
  fr: {
    "language.label": "Langue",
    "common.close": "Fermer",
    "common.continue": "Continuer",
    "common.previous": "Précédent",
    "common.next": "Suivant",
    "common.loading": "Chargement...",
    "common.ready": "Prêt",
    "common.selected": "Sélectionné",
    "common.select": "Sélectionner",
    "common.remove": "Retirer",
    "common.viewMap": "Voir la carte",
    "common.requestViaWhatsApp": "Demander via WhatsApp",
    "common.openWhatsAppRequest": "Ouvrir la demande WhatsApp",
    "common.requiredDetail": "Détail requis",
    "common.notSpecified": "Non précisé",
    "common.signedInTraveler": "Voyageur connecté",
    "common.noEmailAvailable": "Aucun e-mail disponible",
    "common.days": ({ count }) => `${count} jour${Number(count) === 1 ? "" : "s"}`,
    "common.dateRange": ({ start, end }) => `${start} au ${end}`,
    "navbar.holidayPackages": "Forfaits voyage",
    "navbar.planWithUs": "Planifier avec nous",
    "navbar.fleet": "Flotte",
    "navbar.stays": "Séjours",
    "navbar.toggleMenu": "Ouvrir le menu",
    "home.hero.subtitle": "L'expérience patrimoniale ultime",
    "home.hero.viewPackages": "Voir nos forfaits",
    "home.hero.planJourney": "Planifier votre voyage",
    "home.hero.scroll": "DÉFILER",
    "home.packages.title": "Voyages sur mesure",
    "home.packages.description": "Explorez des expériences créées à travers le patrimoine, les montagnes et les côtes du Sri Lanka.",
    "home.packages.viewAll": "Voir les forfaits disponibles",
    "home.stays.title": "Hébergements au Sri Lanka",
    "home.stays.description": "Séjournez au cœur de l'histoire du Sri Lanka.",
    "home.stays.viewAll": "Découvrir tous les séjours",
    "home.fleet.title": "Flotte premium",
    "home.fleet.description": "Véhicules de luxe avec chauffeur pour voyager sans effort au Sri Lanka.",
    "home.fleet.loading": "Chargement de la flotte...",
    "home.fleet.empty": "Aucun véhicule disponible pour le moment.",
    "home.fleet.explore": "Explorer toute la flotte",
    "home.customPlanner.title": "Planificateur de voyage personnalisé",
    "home.customPlanner.startPlanning": "Commencer la planification",
    "home.testimonials.title": "Récits de voyageurs",
    "home.testimonials.description": "Ce que nos invités disent de leur voyage patrimonial",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · Voyages patrimoniaux",
    "home.buddhaLotus.scrollReveal": "Faites défiler pour révéler",
    "home.buddhaLotus.scroll": "Défiler",
    "home.buddhaLotus.sacredAncient": "Sacré · Ancien",
    "home.buddhaLotus.purityPeace": "Pureté · Paix",
    "home.buddhaLotus.yearsOfBuddhism": "Années de bouddhisme",
    "home.buddhaLotus.noblePetals": "Nobles pétales",
    "home.buddhaLotus.sacredFlower": "Fleur sacrée du Bouddha",
    "home.buddhaLotus.wheelOfDharma": "Roue du Dharma",
    "home.buddhaLotus.quote": "Comme le lotus s'élève des eaux boueuses, le Sri Lanka s'élève dans une beauté intemporelle.",
    "home.buddhaLotus.purity": "Pureté",
    "home.buddhaLotus.enlightenment": "Éveil",
    "home.buddhaLotus.rebirth": "Renaissance",
    "home.buddhaLotus.sacredLotus": "Le lotus sacré, symbole de pureté et d'éveil",
    "packages.pageTitle": "Découvrez nos forfaits de voyage sur mesure",
    "stays.pageTitle": "Séjours patrimoniaux sélectionnés",
    "fleet.pageTitle": "Découvrez notre flotte premium",
    "planner.title": "Créez un voyage entièrement personnalisé au Sri Lanka",
    "planner.continueHint": "Complétez les informations requises pour continuer.",
    "feedback.title": "Partager votre avis",
    "feedback.submit": "Envoyer l'avis",
    "contact.title": "Planifions votre voyage",
    "chat.welcome": "Ayubowan ! Je suis Aba, votre guide personnel pour le Sri Lanka. Où souhaitez-vous aller ?",
    "chat.placeholder": "Posez-moi vos questions sur le Sri Lanka...",
    "chat.guide": "Guide de voyage au Sri Lanka",
    "account.title": "Mon compte",
    "account.myPlans": "Mes plans",
    "account.myInquiries": "Mes demandes",
    "placeholders.about": "À propos",
    "placeholders.activities": "Activités",
    "placeholders.destinations": "Destinations",
    "placeholders.destination": ({ slug }) => `Destination : ${slug}`,
  },
  nl: {
    "language.label": "Taal",
    "common.continue": "Doorgaan",
    "common.previous": "Vorige",
    "common.next": "Volgende",
    "common.selected": "Geselecteerd",
    "common.select": "Selecteren",
    "common.remove": "Verwijderen",
    "common.viewMap": "Kaart bekijken",
    "common.requestViaWhatsApp": "Aanvragen via WhatsApp",
    "common.openWhatsAppRequest": "WhatsApp-aanvraag openen",
    "common.days": ({ count }) => `${count} dag${Number(count) === 1 ? "" : "en"}`,
    "navbar.holidayPackages": "Reispakketten",
    "navbar.planWithUs": "Plan met ons",
    "navbar.fleet": "Wagenpark",
    "navbar.stays": "Verblijven",
    "home.hero.subtitle": "De ultieme erfgoedervaring",
    "home.hero.viewPackages": "Bekijk pakketten",
    "home.hero.planJourney": "Plan uw reis",
    "home.packages.title": "Samengestelde reizen",
    "home.stays.title": "Accommodatie in Sri Lanka",
    "home.fleet.title": "Premium wagenpark",
    "home.customPlanner.title": "Persoonlijke reisplanner",
    "home.testimonials.title": "Reisverhalen",
    "home.testimonials.description": "Wat onze gasten zeggen over hun erfgoedreis",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · Erfgoedreizen",
    "home.buddhaLotus.scrollReveal": "Scroll om te ontdekken",
    "home.buddhaLotus.sacredAncient": "Heilig · Oud",
    "home.buddhaLotus.purityPeace": "Zuiverheid · Vrede",
    "home.buddhaLotus.quote": "Zoals de lotus uit modderig water oprijst, zo verrijst Sri Lanka in tijdloze schoonheid.",
    "planner.title": "Stel een volledig persoonlijke Sri Lanka-reis samen",
    "feedback.title": "Deel uw feedback",
    "contact.title": "Laten we uw reis plannen",
    "chat.welcome": "Ayubowan! Ik ben Aba, uw persoonlijke Sri Lanka-reisgids. Waar wilt u naartoe?",
    "chat.placeholder": "Vraag me alles over Sri Lanka...",
    "account.title": "Mijn account",
    "account.myPlans": "Mijn plannen",
    "account.myInquiries": "Mijn aanvragen",
    "placeholders.about": "Over ons",
    "placeholders.activities": "Activiteiten",
    "placeholders.destinations": "Bestemmingen",
    "placeholders.destination": ({ slug }) => `Bestemming: ${slug}`,
  },
  it: {
    "language.label": "Lingua",
    "common.continue": "Continua",
    "common.previous": "Precedente",
    "common.next": "Successivo",
    "common.selected": "Selezionato",
    "common.select": "Seleziona",
    "common.remove": "Rimuovi",
    "common.viewMap": "Vedi mappa",
    "common.requestViaWhatsApp": "Richiedi via WhatsApp",
    "common.openWhatsAppRequest": "Apri richiesta WhatsApp",
    "common.days": ({ count }) => `${count} giorno${Number(count) === 1 ? "" : "i"}`,
    "navbar.holidayPackages": "Pacchetti viaggio",
    "navbar.planWithUs": "Pianifica con noi",
    "navbar.fleet": "Flotta",
    "navbar.stays": "Soggiorni",
    "home.hero.subtitle": "L'esperienza culturale definitiva",
    "home.hero.viewPackages": "Vedi pacchetti",
    "home.hero.planJourney": "Pianifica il viaggio",
    "home.packages.title": "Viaggi curati",
    "home.stays.title": "Alloggi in Sri Lanka",
    "home.fleet.title": "Flotta premium",
    "home.customPlanner.title": "Planner di viaggio personalizzato",
    "home.testimonials.title": "Storie dei viaggiatori",
    "home.testimonials.description": "Cosa dicono i nostri ospiti del loro viaggio culturale",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · Viaggi culturali",
    "home.buddhaLotus.scrollReveal": "Scorri per scoprire",
    "home.buddhaLotus.sacredAncient": "Sacro · Antico",
    "home.buddhaLotus.purityPeace": "Purezza · Pace",
    "home.buddhaLotus.quote": "Come il loto emerge dalle acque fangose, lo Sri Lanka sorge in una bellezza senza tempo.",
    "planner.title": "Crea un viaggio in Sri Lanka completamente personalizzato",
    "feedback.title": "Condividi il tuo feedback",
    "contact.title": "Pianifichiamo il tuo viaggio",
    "chat.welcome": "Ayubowan! Sono Aba, la tua guida personale per lo Sri Lanka. Dove vorresti andare?",
    "chat.placeholder": "Chiedimi qualsiasi cosa sullo Sri Lanka...",
    "account.title": "Il mio account",
    "account.myPlans": "I miei piani",
    "account.myInquiries": "Le mie richieste",
    "placeholders.about": "Chi siamo",
    "placeholders.activities": "Attività",
    "placeholders.destinations": "Destinazioni",
    "placeholders.destination": ({ slug }) => `Destinazione: ${slug}`,
  },
  es: {
    "language.label": "Idioma",
    "common.continue": "Continuar",
    "common.previous": "Anterior",
    "common.next": "Siguiente",
    "common.selected": "Seleccionado",
    "common.select": "Seleccionar",
    "common.remove": "Quitar",
    "common.viewMap": "Ver mapa",
    "common.requestViaWhatsApp": "Solicitar por WhatsApp",
    "common.openWhatsAppRequest": "Abrir solicitud de WhatsApp",
    "common.days": ({ count }) => `${count} día${Number(count) === 1 ? "" : "s"}`,
    "navbar.holidayPackages": "Paquetes de viaje",
    "navbar.planWithUs": "Planifica con nosotros",
    "navbar.fleet": "Flota",
    "navbar.stays": "Estancias",
    "home.hero.subtitle": "La experiencia patrimonial definitiva",
    "home.hero.viewPackages": "Ver paquetes",
    "home.hero.planJourney": "Planificar viaje",
    "home.packages.title": "Viajes seleccionados",
    "home.stays.title": "Alojamientos en Sri Lanka",
    "home.fleet.title": "Flota premium",
    "home.customPlanner.title": "Planificador personalizado",
    "home.testimonials.title": "Historias de viajeros",
    "home.testimonials.description": "Lo que dicen nuestros huéspedes sobre su viaje patrimonial",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · Viajes patrimoniales",
    "home.buddhaLotus.scrollReveal": "Desplázate para descubrir",
    "home.buddhaLotus.sacredAncient": "Sagrado · Antiguo",
    "home.buddhaLotus.purityPeace": "Pureza · Paz",
    "home.buddhaLotus.quote": "Así como el loto emerge de aguas turbias, Sri Lanka se eleva con belleza eterna.",
    "planner.title": "Crea un viaje a Sri Lanka totalmente personalizado",
    "feedback.title": "Comparte tu opinión",
    "contact.title": "Planifiquemos tu viaje",
    "chat.welcome": "¡Ayubowan! Soy Aba, tu guía personal de Sri Lanka. ¿A dónde te gustaría ir?",
    "chat.placeholder": "Pregúntame cualquier cosa sobre Sri Lanka...",
    "account.title": "Mi cuenta",
    "account.myPlans": "Mis planes",
    "account.myInquiries": "Mis consultas",
    "placeholders.about": "Acerca de",
    "placeholders.activities": "Actividades",
    "placeholders.destinations": "Destinos",
    "placeholders.destination": ({ slug }) => `Destino: ${slug}`,
  },
  ru: {
    "language.label": "Язык",
    "common.continue": "Продолжить",
    "common.previous": "Назад",
    "common.next": "Далее",
    "common.selected": "Выбрано",
    "common.select": "Выбрать",
    "common.remove": "Удалить",
    "common.viewMap": "Посмотреть карту",
    "common.requestViaWhatsApp": "Запросить через WhatsApp",
    "common.openWhatsAppRequest": "Открыть запрос WhatsApp",
    "common.days": ({ count }) => `${count} дн.`,
    "navbar.holidayPackages": "Турпакеты",
    "navbar.planWithUs": "Планировать с нами",
    "navbar.fleet": "Автопарк",
    "navbar.stays": "Проживание",
    "home.hero.subtitle": "Лучшее культурное путешествие",
    "home.hero.viewPackages": "Смотреть пакеты",
    "home.hero.planJourney": "Спланировать поездку",
    "home.packages.title": "Авторские маршруты",
    "home.stays.title": "Проживание на Шри-Ланке",
    "home.fleet.title": "Премиальный автопарк",
    "home.customPlanner.title": "Индивидуальный планировщик",
    "home.testimonials.title": "Истории путешественников",
    "home.testimonials.description": "Что гости говорят о своем культурном путешествии",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · Культурные путешествия",
    "home.buddhaLotus.scrollReveal": "Прокрутите, чтобы раскрыть",
    "home.buddhaLotus.sacredAncient": "Священное · Древнее",
    "home.buddhaLotus.purityPeace": "Чистота · Мир",
    "home.buddhaLotus.quote": "Как лотос поднимается из мутной воды, так Шри-Ланка раскрывается в вечной красоте.",
    "planner.title": "Создайте полностью индивидуальное путешествие по Шри-Ланке",
    "feedback.title": "Оставьте отзыв",
    "contact.title": "Давайте спланируем вашу поездку",
    "chat.welcome": "Ayubowan! Я Аба, ваш личный гид по Шри-Ланке. Куда вы хотите отправиться?",
    "chat.placeholder": "Спросите меня о Шри-Ланке...",
    "account.title": "Мой аккаунт",
    "account.myPlans": "Мои планы",
    "account.myInquiries": "Мои запросы",
    "placeholders.about": "О нас",
    "placeholders.activities": "Активности",
    "placeholders.destinations": "Направления",
    "placeholders.destination": ({ slug }) => `Направление: ${slug}`,
  },
  zh: {
    "language.label": "语言",
    "common.continue": "继续",
    "common.previous": "上一步",
    "common.next": "下一步",
    "common.selected": "已选择",
    "common.select": "选择",
    "common.remove": "移除",
    "common.viewMap": "查看地图",
    "common.requestViaWhatsApp": "通过 WhatsApp 咨询",
    "common.openWhatsAppRequest": "打开 WhatsApp 咨询",
    "common.days": ({ count }) => `${count} 天`,
    "navbar.holidayPackages": "旅行套餐",
    "navbar.planWithUs": "定制行程",
    "navbar.fleet": "车队",
    "navbar.stays": "住宿",
    "home.hero.subtitle": "极致文化遗产体验",
    "home.hero.viewPackages": "查看套餐",
    "home.hero.planJourney": "规划旅程",
    "home.packages.title": "精选旅程",
    "home.stays.title": "斯里兰卡住宿",
    "home.fleet.title": "高级车队",
    "home.customPlanner.title": "定制旅程规划器",
    "home.testimonials.title": "旅客故事",
    "home.testimonials.description": "宾客如何评价他们的文化之旅",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · 文化遗产之旅",
    "home.buddhaLotus.scrollReveal": "向下滚动探索",
    "home.buddhaLotus.sacredAncient": "神圣 · 古老",
    "home.buddhaLotus.purityPeace": "纯净 · 宁静",
    "home.buddhaLotus.quote": "正如莲花从泥水中升起，斯里兰卡也绽放出永恒之美。",
    "planner.title": "定制专属斯里兰卡旅程",
    "feedback.title": "分享反馈",
    "contact.title": "让我们规划您的旅程",
    "chat.welcome": "Ayubowan！我是 Aba，您的斯里兰卡私人旅行向导。您想去哪里？",
    "chat.placeholder": "向我询问任何关于斯里兰卡的问题...",
    "account.title": "我的账户",
    "account.myPlans": "我的计划",
    "account.myInquiries": "我的咨询",
    "placeholders.about": "关于我们",
    "placeholders.activities": "活动",
    "placeholders.destinations": "目的地",
    "placeholders.destination": ({ slug }) => `目的地：${slug}`,
  },
  ja: {
    "language.label": "言語",
    "common.continue": "続ける",
    "common.previous": "前へ",
    "common.next": "次へ",
    "common.selected": "選択済み",
    "common.select": "選択",
    "common.remove": "削除",
    "common.viewMap": "地図を見る",
    "common.requestViaWhatsApp": "WhatsAppで問い合わせ",
    "common.openWhatsAppRequest": "WhatsAppリクエストを開く",
    "common.days": ({ count }) => `${count}日`,
    "navbar.holidayPackages": "旅行パッケージ",
    "navbar.planWithUs": "旅を計画",
    "navbar.fleet": "車両",
    "navbar.stays": "宿泊",
    "home.hero.subtitle": "究極のヘリテージ体験",
    "home.hero.viewPackages": "パッケージを見る",
    "home.hero.planJourney": "旅を計画する",
    "home.packages.title": "厳選された旅",
    "home.stays.title": "スリランカの宿泊施設",
    "home.fleet.title": "プレミアム車両",
    "home.customPlanner.title": "カスタム旅行プランナー",
    "home.testimonials.title": "旅行者の声",
    "home.testimonials.description": "ヘリテージ旅行についてのお客様の声",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · ヘリテージ旅行",
    "home.buddhaLotus.scrollReveal": "スクロールして表示",
    "home.buddhaLotus.sacredAncient": "神聖 · 古代",
    "home.buddhaLotus.purityPeace": "清らかさ · 平和",
    "home.buddhaLotus.quote": "蓮が泥水から立ち上がるように、スリランカは時を超えた美しさで輝きます。",
    "planner.title": "完全オーダーメイドのスリランカ旅行を作成",
    "feedback.title": "フィードバックを共有",
    "contact.title": "旅を一緒に計画しましょう",
    "chat.welcome": "Ayubowan！私はAba、あなた専属のスリランカ旅行ガイドです。どこへ行きたいですか？",
    "chat.placeholder": "スリランカについて何でも聞いてください...",
    "account.title": "マイアカウント",
    "account.myPlans": "マイプラン",
    "account.myInquiries": "お問い合わせ",
    "placeholders.about": "私たちについて",
    "placeholders.activities": "アクティビティ",
    "placeholders.destinations": "目的地",
    "placeholders.destination": ({ slug }) => `目的地：${slug}`,
  },
  ko: {
    "language.label": "언어",
    "common.continue": "계속",
    "common.previous": "이전",
    "common.next": "다음",
    "common.selected": "선택됨",
    "common.select": "선택",
    "common.remove": "삭제",
    "common.viewMap": "지도 보기",
    "common.requestViaWhatsApp": "WhatsApp으로 문의",
    "common.openWhatsAppRequest": "WhatsApp 요청 열기",
    "common.days": ({ count }) => `${count}일`,
    "navbar.holidayPackages": "여행 패키지",
    "navbar.planWithUs": "여행 계획",
    "navbar.fleet": "차량",
    "navbar.stays": "숙소",
    "home.hero.subtitle": "최고의 문화유산 경험",
    "home.hero.viewPackages": "패키지 보기",
    "home.hero.planJourney": "여행 계획하기",
    "home.packages.title": "엄선된 여행",
    "home.stays.title": "스리랑카 숙소",
    "home.fleet.title": "프리미엄 차량",
    "home.customPlanner.title": "맞춤 여행 플래너",
    "home.testimonials.title": "여행자 이야기",
    "home.testimonials.description": "문화유산 여행에 대한 고객 후기",
    "home.buddhaLotus.heritageJourneys": "Aba Ceylon · 문화유산 여행",
    "home.buddhaLotus.scrollReveal": "스크롤하여 보기",
    "home.buddhaLotus.sacredAncient": "신성함 · 고대",
    "home.buddhaLotus.purityPeace": "순수 · 평화",
    "home.buddhaLotus.quote": "연꽃이 진흙탕에서 피어나듯, 스리랑카는 영원한 아름다움으로 떠오릅니다.",
    "planner.title": "완전 맞춤형 스리랑카 여행 만들기",
    "feedback.title": "피드백 공유",
    "contact.title": "여행을 함께 계획해요",
    "chat.welcome": "Ayubowan! 저는 스리랑카 개인 여행 가이드 Aba입니다. 어디로 가고 싶으신가요?",
    "chat.placeholder": "스리랑카에 대해 무엇이든 물어보세요...",
    "account.title": "내 계정",
    "account.myPlans": "내 계획",
    "account.myInquiries": "내 문의",
    "placeholders.about": "소개",
    "placeholders.activities": "액티비티",
    "placeholders.destinations": "목적지",
    "placeholders.destination": ({ slug }) => `목적지: ${slug}`,
  },
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: TranslationVars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const CP1252_OVERRIDES: Record<string, number> = {
  "€": 0x80,
  "‚": 0x82,
  "ƒ": 0x83,
  "„": 0x84,
  "…": 0x85,
  "†": 0x86,
  "‡": 0x87,
  "ˆ": 0x88,
  "‰": 0x89,
  "Š": 0x8a,
  "‹": 0x8b,
  "Œ": 0x8c,
  "Ž": 0x8e,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "•": 0x95,
  "–": 0x96,
  "—": 0x97,
  "˜": 0x98,
  "™": 0x99,
  "š": 0x9a,
  "›": 0x9b,
  "œ": 0x9c,
  "ž": 0x9e,
  "Ÿ": 0x9f,
};

function repairMojibake(value: string) {
  if (!/[ÃÂàâð]/.test(value)) {
    return value;
  }

  try {
    const bytes = Array.from(value, (char) => {
      const code = char.charCodeAt(0);
      return code <= 0xff ? code : CP1252_OVERRIDES[char] ?? code;
    });

    return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  } catch {
    return value;
  }
}

function resolveMessage(locale: Locale, key: string): TranslationValue | undefined {
  const flatMessage = flatMessages[locale]?.[key];
  if (flatMessage) {
    return flatMessage;
  }

  return key.split(".").reduce<TranslationValue | undefined>((current, part) => {
    if (!current || typeof current === "string" || typeof current === "function") {
      return undefined;
    }

    return current[part];
  }, messages[locale]);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) {
        setLocaleState(stored);
      }
      setIsLocaleLoaded(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isLocaleLoaded) {
      return;
    }

    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [isLocaleLoaded, locale]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, vars?: Record<string, string | number>) => {
      const resolved =
        resolveMessage(locale, key) ?? resolveMessage("en", key) ?? key;

      if (typeof resolved === "function") {
        return resolved(vars ?? {});
      }

      return typeof resolved === "string" ? repairMojibake(resolved) : key;
    };

    return {
      locale,
      setLocale: setLocaleState,
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
