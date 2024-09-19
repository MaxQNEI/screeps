const XCreep = require("creep");

const CreepsCount = {
    Harvester: 1,
    Upgrader: 1,
};

const Creeps = {};

for (const role in CreepsCount) {
    for (let i = 0; i < CreepsCount[role]; i++) {
        const number =
            Object.values(Creeps).filter((creep) => creep.role === role)
                .length + 1;

        Creeps[`${role}${number}`] = { role };
    }
}

module.exports.loop = function () {
    // Spawn
    for (const name in Creeps) {
        const { role } = Creeps[name];
        XCreep(name).spawn(role);
    }

    // Work
    for (const name in Game.creeps) {
        XCreep(name).work();
    }
};
