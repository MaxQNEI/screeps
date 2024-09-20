(() => {
  // src/lib/dump.js
  function dump() {
    const out = [];
    out.push("Dump {");
    for (const arg of arguments) {
      _(arg, 1);
    }
    function _(arg, tab = 0, key = null) {
      const spaces = "".padStart(tab * 2, " ");
      key = key ? `"${key}": ` : "";
      const prefix = `${spaces}${key}`;
      if (arg === null) {
        out.push(`${prefix}NULL`);
      } else if (arg === void 0) {
        out.push(`${prefix}UNDEFINED`);
      } else if (typeof arg === "boolean") {
        out.push(`${prefix}${arg ? "TRUE" : "FALSE"}`);
      } else if (typeof arg === "string") {
        out.push(`${prefix}"${arg}"`);
      } else if (typeof arg === "number") {
        out.push(`${prefix}${arg}`);
      } else if (typeof arg === "function") {
        out.push(
          `${prefix}${arg.prototype ? `${arg.name || "<function>"}()` : "() => {}"}`
        );
      } else if (Array.isArray(arg)) {
        out.push(`${prefix}<array(${arg.length})>`);
        for (const v of arg) {
          _(v, tab + 1);
        }
      } else if (typeof arg === "object") {
        out.push(
          `${prefix}<object>${Object.keys(arg).length === 0 ? " [empty]" : ""}`
        );
        for (const k in arg) {
          _(arg[k], tab + 1, k);
        }
      } else {
        out.push(`${prefix}<type "${typeof arg}">`);
      }
    }
    out.push("}");
    console.log(out.join("\n"));
  }

  // src/index.js
  function creepSourcesByDistance(creep) {
    const sources = creep.room.find(FIND_SOURCES).map((source) => ({
      source,
      distance: _distance(creep.pos, source.pos)
    })).sort(({ distance: a }, { distance: b }) => {
      return a === b ? 0 : a > b ? 1 : -1;
    }).map(({ source }) => source);
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
          creep.say(`H:${result = creep.harvest(source)}`);
          if (result === ERR_NOT_IN_RANGE) {
            creep.say(`M:${result = creep.move(source)}`);
          } else if (result === ERR_INVALID_ARGS) {
            dump(source);
          }
        }
      }
    }
  }
})();
