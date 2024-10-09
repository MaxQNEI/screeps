import { asc, sequence } from "../../../lib/sort.js";

const {
  Room: {
    Towers: { MinEnergyRepair },
  },
} = Config;

export default function Towers() {
  // find all towers with energy
  // find all repairs
  for (const roomName in Game.rooms) {
    const towers2attack = [];
    const towers2heal = [];
    const towers2repair = [];
    const hostiles = [];
    const healing = [];
    const repairs = [];

    const creeps = Game.rooms[roomName].find(FIND_MY_CREEPS);
    const structures = Game.rooms[roomName].find(FIND_STRUCTURES);

    for (const creep of creeps) {
      if (creep.hits < creep.hitsMax) {
        healing.push(creep);
      }
    }

    for (const structure of structures) {
      // When not my but it's road
      if (!structure.my && structure.structureType !== STRUCTURE_ROAD) {
        continue;
      }

      // When structure is tower
      if (structure.structureType === STRUCTURE_TOWER) {
        const energy = structure.store.energy;

        if (energy > 0) {
          towers2attack.push(structure);
          towers2heal.push(structure);

          const hostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

          if (hostile) {
            hostiles.push(hostile);
          } else if (energy >= MinEnergyRepair) {
            towers2repair.push(structure);
          }
        }
      }

      if (hostiles.length === 0) {
        if (structure.hits < structure.hitsMax && structure.hits < structure.hitsMax - 500) {
          repairs.push(structure);
        }
      }
    }

    if (towers2attack.length > 0 && hostiles.length > 0) {
      attack(towers2attack, hostiles);
    } else if (towers2heal.length > 0 && healing.length > 0) {
      heal(towers2attack, healing);
    } else if (towers2repair.length > 0 && repairs.length > 0) {
      repair(towers2repair, repairs);
    }
  }
}

function attack(towers = [], hostiles = []) {
  const h = hostiles[0];

  for (const tower of towers) {
    tower.attack(h);

    Memory.log.push([`[${tower.room.name}] attacks ${h.name} (${h.owner})`]);
  }
}

function heal(towers = [], healing = []) {
  const h = healing[0];

  for (const tower of towers) {
    tower.heal(h);

    Memory.log.push([
      `[${tower.room.name}] healing ${h.name} ${h.hits} of ${h.hitsMax} (${((h.hits / h.hitsMax) * 100).toFixed(2)})`,
    ]);
  }
}

function repair(towers = [], repairs = []) {
  const repairsSorted = sequence(
    repairs.sort(({ hits: a }, { hits: b }) => asc(a, b)),
    [STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_SPAWN],
  );

  for (const tower of towers) {
    const r = repairsSorted[0];

    tower.repair(r);

    Memory.log.push([
      `[${tower.room.name}] Tower "${tower.id}"`,
      `REPAIR ${r.structureType} (${r.pos.x}x${r.pos.x})`,
      `${r.hits} of ${r.hitsMax} (${((r.hits / r.hitsMax) * 100).toFixed(2)}%)`,
    ]);
  }
}
