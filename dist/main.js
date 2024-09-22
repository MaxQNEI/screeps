(() => {
  // src/index.js
  function Unit(unit = { name: "Bunny", room: Room, body: [] }) {
    console.log(`Unit: ${unit.name}`);
    if (!Game.creeps[unit.name]) {
      let spawnsInRoom = [];
      let spawnMaxEnergy = 0;
      for (const name in Game.spawns) {
        const spawn2 = Game.spawns[name];
        if (spawn2.room === unit.room) {
          const structure = spawn2;
          const energyUsed = spawn2.store.getUsedCapacity(RESOURCE_ENERGY);
          const energyCapacity = spawn2.store.getCapacity(RESOURCE_ENERGY);
          spawnMaxEnergy = Math.max(spawnMaxEnergy, energyCapacity);
          spawnsInRoom.push({ structure, energyUsed, energyCapacity });
        }
      }
      console.log("Cost...");
      const cost = unit.body.reduce((pv, cv) => pv + BODYPART_COST[cv], 0);
      console.log("Cost", cost);
      return;
      if (!spawn) {
        return;
      }
      spawn.spawnCreep();
      return;
    }
    if (Game.creeps[unit.name].spawning) {
      return;
    }
  }
  module.exports.loop = function loop() {
    for (const name in Game.rooms) {
      Unit({
        name: "Universal",
        room: Game.rooms[name],
        body: [WORK, CARRY, MOVE]
      });
    }
  }
})();
