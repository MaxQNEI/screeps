import Creep from "../creep/Creep.js";

export default function Live() {
  for (const name in Game.creeps) {
    // ... Live ...
    new Creep(Game.creeps[name]).live();
  }

  Memory.ResetJob = false;
  Memory.ResetPath = false;
}
