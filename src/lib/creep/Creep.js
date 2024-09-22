import CreepSpawn from "./CreepSpawn";

export default class Creep extends CreepSpawn {
    constructor(options = this.options) {
        super();

        this.creep = Game.creeps[options.name];
        this.options = options;
    }

    live() {
        for (const mtd of ["spawn"]) {
            if (!this[mtd]()) {
                console.log(`[${this.options.name}] ${mtd}()`);
                return false;
            }
        }
    }
}
