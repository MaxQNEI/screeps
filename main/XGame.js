const { ROLES, BODIES } = require("./const");
const XCreep = require("./XCreep");
const XRoom = require("./XRoom");
const XSource = require("./XSource");

class XGame {
    creeplist = {};

    // For-each
    rooms(fn) {
        for (const roomName in Game.rooms) {
            fn && fn(Game.rooms[roomName]);
        }
    }

    spawns(fn) {
        const spawnslist = [];

        for (const spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName];
            fn && fn(spawn);
            spawnslist.push(spawn);
        }

        return spawnslist;
    }

    sources(fn) {
        this.rooms((room) => {
            for (const source of room.find(FIND_SOURCES)) {
                fn && fn(source, room);
            }
        });
    }

    creeps(fn) {
        // Remove deleted
        for (const creepName in this.creeplist) {
            if (!Game.creeps[creepName]) {
                delete this.creeplist[creepName];
            }
        }

        // Add exists
        for (const creepName in Game.creeps) {
            if (!this.creeplist[creepName]) {
                this.creeplist[creepName] = new XCreep().use(
                    Game.creeps[creepName]
                );
            }
        }

        // Call
        for (const creepName in this.creeplist) {
            fn && fn(this.creeplist[creepName]);
        }
    }

    //
    spawnHarvesters() {
        for (const spawn of this.spawns()) {
            const xRoom = new XRoom(spawn.room);

            const harvesters = xRoom
                .creeps()
                .map((creep) => creep.memory.role === ROLES.HARVESTER).length;

            const limit = Object.values(xRoom.memory.sources).reduce(
                (pv, cv) => pv + cv.limit.creep,
                0
            );

            if (harvesters >= limit) {
                continue;
            }

            const xCreep = new XCreep(
                spawn.room,
                ROLES.HARVESTER,
                BODIES.HARVESTER_1
            );

            xCreep.spawn();

            break;
        }
    }

    //
    update() {
        for (const creepName in Memory.creeps) {
            if (!Game.creeps[creepName]) {
                delete Memory.creeps[creepName];
            }
        }

        this.sources((source, room) => {
            const xSource = new XSource(source);

            room.memory.sources = room.memory.sources || {};

            room.memory.sources[source.id] = room.memory.sources[source.id] || {
                limit: { creep: null },
            };

            room.memory.sources[source.id].limit.creep = xSource.creepLimit();
        });
    }
}

module.exports = XGame;
