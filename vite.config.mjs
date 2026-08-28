import { defineConfig } from "vite";
// WPS addin: main page uses Vite, taskpane uses static ES5 in public/ dir
export default defineConfig({
  base: "./",
  publicDir: "public",
  server: { host: "127.0.0.1", port: 3890, strictPort: true },
  build: { outDir: "dist", assetsDir: "assets", sourcemap: false }
});
