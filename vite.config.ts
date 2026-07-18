import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    handler: "./src/server.ts",
    middleware: "./src/start.ts",
  },
});
