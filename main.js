const ControllerCreep = require("controller.creep");

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

let FirstMessage = false;

module.exports.loop = function () {
    if (!FirstMessage) {
        console.log(`Game.rooms:`, Object.keys(Game.rooms));
        FirstMessage = true;
    }

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
