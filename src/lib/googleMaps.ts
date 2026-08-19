export type GoogleMap = {
  panTo: (location: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
};

export type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  addListener: (eventName: string, handler: () => void) => void;
};

type GoogleMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMap;
  Marker: new (options: Record<string, unknown>) => GoogleMarker;
};

let loadPromise: Promise<GoogleMapsApi> | null = null;

export function loadGoogleMaps(): Promise<GoogleMapsApi> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY."));
  }

  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in a browser."));
  }

  const googleWindow = window as Window & { google?: { maps?: GoogleMapsApi } };
  if (googleWindow.google?.maps) {
    return Promise.resolve(googleWindow.google.maps);
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
      script.async = true;
      script.onload = () => {
        const maps = googleWindow.google?.maps;
        if (maps) {
          resolve(maps);
        } else {
          loadPromise = null;
          reject(new Error("Google Maps did not initialise."));
        }
      };
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("Google Maps could not be loaded."));
      };
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
