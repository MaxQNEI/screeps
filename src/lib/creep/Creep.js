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
      return;
    }
  }
}
