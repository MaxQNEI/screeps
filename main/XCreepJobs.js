const { ROLES } = require("./const");

class XCreepJobs {
    findJobByRole() {
        if (this.getJob()) {
            return;
        }

        if (this.role === ROLES.HARVESTER) {
            if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                this.setJob("harvest-energy");
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
                        this.setJob("transfer-spawn");
                        break;
                    } else if (construction) {
                        this.setJob("build-construction");
                        break;
                    }
                }
            }
        }
    }

    doJob() {
        if (!this.getJob()) {
            return false;
        }

        const jobMtdName = this.jobNameToMethod(this.getJob());

        if (!this[jobMtdName]) {
            console.log(
                `${
                    this.creep.name
                }: unknown job method "${jobMtdName}" (of "${this.getJob()}")`
            );

            return false;
        }

        return this[jobMtdName]();
    }

    JobHarvestEnergy() {
        if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            // Done
            this.setJob(null);
        } else {
            // Set source if need
            if (!this.creep.memory.sourceId) {
                // Find free
                const sourcesByDistance = this.creep.room
                    .find(FIND_SOURCES)
                    .map((source) => ({
                        source,
                        distance: this.distance(this.creep.pos, source.pos),
                    }))
                    .sort(({ distance: a }, { distance: b }) =>
                        a === b ? 0 : a > b ? 1 : -1
                    )
                    .map(({ source }) => source);

                for (const source of sourcesByDistance) {
                    const xSource = new XSource(source);

                    if (xSource.creeps().length < xSource.creepLimit()) {
                        this.creep.memory.sourceId = xSource.source.id;
                        break;
                    }
                }
            }

            if (this.creep.memory.sourceId) {
                const targetSource = Game.getObjectById(
                    this.creep.memory.sourceId
                );

                this.harvest(targetSource);
            }
        }
    }

    JobTransferSpawn() {}

    JobBuildConstruction() {}

    // Helpers
    jobNameToMethod(name) {
        return `Job-${name}`
            .split(/[^\da-z]/i)
            .map((piece, index) => {
                return `${piece[0].toUpperCase()}${piece
                    .slice(1)
                    .toLowerCase()}`;
            })
            .join("");
    }
}

module.exports = XCreepJobs;
