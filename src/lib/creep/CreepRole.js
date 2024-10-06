import CreepJob from "./CreepJob";

export default class CreepRole extends CreepJob {
  static RoleWorker() {
    return {
      role: "RoleWorker",
      body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 10 },
    };
  }

  static RoleBuilder() {
    return {
      role: "RoleBuilder",
      body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 10 },
    };
  }

  static RoleManager() {
    return {
      role: "RoleManager",
      body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 10 },
    };
  }

  static RoleTower() {
    return {
      role: "RoleTower",
      body: { [WORK]: 100, [CARRY]: 20, [MOVE]: 1 },
    };
  }
}
