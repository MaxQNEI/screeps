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
                if (!creep.memory.source) {
                    const sources = creep.room.find(FIND_SOURCES);
                    console.log(JSON.stringify(sources));
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
