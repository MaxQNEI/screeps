(() => {
  // src/index.js
  console.log("v0.0.0.10");
  var CASES = {
    HARVEST_TO_SPAWN: {
      body: {
        [WORK]: 1,
        [CARRY]: 10,
        [MOVE]: 10
      }
    },
    HARVEST_TO_BUILD: {
      body: {
        [WORK]: 1,
        [CARRY]: 10,
        [MOVE]: 10
      }
    },
    BUILD_THE_NEAREST: {
      body: {
        [WORK]: 1,
        [CARRY]: 10,
        [MOVE]: 10
      }
    }
  };
  function Unit(name = "Bunny", room, cases = []) {
    if (!Game.creeps[name]) {
      let spawnsInRoom = [];
      let spawnMaxEnergy = 0;
      for (const name2 in Game.spawns) {
        const spawn2 = Game.spawns[name2];
        if (spawn2.room === room) {
          const structure = spawn2;
          const energyUsed = spawn2.store.getUsedCapacity(RESOURCE_ENERGY);
          const energyCapacity = spawn2.store.getCapacity(RESOURCE_ENERGY);
          spawnMaxEnergy = Math.max(spawnMaxEnergy, energyCapacity);
          spawnsInRoom.push({ structure, energyUsed, energyCapacity });
        }
      }
      const body = [];
      for (const _case of cases) {
      }
      if (!spawn) {
        return;
      }
      spawn.spawnCreep();
      return;
    }
    if (Game.creeps[name].spawning) {
      return;
    }
  }
  function loop() {
    return;
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      Unit("Universal", room, [
        CASES.HARVEST_TO_SPAWN,
        CASES.HARVEST_TO_BUILD,
        CASES.BUILD_THE_NEAREST
      ]);
    }
  }
})();
