const XRoom = require("./XRoom");

class XCreep {
    creep = null;
    room = null;
    body = null;
    role = null;

    setRoom(room) {
        this.room = room;

        return this;
    }

    setRole(role) {
        this.role = role;

        return this;
    }

    setBody(body) {
        this.body = body;

        return this;
    }

    spawn() {
        const spawn = this.getPossibleSpawn();

        if (!spawn) {
            return;
        }

        this.room.memory.iterators = this.room.memory.iterators || {};
        const i = this.room.memory.iterators;
        i[this.role] = i[this.role] || 0;
        i[this.role]++;

        // "Harvester1"
        const name = `${this.role}${i[this.role]}`;

        return spawn.spawnCreep(this.body, name, {
            memory: { role: this.role, bord: Date.now() },
        });
    }

    getPossibleSpawn() {
        const name = `SpawnTest-${Date.now().toString(36)}`;
        const opts = { memory: { role: this.role }, dryRun: true };

        const xRoom = new XRoom(this.room);

        let spawn = null;
        for (const _spawn of xRoom.spawns()) {
            if (_spawn.spawnCreep(this.body, name, opts) === OK) {
                spawn = _spawn;
                break;
            }
        }

        return spawn;
    }
}

module.exports = XCreep;
