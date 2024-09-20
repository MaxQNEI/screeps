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

    constructions(fn) {
        const constructionlist = [];

        for (const constructionName in Game.constructionSites) {
            const construction = Game.constructionSites[constructionName];
            if (construction.room === this.room) {
                fn && fn(construction);
                constructionlist.push(construction);
            }
        }

        return constructionlist;
    }

    creeps(fn) {
        const creeplist = [];

        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName];
            if (creep.room === this.room) {
                fn && fn(creep);
                creeplist.push(creep);
            }
        }

        return creeplist;
    }
}

module.exports = XRoom;
