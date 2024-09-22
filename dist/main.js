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
  var FIND_CONSTRUCTION_SITES_BY_DISTANCE = "FIND_CONSTRUCTION_SITES_BY_DISTANCE";
  var FIND_SOURCES_BY_DISTANCE = "FIND_SOURCES_BY_DISTANCE";
  var FIND_SPAWN_WITH_FREE_CAPACITY = "FIND_SPAWN_WITH_FREE_CAPACITY";
  var FIND_SPAWN_TO_SPAWN_CREEP_BY_COST = "FIND_SPAWN_TO_SPAWN_CREEP_BY_COST";
  var CreepFind = class extends CreepProps {
    find(findType = FIND_SPAWN_WITH_FREE_CAPACITY, options = { cost: 0 }) {
      const _room = this.creep?.room ?? this.options.room;
      if (findType === FIND_SPAWN_WITH_FREE_CAPACITY) {
        const spawns = _room.find(FIND_MY_SPAWNS).map((spawn) => ({
          origin: spawn,
          free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })).filter(({ free }) => free > 0).sort(({ free: a }, { free: b }) => asc2(a, b)).map(({ origin }) => origin);
        return spawns;
      }
      if (findType === FIND_SOURCES_BY_DISTANCE) {
        const sources = _room.find(FIND_SOURCES).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(
          ({ distance: a }, { distance: b }) => a === b ? 0 : a > b ? 1 : -1
        ).map(({ origin }) => origin);
        return sources;
      }
      if (findType === FIND_CONSTRUCTION_SITES_BY_DISTANCE) {
        const constructionSites = _room.find(FIND_CONSTRUCTION_SITES).map((constructionSite) => ({
          origin: constructionSite,
          distance: distance(this.creep.pos, constructionSite.pos)
        })).sort(
          ({ distance: a }, { distance: b }) => a === b ? 0 : a > b ? 1 : -1
        ).map(({ origin }) => origin);
        return constructionSites;
      }
      if (findType === FIND_SPAWN_TO_SPAWN_CREEP_BY_COST) {
        for (const nameSpawn in Game.spawns) {
          const spawn = Game.spawns[nameSpawn];
          if (spawn.room === _room && spawn.store[RESOURCE_ENERGY] >= options.cost) {
            return spawn;
          }
        }
        return false;
      }
    }
  };

  // src/lib/creep/CreepSpawn.js
  var CreepSpawn = class extends CreepFind {
    spawn() {
      this.creep = Game.creeps[this.options.name];
      if (this.creep) {
        return;
      }
      const cost = this.options.body.reduce(
        (pv, cv) => (pv ?? 0) + BODYPART_COST[cv]
      );
      const spawn = this.find(FIND_SPAWN_TO_SPAWN_CREEP_BY_COST, { cost });
      if (!spawn) {
        return false;
      }
      spawn.spawnCreep(this.options.body.sort(asc), this.options.name);
      this.creep = Game.creeps[this.options.name];
      return true;
    }
  };

  // src/lib/creep/Creep.js
  var Creep2 = class extends CreepSpawn {
    constructor(options = this.options) {
      super();
      this.creep = Game.creeps[options.name];
      this.options = options;
    }
    live() {
      for (const mtd of ["spawn"]) {
        console.log(`this[${mtd}]()`);
        if (!this[mtd]()) {
          return false;
        }
      }
    }
  };

  // src/index.js
  console.log("".padStart(40, "="));
  module.exports.loop = function loop() {
    for (const nameRoom in Game.rooms) {
      new Creep2({
        name: "Universal",
        room: Game.rooms[nameRoom],
        body: [WORK, CARRY, MOVE]
      }).live();
    }
  }
})();
