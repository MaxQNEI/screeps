import { desc } from "../lib/sort";
import table from "../lib/table";
import Config from "./config";
import Creep from "./lib/creep/Creep";
import CreepRole from "./lib/creep/CreepRole";

Memory.rooms = Memory.rooms ?? {};
Memory.Roads = Memory.Roads ?? {};

Memory.RoadsShow = Memory.RoadsShow ?? false;
Memory.CreepsShow = Memory.CreepsShow ?? false;

export default function loop() {
  // Clear log
  Memory.log = [];

  // Every room
  for (const name in Game.rooms) {
    // Assign
    const room = Game.rooms[name];

    // Creep count by roles
    const ccbr = {};

    // Assign zero
    for (const role in Config.Room.Creeps) {
      ccbr[role] = 0;
    }

    // Calc
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];

      if (creep.room === room) {
        // Fix
        if (creep.memory.role === "Worker") {
          creep.memory.role = "RoleWorker";
          creep.memory.jobs = CreepRole.RoleWorker().jobs;
        }

        // Add/Assign
        ccbr[creep.memory.role] = (ccbr[creep.memory.role] ?? 0) + 1;
      }
    }

    // Write out
    if (Memory.CreepsShow) {
      table([
        //
        ["", ...Object.keys(ccbr)],
        ["Current", ...Object.values(ccbr)],
        ["Need", ...Object.values(Config.Room.Creeps)],
      ]);
    }

    // Spawn
    {
      for (const role in Config.Room.Creeps) {
        if (!ccbr[role] || ccbr[role] < Config.Room.Creeps[role]) {
          Memory.log.push([
            //
            // `<span style="color: tomato;">&lt;loop()&gt;</span>`,
            `loop()`,
            `Next spawn ${role} in ${room.name}`,
          ]);

          new Creep().spawn({ room, ...CreepRole[role]() });

          break;
        }
      }
    }
  }

  // Roads
  {
    for (const coords in Memory.Roads) {
      if (typeof Memory.Roads[coords] === "number") {
        delete Memory.Roads[coords];
        continue;
      }

      if (Memory.Roads[coords].rate >= 100) {
        const [x, y] = coords.split("x").map((v) => parseInt(v));

        const room = Game.rooms[Memory.Roads[coords].room];
        const result = room.createConstructionSite(x, y, STRUCTURE_ROAD);

        if (result === ERR_INVALID_TARGET) {
          delete Memory.Roads[coords];
        } else {
          // console.log("result", result, x, y);
        }

        continue;
      }

      Memory.Roads[coords].rate = Math.max(0, Memory.Roads[coords].rate - 0.001);

      if (Memory.Roads[coords].rate === 0) {
        delete Memory.Roads[coords];
      }
    }

    if (Memory.RoadsShow) {
      const _entries = Object.entries(Memory.Roads);

      table([
        ..._entries
          // .sort(([_1, { update: a }], [_2, { update: b }]) => desc(a, b))
          .sort(([_1, { rate: a }], [_2, { rate: b }]) => desc(a, b))
          .map(([coords, { rate }]) => [coords, rate.toFixed(3)])
          .slice(0, 5),
        ["", ""],
        ["0-25%", _entries.filter(([coords, { rate }]) => rate >= 0 && rate < 25).length],
        ["25-50%", _entries.filter(([coords, { rate }]) => rate >= 25 && rate < 50).length],
        ["50-75%+", _entries.filter(([coords, { rate }]) => rate >= 50 && rate < 75).length],
        ["75-100%+", _entries.filter(([coords, { rate }]) => rate >= 75).length],
        ["Total", _entries.length],
      ]);
    }
  }

  // Live
  {
    for (const name in Game.creeps) {
      // Add roads rates
      {
        const creep = Game.creeps[name];
        const room = creep.room;

        const structures = room
          .lookAt(creep.pos)
          .filter(({ type }) => type === "structure")
          .map(({ structure: { structureType } }) => structureType);

        if (structures.length === 0) {
          const { x, y } = creep.pos;
          const coords = `${x}x${y}`;
          Memory.Roads[coords] = {
            //
            room: room.name,
            rate: Math.min(100, (Memory.Roads[coords]?.rate ?? 0) + 1),
            update: Date.now(),
          };
        }
      }

      // ... Live ...
      new Creep(Game.creeps[name]).live();
    }
  }

  // Write out
  {
    if (Memory.log.length > 0) {
      let time = `${(Game.time / 2 / 60 / 60 / 24).toFixed(4)}d`;

      const _table = [[`${Game.time} (${time})`]];
      for (const msg of Memory.log) {
        _table.push([...msg]);
      }
      table(_table);
    }
  }
}

eval(`module.exports.loop = ${loop.name};`);
