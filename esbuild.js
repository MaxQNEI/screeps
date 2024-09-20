import * as esbuild from "esbuild";
import fsp from "fs/promises";
import { exec } from "child_process";

// Esbuild
{
    const context = await esbuild.context({
        entryPoints: ["src/index.js"],
        bundle: true,
        minify: false,
        sourcemap: false,
        target: ["chrome58", "firefox57", "safari11", "edge16"],
        outfile: "dist/main.js",
        format: "cjs",
        logLevel: "info",
    });

    await context.watch();
}

// Git push
{
    const watcher = fsp.watch("dist/main.js");

    for await (const event of watcher) {
        await new Promise((resolve) => {
            exec(
                `git add .; git commit -m "esbuild-git-push"; git push`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }

                    // console.log(`stdout: ${stdout}`);
                    // console.error(`stderr: ${stderr}`);

                    resolve();
                }
            );
        });

        console.log(`Git-push done`);
    }
}
