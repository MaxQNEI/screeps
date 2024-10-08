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
    const towers2repair = [];
    const hostiles = [];
    const repairs = [];

    const structures = Game.rooms[roomName].find(FIND_STRUCTURES);

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

          const hostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

          if (hostile) {
            hostiles.push(hostile);
          } else if (energy >= MinEnergyRepair) {
            towers2repair.push(structure);
          }
        }
      }

      if (hostiles.length === 0) {
        if (structure.hits < structure.hitsMax) {
          repairs.push(structure);
        }
      }
    }

    if (hostiles.length > 0) {
      attack(towers2attack, hostiles);
    } else if (repairs.length > 0) {
      repair(towers2repair, repairs);
    }
  }
}

function attack(towers = [], hostiles = []) {
  for (const tower of towers) {
    tower.repair(hostiles[0]);
  }
}

function repair(towers = [], repairs = []) {
  const repairsSorted = sequence(
    repairs.sort(({ hits: a }, { hits: b }) => asc(a, b)),
    [STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_SPAWN],
  );

  for (const tower of towers) {
    tower.repair(repairsSorted[0]);
  }
}
