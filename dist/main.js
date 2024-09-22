(() => {
  // src/index.js
  function Unit(unit = { name: "Bunny", room: Room, body: [] }) {
    console.log(`Unit("${name}")`);
    if (!Game.creeps[name]) {
      let spawnsInRoom = [];
      let spawnMaxEnergy = 0;
      for (const name2 in Game.spawns) {
        const spawn2 = Game.spawns[name2];
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
    if (Game.creeps[name].spawning) {
      return;
    }
  }
  module.exports.loop = function loop() {
    for (const name2 in Game.rooms) {
      Unit({
        name: "Universal",
        room: Game.rooms[name2],
        body: [WORK, CARRY, MOVE]
      });
    }
  }
})();
