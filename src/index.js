import Creep from "./lib/creep/Creep";
import CreepJob from "./lib/creep/CreepJob";

const Creep1 = (name = "Universal", room = Game.rooms.sim) => {
  return {
    name,
    room,
    body: { [WORK]: 0.6, [CARRY]: 0.5, [MOVE]: 0.2 },
    jobs: [
      [
        //
        CreepJob.PICKUP_ENERGY,
        CreepJob.HARVEST_ENERGY,
      ],
      [
        //
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
        CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        CreepJob.BUILD,
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
      ],
    ],
  };
};

export default function loop() {
  Memory.log = [];

  // Every room
  for (const nameRoom in Game.rooms) {
    const room = Game.rooms[nameRoom];
    // create universal unit
    new Creep(Creep1("Universal"), room).live();
    new Creep(Creep1("Universal2", room)).live();
    new Creep(Creep1("Universal3", room)).live();
    new Creep(Creep1("Universal4", room)).live();
    new Creep(Creep1("Universal5", room)).live();
    new Creep(Creep1("Universal6", room)).live();
    new Creep(Creep1("Universal7", room)).live();
    new Creep(Creep1("Universal8", room)).live();
    new Creep(Creep1("Universal9", room)).live();
    new Creep(Creep1("Universal10", room)).live();
  }

  for (const msg of Memory.log) {
    console.log(Game.time, msg);
  }
}
