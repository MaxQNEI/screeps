const { ROLES } = require("./const");
const XRoom = require("./XRoom");
const XSource = require("./XSource");

class XCreep {
    creep = null;
    room = null;
    body = null;
    role = null;
    job = null;

    constructor(room, role, body, job) {
        this.room = room;
        this.role = role;
        this.body = body;
        this.job = job;

        return this;
    }

    use(creep) {
        this.creep = creep;

        this.room = this.creep.room;
        this.role = this.creep.memory.role;
        this.body = this.creep.body.map(({ type }) => type);
        this.job = this.creep.memory.job;

        return this;
    }

    useByName(name) {
        if (!Game.creeps[name]) {
            return null;
        }

        this.use(Game.creeps[name]);

        return this;
    }

    spawn() {
        const spawn = this.getAvailableSpawn();

        if (!spawn) {
            return;
        }

        this.room.memory.iterators = this.room.memory.iterators || {};
        const i = this.room.memory.iterators;
        i[this.role] = i[this.role] || 0;
        i[this.role]++;

        // "Harvester1"
        const name = `${this.role}${i[this.role]}`;

        const result = spawn.spawnCreep(this.body, name, {
            memory: {
                //
                born: Date.now(),
                role: this.role,
                job: this.job,
            },
        });

        return result;
    }

    getAvailableSpawn() {
        const name = `SpawnTest-${Date.now().toString(36)}`;
        const opts = { dryRun: true };

        const xRoom = new XRoom(this.room);

        let spawn = null;
        for (const _spawn of xRoom.spawns()) {
            if (_spawn.spawnCreep(this.body, name, opts) === OK) {
                spawn = _spawn;
                break;
            }
        }

        return spawn;
    }

    work() {
        if (this.role === ROLES.HARVESTER) {
            // Get job
            if (!this.job) {
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    this.job = "harvest-energy";
                } else {
                    const xRoom = new XRoom(this.creep.room);

                    // Find spawn free capacity
                    const objects = [
                        ...xRoom.spawns().map((spawn) => ({ spawn })),

                        ...xRoom
                            .constructions()
                            .map((construction) => ({ construction })),
                    ];

                    for (const { type, spawn, construction } of objects) {
                        if (
                            spawn &&
                            spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        ) {
                            this.job = "transfer-spawn";
                            break;
                        } else if (construction) {
                            this.job = "build-construction";
                            break;
                        }
                    }
                }
            }

            if (this.job === "harvest-energy") {
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    // Done
                    this.job = null;
                } else {
                    // Set source if need
                    if (!this.creep.memory.sourceId) {
                        // Find free
                        const sourcesByDistance = this.creep.room
                            .find(FIND_SOURCES)
                            .map((source) => ({
                                source,
                                distance: this.distance(
                                    this.creep.pos,
                                    source.pos
                                ),
                            }))
                            .sort(({ distance: a }, { distance: b }) =>
                                a === b ? 0 : a > b ? 1 : -1
                            )
                            .map(({ source }) => source);

                        for (const source of sourcesByDistance) {
                            const xSource = new XSource(source);

                            if (
                                xSource.creeps().length < xSource.creepLimit()
                            ) {
                                this.creep.memory.sourceId = xSource.source.id;
                                break;
                            }
                        }
                    }

                    if (this.creep.memory.sourceId) {
                        this.harvest(
                            Game.getObjectById(this.creep.memory.sourceId)
                        );
                    }
                }
            }
        }

        return this;
    }

    distance(point1, point2) {
        return (
            Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
        );
    }

    move(to) {
        const path = this.creep.pos.findPathTo(to);
        this.creep.move(path.direction);
    }

    harvest(to) {
        if (this.creep.harvest(to) === ERR_NOT_IN_RANGE) {
            this.move(to);
        }
    }

    build(to) {
        if (this.creep.build(to) === ERR_NOT_IN_RANGE) {
            this.move(to);
        }
    }

    upgradeController(to) {
        if (this.creep.upgradeController(to) === ERR_NOT_IN_RANGE) {
            this.move(to);
        }
    }

    save() {
        this.creep.memory.job = this.job;
    }
}

module.exports = XCreep;
