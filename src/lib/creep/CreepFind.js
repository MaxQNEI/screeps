import { asc } from "../../../lib/sort";
import distance from "../distance";
import CreepProps from "./CreepProps";

export const FIND_CONSTRUCTION_SITES_BY_DISTANCE =
    "FIND_CONSTRUCTION_SITES_BY_DISTANCE";

export const FIND_SOURCES_BY_DISTANCE = "FIND_SOURCES_BY_DISTANCE";

export const FIND_SPAWN_WITH_FREE_CAPACITY = "FIND_SPAWN_WITH_FREE_CAPACITY";

export const FIND_SPAWN_TO_SPAWN_CREEP_BY_COST =
    "FIND_SPAWN_TO_SPAWN_CREEP_BY_COST";

export default class CreepFind extends CreepProps {
    find(findType = FIND_SPAWN_WITH_FREE_CAPACITY, options = { cost: 0 }) {
        const _room = this.creep?.room ?? this.options.room;

        if (findType === FIND_SPAWN_WITH_FREE_CAPACITY) {
            const spawns = _room
                .find(FIND_MY_SPAWNS)
                .map((spawn) => ({
                    origin: spawn,
                    free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
                }))
                .filter(({ free }) => free > 0)
                .sort(({ free: a }, { free: b }) => asc(a, b))
                .map(({ origin }) => origin);

            return spawns;
        }

        if (findType === FIND_SOURCES_BY_DISTANCE) {
            const sources = _room
                .find(FIND_SOURCES)
                .map((source) => ({
                    origin: source,
                    distance: distance(this.creep.pos, source.pos),
                }))
                .sort(({ distance: a }, { distance: b }) =>
                    a === b ? 0 : a > b ? 1 : -1
                )
                .map(({ origin }) => origin);

            return sources;
        }

        if (findType === FIND_CONSTRUCTION_SITES_BY_DISTANCE) {
            const constructionSites = _room
                .find(FIND_CONSTRUCTION_SITES)
                .map((constructionSite) => ({
                    origin: constructionSite,
                    distance: distance(this.creep.pos, constructionSite.pos),
                }))
                .sort(({ distance: a }, { distance: b }) =>
                    a === b ? 0 : a > b ? 1 : -1
                )
                .map(({ origin }) => origin);

            return constructionSites;
        }

        if (findType === FIND_SPAWN_TO_SPAWN_CREEP_BY_COST) {
            for (const nameSpawn in Game.spawns) {
                const spawn = Game.spawns[nameSpawn];

                if (
                    spawn.room === _room &&
                    spawn.store[RESOURCE_ENERGY] >= options.cost
                ) {
                    return spawn;
                }
            }

            return false;
        }
    }
}
