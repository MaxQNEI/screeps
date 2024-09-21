import dump from "./lib/dump";
import Harvester1 from "./roles/Harvester1";

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
        .sort(({ distance: a }, { distance: b }) =>
            a === b ? 0 : a > b ? 1 : -1
        )
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
        .sort(({ distance: a }, { distance: b }) =>
            a === b ? 0 : a > b ? 1 : -1
        )
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

    // Harvester's
    {
        Harvester1("Harvester1");
        Harvester1("Harvester2");
    }

    // {
    //     if (!Game.creeps.Upgrader1) {
    //         const spawn = Object.values(Game.spawns)[0];
    //         spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader1");
    //     }
    // }
}
