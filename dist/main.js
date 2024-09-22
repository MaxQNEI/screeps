(() => {
  // src/lib/creep/Creep.props.js
  var CreepProps = class {
    options = {
      name: "Bunny",
      room: Room,
      body: []
    };
    creep = Creep;
  };

  // src/lib/creep/Creep.js
  var Creep2 = class extends CreepProps {
    constructor(options = this.options) {
      this.creep = Game.creeps[options.name];
    }
    spawn() {
      const cost = this.options.body.reduce(
        (pv, cv) => pv + BODYPART_COST[cv],
        0
      );
      let spawnsInRoom = [];
      let spawnMaxEnergy = 0;
      for (const nameSpawn in Game.spawns) {
        const spawn2 = Game.spawns[nameSpawn];
        const structure = spawn2;
        const energyUsed = spawn2.store.getUsedCapacity(RESOURCE_ENERGY);
        const energyCapacity = spawn2.store.getCapacity(RESOURCE_ENERGY);
        if (spawn2.room === this.options.room && energyUsed >= cost) {
          spawnMaxEnergy = Math.max(spawnMaxEnergy, energyCapacity);
          spawnsInRoom.push({ structure, energyUsed, energyCapacity });
        }
      }
      const spawn = spawnsInRoom?.[0]?.structure;
      if (!spawn) {
        return false;
      }
      spawn.spawnCreep(this.options.body.sort(asc), this.options.name);
      return true;
    }
  };

  // src/index.js
  module.exports.loop = function loop() {
    for (const nameRoom in Game.rooms) {
      new Creep2({
        name: "Universal",
        room: Game.rooms[nameRoom],
        body: [WORK, CARRY, MOVE]
      });
    }
  }
})();
