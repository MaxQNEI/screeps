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
    // TODO: Spawn by ratio
    {
      for (const role in Config.Room.Creeps) {
        if (!CCBR[role] || CCBR[role] < Config.Room.Creeps[role]) {
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
}
