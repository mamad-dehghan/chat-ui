import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "spa",

  server: {
    open: true,
    strictPort: true,
    host: "localhost",
    port: 80,
  },

  plugins: [
    react(),
  ],
});
