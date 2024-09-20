(() => {
  // src/index.js
  function creepSourcesByDistance(creep) {
    const sources = creep.room.find(FIND_SOURCES).map((source) => ({
      source,
      distance: _distance(creep.pos, source.pos)
    })).sort(({ distance: a }, { distance: b }) => {
      return a === b ? 0 : a > b ? 1 : -1;
    }).map((source) => source);
    function _distance(startPoint, endPoint) {
      return Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2);
    }
    return sources;
  }
  console.log(`Load`);
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
      const creep = Game.creeps.Harvester1;
      if (!creep.memory.job) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
          if (!creep.memory.source) {
            const sources = creepSourcesByDistance(creep);
            creep.memory.source = sources[0];
          }
          if (!creep.memory.source) {
            creep.say(":(");
            return;
          }
          console.log(JSON.stringify(creep.memory.source));
          if (creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
            creep.move(creep.memory.source);
          }
        }
      }
    }
  }
})();
