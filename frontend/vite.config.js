import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  css: {
    devSourcemap: true,
  },
  build: {
    rollupOptions: {
      // Externalize các gói này, tức là không đóng gói chúng vào bundle
      external: ['framer-motion'],
    },
  },
});
