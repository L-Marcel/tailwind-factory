import { defineConfig } from "tsup";

export default defineConfig({
  splitting: false,
  sourcemap: false,
  clean: false,
  dts: true,
  entry: {
    index: "src/index.tsx",
    plugin: "src/plugin/index.ts",
  },
});
