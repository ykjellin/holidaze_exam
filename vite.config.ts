import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/scss/bootstrap";`,
      },
    },
  },
  server: {
    open: true,
    hmr: true,
    strictPort: true,
  },
  define: {
    "process.env": {},
  },
  build: {
    sourcemap: true,
  },
});
