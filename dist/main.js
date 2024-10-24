(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // <define:Config>
  var define_Config_default = { Room: { Creeps: { ForceSpawnIfCreepsLessThan: 3, MaximumSpawningTicksBetweenSpawns: 1500, AutoRespawnByRemainingTicks: 50, CountByRole: { RoleWorker: 4, RoleBuilder: 6, RoleManager: 2, RoleTower: 2 } }, Roads: { RateToBuild: 100, RateUpByCreep: 1, RateDownByTick: 0.05 }, Towers: { MinRequiredEnergy: 500, MinEnergyRepair: 500 } } };

  // src/config.js
  var Config2 = {
    Room: {
      Creeps: {
        ForceSpawnIfCreepsLessThan: 3,
        MaximumSpawningTicksBetweenSpawns: 1500,
        AutoRespawnByRemainingTicks: 50,
        CountByRole: {
          RoleWorker: 4,
          RoleBuilder: 6,
          RoleManager: 2,
          RoleTower: 2
        }
      },
      Roads: {
        RateToBuild: 100,
        RateUpByCreep: 1,
        RateDownByTick: 0.05
      },
      Towers: {
        MinRequiredEnergy: 500,
        MinEnergyRepair: 500
      }
    }
  };
  var config_default = Config2;

  // src/lib/process/Garbage.js
  function Garbage() {
    const before = JSON.stringify(Memory).length / 1024;
    if (Game.time % CREEP_LIFE_TIME === 0) {
      Memory.log.push(["Garbage() Memory size before:", `${before.toFixed(2)}KB`]);
      let remove = 0;
      for (const name in Memory.creeps) {
        if (Game.creeps[name] == null) {
          delete Memory.creeps[name];
          remove++;
        }
      }
      if (remove > 0) {
        const after = JSON.stringify(Memory).length / 1024;
        Memory.log.push(["", `-${(before - after).toFixed(2)}KB`], []);
      } else {
        Memory.log.push([]);
      }
    } else {
      Memory.log.push(
        [
          "Garbage() Memory size:",
          `${before.toFixed(2)}KB`,
          `Memory.creeps cleanup will be through ${CREEP_LIFE_TIME - Game.time % CREEP_LIFE_TIME} ticks`
        ],
        []
      );
    }
  }

  // lib/rand.js
  function rand(a, b) {
    return Math.round(Math.random() * (b - a) + a);
  }

  // lib/rand-of.js
  function randOf(array) {
    return array[rand(0, array.length - 1)];
  }

  // lib/sort.js
  function asc2(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }
  function desc(a, b) {
    return a === b ? 0 : a > b ? -1 : 1;
  }
  function sequence(array = [], sequence2 = [], value = (item) => item) {
    const end = [];
    return [
      ...array.filter((v) => {
        if (sequence2.indexOf(value(v)) === -1) {
          end.push(v);
          return false;
        }
        return true;
      }).sort((a, b) => {
        const ai = sequence2.indexOf(value(a));
        const bi = sequence2.indexOf(value(b));
        return ai === -1 ? 1 : ai > bi ? 1 : -1;
      }),
      ...end
    ];
  }

  // src/lib/distance.js
  function distance(point1, point2) {
    return Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
  }

  // lib/Array.prototype.flat.js
  var _a;
  Array.prototype.flat = (_a = Array.prototype.flat) != null ? _a : function flat(depth = Infinity) {
    const flat2 = [];
    (function recursion(array, d = 0) {
      if (d >= depth) {
        return;
      }
      for (const item of array) {
        if (Array.isArray(item)) {
          recursion(item, d + 1);
        } else {
          flat2.push(item);
        }
      }
    })(this);
    return flat2;
  };

  // src/lib/creep/Props.js
  var PropCreepParameters = {
    name: "Bunny",
    room: Room,
    // Screeps Room
    bodyRatios: {}
  };
  var PropCreepMemory = {
    bodyRatios: {},
    job: "",
    jobGroupIndex: 0
  };
  var PropCreepCreep = {
    name: "Bunny",
    memory: PropCreepMemory,
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
      __publicField(this, "parameters", PropCreepParameters);
      __publicField(this, "creep", PropCreepCreep);
      __publicField(this, "memory", PropCreepMemory);
      __publicField(this, "orders", []);
    }
    setParameters(parameters) {
      this.parameters = parameters;
      this.setCreep(Game.creeps[this.parameters.name]);
      return this;
    }
    setCreep(creep) {
      var _a2;
      this.creep = creep;
      this.memory = (_a2 = this.creep) == null ? void 0 : _a2.memory;
      return this;
    }
  };

  // src/lib/creep/CreepMessage.js
  var _CreepMessage = class _CreepMessage extends Props {
    constructor() {
      super(...arguments);
      __publicField(this, "logged", false);
    }
    log(...msg) {
      var _a2, _b, _c;
      const show = Memory.MLS || Memory.MLSO;
      if (!show) {
        return;
      }
      const TTL = "";
      const I = [];
      I.push(
        [
          //
          `\u23F1\uFE0F${(((_a2 = this.creep) == null ? void 0 : _a2.ticksToLive) / CREEP_LIFE_TIME * 100).toFixed(2)}%`.padEnd(8, " "),
          `\u26A1${(this.creep.store.getUsedCapacity(RESOURCE_ENERGY) / this.creep.store.getCapacity(RESOURCE_ENERGY) * 100).toFixed(2)}%`.padEnd(
            8,
            " "
          ),
          [
            this.creep.body.map(({ type }) => type).filter((v, i, a) => a.indexOf(v) === i).map((name) => {
              const count = this.creep.body.filter(({ type: _name }) => _name === name).length;
              return `${_CreepMessage.BODY_TO_EMOJI[name]}${`x${count}`}`;
            }).join(" "),
            `\u{1F4B0}${this.creep.body.reduce((pv, { type }) => pv + BODYPART_COST[type], 0)}`
          ].join(" = ")
        ].join(" | ")
      );
      let first = false;
      for (const m of msg) {
        if (!first && !this.logged) {
          let statuses = null;
          if (((_c = (_b = this.memory) == null ? void 0 : _b.statuses) == null ? void 0 : _c.length) > 0) {
            this.memory.statuses = this.memory.statuses.filter(({ stopShow }) => stopShow > Game.time);
            statuses = this.memory.statuses.map(({ emoji }) => emoji).join("");
          }
          if (Memory.StatusesShow && Game.time % 2 === 0) {
            this.creep.say(statuses);
          }
          const out = [
            //
            `[${this.creep.room.name}] [${this.memory.role.replace(/^Role/i, "")}] ${this.creep.name || this.parameters.name}${TTL}`,
            m,
            ...I
            // statuses,
          ];
          Memory.log.push(out);
          first = true;
        } else {
          Memory.log.push(["", m]);
        }
        first = true;
      }
      this.logged = true;
    }
    status(emoji, stopShow = 6) {
      var _a2;
      this.memory.statuses = ((_a2 = this.memory.statuses) != null ? _a2 : []).filter(({ emoji: emoji2 }) => emoji2 !== emoji2);
      this.memory.statuses.push({ emoji, stopShow: Game.time + stopShow });
      this.memory.statuses = this.memory.statuses.sort(({ stopShow: a }, { stopShow: b }) => asc2(a, b));
    }
  };
  __publicField(_CreepMessage, "BODY_TO_EMOJI", {
    [WORK]: "\u{1F64C}",
    [CARRY]: "\u{1F392}",
    [MOVE]: "\u{1F9BF}"
  });
  var CreepMessage = _CreepMessage;

  // src/lib/creep/CreepFind.js
  var _CreepFind = class _CreepFind extends CreepMessage {
    find(findType = _CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY, parameters = { cost: 0, desc: false, type: null }) {
      var _a2, _b, _c;
      const _room = (_b = (_a2 = this.creep) == null ? void 0 : _a2.room) != null ? _b : this.parameters.room;
      const _sort = parameters.desc ? desc : asc2;
      if (findType === _CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE) {
        let constructionSites = _room.find(FIND_MY_CONSTRUCTION_SITES).map((constructionSite) => ({
          origin: constructionSite,
          distance: distance(this.creep.pos, constructionSite.pos),
          progressTotal: constructionSite.progressTotal
        })).sort(({ distance: a }, { distance: b }) => _sort(a, b));
        let counstructionSitesByStructureType = {};
        for (const constructionSite of constructionSites) {
          counstructionSitesByStructureType[constructionSite.origin.structureType] = (_c = counstructionSitesByStructureType[constructionSite.origin.structureType]) != null ? _c : [];
          counstructionSitesByStructureType[constructionSite.origin.structureType].push(constructionSite);
        }
        for (const structureType in counstructionSitesByStructureType) {
          counstructionSitesByStructureType[structureType] = counstructionSitesByStructureType[structureType].sort(
            ({ progressTotal: a }, { progressTotal: b }) => asc2(a, b)
          );
        }
        const sortedByProgressTotal = Object.values(counstructionSitesByStructureType).flat(Infinity);
        return sortedByProgressTotal.map(({ origin }) => origin);
      }
      if (findType === _CreepFind.FIND_NEAR_DROPPED_RESOURCES) {
        const sources = _room.find(FIND_DROPPED_RESOURCES).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(({ distance: a }, { distance: b }) => asc2(a, b)).map(({ origin }) => origin);
        return sources;
      }
      if (findType === _CreepFind.FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY) {
        const extensions = _room.find(FIND_MY_STRUCTURES).filter(
          ({ structureType, store }) => structureType === STRUCTURE_EXTENSION && store.getFreeCapacity(RESOURCE_ENERGY) > 0
        ).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(({ distance: a }, { distance: b }) => asc2(a, b)).map(({ origin }) => origin);
        return extensions;
      }
      if (findType === _CreepFind.FIND_ROOM_CONTROLLER) {
        return _room.controller;
      }
      if (findType === _CreepFind.FIND_SOURCES_BY_DISTANCE) {
        const sources = _room.find(FIND_SOURCES).map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos)
        })).sort(({ distance: a }, { distance: b }) => asc2(a, b)).map(({ origin }) => origin);
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
      if (findType === _CreepFind.FIND_TOWER_WITH_FREE_CAPACITY) {
        const towers = _room.find(FIND_MY_STRUCTURES).filter(
          ({ structureType, store }) => structureType === STRUCTURE_TOWER && store.getFreeCapacity(RESOURCE_ENERGY) > 0
        ).map((tower) => ({
          origin: tower,
          free: tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          distance: distance(this.creep.pos, tower.pos)
        })).filter(({ free }) => free > 0).sort(({ free: a }, { free: b }) => _sort(a, b)).map(({ origin }) => origin);
        return towers;
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
  __publicField(_CreepFind, "FIND_TOWER_WITH_FREE_CAPACITY", "FIND_TOWER_WITH_FREE_CAPACITY");
  __publicField(_CreepFind, "COUNTER", 0);
  var CreepFind = _CreepFind;

  // lib/rand-name.js
  function randName() {
    const generate = (min = 1, max = 8) => {
      const length = rand(min, max);
      const vowels = "bcdfghjklmnpqrstvwxz";
      const consonants = "aeiouy";
      let hyphenation = false, lockHyphenation = false;
      let out2 = "";
      let vowel, consonant;
      while (out2.length < length || out2.slice(-3).indexOf("-") !== -1) {
        vowel = randOf(vowels);
        consonant = randOf(consonants);
        if (!hyphenation && rand(0, 100) > 90) {
          hyphenation = true;
          lockHyphenation = true;
          consonant = `${consonant}-`;
        }
        if (rand(0, 100) > 80 && !lockHyphenation) {
          consonant = `${consonant}${consonant}`;
        }
        out2 = `${out2}${vowel}${consonant}`;
      }
      out2 = out2.replace(/(\w+)/g, (m, p1) => `${p1[0].toUpperCase()}${p1.slice(1)}`);
      if (out2.length > 2 && rand(0, 100) > 50) {
        out2 = out2.slice(0, -1);
      }
      return out2;
    };
    const out = [];
    out.push(generate());
    if (rand(0, 100) > 20) {
      if (rand(0, 100) > 80) {
        out.push(`${generate(1, 1)[0]}.`);
      }
      out.push(generate());
    }
    return out.join(" ");
  }

  // lib/uc-first.js
  function UpperCaseFirst(string) {
    return string.replace(/(\w+)/g, (m, p1) => `${p1[0].toUpperCase()}${p1.slice(1).toLowerCase()}`);
  }

  // src/lib/creep/CreepSpawn.js
  var {
    Room: {
      Creeps: { ForceSpawnIfCreepsLessThan, MaximumSpawningTicksBetweenSpawns }
    }
  } = define_Config_default;
  var _CreepSpawn = class _CreepSpawn extends CreepFind {
    spawn(parameters = PropCreepParameters, force = false) {
      var _a2, _b, _c, _d;
      this.parameters = parameters;
      this.parameters.name = this.parameters.name || this.name();
      if (!this.parameters.name) {
        return false;
      }
      this.setCreep(Game.creeps[this.parameters.name]);
      if ((_a2 = this.creep) == null ? void 0 : _a2.spawning) {
        return false;
      }
      if (this.creep) {
        return true;
      }
      const spawn = this.find(_CreepSpawn.FIND_SPAWNS_ORDER_BY_ENERGY, { desc: true })[0];
      if (!spawn) {
        return false;
      }
      let CurrentCreepCount = 0;
      for (const name in Game.creeps) {
        if (Game.creeps[name].room === this.parameters.room) {
          CurrentCreepCount++;
        }
      }
      Memory.CreepSpawnLast = (_b = Memory.CreepSpawnLast) != null ? _b : {};
      Memory.CreepSpawnLast[this.parameters.room.name] = (_c = Memory.CreepSpawnLast[this.parameters.room.name]) != null ? _c : Game.time;
      const isTooFewCreeps = ForceSpawnIfCreepsLessThan && CurrentCreepCount < ForceSpawnIfCreepsLessThan;
      const isBeenTooLongBetweenSpawns = Game.time - Memory.CreepSpawnLast[this.parameters.room.name] >= MaximumSpawningTicksBetweenSpawns;
      if (isTooFewCreeps) {
        Memory.log.push(["CreepSpawn.spawn()", "isTooFewCreeps!"]);
      } else if (isBeenTooLongBetweenSpawns) {
        Memory.log.push(["CreepSpawn.spawn()", "isBeenTooLongBetweenSpawns!"]);
      }
      const energy = isTooFewCreeps || isBeenTooLongBetweenSpawns || force ? Math.max(300, this.parameters.room.energyAvailable) : spawn.room.energyCapacityAvailable;
      if (this.parameters.room.energyAvailable < energy) {
        return false;
      }
      const body = ((energy2) => {
        const bodyRatiosAvailable = Object.entries(_CreepSpawn.PACKS.Worker).filter(
          ([_energy]) => energy2 >= parseInt(_energy)
        );
        const bodyRatios = bodyRatiosAvailable[bodyRatiosAvailable.length - 1][1];
        const result2 = [];
        for (const name in bodyRatios) {
          result2.push(...new Array(bodyRatios[name]).fill(name));
        }
        return result2.sort(asc2);
      })(energy);
      if (body.length === 0) {
        console.log(`[WARN] CreepSpawn.spawn() body.length: ${body.length}`, energy);
        return false;
      }
      const result = spawn.spawnCreep(body, this.parameters.name, {
        memory: {
          role: this.parameters.role,
          // bodyRatios: this.parameters.bodyRatios, // ! TODO FEATURE
          job: ""
        }
      });
      if (result === ERR_NOT_ENOUGH_ENERGY) {
        return false;
      } else if (result !== OK && result !== ERR_BUSY) {
        console.log("SPAWN RESULT IS", result);
        return false;
      }
      Memory.CreepSpawnLast[this.parameters.room.name] = Game.time;
      this.setCreep(Game.creeps[this.parameters.name]);
      if (!this.creep) {
        return false;
      }
      if ((_d = this.creep) == null ? void 0 : _d.spawning) {
        return false;
      }
      return true;
    }
    name() {
      let name;
      do {
        name = UpperCaseFirst(randName());
      } while (Game.creeps[name]);
      return name;
    }
  };
  __publicField(_CreepSpawn, "PACKS", {
    Worker: {
      200: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
      300: { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
      350: { [WORK]: 2, [CARRY]: 1, [MOVE]: 2 },
      400: { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
      450: { [WORK]: 3, [CARRY]: 1, [MOVE]: 2 },
      500: { [WORK]: 3, [CARRY]: 2, [MOVE]: 2 },
      550: { [WORK]: 4, [CARRY]: 1, [MOVE]: 2 },
      600: { [WORK]: 4, [CARRY]: 2, [MOVE]: 2 },
      650: { [WORK]: 5, [CARRY]: 1, [MOVE]: 2 },
      700: { [WORK]: 5, [CARRY]: 2, [MOVE]: 2 },
      750: { [WORK]: 6, [CARRY]: 1, [MOVE]: 2 },
      800: { [WORK]: 6, [CARRY]: 2, [MOVE]: 2 },
      850: { [WORK]: 6, [CARRY]: 2, [MOVE]: 3 },
      900: { [WORK]: 6, [CARRY]: 3, [MOVE]: 3 },
      950: { [WORK]: 7, [CARRY]: 2, [MOVE]: 3 },
      1e3: { [WORK]: 7, [CARRY]: 3, [MOVE]: 3 },
      1050: { [WORK]: 8, [CARRY]: 2, [MOVE]: 3 },
      1100: { [WORK]: 8, [CARRY]: 3, [MOVE]: 3 },
      1150: { [WORK]: 8, [CARRY]: 3, [MOVE]: 4 },
      1200: { [WORK]: 8, [CARRY]: 4, [MOVE]: 4 },
      1250: { [WORK]: 9, [CARRY]: 3, [MOVE]: 4 },
      1300: { [WORK]: 9, [CARRY]: 4, [MOVE]: 4 }
    }
  });
  var CreepSpawn = _CreepSpawn;

  // src/lib/creep/CreepMove.js
  var CreepMove = class extends CreepSpawn {
    move(target, next = true) {
      var _a2, _b, _c;
      let direction;
      if (Memory.ResetPath) {
        delete this.memory.myPath;
      }
      if (!this.memory.myPath || ((_a2 = this.memory.myPath) == null ? void 0 : _a2.targetId) !== target.id) {
        const path = this.creep.pos.findPathTo(target, { ignoreCreeps: false, plainCost: 2, swampCost: 10 });
        this.memory.myPath = { path, targetId: target.id };
      }
      if (((_c = (_b = this.memory.myPath) == null ? void 0 : _b.path) == null ? void 0 : _c.length) > 0) {
        const { x: sX, y: sY } = this.memory.myPath.path[0];
        if (sX === this.creep.pos.x && sY === this.creep.pos.y) {
          this.memory.myPath.path = this.memory.myPath.path.slice(1);
        }
        if (this.memory.myPath.path.length > 0) {
          direction = this.memory.myPath.path[0].direction;
        }
      }
      if (direction) {
        const result = this.creep.move(direction);
        return result;
      } else {
        delete this.memory.myPath;
        if (next) {
          this.move(target, false);
          this.creep.say("\u{1F699}\u2753");
        } else {
          this.creep.say("\u{1F699}\u{1F620}");
        }
      }
    }
    moveSimple(target) {
      this.creep.moveTo(target, {
        visualizePathStyle: {
          fill: "transparent",
          stroke: "yellowgreen",
          lineStyle: "dashed",
          strokeWidth: 0.05,
          opacity: 1
        }
      });
      this.status("\u{1F699}");
    }
  };
  __publicField(CreepMove, "DIRECTION_TO_TEXT", {
    [TOP]: "TOP",
    [TOP_RIGHT]: "TOP_RIGHT",
    [RIGHT]: "RIGHT",
    [BOTTOM_RIGHT]: "BOTTOM_RIGHT",
    [BOTTOM]: "BOTTOM",
    [BOTTOM_LEFT]: "BOTTOM_LEFT",
    [LEFT]: "LEFT",
    [TOP_LEFT]: "TOP_LEFT"
  });

  // src/lib/creep/CreepJob.js
  var COORDS_RADIUS_1 = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ];
  var _CreepJob = class _CreepJob extends CreepMove {
    constructor() {
      super(...arguments);
      __publicField(this, "dryRun", false);
    }
    job() {
      if (!this.creep) {
        console.log("=(");
        return false;
      }
      if (Memory.ResetJob) {
        delete this.memory.job;
        delete this.memory.jobGroupIndex;
        this.log(`MEMORY RESET JOB...`);
      }
      if (!this.memory.role) {
        this.memory.role = "RoleWorker";
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
            if (this.memory.job !== _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED) {
              const controller = this.find(CreepFind.FIND_ROOM_CONTROLLER);
              if (controller.ticksToDowngrade > CONTROLLER_DOWNGRADE[controller.level] * 0.5) {
                return false;
              }
            }
            return this.transfer("controller", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_TOWER_IF_NEEDED:
            const towers = this.find(CreepFind.FIND_TOWER_WITH_FREE_CAPACITY).filter(({ energy }) => energy < config_default.Room.Towers.MinRequiredEnergy).sort(({ energy: a }, { energy: b }) => asc(a, b));
            if (towers.length === 0) {
              return false;
            }
            return this.transfer("tower", RESOURCE_ENERGY, "*", towers);
          case _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER:
            return this.transfer("controller", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_EXTENSION:
            return this.transfer("extension", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_SPAWN:
            return this.transfer("spawn", RESOURCE_ENERGY, "*");
          case _CreepJob.TRANSFER_ENERGY_TO_TOWER:
            return this.transfer("tower", RESOURCE_ENERGY, "*");
          case _CreepJob.REPAIR_ROAD_NEAR_SOURCE:
            return this.repair("road-near-source");
        }
      };
      if (this.memory.job) {
        const result = _do(this.memory.job);
        if (result) {
          let add2 = [];
          if (this.memory.job === _CreepJob.BUILD && this.memory.myBuildId) {
            const target = Game.getObjectById(this.memory.myBuildId);
            if (target) {
              add2.push(
                `: ${target.structureType.toUpperCase()}: ${target.progress} of ${target.progressTotal} (${(target.progress / target.progressTotal * 100).toFixed(2)}%) (${target.pos.x}x${target.pos.y})`
              );
            }
          }
          this.log(`> ${this.memory.job}${add2.join(" ")}`);
          return;
        } else {
          delete this.memory.job;
          this.status("\u{1F396}\uFE0F");
        }
      }
      while (!this.memory.job) {
        let jobGroupIndex = -1;
        for (const subJobs of _CreepJob.ROLE_TO_JOB[this.memory.role]) {
          jobGroupIndex++;
          if (this.memory.jobGroupIndex >= 0 && jobGroupIndex !== this.memory.jobGroupIndex) {
            continue;
          }
          const _subJobs = Array.isArray(subJobs) ? subJobs : [subJobs];
          this.dryRun = true;
          const oneOf = _subJobs.map((name) => ({ name, result: _do(name) })).filter(({ result }) => result);
          this.dryRun = false;
          if (oneOf.length > 0) {
            this.log(oneOf[0].name);
            this.status("\u2600\uFE0F");
            this.memory.job = oneOf[0].name;
            this.memory.jobGroupIndex = jobGroupIndex;
            _do(this.memory.job);
            break;
          } else {
            this.memory.jobGroupIndex = -1;
          }
        }
      }
    }
    harvest(resourceType = RESOURCE_ENERGY) {
      var _a2;
      if (!this.creep) {
        delete this.memory.attemptsHarvestSource;
        return false;
      }
      const free = this.creep.store.getFreeCapacity(resourceType);
      const used = this.creep.store.getUsedCapacity(resourceType);
      const total = this.creep.store.getCapacity(resourceType);
      if (free === 0) {
        delete this.memory.attemptsHarvestSource;
        return false;
      }
      let target;
      if (this.memory.mySourceId && this.memory.attemptsHarvestSource >= _CreepJob.ATTEMPTS_HARVEST_LIMIT) {
        target = randOf(
          this.find(CreepFind.FIND_SOURCES_BY_DISTANCE).filter((source) => source.id !== this.memory.mySourceId)
        );
        this.memory.mySourceId = target.id;
        this.memory.attemptsHarvestSource = 0;
      }
      if (!this.memory.mySourceId) {
        target = this.find(CreepFind.FIND_SOURCES_BY_DISTANCE)[0];
        this.memory.mySourceId = target.id;
      } else {
        target = Game.getObjectById(this.memory.mySourceId);
      }
      if (!target) {
        return false;
      }
      const result = this.creep.harvest(target, resourceType);
      this.dryRun && this.creep.cancelOrder("harvest");
      if (result === ERR_NOT_IN_RANGE) {
        this.move(target);
        this.dryRun && this.creep.cancelOrder("move");
        if (distance(this.creep.pos, target.pos) <= _CreepJob.ATTEMPTS_HARVEST_DISTANCE) {
          this.memory.attemptsHarvestSource = ((_a2 = this.memory.attemptsHarvestSource) != null ? _a2 : 0) + 1;
        } else {
          delete this.memory.attemptsHarvestSource;
        }
      } else if (result === ERR_NOT_ENOUGH_EXTENSIONS) {
        !this.dryRun && this.status("\u{1FAB9}");
        this.move(target);
        this.dryRun && this.creep.cancelOrder("move");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
        delete this.memory.attemptsHarvestSource;
      }
      return true;
    }
    pickup(resourceType = RESOURCE_ENERGY) {
      var _a2, _b, _c, _d;
      if (this.creep.store.getFreeCapacity(resourceType) === 0) {
        delete this.memory.myPickupId;
        delete this.memory.myPickupMemKey;
        return false;
      }
      let isNewTarget = false;
      let target;
      if (!this.memory.myPickupId) {
        target = (_a2 = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)) == null ? void 0 : _a2[0];
        isNewTarget = true;
      } else {
        target = Game.getObjectById(this.memory.myPickupId);
      }
      if (!target) {
        delete this.memory.myPickupId;
        delete this.memory.myPickupMemKey;
        return false;
      }
      if (isNewTarget) {
        Memory.DroppedResources = (_b = Memory.DroppedResources) != null ? _b : {};
        Memory.DroppedResources.Energy = (_c = Memory.DroppedResources.Energy) != null ? _c : {};
        const mdre = Memory.DroppedResources.Energy;
        const { x, y } = target.pos;
        const memkey = `${x}x${y}`;
        mdre[memkey] = (_d = mdre[memkey]) != null ? _d : { capacity: target.amount };
        if (mdre[memkey].capacity <= 0) {
          delete this.memory.myPickupId;
          delete this.memory.myPickupMemKey;
          return false;
        }
        console.log(this.creep.name, "assign to", memkey);
        mdre[memkey].capacity += this.creep.store.getFreeCapacity(resourceType);
      }
      this.memory.myPickupId = target.id;
      this.memory.myPickupMemKey = `${target.pos.x}x${target.pos.y}`;
      const result = this.creep.pickup(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.move(target);
        this.dryRun && this.creep.cancelOrder("move");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
      }
      return true;
    }
    transfer(to = "spawn", resourceType = RESOURCE_ENERGY, amount = 100, targets = []) {
      var _a2, _b;
      if (this.creep.store.getUsedCapacity(resourceType) === 0) {
        delete this.memory.myTransferId;
        return false;
      }
      let target;
      if (!this.memory.myTransferId) {
        target = targets.length > 0 ? targets[0] : (_b = (_a2 = {
          controller: () => this.find(CreepFind.FIND_ROOM_CONTROLLER),
          extension: () => this.find(CreepFind.FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY)[0],
          spawn: () => this.find(CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY)[0],
          tower: () => this.find(CreepFind.FIND_TOWER_WITH_FREE_CAPACITY)[0]
        })[to]) == null ? void 0 : _b.call(_a2);
        if (target == null ? void 0 : target.id) {
          this.memory.myTransferId = target.id;
        }
      } else {
        target = Game.getObjectById(this.memory.myTransferId);
      }
      if (!target) {
        delete this.memory.myTransferId;
        return false;
      }
      const result = this.creep.transfer(target, resourceType, amount !== "*" ? amount : null);
      if (result === ERR_NOT_IN_RANGE) {
        this.move(target);
        this.dryRun && this.creep.cancelOrder("move");
      } else if (result === ERR_FULL) {
        delete this.memory.myTransferId;
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
      }
      return true;
    }
    build() {
      var _a2;
      if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        delete this.memory.myBuildId;
        return false;
      }
      let target;
      if (!this.memory.myBuildId) {
        const targets = sequence(
          this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE),
          [STRUCTURE_EXTENSION, STRUCTURE_TOWER],
          // STRUCTURE_ROAD always end
          ({ structureType }) => structureType
        );
        if (!targets[0]) {
          return false;
        }
        const isRoadsOnly = !targets.some(({ structureType }) => structureType !== STRUCTURE_ROAD);
        const roadsNearSource = isRoadsOnly && targets.filter(({ pos }) => {
          for (const [x, y] of COORDS_RADIUS_1) {
            const result2 = this.creep.room.lookForAt(LOOK_SOURCES, pos.x + x, pos.y + y);
            if (result2.length > 0) {
              return true;
            }
          }
          return false;
        });
        target = (_a2 = roadsNearSource == null ? void 0 : roadsNearSource[0]) != null ? _a2 : targets[0];
        this.memory.myBuildId = target.id;
      } else {
        target = Game.getObjectById(this.memory.myBuildId);
      }
      if (!target) {
        delete this.memory.myBuildId;
        return false;
      }
      const result = this.creep.build(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.move(target);
        this.dryRun && this.creep.cancelOrder("move");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
      }
      return true;
    }
    repair(to = "road-near-source") {
      if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        delete this.memory.myRepairId;
        return false;
      }
      let target;
      switch (to) {
        case "road-near-source":
          if (this.memory.myRepairId) {
            const structure = Game.getObjectById(this.memory.myRepairId);
            const remaining = structure.hits / structure.hitsMax;
            if (remaining >= 1) {
              delete this.memory.myRepairId;
            } else {
              target = structure;
            }
          }
          if (!this.memory.myRepairId) {
            const sources = this.find(CreepFind.FIND_SOURCES_BY_DISTANCE);
            const roads = [];
            const radius = 2;
            for (const source of sources) {
              const { x: sX, y: sY } = source.pos;
              for (let x = sX - radius; x < sX + radius; x++) {
                for (let y = sY - radius; y < sY + radius; y++) {
                  if (x === sX && y === sY) {
                    continue;
                  }
                  const road = this.creep.room.lookAt(x, y).filter(({ structure }) => {
                    if ((structure == null ? void 0 : structure.structureType) !== STRUCTURE_ROAD) {
                      return false;
                    }
                  }).map(({ structure }) => {
                    const remaining = structure.hits / structure.hitsMax;
                    return { origin: structure, remaining };
                  });
                  road[0] && roads.push(road[0]);
                }
              }
            }
            if (roads.length === 0) {
              return false;
            }
            const roadLowest = roads.sort(({ remaining: a }, { remaining: b }) => asc(a, b))[0];
            target = roadLowest[0];
            this.memory.myRepairId = target.id;
          }
          break;
      }
      if (!target) {
        return false;
      }
      const result = this.creep.repair(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.move(target);
        this.dryRun && this.creep.cancelOrder("move");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u{1F9F0}");
      }
      return true;
    }
  };
  __publicField(_CreepJob, "BUILD", "BUILD");
  __publicField(_CreepJob, "HARVEST_ENERGY", "HARVEST_ENERGY");
  __publicField(_CreepJob, "PICKUP_ENERGY", "PICKUP_ENERGY");
  __publicField(_CreepJob, "REPAIR_ROAD_NEAR_SOURCE", "REPAIR_ROAD_NEAR_SOURCE");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_CONTROLLER", "TRANSFER_ENERGY_TO_CONTROLLER");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED", "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_EXTENSION", "TRANSFER_ENERGY_TO_EXTENSION");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_SPAWN", "TRANSFER_ENERGY_TO_SPAWN");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_TOWER", "TRANSFER_ENERGY_TO_TOWER");
  __publicField(_CreepJob, "TRANSFER_ENERGY_TO_TOWER_IF_NEEDED", "TRANSFER_ENERGY_TO_TOWER_IF_NEEDED");
  __publicField(_CreepJob, "RESULT_TO_TEXT", {
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
  __publicField(_CreepJob, "ATTEMPTS_HARVEST_DISTANCE", 8);
  // distance()
  __publicField(_CreepJob, "ATTEMPTS_HARVEST_LIMIT", 20);
  __publicField(_CreepJob, "ROLE_TO_JOB", {
    RoleWorker: [
      [
        //
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
        _CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        _CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        _CreepJob.TRANSFER_ENERGY_TO_TOWER,
        _CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        _CreepJob.BUILD,
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER
      ],
      [
        //
        _CreepJob.PICKUP_ENERGY,
        _CreepJob.HARVEST_ENERGY
      ]
    ],
    RoleBuilder: [
      [
        //
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
        _CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        _CreepJob.BUILD,
        _CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        _CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER
      ],
      [
        //
        _CreepJob.PICKUP_ENERGY,
        _CreepJob.HARVEST_ENERGY
      ]
    ],
    RoleManager: [
      [
        //
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
        _CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        _CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        _CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        _CreepJob.BUILD
      ],
      [
        //
        _CreepJob.PICKUP_ENERGY,
        _CreepJob.HARVEST_ENERGY
      ]
    ],
    RoleTower: [
      [
        //
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
        _CreepJob.TRANSFER_ENERGY_TO_TOWER,
        _CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        _CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        _CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        _CreepJob.BUILD,
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER
      ],
      [
        //
        _CreepJob.PICKUP_ENERGY,
        _CreepJob.HARVEST_ENERGY
      ]
    ]
  });
  var CreepJob = _CreepJob;

  // src/lib/creep/CreepRole.js
  var CreepRole = class extends CreepJob {
    static RoleWorker() {
      return {
        role: "RoleWorker",
        body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 10 }
      };
    }
    static RoleBuilder() {
      return {
        role: "RoleBuilder",
        body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 10 }
      };
    }
    static RoleManager() {
      return {
        role: "RoleManager",
        body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 10 }
      };
    }
    static RoleTower() {
      return {
        role: "RoleTower",
        body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 1 }
      };
    }
  };

  // src/lib/creep/Creep.js
  var Creep = class extends CreepRole {
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
  };

  // src/lib/process/Live.js
  function Live() {
    for (const name in Game.creeps) {
      new Creep(Game.creeps[name]).live();
    }
    Memory.ResetJob = false;
    Memory.ResetPath = false;
  }

  // lib/table.js
  function table2(rows = []) {
    var _a2, _b;
    const colsWidth = [];
    for (const row of rows) {
      for (let ci = 0; ci < row.length; ci++) {
        colsWidth[ci] = Math.max(colsWidth[ci] || 0, `${(_a2 = row[ci]) != null ? _a2 : ""}`.length);
      }
    }
    for (let ci = 0; ci < colsWidth.length; ci++) {
      for (const row of rows) {
        row[ci] = `${(_b = row[ci]) != null ? _b : ""}`.padEnd(colsWidth[ci], " ");
      }
    }
    let totalLength = 0;
    const out = [];
    for (const row of rows) {
      out.push(`| ${row.join(" | ")} |`);
    }
    totalLength = out[0].length;
    console.log(
      [
        //
        "".padEnd(totalLength, "_"),
        ...out,
        "".padEnd(totalLength, "\u203E")
      ].join("\n")
    );
  }

  // src/lib/process/MemoryLog.js
  var Time = null;
  function MemoryLog() {
    var _a2, _b;
    Memory.MLS = (_a2 = Memory.MLS) != null ? _a2 : false;
    Memory.MLS = (_b = Memory.MLS) != null ? _b : false;
    const show = Memory.MLS || Memory.MLSO;
    if (!show) {
      Memory.log = [];
      return;
    }
    if (Time === null) {
      Time = Game.time;
      Memory.log = [];
    } else {
      Time = null;
      if (show && Memory.log.length > 0) {
        const _table = [["Memory.log[]"]];
        for (const msg of Memory.log) {
          _table.push([...msg]);
        }
        table2(_table);
      }
      Memory.log = [];
      if (Memory.MLSO) {
        Memory.MLSO = false;
        console.log(`Memory.MLSO is done.`);
      }
    }
  }

  // src/lib/process/Observe.js
  function Observe() {
    var _a2, _b, _c, _d;
    Memory.NotiStack = (_a2 = Memory.NotiStack) != null ? _a2 : {};
    const Notifications = {};
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      if (!Memory.NotiStack[name]) {
        const rcp2 = getRoomControllerProgress(room);
        const data = Memory.NotiStack[name] = {
          level: room.controller.level,
          progress: rcp2.progress
        };
        (Notifications.ObservationStart = (_b = Notifications.ObservationStart) != null ? _b : []).push(
          [
            `Room[${room.name}] controller level observation started, current: ${data.level}`,
            `Room[${room.name}] controller progress observation started, current: ${rcp2.current} of ${rcp2.total} (${rcp2.percent}%)`
          ].join("\n")
        );
      }
      const MNS = Memory.NotiStack[name];
      if (MNS.level !== room.controller.level) {
        MNS.level = room.controller.level;
        const notification = {
          type: "room-controller-level",
          level: room.controller.level,
          text: `Room[${room.name}].Controller level is changed to ${room.controller.level} (${room.controller.level - MNS.level})`
        };
        (Notifications.RoomControllerLevel = (_c = Notifications.RoomControllerLevel) != null ? _c : []).push(notification.text);
      }
      const rcp = getRoomControllerProgress(room);
      if (MNS.progress !== rcp.progress) {
        MNS.progress = rcp.progress;
        const notification = {
          type: "room-controller-progress",
          progress: room.controller.progress,
          text: `Room[${room.name}].Controller progress is changed to ${rcp.current} of ${rcp.total} (${rcp.percent}%)`
        };
        (Notifications.RoomControllerProgress = (_d = Notifications.RoomControllerProgress) != null ? _d : []).push(notification.text);
      }
    }
    for (const key in Notifications) {
      Game.notify(Notifications[key].join("\n\n"));
    }
  }
  function getRoomControllerProgress(room) {
    const controller = room.controller;
    const current = controller.progress;
    const total = controller.progressTotal;
    const progress = parseFloat((current / total).toFixed(1));
    const percent = Math.floor(progress * 100);
    return { current, total, progress, percent };
  }

  // src/lib/room/Room.js
  var {
    Room: {
      Creeps: {
        CountByRole: CBR,
        AutoRespawnByRemainingTicks: ARBRT
        //
      }
    }
  } = config_default;
  var ROADS_AROUND_SOURCES_COORDS = [
    // [-2, -2],
    [-2, -1],
    [-2, 0],
    [-2, 1],
    // [-2, 2],
    [-1, -2],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [0, -2],
    [0, -1],
    [0, 1],
    [0, 2],
    [1, -2],
    [1, -1],
    [1, 0],
    [1, 1],
    [1, 2],
    // [2, -2],
    [2, -1],
    [2, 0],
    [2, 1]
    // [2, 2],
  ];
  function Room2() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      spawnCreeps(room);
      roadsAroundSources(room);
    }
  }
  function spawnCreeps(room) {
    var _a2;
    const CCCBR = {};
    for (const role in CBR) {
      CCCBR[role] = 0;
    }
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.room === room) {
        CCCBR[creep.memory.role] = ((_a2 = CCCBR[creep.memory.role]) != null ? _a2 : 0) + 1;
      }
    }
    if (Memory.CreepsShow) {
      table([
        //
        ["", ...Object.keys(CCCBR)],
        ["Current", ...Object.values(CCCBR)],
        ["Need", ...Object.values(CBR)]
      ]);
    }
    {
      let next;
      let force = false;
      let reason = "";
      if (!next) {
        for (const role in CBR) {
          if (!CCCBR[role] || CCCBR[role] < CBR[role]) {
            next = { room, ...CreepRole[role]() };
            reason = `The count of creeps is less than needed.`;
            force = true;
            break;
          }
        }
      }
      if (!next && ARBRT > 0) {
        const nextByTimeList = [];
        for (const name in Game.creeps) {
          const creep = Game.creeps[name];
          if (creep.spawning) {
            continue;
          }
          const remaining = creep.ticksToLive;
          if (creep.ticksToLive < ARBRT) {
            nextByTimeList.push({ remaining, creep });
          }
        }
        const nextByTime = nextByTimeList.sort(({ remaining: a }, { remaining: b }) => asc2(a, b))[0];
        if (nextByTime) {
          const creep = nextByTime.creep;
          next = { room: creep.room, ...CreepRole[creep.memory.role]() };
          reason = `Creep "${creep.name}" has ${creep.ticksToLive} ticks remaining`;
        }
      }
      if (next) {
        if (Memory.MLS || Memory.MLSO) {
          Memory.log.push([`[${room.name}] Room() -> spawnCreeps()`, `Next spawn ${next.role} in ${next.room.name}`]);
          reason && Memory.log.push(["", `Reason: ${reason}`], []);
        }
        new Creep().spawn({ room: next.room, ...CreepRole[next.role]() }, force);
      }
    }
  }
  function roadsAroundSources(room) {
    if (Game.time % 1500 !== 0) {
      return;
    }
    if (Memory.MLS || Memory.MLSO) {
      Memory.log.push(["roadsAroundSources()"]);
    }
    const sources = room.find(FIND_SOURCES);
    for (const source of sources) {
      for (const [x, y] of ROADS_AROUND_SOURCES_COORDS) {
        const _x = source.pos.x + x;
        const _y = source.pos.y + y;
        let terrainOnly = true;
        const results = room.lookAt(_x, _y);
        for (const { type } of results) {
          if (type !== "terrain" && type !== "creep") {
            terrainOnly = false;
            break;
          }
        }
        if (!terrainOnly) {
          continue;
        }
        room.createConstructionSite(_x, _y, STRUCTURE_ROAD);
      }
    }
  }
  function CountCreepsByRoom() {
    var _a2;
    const NeedCountPerRoom = Object.values(CBR).reduce((pv, cv) => pv + cv, 0);
    let CreepCountByRoom = {};
    for (const name in Game.creeps) {
      (CreepCountByRoom[Game.creeps[name].room.name] = (_a2 = CreepCountByRoom[Game.creeps[name].room.name]) != null ? _a2 : []).push(name);
    }
    for (const name in CreepCountByRoom) {
      Memory.log.push([`${name} creeps:`, `${CreepCountByRoom[name].length} of ${NeedCountPerRoom}`]);
    }
  }

  // src/lib/structures/ProceduralRoads.js
  var {
    Room: {
      Roads: {
        RateToBuild,
        RateUpByCreep,
        RateDownByTick
        //
      }
    }
  } = define_Config_default;
  var FLOAT_FIX = RateDownByTick.toString().replace(/^\d+\./, "").length;
  function ProceduralRoads() {
    var _a2;
    Memory.Roads = (_a2 = Memory.Roads) != null ? _a2 : {
      // [Room.name]: {
      //   [coords]: 55.99
      // },
    };
    calculate();
    add();
  }
  function calculate() {
    let canBuild = Object.keys(Game.constructionSites).length < MAX_CONSTRUCTION_SITES;
    for (const roomName in Memory.Roads) {
      for (const keyCoords in Memory.Roads[roomName]) {
        if (Memory.Roads[roomName][keyCoords] >= RateToBuild) {
          if (!canBuild) {
            continue;
          }
          build(Game.rooms[roomName], keyCoords);
          canBuild = Object.keys(Game.constructionSites).length < MAX_CONSTRUCTION_SITES;
          continue;
        }
        Memory.Roads[roomName][keyCoords] = parseFloat(
          (Memory.Roads[roomName][keyCoords] - RateDownByTick).toFixed(FLOAT_FIX)
        );
        if (Memory.Roads[roomName][keyCoords] <= 0) {
          delete Memory.Roads[roomName][keyCoords];
        }
      }
    }
  }
  function add() {
    var _a2, _b;
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.spawning) {
        continue;
      }
      const room = creep.room;
      const { x, y } = creep.pos;
      const structures = room.lookAt({ x, y }).filter(({ type }) => type === "structure").map(({ structure: { structureType } }) => structureType);
      if (structures.length > 0) {
        continue;
      }
      const keyCoords = `${x}x${y}`;
      Memory.Roads[room.name] = (_a2 = Memory.Roads[room.name]) != null ? _a2 : {};
      const rate = Math.min(RateToBuild, ((_b = Memory.Roads[room.name][keyCoords]) != null ? _b : RateDownByTick) + RateUpByCreep);
      Memory.Roads[room.name][keyCoords] = rate;
    }
  }
  function build(room, keyCoords) {
    const [x, y] = keyCoords.split("x").map((v) => parseInt(v));
    const result = room.createConstructionSite(x, y, STRUCTURE_ROAD);
    if (result === ERR_INVALID_TARGET) {
      delete Memory.Roads[room.name][keyCoords];
    }
    return result;
  }

  // src/lib/structures/Towers.js
  var {
    Room: {
      Towers: { MinEnergyRepair }
    }
  } = define_Config_default;
  function Towers() {
    for (const roomName in Game.rooms) {
      const towers2attack = [];
      const towers2heal = [];
      const towers2repair = [];
      const hostiles = [];
      const healing = [];
      const repairs = [];
      const creeps = Game.rooms[roomName].find(FIND_MY_CREEPS);
      const structures = Game.rooms[roomName].find(FIND_STRUCTURES);
      for (const creep of creeps) {
        if (creep.hits < creep.hitsMax) {
          healing.push(creep);
        }
      }
      for (const structure of structures) {
        if (!structure.my && structure.structureType !== STRUCTURE_ROAD) {
          continue;
        }
        if (structure.structureType === STRUCTURE_TOWER) {
          const energy = structure.store.energy;
          if (energy > 0) {
            towers2attack.push(structure);
            towers2heal.push(structure);
            const hostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostile) {
              hostiles.push(hostile);
            } else if (energy >= MinEnergyRepair) {
              towers2repair.push(structure);
            }
          }
        }
        if (hostiles.length === 0) {
          if (structure.hits < structure.hitsMax && structure.hits < structure.hitsMax - 500) {
            repairs.push(structure);
          }
        }
      }
      if (towers2attack.length > 0 && hostiles.length > 0) {
        attack(towers2attack, hostiles);
      } else if (towers2heal.length > 0 && healing.length > 0) {
        heal(towers2attack, healing);
      } else if (towers2repair.length > 0 && repairs.length > 0) {
        repair(towers2repair, repairs);
      }
    }
  }
  function attack(towers = [], hostiles = []) {
    const h = hostiles[0];
    for (const tower of towers) {
      tower.attack(h);
      Memory.log.push([`[${tower.room.name}] attacks ${h.name} (${h.owner})`]);
    }
  }
  function heal(towers = [], healing = []) {
    const h = healing[0];
    for (const tower of towers) {
      tower.heal(h);
      Memory.log.push([
        `[${tower.room.name}] healing ${h.name} ${h.hits} of ${h.hitsMax} (${(h.hits / h.hitsMax * 100).toFixed(2)})`
      ]);
    }
  }
  function repair(towers = [], repairs = []) {
    const repairsSorted = sequence(
      repairs.sort(({ hits: a }, { hits: b }) => asc2(a, b)),
      [STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_SPAWN]
    );
    for (const tower of towers) {
      const r = repairsSorted[0];
      tower.repair(r);
      Memory.log.push([
        `[${tower.room.name}] Tower "${tower.id}"`,
        `REPAIR ${r.structureType} (${r.pos.x}x${r.pos.x})`,
        `${r.hits} of ${r.hitsMax} (${(r.hits / r.hitsMax * 100).toFixed(2)}%)`
      ]);
    }
  }

  // src/index.js
  function loop() {
    MemoryLog();
    Garbage();
    Observe();
    Room2();
    ProceduralRoads();
    Towers();
    Live();
    CountCreepsByRoom();
    MemoryLog();
  }
  eval(`module.exports.loop = ${loop.name};`);
})();
