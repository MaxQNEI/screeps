class XRoom {
    room = null;
    memory = null;

    constructor(room) {
        this.room = room;
        this.memory = this.room.memory;
    }

    spawns(fn) {
        const spawnslist = [];

        for (const spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName];
            if (spawn.room === this.room) {
                fn && fn(spawn);
                spawnslist.push(spawn);
            }
        }

        return spawnslist;
    }

    sources(fn) {
        for (const sourceId in this.room.memory.sources) {
            fn(Game.getObjectById(sourceId));
        }
    }

    listCreep() {
        return Object.values(Game.creeps).filter(
            ({ room }) => room === this.room
        );
    }
}

module.exports = XRoom;
