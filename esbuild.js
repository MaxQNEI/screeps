import * as ESBUILD from "esbuild";
import "./lib/date.prototype.diff.js";
import "./lib/date.prototype.format.js";
import PUSH from "./lib/esbuild.plugin.push.js";

const context = await ESBUILD.context({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: false,
  sourcemap: false,
  outfile: "dist/main.js",
  logLevel: "info",
  target: ["node10"],

  plugins: [await PUSH(import.meta.dirname)],
});

await context.watch();
