import Live from "./lib/process/Live.js";
import MemoryLog from "./lib/process/MemoryLog.js";
import Observe from "./lib/process/Observe.js";
import Room from "./lib/room/Room.js";
import ProceduralRoads from "./lib/structures/ProceduralRoads.js";

export default function loop() {
  MemoryLog();

  new Observe().run();
  new Room().run();
  new ProceduralRoads().run();
  new Live().run();

  MemoryLog();
}

eval(`module.exports.loop = ${loop.name};`);
