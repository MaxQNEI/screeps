const XSource = require("./Source");

class XRooms {
    every(fn) {
        for (const roomName in Game.rooms) {
            fn(Game.rooms[roomName]);
        }
    }

    sources(fn) {
        this.every((room) => {
            for (const source of room.find(FIND_SOURCES)) {
                fn(source, room);
            }
        });
    }

    update() {
        this.sources(function (source, room) {
            const _source = new XSource(source);

            room.memory.sources = room.memory.sources || {};
            room.memory.sources[source.id] = {
                limit: {
                    creep: _source.creepLimit(),
                },
            };
        });
    }
}

module.exports = XRooms;
