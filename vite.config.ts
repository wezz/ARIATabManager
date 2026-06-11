//https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ariatabmanager",
      fileName: "index",
    },
    rollupOptions: {
      // Don't bundle the peer dependency; consumers provide it so a single
      // shared ARIAManager is used and its fixes propagate without rebuilding.
      external: [/^@wezz\/ariamanager/],
      output: {
        globals: {
          "@wezz/ariamanager": "ARIAManager",
        },
      },
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
