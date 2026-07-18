"use client";

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
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

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

function waitForWindowLoad() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
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

  const startTime = Date.now();
  const MIN_DURATION = 1800; // 1.8 seconds minimum for animation

  // Start checking when window load event is ready
  const windowLoadPromise = waitForWindowLoad();
  const logoPromise = trackImage("/LOGO.jpeg");

  const criticalPromise = Promise.all([windowLoadPromise, logoPromise]);

  preloadPromise = new Promise<void>((resolve) => {
    let criticalCompleted = false;

    criticalPromise.finally(() => {
      criticalCompleted = true;
    });

    const update = () => {
      const elapsed = Date.now() - startTime;
      const timeProgress = Math.min(elapsed / MIN_DURATION, 1);

      if (timeProgress >= 1 && criticalCompleted) {
        emitProgress(1);
        clearInterval(timerId);
        resolve();
      } else {
        const displayProgress = criticalCompleted
          ? timeProgress
          : Math.min(timeProgress * 0.9, 0.9);
        emitProgress(displayProgress);
      }
    };

    // Run every 16ms (roughly 60fps)
    const timerId = setInterval(update, 16);
  });

  return preloadPromise;
}
