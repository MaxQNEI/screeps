import randOf from "../../../lib/rand-of";
import sequence from "../../../lib/sort";
import distance from "../distance";
import CreepFind from "./CreepFind";
import CreepSpawn from "./CreepSpawn";

const VPS = {
  fill: "transparent",
  stroke: "yellowgreen",
  lineStyle: "dashed",
  // strokeWidth: 0.15,
  // opacity: 0.1,

  strokeWidth: 0.05,
  opacity: 1,
};

export default class CreepJob extends CreepSpawn {
  static BUILD = "BUILD";
  static HARVEST_ENERGY = "HARVEST_ENERGY";
  static PICKUP_ENERGY = "PICKUP_ENERGY";
  static REPAIR_ROAD_NEAR_SOURCE = "REPAIR_ROAD_NEAR_SOURCE";
  static TRANSFER_ENERGY_TO_CONTROLLER = "TRANSFER_ENERGY_TO_CONTROLLER";
  static TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED = "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED";
  static TRANSFER_ENERGY_TO_EXTENSION = "TRANSFER_ENERGY_TO_EXTENSION";
  static TRANSFER_ENERGY_TO_SPAWN = "TRANSFER_ENERGY_TO_SPAWN";

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
  };

  dryRun = false;

  job() {
    if (!this.creep) {
      console.log("=(");
      return false;
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

        case CreepJob.TRANSFER_ENERGY_TO_CONTROLLER:
          return this.transfer("controller", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_EXTENSION:
          return this.transfer("extension", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_SPAWN:
          return this.transfer("spawn", RESOURCE_ENERGY, "*");

        case CreepJob.REPAIR_ROAD_NEAR_SOURCE:
          return this.repair("road-near-source");
      }
    };

    if (this.memory.job) {
      const result = _do(this.memory.job);

      if (result) {
        // Continue...
        this.log(`> ${this.memory.job}`);
        return;
      } else {
        delete this.memory.job;
        this.status("🎖️");
      }
    }

    if (!this.memory.job) {
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

    // Full
    if (this.creep.store.getFreeCapacity(resourceType) === 0) {
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
      this.creep.moveTo(target, { visualizePathStyle: VPS });

      this.dryRun && this.creep.cancelOrder("move");
      !this.dryRun && this.status("🚙");

      if (distance(this.creep.pos, target.pos) <= CreepJob.ATTEMPTS_HARVEST_DISTANCE) {
        this.memory.attemptsHarvestSource = (this.memory.attemptsHarvestSource ?? 0) + 1;
      } else {
        delete this.memory.attemptsHarvestSource;
      }
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
      return false;
    }

    const target = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)?.[0];

    // BREAK if target not found
    if (!target) {
      return false;
    }

    const result = this.creep.pickup(target);

    if (result === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target, { visualizePathStyle: VPS });
      !this.dryRun && this.status("🚙");
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("⚒️");
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

    // BREAK if target not found
    if (!target) {
      return false;
    }

    const result = this.creep.transfer(target, resourceType, amount !== "*" ? amount : null);

    if (result === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target, { visualizePathStyle: VPS });
      !this.dryRun && this.status("🚙");
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
      return false;
    }

    const targets = sequence(
      this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE),
      [STRUCTURE_EXTENSION, STRUCTURE_TOWER], // STRUCTURE_ROAD always end
      ({ structureType }) => structureType,
    );

    const target = targets?.[0];

    // BREAK if target not found
    if (!target) {
      return false;
    }

    const result = this.creep.build(target);

    if (result === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target, { visualizePathStyle: VPS });
      !this.dryRun && this.status("🚙");
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

          const radius = 1;
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
      this.creep.moveTo(target, { visualizePathStyle: VPS });
      !this.dryRun && this.status("🚙");
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RESULT_TO_TEXT[result]);
      !this.dryRun && this.status("😠");
    } else if (result === OK) {
      !this.dryRun && this.status("🧰");
    }

    return true;
  }
}
