import CHILD_PROCESS from "child_process";
import OS from "os";
import PATH from "path";
import { read, write } from "./fs.js";
import PushCounter from "./push-counter.js";
import TABLE from "./table.js";

export default async function UpdateNPush(
    root = import.meta.dirname,
    options = { version: "?" }
) {
    const Counter = await PushCounter();

    let outfile;
    let body, msg;

    return {
        name: "UpdateNPush",
        setup(build) {
            let start, buildEnd, pushEnd;

            outfile = PATH.resolve(root, build.initialOptions.outfile);

            build.onStart(() => {
                start = new Date();
            });

            build.onEnd(async (result) => {
                if (result.errors.length > 0 || result.warnings.length > 0) {
                    console.log("result.errors", result.errors.length);
                    console.log("result.warnings", result.warnings.length);
                    return;
                }

                buildEnd = new Date();
                pushEnd = null;

                (await algo()) && (pushEnd = new Date());

                TABLE([
                    "Start, Build, Push, Total".split(", "),
                    [
                        start.format(),
                        start.diff(buildEnd) + "ms",
                        pushEnd !== null ? `${start.diff(pushEnd)}ms` : "-",
                        start.diff(buildEnd) +
                            (pushEnd ? start.diff(pushEnd) : 0) +
                            "ms",
                    ],
                ]);
            });
        },
    };

    // Update & Push
    async function algo() {
        return await new Promise(async (resolve) => {
            body = await read(outfile);
            body = body
                .replace(
                    /^(\s+)(function loop\(\) \{)/g,
                    "$1module.exports.loop = $2"
                )
                .replace(
                    /\{\{VERSION\}\}/g,
                    options.version.replace(/\$/g, Counter.get())
                );

            await write(outfile, body);

            msg = `<${OS.platform().toUpperCase()}/${
                OS.userInfo().username
            }> esbuild-git-push #${Counter.get()}`;

            CHILD_PROCESS.exec(
                `git status; git add dist/; git commit -m "${msg}"; git push`,
                async (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        resolve(false);
                        return;
                    }

                    // console.log(`stdout: ${stdout}`);
                    // console.error(`stderr: ${stderr}`);

                    if (stderr.indexOf("Everything up-to-date") === -1) {
                        console.log(`<"${msg}">`);

                        await Counter.up();

                        resolve(true);
                    }

                    resolve(false);
                }
            );
        });
    }
}
