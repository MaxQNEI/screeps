const { LIMITS } = require("const");
const ControllerCreep = require("controller.creep");
const { SourceCreepLimit } = require("room");

const Creeps = {};

for (const role in LIMITS) {
    for (let i = 0; i < LIMITS[role]; i++) {
        const number =
            Object.values(Creeps).filter((creep) => creep.role === role)
                .length + 1;

        Creeps[`${role}${number}`] = { role };
    }
}

module.exports.loop = function () {
    // Creep limit per source
    SourceCreepLimit();

    // Spawn
    for (const name in Creeps) {
        const { role } = Creeps[name];
        ControllerCreep(name).spawn(role);
    }

    // Work
    for (const name in Game.creeps) {
        ControllerCreep(name).work();
    }
};
