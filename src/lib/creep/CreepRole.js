import CreepJob from "./CreepJob";

export default class CreepRole extends CreepJob {
  static RoleWorker() {
    return {
      role: "RoleWorker",
      body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 },
    };
  }

  static RoleBuilder() {
    return {
      role: "RoleBuilder",
      body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 },
    };
  }

  static RoleManager() {
    return {
      role: "RoleManager",
      body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 },
    };
  }
}
