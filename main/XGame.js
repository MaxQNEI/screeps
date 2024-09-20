const { ROLES, BODIES } = require("./const");
const XCreep = require("./XCreep");
const XRoom = require("./XRoom");
const XSource = require("./XSource");

class XGame {
    // For-each
    rooms(fn) {
        for (const roomName in Game.rooms) {
            fn(Game.rooms[roomName]);
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
                fn(source, room);
            }
        });
    }

    //
    spawnHarvesters() {
        for (const spawn of this.spawns()) {
            const xRoom = new XRoom(spawn.room);

            const harvesters = xRoom
                .listCreep()
                .map((creep) => creep.memory.role === ROLES.HARVESTER).length;

            const limit = Object.values(xRoom.memory.sources).reduce(
                (pv, cv) => pv + cv.limit.creep,
                0
            );

            if (harvesters < limit) {
                // spawn
                const xCreep = new XCreep();

                xCreep
                    .setRoom(spawn.room)
                    .setRole(ROLES.HARVESTER)
                    .setBody(BODIES.HARVESTER_1)
                    .spawn();

                break;
            }
        }
    }

    //
    update() {
        this.sources(function (source, room) {
            const xSource = new XSource(source);

            room.memory.sources = room.memory.sources || {};
            room.memory.sources[source.id] = {
                limit: {
                    creep: xSource.creepLimit(),
                },
            };
        });
    }
}

module.exports = XGame;
