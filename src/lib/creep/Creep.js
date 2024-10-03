import CreepRole from "./CreepRole";

export default class Creep extends CreepRole {
  constructor(creep = Game.creeps["Bunny"]) {
    super();
    this.setCreep(creep);
  }

  live() {
    // if (!this.spawn()) {
    //   return;
    // }

    if (this.creep.spawning) {
      return;
    }

    if (!this.job()) {
      this.says.length > 0 && this.creep.say(this.says.join(""));
      return;
    }
  }
}
