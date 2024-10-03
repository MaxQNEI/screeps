import randName from "../../../lib/rand-name";
import UpperCaseFirst from "../../../lib/uc-first";
import CalcCreepBody from "./Calc";
import CreepFind from "./CreepFind";
import { PropCreepParameters } from "./Props";

export default class CreepSpawn extends CreepFind {
  spawn(parameters = PropCreepParameters) {
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

    const body = Array.isArray(this.parameters.body)
      ? this.parameters.body
      : CalcCreepBody(spawn.room.energyCapacityAvailable, this.parameters.body);

    if (body.length === 0) {
      throw new Error(`body.length: ${body.length}`);
    }

    // spawn
    const result = spawn.spawnCreep(body, this.parameters.name, {
      memory: {
        role: this.parameters.role,
        job: "",
        jobs: this.parameters.jobs,
        body: this.parameters.body,
      },
    });

    if (result === ERR_NOT_ENOUGH_ENERGY) {
      return false;
    }

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
      name = UpperCaseFirst(`${randName()} ${this.parameters.role.replace(/^Role/, "").replace(/[aeiouy]/gi, "")}`);
    } while (Game.creeps[name]);

    return name;
  }
}
