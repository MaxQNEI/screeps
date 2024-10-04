import * as ESBUILD from "esbuild";
import "./lib/date.prototype.diff.js";
import "./lib/date.prototype.format.js";
import PUSH from "./lib/esbuild.plugin.push.js";
import Config from "./src/config.js";

const context = await ESBUILD.context({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: false,
  sourcemap: false,
  outfile: "dist/main.js",
  logLevel: "error",
  target: ["node10"],

  plugins: [await PUSH(import.meta.dirname)],
  define: { Config: JSON.stringify(Config) },
});

await context.watch();
