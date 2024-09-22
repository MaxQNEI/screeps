import * as ESBUILD from "esbuild";
import "./lib/date.prototype.diff.js";
import "./lib/date.prototype.format.js";
import UpdateNPush from "./lib/esbuild.plugin.update-and-push.js";

const context = await ESBUILD.context({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: "dist/main.js",
    // logLevel: "info",

    plugins: [await UpdateNPush(import.meta.dirname)],
});

await context.watch();
