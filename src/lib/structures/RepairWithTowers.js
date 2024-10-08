import { asc, sequence } from "../../../lib/sort.js";

const {
  Room: {
    Towers: { MinEnergyDefence },
  },
} = Config;

let WaitRepair = false;
export default function RepairWithTowers() {
  if (WaitRepair) {
    if (Game.time % 60 !== 0) {
      return;
    }
  }

  for (const name in Game.rooms) {
    const towers = [];
    const repairs = [];

    const structures = Game.rooms[name].find(FIND_STRUCTURES);

    for (const structure of structures) {
      if (!structure.my && structure.structureType !== STRUCTURE_ROAD) {
        continue;
      }

      if (structure.structureType === STRUCTURE_TOWER) {
        const energy = structure.store.energy;

        if (energy > 0 && energy >= MinEnergyDefence) {
          towers.push(structure);
        }
      }

      if (structure.hits < structure.hitsMax) {
        repairs.push(structure);
      }
    }

    if (repairs.length > 0) {
      const repair = sequence(
        repairs.sort(({ hits: a }, { hits: b }) => asc(a, b)),
        [STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_SPAWN],
      )[0];

      for (const tower of towers) {
        tower.repair(repair);
      }

      WaitRepair = false;
    } else {
      WaitRepair = true;
    }
  }
}
