"use client";

import { packages as fallbackPackages } from "@/data/packages";
import { stays as fallbackStays } from "@/data/stays";
import { vehicles as fallbackVehicles } from "@/data/vehicles";
import { fetchDestinations } from "@/services/destinationService";
import { fetchPackages } from "@/services/packageService";
import { fetchStays } from "@/services/stayService";
import { fetchVehiclesPage } from "@/services/fleetService";

type ProgressListener = (progress: number) => void;

const listeners = new Set<ProgressListener>();
const completedMedia = new Set<string>();

let preloadPromise: Promise<void> | null = null;
let latestProgress = 0;

function emitProgress(progress: number) {
  latestProgress = progress;
  listeners.forEach((listener) => listener(progress));
}

function trackImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();

    image.onload = () => {
      completedMedia.add(src);
      resolve();
    };
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      completedMedia.add(src);
      resolve();
    }
  });
}

function trackVideo(src: string) {
  return new Promise<void>((resolve) => {
    const video = document.createElement("video");
    const settle = () => {
      video.removeEventListener("loadeddata", settle);
      video.removeEventListener("error", settle);
      if (video.readyState >= 2) {
        completedMedia.add(src);
      }
      resolve();
    };

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("loadeddata", settle, { once: true });
    video.addEventListener("error", settle, { once: true });
    video.src = src;
    video.load();
  });
}

function waitForWindowLoad() {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function getHomeAssetTasks() {
  const imageSources = Array.from(
    new Set([
      "/LOGO.jpeg",
      "/Who.png",
      "/Founder.png",
      "/whychoose.webp",
      "/images/heritage/Hero1.jpg",
      ...fallbackPackages.map((pkg) => pkg.image),
      ...fallbackStays.map((stay) => stay.image),
      ...fallbackVehicles.map((vehicle) => vehicle.imageUrl),
    ]),
  );

  const videoSources = ["/videos/SriLanka.mp4", "/videos/output.mp4"];

  return [
    ...imageSources.map((src) => () => trackImage(src)),
    ...videoSources.map((src) => () => trackVideo(src)),
  ];
}

function getHomeCodeTasks() {
  return [
    () => import("@/components/hero/HeroSection").then(() => undefined),
    () => import("@/components/whoWeAre/WhoWeAre").then(() => undefined),
    () => import("@/components/howItWorks/HowItWorks").then(() => undefined),
    () => import("@/components/buddhaLotus/BuddhaLotus").then(() => undefined),
    () => import("@/components/trustBar/TrustBar").then(() => undefined),
    () =>
      import("@/components/interactiveSriLanka/InteractiveMap").then(
        () => undefined,
      ),
    () => import("@/components/whyChooseUs/WhyChooseUs").then(() => undefined),
    () =>
      import("@/components/featuredPackages/FeaturedPckgs").then(
        () => undefined,
      ),
    () =>
      import("@/components/featuredStays/FeaturedStays").then(() => undefined),
    () => import("@/components/fleet/FleetSection").then(() => undefined),
    () =>
      import("@/components/customPlanner/CustomPlannerSection").then(
        () => undefined,
      ),
    () => import("@/components/faq/FAQ").then(() => undefined),
    () =>
      import("@/components/testimonials/Testimonials").then(() => undefined),
  ];
}

function getHomeDataTasks() {
  return [
    () => fetchPackages().then(() => undefined),
    () => fetchStays().then(() => undefined),
    () => fetchDestinations().then(() => undefined),
    () => fetchVehiclesPage(1, 8).then(() => undefined),
  ];
}

export function subscribeHomePreloadProgress(listener: ProgressListener) {
  listeners.add(listener);
  listener(latestProgress);

  return () => {
    listeners.delete(listener);
  };
}

export function isHomeMediaPreloaded(src: string) {
  return completedMedia.has(src);
}

export function ensureHomeExperiencePreloaded() {
  if (preloadPromise) {
    return preloadPromise;
  }

  const tasks = [
    () => waitForWindowLoad(),
    ...getHomeCodeTasks(),
    ...getHomeDataTasks(),
    ...getHomeAssetTasks(),
  ];

  let completed = 0;
  emitProgress(0);

  preloadPromise = Promise.all(
    tasks.map((task) =>
      Promise.resolve()
        .then(task)
        .catch(() => undefined)
        .finally(() => {
          completed += 1;
          emitProgress(completed / tasks.length);
        }),
    ),
  ).then(() => {
    emitProgress(1);
  });

  return preloadPromise;
}
