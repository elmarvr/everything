import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite as tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      generatedRouteTree: "src/routes.generated.ts",
    }),
    react(),
  ],
});
