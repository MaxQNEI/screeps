import CHILD_PROCESS from "child_process";
import * as ESBUILD from "esbuild";
import FSP from "fs/promises";
import OS from "os";
import TABLE from "./lib/table.js";
import "./lib/date.prototype.format.js";

let PushCounter;

await LoadPushCounter();
await SavePushCounter();

async function LoadPushCounter() {
    return (PushCounter = parseInt(
        await FSP.readFile("./push-counter.json", {
            encoding: "utf-8",
        }).catch(() => 0)
    ));
}

async function SavePushCounter() {
    return await FSP.writeFile("./push-counter.json", PushCounter.toString(), {
        encoding: "utf-8",
    });
}

async function UpdateNPush() {
    return await new Promise(async (resolve) => {
        const body = (
            await FSP.readFile("dist/main.js", { encoding: "utf-8" })
        ).replace(/^(\s+)(function loop\(\) {)/m, "$1module.exports.loop = $2");

        await FSP.writeFile("dist/main.js", body, { encoding: "utf-8" });

        const msg = `<${OS.platform().toUpperCase()}/${
            OS.userInfo().username
        }> esbuild-git-push #${PushCounter + 1}`;

        CHILD_PROCESS.exec(
            `git status; git add .; git commit -m "${msg}"; git push`,
            async (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }

                // console.log(`stdout: ${stdout}`);
                // console.error(`stderr: ${stderr}`);

                if (stderr.indexOf("Everything up-to-date") !== -1) {
                    console.log(`<"${msg}">`);

                    PushCounter += 1;
                    await SavePushCounter();
                }

                resolve();
            }
        );
    });
}

const context = await ESBUILD.context({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: "dist/main.js",
    // logLevel: "info",

    plugins: [
        {
            name: "git-push",
            setup(build) {
                let start, buildEnd, pushEnd;

                build.onStart(() => {
                    start = new Date();
                });

                build.onEnd(async (result) => {
                    if (result.errors.length > 0) {
                        return;
                    }

                    buildEnd = new Date();

                    await UpdateNPush();

                    pushEnd = new Date();

                    TABLE([
                        "Start, Build, Push".split(", "),
                        [
                            start.format(),
                            start.diff(buildEnd),
                            start.diff(pushEnd),
                        ],
                    ]);
                });
            },
        },
    ],
});

await context.watch();
