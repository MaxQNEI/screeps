import OS from "os";
import { readj, writej } from "./fs.js";

const HOME = OS.homedir();
const PATH = `${HOME}/screeps.push-counter.json`;
const OPTS = { encoding: "utf-8" };

export default async function PushCounter(path = PATH) {
    let counter = 0;

    await load();
    await save();

    async function load() {
        return (counter = await readj(path).catch(() => 1));
    }

    async function save() {
        return await writej(path, counter);
    }

    return {
        get: () => {
            return counter;
        },

        up: async () => {
            counter++;
            return await save();
        },
    };
}
