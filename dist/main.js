(() => {
  // src/index.js
  function Unit(name = "Bunny", opts = { body: [] }) {
    console.log(`Unit("${name}")`);
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
      console.log("Cost...");
      const cost = opts.body.reduce((pv, cv) => pv + BODYPART_COST[cv], 0);
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
    for (const name in Game.rooms) {
      const room2 = Game.rooms[name];
      Unit("Universal", {
        room: room2,
        body: [WORK, CARRY, MOVE]
      });
    }
  }
})();
