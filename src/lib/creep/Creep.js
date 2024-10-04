import CreepRole from "./CreepRole";

export default class Creep extends CreepRole {
  constructor(creep = Game.creeps["Bunny"]) {
    super();
    this.setCreep(creep);
  }

  live() {
    if (this.creep.spawning) {
      return;
    }

    if (!this.job()) {
      if (Memory.StatusesShow && this.memory?.statuses?.length > 0) {
        this.memory.statuses = this.memory.statuses.filter(({ stopShow }) => stopShow > Game.time);
        this.creep.say(this.memory.statuses.map(({ emoji }) => emoji).join(""));
      }

      return;
    }
  }
}
