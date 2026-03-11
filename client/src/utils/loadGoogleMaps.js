/**
 * Dynamically load Google Maps API with secure environment variables
 * This prevents hardcoding API keys in code
 */

let mapsPromise = null;

export const loadGoogleMaps = () => {
  if (mapsPromise) {
    return mapsPromise;
  }

  mapsPromise = new Promise((resolve, reject) => {
    // Security: Load API key from environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (
      !apiKey ||
      apiKey === "your_google_maps_api_key" ||
      apiKey === "GOOGLE_MAPS_API_KEY"
    ) {
      console.warn(
        "⚠️ Google Maps API Key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in .env.local",
      );
      reject(new Error("Google Maps API Key not configured"));
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error("Google Maps failed to load"));
      }
    };

    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return mapsPromise;
};

export default loadGoogleMaps;
