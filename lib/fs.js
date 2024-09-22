import FSP from "fs/promises";
import PATH from "path";

const options = { encoding: "utf-8" };

async function read(path) {
    return await FSP.readFile(path, options);
}

async function write(path, data) {
    return await FSP.writeFile(path, data, options);
}

async function readj(path) {
    return JSON.parse(await read(path));
}

async function writej(path, data) {
    return await write(path, JSON.stringify(data));
}

async function rename(path, name) {
    const dirname = PATH.dirname(path);
    const newpath = PATH.join(dirname, name);
    return FSP.rename(path, newpath);
}

export { read, write, readj, writej, rename };
