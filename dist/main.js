(() => {
  // src/index.js
  module.exports.loop = function loop() {
    {
      if (Object.keys(Game.spawns).length === 0) {
        return;
      }
    }
    {
      if (!Game.creeps.Harvester1) {
        const spawn = Object.values(Game.spawns)[0];
        spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester1");
      }
      const Harvester1 = Game.creeps.Harvester1;
      console.log(">", Harvester1);
    }
  }
})();
