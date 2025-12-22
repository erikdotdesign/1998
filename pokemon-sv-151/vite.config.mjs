import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import glsl from 'vite-plugin-glsl';
import { viteSingleFile } from "vite-plugin-singlefile";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname),
  plugins: [reactRefresh(), viteSingleFile(), glsl(), svgr()],
  assetsInclude: ['**/*.glb'],
  build: {
    outDir: resolve(__dirname, "../public/pokemon-sv-151"),
    emptyOutDir: true,

    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});