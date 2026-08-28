import { defineConfig } from "vite";

function logRequests() {
  return {
    name: "log-requests",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        console.log("[REQ]", req.method, req.url);
        next();
      });
    },
  };
}

export default defineConfig({
  base: "./",
  publicDir: "public",
  plugins: [logRequests()],
  server: { host: "127.0.0.1", port: 3889, strictPort: true },
  build: { outDir: "dist", assetsDir: "assets", sourcemap: false },
});
