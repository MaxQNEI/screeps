(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // lib/sort.js
  function asc(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }
  function desc(a, b) {
    return a === b ? 0 : a > b ? -1 : 1;
  }

  // src/lib/distance.js
  function distance(point1, point2) {
    return Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
  }

  // src/lib/creep/Props.js
  var options = {
    name: "Bunny",
    room: Room,
    body: {},
    job: "",
    jobs: []
  };
  var memory = {
    body: {},
    job: "",
    jobs: []
  };
  var creep = {
    name: "Bunny",
    memory,
    build: (target) => {
    },
    harvest: (target, resourceType) => {
    },
    moveTo: (target) => {
    },
    pickup: (target, resourceType) => {
    },
    transfer: (target, resourceType, amount) => {
    },
    upgrade: (target) => {
    }
  };
  var Props = class {
    constructor() {
      __publicField(this, "options", options);
      __publicField(this, "creep", creep);
      __publicField(this, "memory", memory);
      __publicField(this, "orders", []);
    }
    setOptions(options2) {
      this.options = options2;
      this.setCreep();
    }
    setCreep(creep2 = Game.creeps[this.options.name]) {
      var _a;
      this.creep = creep2;
      this.memory = (_a = this.creep) == null ? void 0 : _a.memory;
    }
  };

  // src/lib/creep/CreepMessage.js
  var CreepMessage = class extends Props {
    log(...msg) {
      var _a, _b, _c;
      const TTL = ((_a = this.creep) == null ? void 0 : _a.ticksToLive) >= 0 ? `/${(_b = this.creep) == null ? void 0 : _b.ticksToLive}` : "";
      Memory.log.push([`[${((_c = this.creep) == null ? void 0 : _c.name) || this.options.name}${TTL}]`, ...msg].join(" "));
    }
  };

  // src/lib/creep/CreepFind.js
  var _CreepFind = class _CreepFind extends CreepMessage {
    find(findType = _CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY, parameters = { cost: 0, desc: false, type: null }) {
      var _a, _b;
      const _room = (_b = (_a = this.creep) == null ? void 0 : _a.room) != null ? _b : this.options.room;
      const _sort = parameters.desc ? desc : asc;
      if (findType === _CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE) {
        const constructionSites = _room.find(FIND_CONSTRUCTION_SITES).map((constructionSite) => ({
          origin: constructionSite,
          distance: distance(this.creep.pos, constructionSite.pos)
        })).sort(({ distance: a }, { distance: b }) => _sort(a, b)).map(({ origin }) => origin);
        return constructionSites;
      }
      if (findType === _CreepFind.FIND_NEAR_DROPPED_RESOURCES) {
        const sources = _room.find(FIND_DROPPED_RESOURCES).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(({ distance: a }, { distance: b }) => asc(a, b)).map(({ origin }) => origin);
        return sources;
      }
      if (findType === _CreepFind.FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY) {
        const extensions = _room.find(FIND_MY_STRUCTURES).filter(
          ({ structureType, store }) => structureType === STRUCTURE_EXTENSION && store.getFreeCapacity(RESOURCE_ENERGY) > 0
        ).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(({ distance: a }, { distance: b }) => asc(a, b)).map(({ origin }) => origin);
        return extensions;
      }
      if (findType === _CreepFind.FIND_ROOM_CONTROLLER) {
        return _room.controller;
      }
      if (findType === _CreepFind.FIND_SOURCES_BY_DISTANCE) {
        const sources = _room.find(FIND_SOURCES).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(({ distance: a }, { distance: b }) => asc(a, b)).map(({ origin }) => origin);
        return sources;
      }
      if (findType === _CreepFind.FIND_SPAWN_TO_SPAWN_CREEP_BY_COST) {
        for (const nameSpawn in Game.spawns) {
          const spawn = Game.spawns[nameSpawn];
          if (spawn.room === _room && spawn.store[RESOURCE_ENERGY] >= parameters.cost) {
            return spawn;
          }
        }
        return false;
      }
      if (findType === _CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY) {
        const spawns = _room.find(FIND_MY_SPAWNS).map((spawn) => ({
          origin: spawn,
          free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          distance: distance(this.creep.pos, spawn.pos)
        })).filter(({ free }) => free > 0).sort(({ free: a }, { free: b }) => _sort(a, b)).map(({ origin }) => origin);
        return spawns;
      }
      if (findType === _CreepFind.FIND_SPAWNS_ORDER_BY_ENERGY) {
        const spawns = [];
        for (const nameSpawn in Game.spawns) {
          const spawn = Game.spawns[nameSpawn];
          if (spawn.room === _room) {
            spawns.push({
              origin: spawn,
              energy: spawn.store.energy
            });
          }
        }
        return spawns.sort(({ energy: a }, { energy: b }) => _sort(a, b)).map(({ origin }) => origin);
      }
    }
  };
  __publicField(_CreepFind, "FIND_CONSTRUCTION_SITES_BY_DISTANCE", "FIND_CONSTRUCTION_SITES_BY_DISTANCE");
  __publicField(_CreepFind, "FIND_NEAR_DROPPED_RESOURCES", "FIND_NEAR_DROPPED_RESOURCES");
  __publicField(_CreepFind, "FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY", "FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY");
  __publicField(_CreepFind, "FIND_ROOM_CONTROLLER", "FIND_ROOM_CONTROLLER");
  __publicField(_CreepFind, "FIND_SOURCES_BY_DISTANCE", "FIND_SOURCES_BY_DISTANCE");
  __publicField(_CreepFind, "FIND_SPAWN_TO_SPAWN_CREEP_BY_COST", "FIND_SPAWN_TO_SPAWN_CREEP_BY_COST");
  __publicField(_CreepFind, "FIND_SPAWN_WITH_FREE_CAPACITY", "FIND_SPAWN_WITH_FREE_CAPACITY");
  __publicField(_CreepFind, "FIND_SPAWNS_ORDER_BY_ENERGY", "FIND_SPAWNS_ORDER_BY_ENERGY");
  var CreepFind = _CreepFind;

  // src/lib/creep/Calc.js
  function CalcCreepBody(energy = 300, ratios = { [WORK]: 1, [CARRY]: 0.5, [MOVE]: 0.1 }) {
    const names = Object.keys(ratios);
    let result = [];
    let _energy = energy;
    for (const name of names) {
      result.push(name);
      _energy -= BODYPART_COST[name];
    }
    if (_energy < 0) {
      return false;
    }
    {
      let _available = [];
      let _ratios = {};
      let _places = MAX_CREEP_SIZE;
      while (true) {
        _energy = energy - result.reduce((pv, cv) => pv + BODYPART_COST[cv], 0);
        _available = names.filter((name) => BODYPART_COST[name] <= _energy);
        _places = MAX_CREEP_SIZE - result.length;
        _ratios = {};
        if (_places === 0) {
          break;
        } else if (_available.length === 0) {
          break;
        } else if (_places < 0) {
          while (_places < 0) {
            const _toRemove = names.map((name) => ({
              name,
              count: result.filter((_name) => _name === name).length,
              ratio: ratios[name]
            })).filter(({ count }) => count > 1).sort(({ ratio: a }, { ratio: b }) => asc(a, b))[0].name;
            const _toRemoveIndex = result.indexOf(_toRemove);
            result = result.filter((name, index, array) => index !== _toRemoveIndex);
            _places = MAX_CREEP_SIZE - result.length;
          }
          break;
        }
        for (const _name of _available) {
          _ratios[_name] = ratios[_name];
        }
        const add = {};
        for (const name of _available) {
          add[name] = Math.min(
            1,
            Math.floor(
              _energy / BODYPART_COST[name] * (_available.filter((_name) => _name !== name).reduce((pv, _name) => pv + _ratios[_name], 0) * 1e3 * _ratios[name]) / 1e3
            )
          );
        }
        if (Object.values(add).filter((v) => v > 0).length === 0) {
          const higherRatio = Object.entries(add).sort(([_1, a], [_2, b]) => desc(a, b))[0];
          const [name, _] = higherRatio;
          result.push(name);
        } else {
          for (const name in add) {
            add[name] > 0 && result.push(...new Array(add[name]).fill(name));
          }
        }
      }
    }
    return result.sort(asc);
  }

  // src/lib/creep/CreepSpawn.js
  var CreepSpawn = class _CreepSpawn extends CreepFind {
    spawn() {
      var _a, _b;
      this.setCreep();
      if ((_a = this.creep) == null ? void 0 : _a.spawning) {
        return false;
      }
      if (this.creep) {
        return true;
      }
      const spawn = this.find(_CreepSpawn.FIND_SPAWNS_ORDER_BY_ENERGY, { desc: true })[0];
      if (!spawn) {
        return false;
      }
      const body = Array.isArray(this.options.body) ? this.options.body : CalcCreepBody(spawn.room.energyCapacityAvailable, this.options.body);
      if (body.length === 0) {
        throw new Error(`body.length: ${body.length}`);
      }
      const result = spawn.spawnCreep(body, this.options.name, {
        memory: {
          job: "",
          jobs: this.options.jobs,
          body: this.options.body
        }
      });
      if (result === ERR_NOT_ENOUGH_ENERGY) {
        return false;
      }
      this.setCreep();
      if (!this.creep) {
        return false;
      }
      if ((_b = this.creep) == null ? void 0 : _b.spawning) {
        return false;
      }
      return true;
    }
  };

  // src/lib/creep/CreepJob.js
  var _CreepJob = class _CreepJob extends CreepSpawn {
    job() {
      if (!this.creep) {
        return false;
      }
      const _do = (job) => {
        switch (job) {
          case _CreepJob.HARVEST_ENERGY:
            return this.harvest(RESOURCE_ENERGY);
          case _CreepJob.PICKUP_ENERGY:
            return this.pickup(RESOURCE_ENERGY);
          case _CreepJob.BUILD:
            return this.build();
          case _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED:
            const controller = this.find(CreepFind.FIND_ROOM_CONTROLLER);
            if (controller.ticksToDowngrade > CONTROLLER_DOWNGRADE[controller.level] * 0.7) {
              return false;
            }
            return this.transfer("controller", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER:
            return this.transfer("controller", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_EXTENSION:
            return this.transfer("extension", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_SPAWN:
            return this.transfer("spawn", RESOURCE_ENERGY, "*");
        }
      };
      if (this.memory.job) {
        const result = _do(this.memory.job);
        if (result) {
          return;
        } else {
          this.memory.job = "";
        }
      }
      for (const subJobs of this.memory.jobs) {
        const _subJobs = Array.isArray(subJobs) ? subJobs : [subJobs];
        const oneOf = _subJobs.map((name) => ({ name, result: _do(name) })).filter(({ result }) => result);
        if (oneOf.length > 0) {
          this.log("?", oneOf.map(({ name }) => name).join(", "));
          for (const name of this.orders) {
            this.creep.cancelOrder(name);
            this.orders = this.orders.filter((_name) => _name !== name);
          }
          this.memory.job = oneOf[0].name;
          _do(this.memory.job);
          break;
        }
      }
    }
    harvest(resourceType = RESOURCE_ENERGY) {
      var _a;
      if (!this.creep) {
        return false;
      }
      if (this.creep.store.getFreeCapacity(resourceType) === 0) {
        return false;
      }
      const target = (_a = this.find(CreepFind.FIND_SOURCES_BY_DISTANCE)) == null ? void 0 : _a[0];
      if (!target) {
        return false;
      }
      const result = this.creep.harvest(target, resourceType);
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RES2SAY[result]);
      }
      return true;
    }
    pickup(resourceType = RESOURCE_ENERGY) {
      var _a;
      if (!this.creep) {
        return false;
      }
      if (this.creep.store.getFreeCapacity(resourceType) === 0) {
        return false;
      }
      const target = (_a = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)) == null ? void 0 : _a[0];
      if (!target) {
        return false;
      }
      const result = this.creep.pickup(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RES2SAY[result]);
      }
      return true;
    }
    transfer(to = "spawn", resourceType = RESOURCE_ENERGY, amount = 100) {
      if (!this.creep) {
        return false;
      }
      if (this.creep.store.getUsedCapacity(resourceType) === 0) {
        return false;
      }
      let target;
      switch (to) {
        case "controller":
          target = this.find(CreepFind.FIND_ROOM_CONTROLLER);
          break;
        case "extension":
          target = this.find(CreepFind.FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY)[0];
          break;
        case "spawn":
          target = this.find(CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY)[0];
          break;
      }
      if (!target) {
        return false;
      }
      const result = this.creep.transfer(target, resourceType, amount !== "*" ? amount : null);
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RES2SAY[result]);
      }
      return true;
    }
    build() {
      var _a;
      if (!this.creep) {
        return false;
      }
      if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        return false;
      }
      const target = (_a = this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE)) == null ? void 0 : _a[0];
      if (!target) {
        return false;
      }
      const result = this.creep.build(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RES2SAY[result]);
      }
      return true;
    }
  };
  __publicField(_CreepJob, "BUILD", "BUILD");
  __publicField(_CreepJob, "HARVEST_ENERGY", "HARVEST_ENERGY");
  __publicField(_CreepJob, "PICKUP_ENERGY", "PICKUP_ENERGY");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_CONTROLLER", "TRANSFER_ENERGY_TO_CONTROLLER");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED", "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_EXTENSION", "TRANSFER_ENERGY_TO_EXTENSION");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_SPAWN", "TRANSFER_ENERGY_TO_SPAWN");
  __publicField(_CreepJob, "RES2SAY", {
    [OK]: "OK",
    [ERR_NOT_OWNER]: "NOT_OWNER",
    [ERR_NO_PATH]: "NO_PATH",
    [ERR_NAME_EXISTS]: "NAME_EXISTS",
    [ERR_BUSY]: "BUSY",
    [ERR_NOT_FOUND]: "NOT_FOUND",
    [ERR_NOT_ENOUGH_ENERGY]: "NOT_ENOUGH_ENERGY",
    [ERR_NOT_ENOUGH_RESOURCES]: "NOT_ENOUGH_RESOURCES",
    [ERR_INVALID_TARGET]: "INVALID_TARGET",
    [ERR_FULL]: "FULL",
    [ERR_NOT_IN_RANGE]: "NOT_IN_RANGE",
    [ERR_INVALID_ARGS]: "INVALID_ARGS",
    [ERR_TIRED]: "TIRED",
    [ERR_NO_BODYPART]: "NO_BODYPART",
    [ERR_NOT_ENOUGH_EXTENSIONS]: "NOT_ENOUGH_EXTENSIONS",
    [ERR_RCL_NOT_ENOUGH]: "RCL_NOT_ENOUGH",
    [ERR_GCL_NOT_ENOUGH]: "GCL_NOT_ENOUGH"
  });
  var CreepJob = _CreepJob;

  // src/lib/creep/Creep.js
  var Creep = class extends CreepJob {
    constructor(options2 = this.options) {
      super();
      this.setOptions(options2);
    }
    live() {
      if (!this.spawn()) {
        return;
      }
      if (!this.job()) {
        return;
      }
    }
  };

  // src/index.js
  var Creep1 = (name = "Universal", room = Game.rooms.sim) => {
    return {
      name,
      room,
      body: { [WORK]: 0.6, [CARRY]: 0.5, [MOVE]: 0.2 },
      jobs: [
        [
          //
          CreepJob.PICKUP_ENERGY,
          CreepJob.HARVEST_ENERGY
        ],
        [
          //
          CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
          CreepJob.TRANSFER_ENERGY_TO_SPAWN,
          CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
          CreepJob.BUILD,
          CreepJob.TRANSFER_ENERGY_TO_CONTROLLER
        ]
      ]
    };
  };
  module.exports.loop = function loop() {
    Memory.log = [];
    for (const nameRoom in Game.rooms) {
      const room = Game.rooms[nameRoom];
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
})();
