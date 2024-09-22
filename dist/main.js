(() => {
  // lib/sort.js
  function asc2(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  // src/lib/creep/CreepProps.js
  var CreepProps = class {
    options = {
      name: "Bunny",
      room: Room,
      body: []
    };
    creep = Creep;
  };

  // src/lib/creep/CreepFind.js
  var FIND_SPAWN_WITH_FREE_CAPACITY = "FIND_SPAWN_WITH_FREE_CAPACITY";
  var CreepFind = class extends CreepProps {
    find(findType = FIND_SPAWN_WITH_FREE_CAPACITY) {
      if (findType === FIND_SPAWN_WITH_FREE_CAPACITY) {
        const spawns = this.creep.room.find(FIND_MY_SPAWNS).map((spawn) => ({
          origin: spawn,
          free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })).filter(({ free }) => free > 0).sort(({ free: a }, { free: b }) => asc2(a, b)).map(({ origin }) => origin);
        return spawns;
      }
    }
  };

  // src/lib/creep/Creep.js
  var Creep2 = class extends CreepFind {
    constructor(options = this.options) {
      super();
      this.creep = Game.creeps[options.name];
      this.options = options;
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
