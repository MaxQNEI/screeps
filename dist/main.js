(() => {
  // src/index.js
  function creepSourcesByDistance(creep) {
    const sources = creep.room.find(FIND_SOURCES).map((source) => ({
      origin: source,
      distance: _distance(creep.pos, source.pos)
    })).sort(({ distance: a }, { distance: b }) => {
      return a === b ? 0 : a > b ? 1 : -1;
    }).map(({ origin }) => origin);
    function _distance(startPoint, endPoint) {
      return Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2);
    }
    return sources;
  }
  console.log("".padStart(80, "="));
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
          creep.memory.job = "harvest-energy";
        } else {
          delete creep.memory.sourceId;
          creep.memory.job = "transfer-energy";
        }
      } else if (creep.memory.job === "harvest-energy") {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
          delete creep.memory.sourceId;
          creep.memory.job = "transfer-energy";
        } else {
          if (!creep.memory.sourceId) {
            const sources = creepSourcesByDistance(creep);
            creep.memory.sourceId = sources[0].id;
          }
          if (!creep.memory.sourceId) {
            creep.say(":( #1");
            return;
          }
          const source = Game.getObjectById(creep.memory.sourceId);
          if (!source) {
            creep.say(":( #2");
            return;
          }
          let result;
          result = creep.harvest(source);
          result !== OK && creep.say(`H:${result}`);
          if (result === ERR_NOT_IN_RANGE) {
            result = creep.moveTo(source);
            result !== OK && creep.say(`M:${result}`);
          }
        }
      } else if (creep.memory.job === "transfer-energy") {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
          delete creep.memory.spawnId;
          creep.memory.job = "transfer-energy";
        } else {
          if (!creep.memory.spawnId) {
            const spawns = creep.room.find(FIND_MY_SPAWNS);
            for (const spawn2 of spawns) {
              if (spawn2.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                creep.memory.spawnId = spawn2.id;
                break;
              }
            }
            if (!creep.memory.spawnId) {
              creep.memory.spawnId = spawns[0].id;
            }
          }
          if (!creep.memory.spawnId) {
            creep.say(":( #1");
            return;
          }
          const spawn = Game.getObjectById(creep.memory.spawnId);
          if (!spawn) {
            creep.say(":( #2");
            return;
          }
          let result;
          result = creep.transfer(spawn, RESOURCE_ENERGY);
          result !== OK && creep.say(`T:${result}`);
          if (result === ERR_NOT_IN_RANGE) {
            result = creep.moveTo(spawn);
            result !== OK && creep.say(`M:${result}`);
          }
        }
      }
    }
  }
})();
