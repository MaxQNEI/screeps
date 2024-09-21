const CASES = {
    HARVEST_TO_SPAWN: {
        body: {
            [WORK]: 1,
            [CARRY]: 10,
            [MOVE]: 10,
        },
    },

    HARVEST_TO_BUILD: {
        body: {
            [WORK]: 1,
            [CARRY]: 10,
            [MOVE]: 10,
        },
    },

    BUILD_THE_NEAREST: {
        body: {
            [WORK]: 1,
            [CARRY]: 10,
            [MOVE]: 10,
        },
    },
};

function Unit(name = "Bunny", room, cases = []) {
    // const BODYPART_COST = {
    //     tough: 10, // TOUGH
    //     carry: 50, // CARRY
    //     move: 50, // MOVE
    //     attack: 80, // ATTACK
    //     work: 100, // WORK
    //     ranged_attack: 150, // RANGED_ATTACK
    //     heal: 250, // HEAL
    //     claim: 600, // CLAIM
    // };

    // Spawn if not exists
    if (!Game.creeps[name]) {
        // Find spawn
        let spawnsInRoom = [];
        let spawnMaxEnergy = 0;
        for (const name in Game.spawns) {
            const spawn = Game.spawns[name];

            if (spawn.room === room) {
                const structure = spawn;
                const energyUsed = spawn.store.getUsedCapacity(RESOURCE_ENERGY);
                const energyCapacity = spawn.store.getCapacity(RESOURCE_ENERGY);

                spawnMaxEnergy = Math.max(spawnMaxEnergy, energyCapacity);

                spawnsInRoom.push({ structure, energyUsed, energyCapacity });
            }
        }

        // Spawn not exists
        if (!spawn) {
            return;
        }

        spawn.spawnCreep();

        // Done
        return;
    }

    // Break if spawning
    if (Game.creeps[name].spawning) {
        // Done
        return;
    }
}

async function Msg(data) {
    return fetch("http://localhost:8484/msg", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.text())
        .catch(({ message }) => ({ error: message }))
        .then((result) => console.log("Fetch:", JSON.stringify(result)));
}

Msg(1);

export default function loop() {
    // Every room
    for (const name in Game.rooms) {
        const room = Game.rooms[name];

        // create universal unit
        Unit("Universal", room, [
            CASES.HARVEST_TO_SPAWN,
            CASES.HARVEST_TO_BUILD,
            CASES.BUILD_THE_NEAREST,
        ]);
    }
}
