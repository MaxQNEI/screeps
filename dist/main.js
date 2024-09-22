(() => {
  // lib/sort.js
  function asc2(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  // src/lib/distance.js
  function distance(point1, point2) {
    return Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
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
  var FIND_SPAWN_WITH_FREE_CAPACITY = 0;
  var FIND_SOURCES_BY_DISTANCE = 1;
  var FIND_CONSTRUCTION_SITES_BY_DISTANCE = 2;
  var CreepFind = class extends CreepProps {
    find(findType = FIND_SPAWN_WITH_FREE_CAPACITY) {
      if (findType === FIND_SPAWN_WITH_FREE_CAPACITY) {
        const spawns = this.creep.room.find(FIND_MY_SPAWNS).map((spawn) => ({
          origin: spawn,
          free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })).filter(({ free }) => free > 0).sort(({ free: a }, { free: b }) => asc2(a, b)).map(({ origin }) => origin);
        return spawns;
      }
      if (findType === FIND_SOURCES_BY_DISTANCE) {
        const sources = this.creep.room.find(FIND_SOURCES).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(
          ({ distance: a }, { distance: b }) => a === b ? 0 : a > b ? 1 : -1
        ).map(({ origin }) => origin);
        return sources;
      }
      if (findType === FIND_CONSTRUCTION_SITES_BY_DISTANCE) {
        const constructionSites = this.creep.room.find(FIND_CONSTRUCTION_SITES).map((constructionSite) => ({
          origin: constructionSite,
          distance: distance(this.creep.pos, constructionSite.pos)
        })).sort(
          ({ distance: a }, { distance: b }) => a === b ? 0 : a > b ? 1 : -1
        ).map(({ origin }) => origin);
        return constructionSites;
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
        (pv, cv) => (pv ?? 0) + BODYPART_COST[cv]
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
