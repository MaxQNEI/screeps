import randName from "../../../lib/rand-name";
import UpperCaseFirst from "../../../lib/uc-first";
import CalculateCreepBody from "./CalculateCreepBody";
import CreepFind from "./CreepFind";
import { PropCreepParameters } from "./Props";

const {
  Room: {
    Creeps: { ForceSpawnIfCreepsLessThan, MaximumSpawningTicksBetweenSpawns },
  },
} = Config;

export default class CreepSpawn extends CreepFind {
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

    const body = CalculateCreepBody(energy, this.parameters.bodyRatios);

    if (body.length === 0) {
      throw new Error(`body.length: ${body.length}`);
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
