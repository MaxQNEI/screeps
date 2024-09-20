class Rooms {
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
}

module.exports = Rooms;
