import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let googleMapsPromise: Promise<void> | undefined;
let optionsConfigured = false;

/** Loads the Google Maps JavaScript API once for every client-side map. */
export function loadGoogleMaps() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured."),
    );
  }

  if (!googleMapsPromise) {
    if (!optionsConfigured) {
      setOptions({ key: apiKey, v: "weekly" });
      optionsConfigured = true;
    }

    googleMapsPromise = importLibrary("maps")
      .then(() => undefined)
      .catch((error) => {
        googleMapsPromise = undefined;
        throw error;
      });
  }

  return googleMapsPromise!;
}
