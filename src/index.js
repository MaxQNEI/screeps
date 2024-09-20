import dump from "./lib/dump";

function creepSourcesByDistance(creep) {
    const sources = creep.room
        .find(FIND_SOURCES)
        .map((source) => ({
            source,
            distance: _distance(creep.pos, source.pos),
        }))
        .sort(({ distance: a }, { distance: b }) => {
            return a === b ? 0 : a > b ? 1 : -1;
        })
        .map(({ source }) => source);

    function _distance(startPoint, endPoint) {
        return (
            Math.pow(endPoint.x - startPoint.x, 2) +
            Math.pow(endPoint.y - startPoint.y, 2)
        );
    }

    return sources;
}

console.log("".padStart(80, "="));

export default function loop() {
    // Spawn exists?
    {
        if (Object.keys(Game.spawns).length === 0) {
            return; // break
        }
    }

    // Harvester
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

                creep.say(`H:${(result = creep.harvest(source))}`);

                if (result === ERR_NOT_IN_RANGE) {
                    console.log(typeof source, source);
                    creep.say(`M:${(result = creep.move(source))}`);
                }
            }
        }
    }

    // {
    //     if (!Game.creeps.Upgrader1) {
    //         const spawn = Object.values(Game.spawns)[0];
    //         spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader1");
    //     }
    // }
}
