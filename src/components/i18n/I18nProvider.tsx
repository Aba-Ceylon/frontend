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

type Locale = "en" | "si";

const STORAGE_KEY = "aba-locale";

const messages: Record<Locale, TranslationMessages> = {
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
  return key.split(".").reduce<TranslationValue | undefined>((current, part) => {
    if (!current || typeof current === "string" || typeof current === "function") {
      return undefined;
    }

    return current[part];
  }, messages[locale]);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "si" ? stored : "en";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

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
