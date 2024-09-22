(() => {
  // lib/sort.js
  function asc(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  // src/lib/unit.js
  function Unit(unit = { name: "Bunny", room: Room, body: [] }) {
    console.log(`Unit: ${unit.name}`);
    if (!Game.creeps[unit.name]) {
      console.log("Cost...");
      const cost = unit.body.reduce((pv, cv) => pv + BODYPART_COST[cv], 0);
      console.log("Cost", cost);
      let spawnsInRoom = [];
      let spawnMaxEnergy = 0;
      for (const nameSpawn in Game.spawns) {
        const spawn2 = Game.spawns[nameSpawn];
        const structure = spawn2;
        const energyUsed = spawn2.store.getUsedCapacity(RESOURCE_ENERGY);
        const energyCapacity = spawn2.store.getCapacity(RESOURCE_ENERGY);
        if (spawn2.room === unit.room && energyUsed >= cost) {
          spawnMaxEnergy = Math.max(spawnMaxEnergy, energyCapacity);
          spawnsInRoom.push({ structure, energyUsed, energyCapacity });
        }
      }
      const spawn = spawnsInRoom?.[0]?.structure;
      if (!spawn) {
        return;
      }
      console.log(unit.body.sort(asc));
      return;
    }
    if (Game.creeps[unit.name].spawning) {
      return;
    }
  }

  // src/index.js
  module.exports.loop = function loop() {
    for (const nameRoom in Game.rooms) {
      Unit({
        name: "Universal",
        room: Game.rooms[nameRoom],
        body: [WORK, CARRY, MOVE]
      });
    }
  }
})();
