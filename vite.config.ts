import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/_/",
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      manifest: {
        name: "ChinatGPT",
        short_name: "GPT",
        description: "My simple ChatGPT UI",
        theme_color: "#333333",
        start_url: '_',
        display: 'standalone',
        icons: [
          {
            src: "./src/assets/react.svg",
            sizes: "192x192",
            type: "image/svg",
          },
        ],
      },
    }),
  ],
});
