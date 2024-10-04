import { desc } from "../../../lib/sort.js";
import table from "../../../lib/table.js";

export default class ProceduralRoads {
  static RATE_UP = 1;
  static RATE_DOWN = 0.005;
  static RATE_BUILD = 100;

  run() {
    // Init & Assign
    Memory.RoadsShow = Memory.RoadsShow ?? false;
    Memory.Roads = Memory.Roads ?? {};

    this.calculate();
    this.add();
    this.log();
  }

  calculate() {
    // Every roads
    for (const coords in Memory.Roads) {
      // When rate 100+ - create road construction site
      if (Memory.Roads[coords].rate >= ProceduralRoads.RATE_BUILD) {
        // Parse coords from road key
        const [x, y] = coords.split("x").map((v) => parseInt(v));

        // Build
        this.build(x, y);

        // Skip
        continue;
      }

      // Decrease rate
      Memory.Roads[coords].rate = Math.max(0, Memory.Roads[coords].rate - ProceduralRoads.RATE_DOWN);

      // Delete when rate is zero
      if (Memory.Roads[coords].rate === 0) {
        delete Memory.Roads[coords];
      }
    }
  }

  add() {
    // Every creep
    for (const name in Game.creeps) {
      // Assign
      const creep = Game.creeps[name];

      // Skip when creep is spawning
      if (creep.spawning) {
        continue;
      }

      // Creep room
      const room = creep.room;

      // Creep coords
      const { x, y } = creep.pos;

      // Structures by creep coordinates
      const structures = room
        .lookAt({ x, y })
        .filter(({ type }) => type === "structure")
        .map(({ structure: { structureType } }) => structureType);

      // Skip when structures exists
      if (structures.length > 0) {
        continue;
      }

      // Road key
      const key = `${x}x${y}`;

      // Save
      Memory.Roads[key] = {
        // Room name
        room: room.name,
        // Rate to build
        rate: Math.min(
          ProceduralRoads.RATE_BUILD,
          (Memory.Roads[key]?.rate ?? ProceduralRoads.RATE_DOWN) + ProceduralRoads.RATE_UP,
        ),
        // Last rate update
        update: Date.now(),
      };
    }
  }

  log() {
    if (!Memory.RoadsShow) {
      return;
    }

    const _entries = Object.entries(Memory.Roads);

    table([
      ..._entries
        // sort by update time
        // .sort(([_1, { update: a }], [_2, { update: b }]) => desc(a, b))
        // sort by rate
        .sort(([_1, { rate: a }], [_2, { rate: b }]) => desc(a, b))
        .map(([coords, { rate }]) => [coords, rate.toFixed(3)])
        .slice(0, 5),

      ["", ""],

      ["0-25%", _entries.filter(([coords, { rate }]) => rate >= 0 && rate < 25).length],
      ["25-50%", _entries.filter(([coords, { rate }]) => rate >= 25 && rate < 50).length],
      ["50-75%+", _entries.filter(([coords, { rate }]) => rate >= 50 && rate < 75).length],
      ["75-100%+", _entries.filter(([coords, { rate }]) => rate >= 75).length],
      ["Total", _entries.length],
    ]);
  }

  build(x, y) {
    const key = `${x}x${y}`;

    // Road room
    const room = Game.rooms[Memory.Roads[key].room];

    // Create road construction site
    const result = room.createConstructionSite(x, y, STRUCTURE_ROAD);

    // Delete when impossible
    if (result === ERR_INVALID_TARGET) {
      delete Memory.Roads[key];
    }
  }
}
