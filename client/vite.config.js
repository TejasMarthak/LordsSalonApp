import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:5000",
    ),
    "import.meta.env.VITE_GOOGLE_MAPS_API_KEY": JSON.stringify(
      process.env.VITE_GOOGLE_MAPS_API_KEY || "",
    ),
    "import.meta.env.VITE_SALON_LAT": JSON.stringify(
      process.env.VITE_SALON_LAT || "22.3072",
    ),
    "import.meta.env.VITE_SALON_LNG": JSON.stringify(
      process.env.VITE_SALON_LNG || "73.1812",
    ),
    "import.meta.env.VITE_SALON_ADDRESS": JSON.stringify(
      process.env.VITE_SALON_ADDRESS || "Vadodara, Gujarat",
    ),
    "import.meta.env.VITE_SALON_PHONE": JSON.stringify(
      process.env.VITE_SALON_PHONE || "+91-XXXXXXXXXX",
    ),
    "import.meta.env.VITE_SALON_EMAIL": JSON.stringify(
      process.env.VITE_SALON_EMAIL || "info@lords-salon.com",
    ),
  },
});
