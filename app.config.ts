import { createApp } from "vinxi";
import { TanStackStartVite } from "@tanstack/react-start/plugin/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default createApp({
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public",
    },
    {
      name: "client",
      type: "client",
      target: "browser",
      handler: "./src/client.tsx",
      base: "/_build",
      plugins: () => [
        tailwindcss(),
        viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
        TanStackStartVite(),
      ],
    },
    {
      name: "ssr",
      type: "http",
      target: "server",
      handler: "./src/server.tsx",
      plugins: () => [
        tailwindcss(),
        viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
        TanStackStartVite(),
      ],
    },
  ],
});
