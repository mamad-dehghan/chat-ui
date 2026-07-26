import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  appType: "spa",
  server: {
    open: false,
    strictPort: true,
    port: 80,
  },
  preview: {
    strictPort: true,
    port: 80,
  },
  resolve: {
    alias: {
      "@kitty": path.resolve(__dirname, "./src/lib/kitty"),
    },
  },
  plugins: [
    svgr({
      include: "**/*.svg",
      // exportAsDefault: true,
      svgrOptions: {
        // exportType: "default",
        icon: true,
      },
    }),
    react(),
  ],
  esbuild: {
    // Bun uses similar esbuild under the hood
    legalComments: "none",
  },
  server: {
    // Optional: Bun-specific optimizations
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
});
