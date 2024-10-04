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

  // lib/table.js
  function table(rows = []) {
    var _a5, _b;
    const colsWidth = [];
    for (const row of rows) {
      for (let ci = 0; ci < row.length; ci++) {
        colsWidth[ci] = Math.max(colsWidth[ci] || 0, `${(_a5 = row[ci]) != null ? _a5 : ""}`.length);
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

  // src/config.js
  var Config = {
    Room: {
      Creeps: {
        RoleWorker: 3,
        RoleBuilder: 3,
        RoleManager: 3
      }
    }
  };
  var config_default = Config;

  // lib/rand.js
  function rand(a, b) {
    return Math.round(Math.random() * (b - a) + a);
  }

  // lib/rand-of.js
  function randOf(array) {
    return array[rand(0, array.length - 1)];
  }

  // src/lib/distance.js
  function distance(point1, point2) {
    return Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
  }

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
      var _a5;
      this.creep = creep;
      this.memory = (_a5 = this.creep) == null ? void 0 : _a5.memory;
      return this;
    }
  };

  // src/lib/creep/CreepMessage.js
  var _CreepMessage = class _CreepMessage extends Props {
    log(...msg) {
      var _a5;
      const TTL = "";
      const I = [];
      I.push(
        [
          //
          // `❤️${((this.creep?.ticksToLive / 1500) * 100).toFixed(2)}%`.padEnd(8, " "),
          `\u23F1\uFE0F${(((_a5 = this.creep) == null ? void 0 : _a5.ticksToLive) / 1500 * 100).toFixed(2)}%`.padEnd(8, " "),
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
      Memory.log.push([
        //
        // `<span style="color: yellowgreen; font-style: italic;">${this.creep?.name || this.parameters.name}</span>${TTL}`,
        `[${this.creep.room.name}] ${this.creep.name || this.parameters.name}${TTL}`,
        ...msg,
        ...I
      ]);
    }
    status(emoji) {
      var _a5;
      this.memory.statuses = ((_a5 = this.memory.statuses) != null ? _a5 : []).filter(({ e }) => e !== emoji);
      this.memory.statuses.push({ e: emoji, t: Game.time });
      this.memory.statuses = this.memory.statuses.sort(({ t: a }, { t: b }) => asc(a, b));
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
      var _a5, _b;
      const _room = (_b = (_a5 = this.creep) == null ? void 0 : _a5.room) != null ? _b : this.parameters.room;
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
        if (!hyphenation && rand(0, 100) > 80) {
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
    return new Array(rand(0, 100) > 20 ? 2 : 1).fill(null).map(generate).join(" ");
  }

  // lib/uc-first.js
  function UpperCaseFirst(string) {
    return string.replace(/(\w+)/g, (m, p1) => `${p1[0].toUpperCase()}${p1.slice(1).toLowerCase()}`);
  }

  // src/lib/creep/CalcCreepBody.js
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
    spawn(parameters = PropCreepParameters) {
      var _a5, _b;
      this.parameters = parameters;
      this.parameters.name = this.parameters.name || this.name();
      if (!this.parameters.name) {
        return false;
      }
      this.setCreep(Game.creeps[this.parameters.name]);
      if ((_a5 = this.creep) == null ? void 0 : _a5.spawning) {
        return false;
      }
      if (this.creep) {
        return true;
      }
      const spawn = this.find(_CreepSpawn.FIND_SPAWNS_ORDER_BY_ENERGY, { desc: true })[0];
      if (!spawn) {
        return false;
      }
      const body = CalcCreepBody(spawn.room.energyCapacityAvailable, this.parameters.bodyRatios);
      if (body.length === 0) {
        throw new Error(`body.length: ${body.length}`);
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
      }
      this.setCreep(Game.creeps[this.parameters.name]);
      if (!this.creep) {
        return false;
      }
      if ((_b = this.creep) == null ? void 0 : _b.spawning) {
        return false;
      }
      return true;
    }
    name() {
      let name;
      do {
        name = UpperCaseFirst(`${randName()} ${this.parameters.role.replace(/^Role/, "").replace(/[aeiouy]/gi, "")}`);
      } while (Game.creeps[name]);
      return name;
    }
  };

  // src/lib/creep/CreepJob.js
  var VPS = {
    fill: "transparent",
    stroke: "yellowgreen",
    lineStyle: "dashed",
    // strokeWidth: 0.15,
    // opacity: 0.1,
    strokeWidth: 0.05,
    opacity: 1
  };
  var _CreepJob = class _CreepJob extends CreepSpawn {
    constructor() {
      super(...arguments);
      __publicField(this, "dryRun", false);
    }
    job() {
      if (!this.creep) {
        console.log("=(");
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
            if (this.memory.job !== _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED) {
              const controller = this.find(CreepFind.FIND_ROOM_CONTROLLER);
              if (controller.ticksToDowngrade > CONTROLLER_DOWNGRADE[controller.level] * 0.5) {
                return false;
              }
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
          this.log(`> ${this.memory.job}`);
          return;
        } else {
          delete this.memory.job;
          this.status("\u{1F396}\uFE0F");
        }
      }
      if (!this.memory.job) {
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
      var _a5;
      if (!this.creep) {
        delete this.memory.attemptsHarvestSource;
        return false;
      }
      if (this.creep.store.getFreeCapacity(resourceType) === 0) {
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
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, { visualizePathStyle: VPS });
        !this.dryRun && this.status("\u{1F699}");
        if (distance(this.creep.pos, target.pos) <= _CreepJob.ATTEMPTS_HARVEST_DISTANCE) {
          this.memory.attemptsHarvestSource = ((_a5 = this.memory.attemptsHarvestSource) != null ? _a5 : 0) + 1;
        } else {
          delete this.memory.attemptsHarvestSource;
        }
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
      var _a5;
      if (!this.creep) {
        return false;
      }
      if (this.creep.store.getFreeCapacity(resourceType) === 0) {
        return false;
      }
      const target = (_a5 = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)) == null ? void 0 : _a5[0];
      if (!target) {
        return false;
      }
      const result = this.creep.pickup(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, { visualizePathStyle: VPS });
        !this.dryRun && this.status("\u{1F699}");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
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
        this.creep.moveTo(target, { visualizePathStyle: VPS });
        !this.dryRun && this.status("\u{1F699}");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
      }
      return true;
    }
    build() {
      if (!this.creep) {
        return false;
      }
      if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        return false;
      }
      const targets = sequence(
        this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE),
        [STRUCTURE_EXTENSION, STRUCTURE_ROAD],
        ({ structureType }) => structureType
      );
      const target = targets == null ? void 0 : targets[0];
      if (!target) {
        return false;
      }
      const result = this.creep.build(target);
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, { visualizePathStyle: VPS });
        !this.dryRun && this.status("\u{1F699}");
      } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
        this.log(this.memory.job, _CreepJob.RESULT_TO_TEXT[result]);
        !this.dryRun && this.status("\u{1F620}");
      } else if (result === OK) {
        !this.dryRun && this.status("\u2692\uFE0F");
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
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
        _CreepJob.BUILD
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
        _CreepJob.BUILD,
        _CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
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
        _CreepJob.BUILD
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
        body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 }
      };
    }
    static RoleBuilder() {
      return {
        role: "RoleBuilder",
        body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 }
      };
    }
    static RoleManager() {
      return {
        role: "RoleManager",
        body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 }
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
      var _a5, _b;
      if (this.creep.spawning) {
        return;
      }
      if (!this.job()) {
        if (((_b = (_a5 = this.memory) == null ? void 0 : _a5.statuses) == null ? void 0 : _b.length) > 0) {
          this.memory.statuses = this.memory.statuses.filter(({ t }) => t + 2 > Game.time);
          this.creep.say(this.memory.statuses.map(({ e }) => e).join(""));
        }
        return;
      }
    }
  };

  // src/index.js
  var _a;
  Memory.rooms = (_a = Memory.rooms) != null ? _a : {};
  var _a2;
  Memory.Roads = (_a2 = Memory.Roads) != null ? _a2 : {};
  var _a3;
  Memory.RoadsShow = (_a3 = Memory.RoadsShow) != null ? _a3 : false;
  var _a4;
  Memory.CreepsShow = (_a4 = Memory.CreepsShow) != null ? _a4 : false;
  function loop() {
    var _a5, _b, _c;
    Memory.log = [];
    {
      for (const name in Game.creeps) {
        delete Game.creeps[name].memory.jobs;
        delete Game.creeps[name].memory.body;
      }
    }
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      const ccbr = {};
      for (const role in config_default.Room.Creeps) {
        ccbr[role] = 0;
      }
      for (const name2 in Game.creeps) {
        const creep = Game.creeps[name2];
        if (creep.room === room) {
          if (creep.memory.role === "Worker") {
            creep.memory.role = "RoleWorker";
            creep.memory.jobs = CreepRole.RoleWorker().jobs;
          }
          ccbr[creep.memory.role] = ((_a5 = ccbr[creep.memory.role]) != null ? _a5 : 0) + 1;
        }
      }
      if (Memory.CreepsShow) {
        table([
          //
          ["", ...Object.keys(ccbr)],
          ["Current", ...Object.values(ccbr)],
          ["Need", ...Object.values(config_default.Room.Creeps)]
        ]);
      }
      {
        for (const role in config_default.Room.Creeps) {
          if (!ccbr[role] || ccbr[role] < config_default.Room.Creeps[role]) {
            Memory.log.push([
              //
              // `<span style="color: tomato;">&lt;loop()&gt;</span>`,
              `loop()`,
              `Next spawn ${role} in ${room.name}`
            ]);
            new Creep().spawn({ room, ...CreepRole[role]() });
            break;
          }
        }
      }
    }
    {
      for (const coords in Memory.Roads) {
        if (typeof Memory.Roads[coords] === "number") {
          delete Memory.Roads[coords];
          continue;
        }
        if (Memory.Roads[coords].rate >= 100) {
          const [x, y] = coords.split("x").map((v) => parseInt(v));
          const room = Game.rooms[Memory.Roads[coords].room];
          const result = room.createConstructionSite(x, y, STRUCTURE_ROAD);
          if (result === ERR_INVALID_TARGET) {
            delete Memory.Roads[coords];
          } else {
          }
          continue;
        }
        Memory.Roads[coords].rate = Math.max(0, Memory.Roads[coords].rate - 0.01);
        if (Memory.Roads[coords].rate === 0) {
          delete Memory.Roads[coords];
        }
      }
      if (Memory.RoadsShow) {
        const _entries = Object.entries(Memory.Roads);
        table([
          ..._entries.sort(([_1, { rate: a }], [_2, { rate: b }]) => desc(a, b)).map(([coords, { rate }]) => [coords, rate.toFixed(3)]).slice(0, 5),
          ["", ""],
          ["0-25%", _entries.filter(([coords, { rate }]) => rate >= 0 && rate < 25).length],
          ["25-50%", _entries.filter(([coords, { rate }]) => rate >= 25 && rate < 50).length],
          ["50-75%+", _entries.filter(([coords, { rate }]) => rate >= 50 && rate < 75).length],
          ["75-100%+", _entries.filter(([coords, { rate }]) => rate >= 75).length],
          ["Total", _entries.length]
        ]);
      }
    }
    {
      for (const name in Game.creeps) {
        {
          const creep = Game.creeps[name];
          const room = creep.room;
          const structures = room.lookAt(creep.pos).filter(({ type }) => type === "structure").map(({ structure: { structureType } }) => structureType);
          if (structures.length === 0) {
            const { x, y } = creep.pos;
            const coords = `${x}x${y}`;
            Memory.Roads[coords] = {
              //
              room: room.name,
              rate: Math.min(100, ((_c = (_b = Memory.Roads[coords]) == null ? void 0 : _b.rate) != null ? _c : 0) + 1),
              update: Date.now()
            };
          }
        }
        new Creep(Game.creeps[name]).live();
      }
    }
    {
      if (Memory.log.length > 0) {
        let time = `${(Game.time / 2 / 60 / 60 / 24).toFixed(4)}d`;
        const _table = [[`${Game.time} (${time})`]];
        for (const msg of Memory.log) {
          _table.push([...msg]);
        }
        table(_table);
      }
    }
  }
  eval(`module.exports.loop = ${loop.name};`);
})();
