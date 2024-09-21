import * as ESBUILD from "esbuild";
import FSP from "fs/promises";
import CHILD_PROCESS from "child_process";

// Esbuild
{
    const context = await ESBUILD.context({
        entryPoints: ["src/index.js"],
        bundle: true,
        minify: false,
        sourcemap: false,
        // target: ["chrome58", "firefox57", "safari11", "edge16"],
        outfile: "dist/main.js",
        logLevel: "info",
    });

    await context.watch();
}

// Git push
{
    const watcher = FSP.watch("dist/main.js");

    for await (const event of watcher) {
        await new Promise(async (resolve) => {
            const body = (
                await FSP.readFile("dist/main.js", { encoding: "utf-8" })
            ).replace(
                /^(\s+)(function loop\(\) {)/m,
                "$1module.exports.loop = $2"
            );

            await FSP.writeFile("dist/main.js", body, { encoding: "utf-8" });

            CHILD_PROCESS.exec(
                `git add .; git commit -m "esbuild-git-push"; git push`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }

                    // console.log(`stdout: ${stdout}`);
                    // console.error(`stderr: ${stderr}`);

                    console.log(`Git done.`);

                    resolve();
                }
            );
        });
    }
}
