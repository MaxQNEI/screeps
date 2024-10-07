import { asc, sequence } from "../../../lib/sort.js";

export default function RepairWithTowers() {
  for (const name in Game.rooms) {
    const towers = [];
    const repairs = [];

    const structures = Game.rooms[name].find(FIND_STRUCTURES);

    for (const structure of structures) {
      if (!structure.my && structure.structureType !== STRUCTURE_ROAD) {
        continue;
      }

      if (structure.structureType === STRUCTURE_TOWER) {
        if (structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
          towers.push(structure);
        }
      }

      if (structure.hits < structure.hitsMax) {
        repairs.push(structure);
      }
    }

    if (repairs.length > 0) {
      for (const repair of sequence(
        repairs.sort(({ hits: a }, { hits: b }) => asc(a, b)),
        [STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_SPAWN],
      )) {
        for (const tower of towers) {
          tower.repair(repair);
        }
      }
    }
  }
}
