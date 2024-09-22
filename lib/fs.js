import FSP from "fs/promises";

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

export { read, write, readj, writej };
