import CreepFind from "./CreepFind";
import CreepSpawn from "./CreepSpawn";

export default class CreepJob extends CreepSpawn {
  static BUILD = "BUILD";
  static HARVEST_ENERGY = "HARVEST_ENERGY";
  static PICKUP_ENERGY = "PICKUP_ENERGY";
  static TRANSFER_ENERGY_TO_CONTROLLER = "TRANSFER_ENERGY_TO_CONTROLLER";
  static TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED = "TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED";
  static TRANSFER_ENERGY_TO_EXTENSION = "TRANSFER_ENERGY_TO_EXTENSION";
  static TRANSFER_ENERGY_TO_SPAWN = "TRANSFER_ENERGY_TO_SPAWN";

  static RES2SAY = {
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

  job() {
    if (!this.creep) {
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
          const controller = this.find(CreepFind.FIND_ROOM_CONTROLLER);

          if (controller.ticksToDowngrade > CONTROLLER_DOWNGRADE[controller.level] * 0.7) {
            return false;
          }

          return this.transfer("controller", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_CONTROLLER:
          return this.transfer("controller", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_EXTENSION:
          return this.transfer("extension", RESOURCE_ENERGY, "*");

        case CreepJob.TRANSFER_ENERGY_TO_SPAWN:
          return this.transfer("spawn", RESOURCE_ENERGY, "*");
      }
    };

    if (this.memory.job) {
      const result = _do(this.memory.job);

      if (result) {
        // Continue...

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
    // BREAK if creep not exists
    if (!this.creep) {
      return false;
    }

    if (this.creep.store.getFreeCapacity(resourceType) === 0) {
      return false;
    }

    const target = this.find(CreepFind.FIND_SOURCES_BY_DISTANCE)?.[0];

    // BREAK if source not found
    if (!target) {
      return false;
    }

    // this.orders.push("harvest");
    const result = this.creep.harvest(target, resourceType);

    if (result === ERR_NOT_IN_RANGE) {
      // this.orders.push("moveTo");
      this.creep.moveTo(target);
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RES2SAY[result]);
    }

    return true;
  }

  pickup(resourceType = RESOURCE_ENERGY) {
    // BREAK if creep not exists
    if (!this.creep) {
      return false;
    }

    if (this.creep.store.getFreeCapacity(resourceType) === 0) {
      return false;
    }

    const target = this.find(CreepFind.FIND_NEAR_DROPPED_RESOURCES)?.[0];

    // BREAK if resource not found
    if (!target) {
      return false;
    }

    // this.orders.push("pickup");
    const result = this.creep.pickup(target);

    if (result === ERR_NOT_IN_RANGE) {
      // this.orders.push("moveTo");
      this.creep.moveTo(target);
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RES2SAY[result]);
    }

    return true;
  }

  transfer(to = "spawn", resourceType = RESOURCE_ENERGY, amount = 100) {
    // BREAK if creep not exists
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

    // BREAK if resource not found
    if (!target) {
      return false;
    }

    // this.orders.push("transfer");
    const result = this.creep.transfer(target, resourceType, amount !== "*" ? amount : null);

    if (result === ERR_NOT_IN_RANGE) {
      // this.orders.push("moveTo");
      this.creep.moveTo(target);
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RES2SAY[result]);
    }

    return true;
  }

  build() {
    // BREAK if creep not exists
    if (!this.creep) {
      return false;
    }

    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      return false;
    }

    const target = this.find(CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE)?.[0];

    // BREAK if resource not found
    if (!target) {
      return false;
    }

    // this.orders.push("build");
    const result = this.creep.build(target);

    if (result === ERR_NOT_IN_RANGE) {
      // this.orders.push("moveTo");
      this.creep.moveTo(target);
    } else if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      this.log(this.memory.job, CreepJob.RES2SAY[result]);
    }

    return true;
  }
}
