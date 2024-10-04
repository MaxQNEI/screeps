import { asc } from "../../../lib/sort.js";
import Creep from "../creep/Creep.js";
import CreepRole from "../creep/CreepRole.js";

export default class Room {
  run() {
    this.every();
  }

  every() {
    // Every room
    for (const name in Game.rooms) {
      // Assign
      const room = Game.rooms[name];

      // Prcess the room
      this.room(room);
    }
  }

  room(room) {
    // Creep count by roles
    const CCBR = {};

    // Assign zero
    for (const role in Config.Room.Creeps) {
      CCBR[role] = 0;
    }

    // Calc
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];

      if (creep.room === room) {
        // Add/Assign
        CCBR[creep.memory.role] = (CCBR[creep.memory.role] ?? 0) + 1;
      }
    }

    // Write out
    if (Memory.CreepsShow) {
      table([
        //
        ["", ...Object.keys(CCBR)],
        ["Current", ...Object.values(CCBR)],
        ["Need", ...Object.values(Config.Room.Creeps)],
      ]);
    }

    // Spawn
    // TODO: Spawn before die
    // TODO: Spawn by ratio
    {
      let next;
      let reason = "";

      if (!next) {
        const nextByTimeList = [];

        for (const name in Game.creeps) {
          const creep = Game.creeps[name];

          if (creep.spawning) {
            continue;
          }

          const left = (creep.ticksToLive / 1500) * 100;

          if (left < 10) {
            nextByTimeList.push({ left, creep });
          }
        }

        const nextByTime = nextByTimeList.sort(({ left: a }, { left: b }) => asc(a, b))[0];

        if (nextByTime) {
          const creep = nextByTime.creep;
          next = { room: creep.room, ...CreepRole[creep.memory.role]() };
          reason = `Creep "${creep.name}" has ${creep.ticksToLive} ticks left`;
        }
      }

      if (!next) {
        for (const role in Config.Room.Creeps) {
          if (!CCBR[role] || CCBR[role] < Config.Room.Creeps[role]) {
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
}
