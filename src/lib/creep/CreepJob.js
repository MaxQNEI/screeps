import randOf from "../../../lib/rand-of";
import { sequence } from "../../../lib/sort";
import Config from "../../config.js";
import distance from "../distance";
import CreepFind from "./CreepFind";
import CreepMove from "./CreepMove.js";

const COORDS_RADIUS_1 = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export default class CreepJob extends CreepMove {
  static BUILD = "BUILD";
  static HARVEST_ENERGY = "HARVEST_ENERGY";
  static PICKUP_ENERGY = "PICKUP_ENERGY";
  static REPAIR_ROAD_NEAR_SOURCE = "REPAIR_ROAD_NEAR_SOURCE";
  static TRANSFER_ENERGY_TO_CONTROLLER = "TRANSFER_ENERGY_TO_CONTROLLER";
  static TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED = "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED";
  static TRANSFER_ENERGY_TO_EXTENSION = "TRANSFER_ENERGY_TO_EXTENSION";
  static TRANSFER_ENERGY_TO_SPAWN = "TRANSFER_ENERGY_TO_SPAWN";
  static TRANSFER_ENERGY_TO_TOWER = "TRANSFER_ENERGY_TO_TOWER";
  static TRANSFER_ENERGY_TO_TOWER_IF_NEEDED = "TRANSFER_ENERGY_TO_TOWER_IF_NEEDED";

  static RESULT_TO_TEXT = {
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
    [ERR_GCL_NOT_ENOUGH]: "GCL_NOT_ENOUGH",
  };

  static ATTEMPTS_HARVEST_DISTANCE = 8; // distance()
  static ATTEMPTS_HARVEST_LIMIT = 20;

  static ROLE_TO_JOB = {
    RoleWorker: [
      [
        //
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,

        CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        CreepJob.TRANSFER_ENERGY_TO_TOWER,

        CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        CreepJob.BUILD,

        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
      ],
      [
        //
        CreepJob.PICKUP_ENERGY,
        CreepJob.HARVEST_ENERGY,
      ],
    ],

    RoleBuilder: [
      [
        //
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,

        CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        CreepJob.BUILD,

        CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        CreepJob.TRANSFER_ENERGY_TO_EXTENSION,

        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
      ],
      [
        //
        CreepJob.PICKUP_ENERGY,
        CreepJob.HARVEST_ENERGY,
      ],
    ],

    RoleManager: [
      [
        //
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,

        CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        CreepJob.TRANSFER_ENERGY_TO_EXTENSION,

        CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        CreepJob.BUILD,
      ],

      [
        //
        CreepJob.PICKUP_ENERGY,
        CreepJob.HARVEST_ENERGY,
      ],
    ],

    RoleTower: [
      [
        //
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,

        CreepJob.TRANSFER_ENERGY_TO_TOWER,
        CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        CreepJob.TRANSFER_ENERGY_TO_EXTENSION,

        CreepJob.REPAIR_ROAD_NEAR_SOURCE,
        CreepJob.BUILD,

        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
      ],

      [
        //
        CreepJob.PICKUP_ENERGY,
        CreepJob.HARVEST_ENERGY,
      ],
    ],
  };

  dryRun = false;

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
        case CreepJob.HARVEST_ENERGY:
          return this.harvest(RESOURCE_ENERGY);

        case CreepJob.PICKUP_ENERGY:
          return this.pickup(RESOURCE_ENERGY);

        case CreepJob.BUILD:
          return this.build();

        case CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED:
          if (this.memory.job !== CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED) {
            const controller = this.find(CreepFind.FIND_ROOM_CONTROLLER);

            if (controller.ticksToDowngrade > CONTROLLER_DOWNGRADE[controller.level] * 0.5) {
              return false;
            }
          }

          return this.transfer("controller", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_TOWER_IF_NEEDED:
          const towers = this.find(CreepFind.FIND_TOWER_WITH_FREE_CAPACITY)
            .filter(({ energy }) => energy < Config.Room.Towers.MinRequiredEnergy)
            .sort(({ energy: a }, { energy: b }) => asc(a, b));

          if (towers.length === 0) {
            return false;
          }

          return this.transfer("tower", RESOURCE_ENERGY, "*", towers);

        case CreepJob.TRANSFER_ENERGY_TO_CONTROLLER:
          return this.transfer("controller", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_EXTENSION:
          return this.transfer("extension", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_SPAWN:
          return this.transfer("spawn", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_TOWER:
          return this.transfer("tower", RESOURCE_ENERGY, "*");

        case CreepJob.REPAIR_ROAD_NEAR_SOURCE:
          return this.repair("road-near-source");
      }
    };

    if (this.memory.job) {
      const result = _do(this.memory.job);

      if (result) {
        // Continue...
        let add = [];
        if (this.memory.job === CreepJob.BUILD && this.memory.myBuildId) {
          const target = Game.getObjectById(this.memory.myBuildId);

          if (target) {
            add.push(
              `: ${target.structureType.toUpperCase()}: ${target.progress} of ${target.progressTotal} (${((target.progress / target.progressTotal) * 100).toFixed(2)}%) (${target.pos.x}x${target.pos.y})`,
            );
          }
        }

        this.log(`> ${this.memory.job}${add.join(" ")}`);
        return;
      } else {
        delete this.memory.job;
        this.status("🎖️");
      }
    }

    while (!this.memory.job) {
      let jobGroupIndex = -1;
      for (const subJobs of CreepJob.ROLE_TO_JOB[this.memory.role]) {
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
          this.status("☀️");

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
    // BREAK if creep not exists
    if (!this.creep) {
      delete this.memory.attemptsHarvestSource;
      return false;
    }

    const free = this.creep.store.getFreeCapacity(resourceType);
    const used = this.creep.store.getUsedCapacity(resourceType);
    const total = this.creep.store.getCapacity(resourceType);

    // Full
    if (free === 0) {
      delete this.memory.attemptsHarvestSource;
      return false;
    }

    let target;

    // When not available (by other creep)
    if (this.memory.mySourceId && this.memory.attemptsHarvestSource >= CreepJob.ATTEMPTS_HARVEST_LIMIT) {
      target = randOf(
        this.find(CreepFind.FIND_SOURCES_BY_DISTANCE).filter((source) => source.id !== this.memory.mySourceId),
      );

      this.memory.mySourceId = target.id;

      this.memory.attemptsHarvestSource = 0;
    }

    // Find target
    if (!this.memory.mySourceId) {
      target = this.find(CreepFind.FIND_SOURCES_BY_DISTANCE)[0];
      this.memory.mySourceId = target.id;
    } else {
      target = Game.getObjectById(this.memory.mySourceId);
    }

    // BREAK if source not found
    if (!target) {
      return false;
    }

    const result = this.creep.harvest(target, resourceType);
    this.dryRun && this.creep.cancelOrder("harvest");

    if (result === ERR_NOT_IN_RANGE) {
      this.move(target);
      this.dryRun && this.creep.cancelOrder("move");

      if (distance(this.creep.pos, target.pos) <= CreepJob.ATTEMPTS_HARVEST_DISTANCE) {
        this.memory.attemptsHarvestSource = (this.memory.attemptsHarvestSource ?? 0) + 1;
      } else {
        delete this.memory.attemptsHarvestSource;
      }
    } else if (result === ERR_NOT_ENOUGH_EXTENSIONS) {
      !this.dryRun && this.status("🪹");
      this.move(target);
      this.dryRun && this.creep.cancelOrder("move");
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("⚒️");
      delete this.memory.attemptsHarvestSource;
    }

    return true;
  }

  pickup(resourceType = RESOURCE_ENERGY) {
    if (this.creep.store.getFreeCapacity(resourceType) === 0) {
      delete this.memory.myPickupId;
      delete this.memory.myPickupMemKey;
      return false;
    }

    let isNewTarget = false;
    let target;

    if (!this.memory.myPickupId) {
      target = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)?.[0];
      isNewTarget = true;
    } else {
      target = Game.getObjectById(this.memory.myPickupId);
    }

    // BREAK if target not found
    if (!target) {
      delete this.memory.myPickupId;
      delete this.memory.myPickupMemKey;
      return false;
    }

    // Assign available seat
    if (isNewTarget) {
      Memory.DroppedResources = Memory.DroppedResources ?? {};
      Memory.DroppedResources.Energy = Memory.DroppedResources.Energy ?? {};
      const mdre = Memory.DroppedResources.Energy;

      const { x, y } = target.pos;
      const memkey = `${x}x${y}`;
      mdre[memkey] = mdre[memkey] ?? { capacity: target.amount };

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

    // Pickup when available
    const result = this.creep.pickup(target);

    if (result === ERR_NOT_IN_RANGE) {
      this.move(target);
      this.dryRun && this.creep.cancelOrder("move");
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("⚒️");
    }

    return true;
  }

  transfer(to = "spawn", resourceType = RESOURCE_ENERGY, amount = 100, targets = []) {
    if (this.creep.store.getUsedCapacity(resourceType) === 0) {
      delete this.memory.myTransferId;
      return false;
    }

    let target;

    if (!this.memory.myTransferId) {
      target =
        targets.length > 0
          ? targets[0]
          : {
              controller: () => this.find(CreepFind.FIND_ROOM_CONTROLLER),
              extension: () => this.find(CreepFind.FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY)[0],
              spawn: () => this.find(CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY)[0],
              tower: () => this.find(CreepFind.FIND_TOWER_WITH_FREE_CAPACITY)[0],
            }[to]?.();

      if (target?.id) {
        this.memory.myTransferId = target.id;
      }
    } else {
      target = Game.getObjectById(this.memory.myTransferId);
    }

    // BREAK if target not found
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
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("⚒️");
    }

    return true;
  }

  build() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      delete this.memory.myBuildId;
      return false;
    }

    let target;
    if (!this.memory.myBuildId) {
      const targets = sequence(
        this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE),
        [STRUCTURE_EXTENSION, STRUCTURE_TOWER], // STRUCTURE_ROAD always end
        ({ structureType }) => structureType,
      );

      if (!targets[0]) {
        return false;
      }

      // When only road - build nearest source (if exists)
      const isRoadsOnly = !targets.some(({ structureType }) => structureType !== STRUCTURE_ROAD);

      const roadsNearSource =
        isRoadsOnly &&
        targets.filter(({ pos }) => {
          for (const [x, y] of COORDS_RADIUS_1) {
            const result = this.creep.room.lookForAt(LOOK_SOURCES, pos.x + x, pos.y + y);

            if (result.length > 0) {
              return true;
            }
          }

          return false;
        });

      target = roadsNearSource?.[0] ?? targets[0];

      this.memory.myBuildId = target.id;
    } else {
      target = Game.getObjectById(this.memory.myBuildId);
    }

    // BREAK if target not found
    if (!target) {
      delete this.memory.myBuildId;
      return false;
    }

    const result = this.creep.build(target);

    if (result === ERR_NOT_IN_RANGE) {
      this.move(target);
      this.dryRun && this.creep.cancelOrder("move");
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("⚒️");
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

                const road = this.creep.room
                  .lookAt(x, y)
                  .filter(({ structure }) => {
                    if (structure?.structureType !== STRUCTURE_ROAD) {
                      return false;
                    }
                  })
                  .map(({ structure }) => {
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

    // BREAK if target not found
    if (!target) {
      return false;
    }

    const result = this.creep.repair(target);

    if (result === ERR_NOT_IN_RANGE) {
      this.move(target);
      this.dryRun && this.creep.cancelOrder("move");
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("🧰");
    }

    return true;
  }
}
