(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // <define:Config>
  var define_Config_default = { Room: { Creeps: { AutoRespawnByTicksRemainingPercent: null, CountByRole: { RoleWorker: 3, RoleBuilder: 3, RoleManager: 3 } }, Roads: { RateToBuild: 100, RateUpByCreep: 1, RateDownByTick: 5e-3 } } };

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
      var _a;
      this.creep = creep;
      this.memory = (_a = this.creep) == null ? void 0 : _a.memory;
      return this;
    }
  };

  // src/lib/creep/CreepMessage.js
  var _CreepMessage = class _CreepMessage extends Props {
    log(...msg) {
      var _a;
      const TTL = "";
      const I = [];
      I.push(
        [
          //
          `\u23F1\uFE0F${(((_a = this.creep) == null ? void 0 : _a.ticksToLive) / CREEP_LIFE_TIME * 100).toFixed(2)}%`.padEnd(8, " "),
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
    status(emoji, stopShow = 3) {
      var _a;
      this.memory.statuses = ((_a = this.memory.statuses) != null ? _a : []).filter(({ emoji: emoji2 }) => emoji2 !== emoji2);
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
      var _a, _b;
      const _room = (_b = (_a = this.creep) == null ? void 0 : _a.room) != null ? _b : this.parameters.room;
      const _sort = parameters.desc ? desc : asc2;
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
          const spawn2 = Game.spawns[nameSpawn];
          if (spawn2.room === _room && spawn2.store[RESOURCE_ENERGY] >= parameters.cost) {
            return spawn2;
          }
        }
        return false;
      }
      if (findType === _CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY) {
        const spawns = _room.find(FIND_MY_SPAWNS).map((spawn2) => ({
          origin: spawn2,
          free: spawn2.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          distance: distance(this.creep.pos, spawn2.pos)
        })).filter(({ free }) => free > 0).sort(({ free: a }, { free: b }) => _sort(a, b)).map(({ origin }) => origin);
        return spawns;
      }
      if (findType === _CreepFind.FIND_SPAWNS_ORDER_BY_ENERGY) {
        const spawns = [];
        for (const nameSpawn in Game.spawns) {
          const spawn2 = Game.spawns[nameSpawn];
          if (spawn2.room === _room) {
            spawns.push({
              origin: spawn2,
              energy: spawn2.store.energy
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

  // src/lib/creep/CalculateCreepBody.js
  function CalculateCreepBody(energy = 300, ratios = { [WORK]: 1, [CARRY]: 0.5, [MOVE]: 0.1 }) {
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
            })).filter(({ count }) => count > 1).sort(({ ratio: a }, { ratio: b }) => asc2(a, b))[0].name;
            const _toRemoveIndex = result.indexOf(_toRemove);
            result = result.filter((name, index, array) => index !== _toRemoveIndex);
            _places = MAX_CREEP_SIZE - result.length;
          }
          break;
        }
        for (const _name of _available) {
          _ratios[_name] = ratios[_name];
        }
        const add2 = {};
        for (const name of _available) {
          add2[name] = Math.min(
            1,
            Math.floor(
              _energy / BODYPART_COST[name] * (_available.filter((_name) => _name !== name).reduce((pv, _name) => pv + _ratios[_name], 0) * 1e3 * _ratios[name]) / 1e3
            )
          );
        }
        if (Object.values(add2).filter((v) => v > 0).length === 0) {
          const higherRatio = Object.entries(add2).sort(([_1, a], [_2, b]) => desc(a, b))[0];
          const [name, _] = higherRatio;
          result.push(name);
        } else {
          for (const name in add2) {
            add2[name] > 0 && result.push(...new Array(add2[name]).fill(name));
          }
        }
      }
    }
    return result.sort(asc2);
  }

  // src/lib/creep/CreepSpawn.js
  var CreepSpawn = class _CreepSpawn extends CreepFind {
    spawn(parameters = PropCreepParameters) {
      var _a, _b;
      this.parameters = parameters;
      this.parameters.name = this.parameters.name || this.name();
      if (!this.parameters.name) {
        return false;
      }
      this.setCreep(Game.creeps[this.parameters.name]);
      if ((_a = this.creep) == null ? void 0 : _a.spawning) {
        return false;
      }
      if (this.creep) {
        return true;
      }
      const spawn2 = this.find(_CreepSpawn.FIND_SPAWNS_ORDER_BY_ENERGY, { desc: true })[0];
      if (!spawn2) {
        return false;
      }
      const body = CalculateCreepBody(spawn2.room.energyCapacityAvailable, this.parameters.bodyRatios);
      if (body.length === 0) {
        throw new Error(`body.length: ${body.length}`);
      }
      const result = spawn2.spawnCreep(body, this.parameters.name, {
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
          case _CreepJob.REPAIR_ROAD_NEAR_SOURCE:
            return this.repair("road-near-source");
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
      var _a;
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
      this.dryRun && this.creep.cancelOrder("harvest");
      if (result === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, { visualizePathStyle: VPS });
        this.dryRun && this.creep.cancelOrder("move");
        !this.dryRun && this.status("\u{1F699}");
        if (distance(this.creep.pos, target.pos) <= _CreepJob.ATTEMPTS_HARVEST_DISTANCE) {
          this.memory.attemptsHarvestSource = ((_a = this.memory.attemptsHarvestSource) != null ? _a : 0) + 1;
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
      var _a;
      if (this.creep.store.getFreeCapacity(resourceType) === 0) {
        return false;
      }
      const target = (_a = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)) == null ? void 0 : _a[0];
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
      if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        return false;
      }
      const targets = sequence(
        this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE),
        [STRUCTURE_EXTENSION, STRUCTURE_TOWER],
        // STRUCTURE_ROAD always end
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
            const radius = 1;
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
        this.creep.moveTo(target, { visualizePathStyle: VPS });
        !this.dryRun && this.status("\u{1F699}");
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
      var _a, _b;
      if (this.creep.spawning) {
        return;
      }
      if (!this.job()) {
        if (Memory.StatusesShow && ((_b = (_a = this.memory) == null ? void 0 : _a.statuses) == null ? void 0 : _b.length) > 0) {
          this.memory.statuses = this.memory.statuses.filter(({ stopShow }) => stopShow > Game.time);
          this.creep.say(this.memory.statuses.map(({ emoji }) => emoji).join(""));
        }
        return;
      }
    }
  };

  // src/lib/process/Live.js
  function Live() {
    for (const name in Game.creeps) {
      new Creep(Game.creeps[name]).live();
    }
  }

  // lib/table.js
  function table2(rows = []) {
    var _a, _b;
    const colsWidth = [];
    for (const row of rows) {
      for (let ci = 0; ci < row.length; ci++) {
        colsWidth[ci] = Math.max(colsWidth[ci] || 0, `${(_a = row[ci]) != null ? _a : ""}`.length);
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
    var _a;
    Memory.MemoryLogShow = (_a = Memory.MemoryLogShow) != null ? _a : true;
    if (Time === null) {
      Time = Game.time;
      Memory.log = [];
    } else {
      Time = null;
      if (Memory.MemoryLogShow && Memory.log.length > 0) {
        const _table = [["Memory.log[]"]];
        for (const msg of Memory.log) {
          _table.push([...msg]);
        }
        table2(_table);
      }
      Memory.log = [];
    }
  }

  // src/lib/process/Observe.js
  function Observe() {
    var _a, _b, _c, _d;
    Memory.NotiStack = (_a = Memory.NotiStack) != null ? _a : {};
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
    const percent = Math.floor(current / total * 100);
    const p_x10 = Math.floor(percent / 10);
    return { current, total, percent, p_x10 };
  }

  // src/lib/room/Room.js
  var {
    Room: {
      Creeps: {
        CountByRole: CBR,
        AutoRespawnByTicksRemainingPercent: ARBTRP
        //
      }
    }
  } = define_Config_default;
  function Room2() {
    for (const name in Game.rooms) {
      spawn(Game.rooms[name]);
    }
  }
  function spawn(room) {
    var _a;
    const CCCBR = {};
    for (const role in CBR) {
      CCCBR[role] = 0;
    }
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.room === room) {
        CCCBR[creep.memory.role] = ((_a = CCCBR[creep.memory.role]) != null ? _a : 0) + 1;
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
      let reason = "";
      if (!next && ARBTRP > 0) {
        const nextByTimeList = [];
        for (const name in Game.creeps) {
          const creep = Game.creeps[name];
          if (creep.spawning) {
            continue;
          }
          const remaining = creep.ticksToLive / CREEP_LIFE_TIME * 100;
          if (remaining < define_Config_default.AutoRespawnByTicksRemainingPercent) {
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
      if (!next) {
        for (const role in CBR) {
          if (!CCCBR[role] || CCCBR[role] < CBR[role]) {
            next = { room, ...CreepRole[role]() };
            reason = `The count of creeps is less than needed.`;
            break;
          }
        }
      }
      if (next) {
        Memory.log.push([`loop()`, `Next spawn ${next.role} in ${next.room.name}`]);
        reason && Memory.log.push(["", `Reason: ${reason}`], []);
        new Creep().spawn({ room: next.room, ...CreepRole[next.role]() });
      }
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
  function ProceduralRoads() {
    var _a, _b;
    Memory.RoadsShow = (_a = Memory.RoadsShow) != null ? _a : false;
    Memory.Roads = (_b = Memory.Roads) != null ? _b : {};
    calculate();
    add();
    log();
  }
  function calculate() {
    for (const coords in Memory.Roads) {
      if (Memory.Roads[coords].rate >= RateToBuild) {
        const [x, y] = coords.split("x").map((v) => parseInt(v));
        build(x, y);
        continue;
      }
      Memory.Roads[coords].rate = Math.max(0, Memory.Roads[coords].rate - RateDownByTick);
      if (Memory.Roads[coords].rate === 0) {
        delete Memory.Roads[coords];
      }
    }
  }
  function add() {
    var _a, _b;
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
      const key = `${x}x${y}`;
      Memory.Roads[key] = {
        // Room name
        room: room.name,
        // Rate to build
        rate: Math.min(RateToBuild, ((_b = (_a = Memory.Roads[key]) == null ? void 0 : _a.rate) != null ? _b : RateDownByTick) + RateUpByCreep),
        // Last rate update
        update: Date.now()
      };
    }
  }
  function log() {
    if (!Memory.RoadsShow) {
      return;
    }
    const _entries = Object.entries(Memory.Roads);
    table2([
      ..._entries.sort(([_1, { rate: a }], [_2, { rate: b }]) => desc(a, b)).map(([coords, { rate }]) => [coords, rate.toFixed(3)]).slice(0, 5),
      ["", ""],
      ["0-25%", _entries.filter(([coords, { rate }]) => rate >= 0 && rate < 25).length],
      ["25-50%", _entries.filter(([coords, { rate }]) => rate >= 25 && rate < 50).length],
      ["50-75%+", _entries.filter(([coords, { rate }]) => rate >= 50 && rate < 75).length],
      ["75-100%+", _entries.filter(([coords, { rate }]) => rate >= 75).length],
      ["Total", _entries.length]
    ]);
  }
  function build(x, y) {
    const key = `${x}x${y}`;
    const room = Game.rooms[Memory.Roads[key].room];
    const result = room.createConstructionSite(x, y, STRUCTURE_ROAD);
    if (result === ERR_INVALID_TARGET) {
      delete Memory.Roads[key];
    }
  }

  // src/index.js
  function loop() {
    MemoryLog();
    Observe();
    Room2();
    ProceduralRoads();
    Live();
    MemoryLog();
  }
  eval(`module.exports.loop = ${loop.name};`);
})();
