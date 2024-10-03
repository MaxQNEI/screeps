import { asc, desc } from "../../../lib/sort";
import CalcCreepBody from "./Calc";
import CreepFind from "./CreepFind";

export default class CreepSpawn extends CreepFind {
  spawn() {
    // assign
    this.setCreep();

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

    const body = Array.isArray(this.options.body)
      ? this.options.body
      : CalcCreepBody(spawn.room.energyCapacityAvailable, this.options.body);

    if (body.length === 0) {
      throw new Error(`body.length: ${body.length}`);
    }

    // spawn
    const result = spawn.spawnCreep(body, this.options.name, {
      memory: {
        job: "",
        jobs: this.options.jobs,
        body: this.options.body,
      },
    });

    if (result === ERR_NOT_ENOUGH_ENERGY) {
      return false;
    }

    // assign
    this.setCreep();

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
}
