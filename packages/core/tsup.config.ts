import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "fsevents"],
  sourcemap: true,
  noExternal: ["src/**"],
  esbuildOptions(options) {
    options.platform = "node";
    options.target = "node14";
  },
});
