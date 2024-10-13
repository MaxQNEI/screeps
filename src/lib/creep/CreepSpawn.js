import randName from "../../../lib/rand-name.js";
import { asc } from "../../../lib/sort.js";
import UpperCaseFirst from "../../../lib/uc-first.js";
// import CalculateCreepBody from "./CalculateCreepBody";
import CreepFind from "./CreepFind.js";
import { PropCreepParameters } from "./Props.js";

const {
  Room: {
    Creeps: { ForceSpawnIfCreepsLessThan, MaximumSpawningTicksBetweenSpawns },
  },
} = Config;

export default class CreepSpawn extends CreepFind {
  static PACKS = {
    Worker: {
      200: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
      300: { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
      350: { [WORK]: 2, [CARRY]: 1, [MOVE]: 2 },
      400: { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
      450: { [WORK]: 3, [CARRY]: 1, [MOVE]: 2 },
      500: { [WORK]: 3, [CARRY]: 2, [MOVE]: 2 },
      550: { [WORK]: 4, [CARRY]: 1, [MOVE]: 2 },
      600: { [WORK]: 4, [CARRY]: 2, [MOVE]: 2 },
      650: { [WORK]: 5, [CARRY]: 1, [MOVE]: 2 },
      700: { [WORK]: 5, [CARRY]: 2, [MOVE]: 2 },
      750: { [WORK]: 6, [CARRY]: 1, [MOVE]: 2 },
      800: { [WORK]: 6, [CARRY]: 2, [MOVE]: 2 },
      850: { [WORK]: 6, [CARRY]: 2, [MOVE]: 3 },
      900: { [WORK]: 6, [CARRY]: 3, [MOVE]: 3 },
      950: { [WORK]: 7, [CARRY]: 2, [MOVE]: 3 },
      1000: { [WORK]: 7, [CARRY]: 3, [MOVE]: 3 },
      1050: { [WORK]: 8, [CARRY]: 2, [MOVE]: 3 },
      1100: { [WORK]: 8, [CARRY]: 3, [MOVE]: 3 },
      1150: { [WORK]: 8, [CARRY]: 3, [MOVE]: 4 },
      1200: { [WORK]: 8, [CARRY]: 4, [MOVE]: 4 },
      1250: { [WORK]: 9, [CARRY]: 3, [MOVE]: 4 },
      1300: { [WORK]: 9, [CARRY]: 4, [MOVE]: 4 },
    },
  };

  spawn(parameters = PropCreepParameters, force = false) {
    this.parameters = parameters;
    this.parameters.name = this.parameters.name || this.name();

    if (!this.parameters.name) {
      return false;
    }

    // assign
    this.setCreep(Game.creeps[this.parameters.name]);

    // BREAK if currently spawning
    if (this.creep?.spawning) {
      return false;
    }

    // DONE if spawned
    if (this.creep) {
      return true;
    }

    // find spawn
    const spawn = this.find(CreepSpawn.FIND_SPAWNS_ORDER_BY_ENERGY, { desc: true })[0];

    // BREAK if not found spawn
    if (!spawn) {
      return false;
    }

    let CurrentCreepCount = 0;
    for (const name in Game.creeps) {
      if (Game.creeps[name].room === this.parameters.room) {
        CurrentCreepCount++;
      }
    }

    Memory.CreepSpawnLast = Memory.CreepSpawnLast ?? {};
    Memory.CreepSpawnLast[this.parameters.room.name] = Memory.CreepSpawnLast[this.parameters.room.name] ?? Game.time;

    const isTooFewCreeps = ForceSpawnIfCreepsLessThan && CurrentCreepCount < ForceSpawnIfCreepsLessThan;
    const isBeenTooLongBetweenSpawns =
      Game.time - Memory.CreepSpawnLast[this.parameters.room.name] >= MaximumSpawningTicksBetweenSpawns;

    if (isTooFewCreeps) {
      Memory.log.push(["CreepSpawn.spawn()", "isTooFewCreeps!"]);
    } else if (isBeenTooLongBetweenSpawns) {
      Memory.log.push(["CreepSpawn.spawn()", "isBeenTooLongBetweenSpawns!"]);
    }

    const energy =
      isTooFewCreeps || isBeenTooLongBetweenSpawns || force
        ? Math.max(300, this.parameters.room.energyAvailable)
        : spawn.room.energyCapacityAvailable;

    // abort if less energy is available than needed
    if (this.parameters.room.energyAvailable < energy) {
      return false;
    }

    // const body = CalculateCreepBody(energy, this.parameters.bodyRatios);
    const body = ((energy) => {
      const bodyRatiosAvailable = Object.entries(CreepSpawn.PACKS.Worker).filter(
        ([_energy]) => energy >= parseInt(_energy),
      );

      const bodyRatios = bodyRatiosAvailable[bodyRatiosAvailable.length - 1][1];
      const result = [];

      for (const name in bodyRatios) {
        result.push(...new Array(bodyRatios[name]).fill(name));
      }

      return result.sort(asc);
    })(energy);

    if (body.length === 0) {
      console.log(`[WARN] CreepSpawn.spawn() body.length: ${body.length}`, energy);
      // throw new Error(`body.length: ${body.length}`);
      return false;
    }

    // spawn
    const result = spawn.spawnCreep(body, this.parameters.name, {
      memory: {
        role: this.parameters.role,
        // bodyRatios: this.parameters.bodyRatios, // ! TODO FEATURE
        job: "",
      },
    });

    if (result === ERR_NOT_ENOUGH_ENERGY) {
      return false;
    } else if (result !== OK && result !== ERR_BUSY) {
      console.log("SPAWN RESULT IS", result);
      return false;
    }

    // Save last creep spawn time
    Memory.CreepSpawnLast[this.parameters.room.name] = Game.time;

    // assign
    this.setCreep(Game.creeps[this.parameters.name]);

    // BREAK if "problem"
    if (!this.creep) {
      return false;
    }

    // BREAK if currently spawning
    if (this.creep?.spawning) {
      return false;
    }

    // DONE if spawned
    return true;
  }

  name() {
    let name;

    do {
      name = UpperCaseFirst(randName());
    } while (Game.creeps[name]);

    return name;
  }
}
