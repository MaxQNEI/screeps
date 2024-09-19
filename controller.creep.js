const { CREEP_ROLES } = require("const");
const Harvester = require("role.harvester");
const Upgrader = require("role.upgrader");

module.exports = function Creep(name) {
    const role2fn = {
        //
        Harvester,
        Upgrader,
    };

    let creep = Game.creeps[name];

    return {
        spawn: (role = "Harvester") => {
            if (!creep) {
                const spawn = Object.values(Game.spawns)[0];

                if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) < 200) {
                    return false;
                }

                const spawnResult = spawn.spawnCreep(CREEP_ROLES[role], name, {
                    memory: { role },
                    // energyStructures: [],
                    dryRun: false,
                    // directions: [
                    //     TOP,
                    //     TOP_RIGHT,
                    //     RIGHT,
                    //     BOTTOM_RIGHT,
                    //     BOTTOM,
                    //     BOTTOM_LEFT,
                    //     LEFT,
                    //     TOP_LEFT,
                    // ],
                });

                if (spawnResult !== 0) {
                    return false;
                }

                creep = Game.creeps[name];
            } else {
                // console.log(`[WARN] creep already exists: ${creep.name}`)
            }

            return true;
        },

        work: () => {
            if (!creep) {
                return false;
            }

            if (!creep.memory.role) {
                console.log(`[${creep.name}] .memory.role!`, creep.memory.role);
                return false;
            }

            if (!role2fn[creep.memory.role]) {
                console.log(`[${creep.name}] role2fn!`, creep.memory.role);
                return false;
            }

            // Work
            return role2fn[creep.memory.role](creep.name).work();
        },
    };
};
