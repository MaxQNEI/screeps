console.log("Load at", new Date().toString());

const XRooms = require("./Rooms");
const XSource = require("./Source");

const _rooms = new XRooms();
_rooms.sources(function (source, room) {
    const _source = new XSource(source);

    room.memory.sources = room.memory.sources || {};
    room.memory.sources[source.id] = {
        limit: {
            creep: _source.creepLimit(),
        },
    };
});

module.exports.loop = function loop() {};
