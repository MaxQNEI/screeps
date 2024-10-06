import { asc } from "../../../lib/sort.js";
import Config from "../../config.js";
import Creep from "../creep/Creep.js";
import CreepRole from "../creep/CreepRole.js";

const {
  Room: {
    Creeps: {
      CountByRole: CBR,
      AutoRespawnByTicksRemainingPercent: ARBTRP, //
    },
  },
} = Config;

const ROADS_AROUND_SOURCES_RADIUS = 2;

const ROADS_AROUND_SOURCES_COORDS = [
  [-2, -2],
  [-2, -1],
  [-2, 0],
  [-2, 1],
  [-2, 2],
  [-1, -2],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [-1, 2],
  [0, -2],
  [0, -1],
  [0, 1],
  [0, 2],
  [1, -2],
  [1, -1],
  [1, 0],
  [1, 1],
  [1, 2],
  [2, -2],
  [2, -1],
  [2, 0],
  [2, 1],
  [2, 2],
];

export default function Room() {
  // Every room
  for (const name in Game.rooms) {
    const room = Game.rooms[name];

    spawnCreeps(room);
    roadsAroundSources(room);
  }
}

function spawnCreeps(room) {
  // Current creep count by roles
  const CCCBR = {};

  //
  // let MinimumNumberCreeps = 0;

  //
  // let CurrentNumberCreeps = 0;

  // Assign zero
  for (const role in CBR) {
    CCCBR[role] = 0;
    // MinimumNumberCreeps += CBR[role];
  }

  // Calc
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    // CurrentNumberCreeps++;

    if (creep.room === room) {
      // Add/Assign
      CCCBR[creep.memory.role] = (CCCBR[creep.memory.role] ?? 0) + 1;
    }
  }

  // Write out
  if (Memory.CreepsShow) {
    table([
      //
      ["", ...Object.keys(CCCBR)],
      ["Current", ...Object.values(CCCBR)],
      ["Need", ...Object.values(CBR)],
    ]);
  }

  // Spawn
  // TODO: Spawn similar before die
  // TODO: Spawn by ratio
  {
    let next;
    let reason = "";

    //
    if (!next) {
      for (const role in CBR) {
        if (!CCCBR[role] || CCCBR[role] < CBR[role]) {
          next = { room, ...CreepRole[role]() };
          reason = `The count of creeps is less than needed.`;
          break;
        }
      }
    }

    //
    if (!next && ARBTRP > 0) {
      const nextByTimeList = [];

      for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.spawning) {
          continue;
        }

        const remaining = creep.ticksToLive / CREEP_LIFE_TIME;

        if (remaining < ARBTRP) {
          nextByTimeList.push({ remaining, creep });
        }
      }

      const nextByTime = nextByTimeList.sort(({ remaining: a }, { remaining: b }) => asc(a, b))[0];

      if (nextByTime) {
        const creep = nextByTime.creep;
        next = { room: creep.room, ...CreepRole[creep.memory.role]() };
        reason = `Creep "${creep.name}" has ${creep.ticksToLive} ticks remaining`;
      }
    }

    if (next) {
      if (Memory.MemoryLogShow) {
        Memory.log.push([`loop()`, `Next spawn ${next.role} in ${next.room.name}`]);
        reason && Memory.log.push(["", `Reason: ${reason}`], []);
      }

      new Creep().spawn({ room: next.room, ...CreepRole[next.role]() });
    }
  }
}

function roadsAroundSources(room) {
  if (Game.time % 60 !== 0) {
    return;
  }

  Memory.log.push(["roadsAroundSources()"]);

  const sources = room.find(FIND_SOURCES);

  for (const source of sources) {
    for (const [x, y] of ROADS_AROUND_SOURCES_COORDS) {
      const _x = source.pos.x + x;
      const _y = source.pos.y + y;

      let terrainOnly = true;
      const results = room.lookAt(_x, _y);
      for (const { type } of results) {
        if (type !== "terrain" && type !== "creep") {
          terrainOnly = false;
          break;
        }
      }

      if (!terrainOnly) {
        continue;
      }

      room.createConstructionSite(_x, _y, STRUCTURE_ROAD);
    }
  }
}
