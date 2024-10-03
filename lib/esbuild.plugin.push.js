import CHILD_PROCESS from "child_process";
import CRYPTO from "crypto";
import FS from "fs";
import HTTPS from "https";
import OS from "os";
import PATH from "path";
import TOKEN from "../token.js";
import { read, write } from "./fs.js";
import PushCounter from "./push-counter.js";
import TABLE from "./table.js";

// const out = [];
// for (let i = 0; i < 255; i++) {
//   out.push(`\x1b[${i}m${i}\x1b[0m`);
// }
// console.log(out.join(" "));

export default async function Push(root = import.meta.dirname) {
  const Counter = await PushCounter();

  // PATH.resolve(root, build.initialOptions.outfile);
  let outfile = PATH.join(root, "dist", "main.js");
  let body, msg;
  let prevBodyHash = await getHash();

  return {
    name: "Push",
    setup(build) {
      let start, buildEnd, modifyEnd, pushEnd;

      build.onStart(() => {
        start = new Date();
      });

      build.onEnd(async (result) => {
        // ignore eval()
        result.warnings = result.warnings.filter(({ id }) => id !== "direct-eval");

        let _break = false;

        if (result.errors.length > 0) {
          _break = true;
          console.log("result.errors", result.errors.length);
        }

        if (result.warnings.length > 0) {
          console.log("result.warnings", result.warnings.length);
          console.log(...result.warnings);
        }

        if (_break) {
          return;
        }

        buildEnd = new Date();
        pushEnd = null;

        await modify();
        modifyEnd = new Date();

        if ((await getHash()) !== prevBodyHash) {
          // (await git()) && (pushEnd = new Date());
          (await direct()) && (pushEnd = new Date());

          prevBodyHash = await getHash();
        }

        TABLE([
          ["Start", "Build", "Modify", "Push", "Total"],
          [
            start.format("Y-M-D h:m:s.ms"),
            start.diff(buildEnd) + "ms",
            start.diff(modifyEnd) + "ms",
            pushEnd !== null ? `${start.diff(pushEnd)}ms` : "-",

            start.diff(buildEnd) + start.diff(modifyEnd) + (pushEnd ? start.diff(pushEnd) : 0) + "ms",
          ],
        ]);
      });
    },
  };

  async function modify() {
    body = await read(outfile);
    // body = body.replace(
    //   /((async )?function loop\(\) \{)/m,
    //   "module.exports.loop = $1" //
    // );

    // await write(outfile, body);
  }

  // Update & Push - Git
  async function git() {
    return await new Promise(async (resolve) => {
      msg = `<${OS.platform().toUpperCase()}/${OS.userInfo().username}> esbuild-git-push #${Counter.get()}`;

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
        },
      );
    });
  }

  // Update & Push - Direct
  async function direct() {
    return await new Promise(async (resolve, reject) => {
      const req = HTTPS.request({
        method: "POST",
        hostname: "screeps.com",
        port: 443,
        path: "/api/user/code",
        // auth: email + ":" + password,
        // auth: `${email}:${password}`,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Token": TOKEN,
        },
      });

      req.on("response", (response) => {
        if (response.statusCode === 429) {
          console.log(`\x1b[1;101m[ERROR] ${response.statusMessage.toUpperCase()}\x1b[0m`);
          return resolve(false);
        } else if (response.statusCode === 20) {
          return resolve(true);
        }

        console.log(">", response.statusCode, response.statusMessage);
      });
      req.on("finish", () => resolve(true));
      req.on("error", (error) => {
        console.log(error);
        resolve(false);
      });

      req.write(
        JSON.stringify({
          branch: "default",
          modules: {
            main: body,
          },
        }),
      );
      req.end();
    });
  }

  //
  function getHash() {
    return hash(outfile).catch((e) => {
      console.log("E:", outfile);
      return null;
    });
  }

  // File hash
  function hash(path) {
    return new Promise((resolve, reject) => {
      const hash = CRYPTO.createHash("sha256");
      const stream = FS.createReadStream(path);

      stream.on("data", (data) => hash.update(data));
      stream.on("end", () => resolve(hash.digest("hex")));
      stream.on("error", (err) => reject(err));
    });
  }
}
