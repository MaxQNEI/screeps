const offsets = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

module.exports.SourceCreepLimit = function SourceCreepLimit() {
    const rooms = [];

    for (const name in Game.creeps) {
        const room = Game.creeps[name].room;
        !rooms.includes(room) && rooms.push(room);
    }

    for (const room of rooms) {
        const SOURCE_CREEP_LIMIT = (room.memory.SOURCE_CREEP_LIMIT = []);

        const sources = room.find(FIND_SOURCES);

        for (const source of sources) {
            const { x, y } = source.pos;

            let limit = 0;

            {
                for (const [dx, dy] of offsets) {
                    const look = room.lookAt(dx + x, dy + y);

                    const good = look.some(({ type, terrain }) => {
                        if (
                            type === "terrain" &&
                            (terrain === "plain" || terrain === "swamp")
                        ) {
                            return true;
                        } else if (type === "creep") {
                            return true;
                        }

                        return false;
                    });

                    limit += good + 0;
                }
            }

            SOURCE_CREEP_LIMIT.push({
                source,
                limit,
                // creeps: 0,
            });

            // console.log(
            //     `Room ${room.name} -> Source(${x}x${y}) :> CreepLimit: ${limit}`
            // );
        }
    }
};
