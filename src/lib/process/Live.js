import Creep from "../creep/Creep.js";

export default class Live {
  run() {
    for (const name in Game.creeps) {
      // ... Live ...
      new Creep(Game.creeps[name]).live();
    }
  }
}
