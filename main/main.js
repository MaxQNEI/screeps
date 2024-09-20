console.log("Load at", new Date().toString());

const Rooms = require("./Rooms");
const Source = require("./Source");

const rooms = new Rooms();
rooms.sources(function (source, room) {
    const _source = new Source(source);

    room.memory.sources = room.memory.sources || {};
    room.memory.sources[source.id] = {
        limit: {
            creep: _source.creepLimit(),
        },
    };
});

module.exports.loop = function loop() {};
