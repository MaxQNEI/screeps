import CreepJob from "./CreepJob";

export default class CreepRole extends CreepJob {
  static RoleWorker() {
    return {
      role: "RoleWorker",
      body: { [WORK]: 1, [CARRY]: 0.5, [MOVE]: 0.2 },
      jobs: [
        [
          //
          CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
          CreepJob.TRANSFER_ENERGY_TO_SPAWN,
          CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
          CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
          CreepJob.BUILD,
        ],
        [
          //
          CreepJob.PICKUP_ENERGY,
          CreepJob.HARVEST_ENERGY,
        ],
      ],
    };
  }

  static RoleBuilder() {
    return {
      role: "RoleBuilder",
      body: { [WORK]: 1, [CARRY]: 0.5, [MOVE]: 0.1 },
      jobs: [
        [
          //
          CreepJob.BUILD,
          CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
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
    };
  }

  static RoleManager() {
    return {
      role: "RoleManager",
      body: { [WORK]: 1, [CARRY]: 0.5, [MOVE]: 0.5 },
      jobs: [
        [
          //
          CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
          CreepJob.TRANSFER_ENERGY_TO_SPAWN,
          CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
          CreepJob.BUILD,
        ],

        [
          //
          CreepJob.PICKUP_ENERGY,
          CreepJob.HARVEST_ENERGY,
        ],
      ],
    };
  }
}
