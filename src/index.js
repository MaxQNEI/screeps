import "./config.js";

import Garbage from "./lib/process/Garbage.js";

import Live from "./lib/process/Live.js";
import MemoryLog from "./lib/process/MemoryLog.js";
import Observe from "./lib/process/Observe.js";
import Room, { CountCreepsByRoom } from "./lib/room/Room.js";
import ProceduralRoads from "./lib/structures/ProceduralRoads.js";
import Towers from "./lib/structures/Towers.js";

export default function loop() {
  MemoryLog(); // start

  // for (const name in Game.rooms) {
  //   const room = Game.rooms[name];
  //   const css = room.find(FIND_CONSTRUCTION_SITES).filter((cs) => cs.progress === 0 && cs.progressTotal <= 300);
  //   for (const cs of css) {
  //     cs.remove();
  //   }
  // }

  Garbage();
  Observe();
  Room();
  ProceduralRoads();
  Towers();
  Live();

  CountCreepsByRoom();

  MemoryLog(); // end
}

eval(`module.exports.loop = ${loop.name};`);
