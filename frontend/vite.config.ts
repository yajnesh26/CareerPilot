import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BACKEND_ORIGIN = "http://localhost:8000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Keeps the browser on a single origin in dev, so CORS is never
      // the reason a request fails.
      "/analyze": {
        target: BACKEND_ORIGIN,
        changeOrigin: true,
      },
      "/health": {
        target: BACKEND_ORIGIN,
        changeOrigin: true,
      },
    },
  },
});
