import { asc } from "../../../lib/sort";
import CreepFind, { FIND_SPAWN_TO_SPAWN_CREEP_BY_COST } from "./CreepFind";

export default class CreepSpawn extends CreepFind {
    spawn() {
        this.creep = Game.creeps[this.options.name];

        if (this.creep) {
            return true;
        }

        const cost = this.options.body.reduce(
            (pv, cv) => pv + BODYPART_COST[cv],
            0
        );

        const spawn = this.find(FIND_SPAWN_TO_SPAWN_CREEP_BY_COST, { cost });

        if (!spawn) {
            return false;
        }

        spawn.spawnCreep(this.options.body.sort(asc), this.options.name);

        this.creep = Game.creeps[this.options.name];

        return true;
    }
}
