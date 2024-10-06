import "./config.js";

import Garbage from "./lib/process/Garbage.js";

import Live from "./lib/process/Live.js";
import MemoryLog from "./lib/process/MemoryLog.js";
import Observe from "./lib/process/Observe.js";
import Room from "./lib/room/Room.js";
import ProceduralRoads from "./lib/structures/ProceduralRoads.js";

Garbage();
export default function loop() {
  MemoryLog();

  Observe();
  Room();
  ProceduralRoads();
  Live();

  MemoryLog();
}

eval(`module.exports.loop = ${loop.name};`);
