(() => {
  // src/roles/Harvester1.js
  function Harvester1(name) {
    if (!Game.creeps[name]) {
      const spawn = Object.values(Game.spawns)[0];
      spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester1", { memory: {} });
    }
    const creep = Game.creeps[name];
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
          const sources = SourcesByDistance(creep);
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
        delete creep.memory.job;
      } else {
        if (!creep.memory.transferId) {
          {
            const spawn = FindSpawnWithFreeCapacity(creep)[0];
            spawn && (creep.memory.transferId = spawn.id);
          }
        }
        if (!creep.memory.transferId) {
          creep.say(":( #1");
          return;
        }
        const transfer = Game.getObjectById(creep.memory.transferId);
        if (!transfer) {
          creep.say(":( #2");
          return;
        }
        let result;
        result = creep.transfer(transfer, RESOURCE_ENERGY);
        result !== OK && result !== ERR_NOT_IN_RANGE && creep.say(`T:${result}`);
        if (result === ERR_NOT_IN_RANGE) {
          result = creep.moveTo(transfer);
          result !== OK && creep.say(`M:${result}`);
        } else if (result === ERR_FULL) {
          delete creep.memory.transferId;
        }
      }
    }
  }

  // src/index.js
  module.exports.loop = function loop() {
    {
      if (Object.keys(Game.spawns).length === 0) {
        return;
      }
    }
    {
      Harvester1("Harvester1");
      Harvester1("Harvester2");
    }
  }
})();
