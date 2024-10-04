import { asc } from "../../../lib/sort.js";
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

export default function Room() {
  // Every room
  for (const name in Game.rooms) {
    spawn(Game.rooms[name]);
  }
}

function spawn(room) {
  // Current creep count by roles
  const CCCBR = {};

  // Assign zero
  for (const role in CBR) {
    CCCBR[role] = 0;
  }

  // Calc
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

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
  // TODO: Spawn before die
  // TODO: Spawn by ratio
  {
    let next;
    let reason = "";

    if (!next && ARBTRP > 0) {
      const nextByTimeList = [];

      for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.spawning) {
          continue;
        }

        const remaining = (creep.ticksToLive / CREEP_LIFE_TIME) * 100;

        if (remaining < Config.AutoRespawnByTicksRemainingPercent) {
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

    if (!next) {
      for (const role in CBR) {
        if (!CCCBR[role] || CCCBR[role] < CBR[role]) {
          next = { room, ...CreepRole[role]() };
          reason = `The count of creeps is less than needed.`;
          break;
        }
      }
    }

    if (next) {
      Memory.log.push([`loop()`, `Next spawn ${next.role} in ${next.room.name}`]);
      reason && Memory.log.push(["", `Reason: ${reason}`], []);

      new Creep().spawn({ room: next.room, ...CreepRole[next.role]() });
    }
  }
}
