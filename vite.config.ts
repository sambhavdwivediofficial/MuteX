import { defineConfig } from "vite";
import { resolve } from "path";

// Tauri dev server host — do not change
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  root: resolve(__dirname, "src"),

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "src/index.html"),
    },
  },

  envPrefix: ["VITE_", "TAURI_"],
});
