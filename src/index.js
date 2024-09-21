import dump from "./lib/dump";

function _distance(startPoint, endPoint) {
    return (
        Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
    );
}

// Sources by distance
function SourcesByDistance(creep) {
    const sources = creep.room
        .find(FIND_SOURCES)
        .map((source) => ({
            origin: source,
            distance: _distance(creep.pos, source.pos),
        }))
        .sort(({ distance: a }, { distance: b }) => {
            return a === b ? 0 : a > b ? 1 : -1;
        })
        .map(({ origin }) => origin);

    return sources;
}

// Find a spawn with free capacity
function FindSpawnWithFreeCapacity(creep) {
    const spawns = creep.room
        .find(FIND_MY_SPAWNS)
        .map((spawn) => ({
            origin: spawn,
            free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        }))
        .filter(({ free }) => free > 0)
        .sort(({ free: a }, { free: b }) => (a === b ? 0 : a > b ? 1 : -1))
        .map(({ origin }) => origin);

    return spawns;
}

// Construction sites by distance
function ConstructionSitesByDistance(creep) {
    const constructionSites = creep.room
        .find(FIND_CONSTRUCTION_SITES)
        .map((constructionSite) => ({
            origin: constructionSite,
            distance: _distance(creep.pos, constructionSite.pos),
        }))
        .sort(({ distance: a }, { distance: b }) => {
            return a === b ? 0 : a > b ? 1 : -1;
        })
        .map(({ origin }) => origin);

    return constructionSites;
}

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
            spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester1", { memory: {} });
        }

        const creep = Game.creeps.Harvester1;

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
                    // To spawn
                    {
                        const spawn = FindSpawnWithFreeCapacity(creep)[0];
                        spawn && (creep.memory.transferId = spawn.id);
                    }

                    // To storage

                    // To construction
                    {
                        const constructionSite = ConstructionSitesByDistance(
                            creep
                        )[0];

                        constructionSite &&
                            (creep.memory.transferId = constructionSite.id);
                    }

                    // When nothing to transfer
                    // {
                    //     if (!creep.memory.transferId) {
                    //         creep.memory.transferId = spawns[0].id;
                    //     }
                    // }
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
                result !== OK &&
                    result !== ERR_NOT_IN_RANGE &&
                    creep.say(`T:${result}`);

                if (result === ERR_NOT_IN_RANGE) {
                    result = creep.moveTo(transfer);
                    result !== OK && creep.say(`M:${result}`);
                } else if (result === ERR_FULL) {
                    delete creep.memory.transferId;
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
