import { defineConfig } from "vite";

// WPS 加载项以静态资源形式被客户端 WebView 直接加载，
// 必须使用相对路径引用产物，产物统一输出到 dist/。
export default defineConfig({
  base: "./",
  root: "pages",
  publicDir: false,
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false
  }
});
