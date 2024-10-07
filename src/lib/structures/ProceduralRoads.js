const {
  Room: {
    Roads: {
      RateToBuild,
      RateUpByCreep,
      RateDownByTick, //
    },
  },
} = Config;

const FLOAT_FIX = RateDownByTick.toString().replace(/^\d+\./, "").length;

export default function ProceduralRoads() {
  // Init & Assign
  Memory.Roads =
    Memory.Roads ??
    {
      // [Room.name]: {
      //   [coords]: 55.99
      // },
    };

  calculate();
  add();
}

function calculate() {
  let canBuild = Object.keys(Game.constructionSites).length < MAX_CONSTRUCTION_SITES;

  // Every roads
  for (const roomName in Memory.Roads) {
    for (const keyCoords in Memory.Roads[roomName]) {
      // When rate 100+ - create road construction site
      if (Memory.Roads[roomName][keyCoords] >= RateToBuild) {
        if (!canBuild) {
          continue;
        }

        // Build
        build(Game.rooms[roomName], keyCoords);

        canBuild = Object.keys(Game.constructionSites).length < MAX_CONSTRUCTION_SITES;

        // Next
        continue;
      }

      // Decrease rate
      Memory.Roads[roomName][keyCoords] = parseFloat(
        (Memory.Roads[roomName][keyCoords] - RateDownByTick).toFixed(FLOAT_FIX),
      );

      // Delete when rate is zero
      if (Memory.Roads[roomName][keyCoords] <= 0) {
        delete Memory.Roads[roomName][keyCoords];
      }
    }
  }
}

function add() {
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
    const keyCoords = `${x}x${y}`;

    // Create memory piece
    Memory.Roads[room.name] = Memory.Roads[room.name] ?? {};

    // Rate to build
    const rate = Math.min(RateToBuild, (Memory.Roads[room.name][keyCoords] ?? RateDownByTick) + RateUpByCreep);

    // Save
    Memory.Roads[room.name][keyCoords] = rate;
  }
}

function build(room, keyCoords) {
  // Parse keyCoords
  const [x, y] = keyCoords.split("x").map((v) => parseInt(v));

  // Create road construction site
  const result = room.createConstructionSite(x, y, STRUCTURE_ROAD);

  // Delete when impossible
  if (result === ERR_INVALID_TARGET) {
    delete Memory.Roads[room.name][keyCoords];
  }
}
