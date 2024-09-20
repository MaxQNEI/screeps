const { ROLES } = require("./const");
const { dump } = require("./lib.dump");
const XCreepJobs = require("./XCreepJobs");
const XRoom = require("./XRoom");
const XSource = require("./XSource");

class XCreep extends XCreepJobs {
    creep = null;
    room = null;
    body = null;
    role = null;

    constructor(room, role, body) {
        super();

        this.room = room;
        this.role = role;
        this.body = body;

        return this;
    }

    use(creep) {
        this.creep = creep;

        this.room = this.creep.room;
        this.role = this.creep.memory.role;
        this.body = this.creep.body.map(({ type }) => type);

        return this;
    }

    useByName(name) {
        if (!Game.creeps[name]) {
            return null;
        }

        this.use(Game.creeps[name]);

        return this;
    }

    spawn() {
        const spawn = this.getAvailableSpawn();

        if (!spawn) {
            return;
        }

        this.room.memory.iterators = this.room.memory.iterators || {};
        const i = this.room.memory.iterators;
        i[this.role] = i[this.role] || 0;
        i[this.role]++;

        // "Harvester1"
        const name = `${this.role}${i[this.role]}`;

        const result = spawn.spawnCreep(this.body, name, {
            memory: {
                //
                born: Date.now(),
                role: this.role,
                job: null,
            },
        });

        return result;
    }

    getAvailableSpawn() {
        const name = `SpawnTest-${Date.now().toString(36)}`;
        const opts = { dryRun: true };

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

    work() {
        this.findJobByRole();
        this.doJob();

        return this;
    }

    distance(point1, point2) {
        return (
            Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
        );
    }

    harvest(to) {
        console.log(`${this.creep.name}: harvest()`);

        if (this.creep.harvest(to) === ERR_NOT_IN_RANGE) {
            this.move(to);
        }
    }

    build(to) {
        console.log(`${this.creep.name}: build()`);

        if (this.creep.build(to) === ERR_NOT_IN_RANGE) {
            this.move(to);
        }
    }

    upgradeController(to) {
        console.log(`${this.creep.name}: upgradeController()`);

        if (this.creep.upgradeController(to) === ERR_NOT_IN_RANGE) {
            this.move(to);
        }
    }

    move(to) {
        if (!to) {
            console.log(`${this.creep.name}: [ERROR] move() "to":`, to);
            return false;
        }

        const moveCoords = `${to.pos.x}x${to.pos.y}`;
        if (this.creep.memory.moveCoords !== moveCoords) {
            this.creep.memory.path = this.creep.pos.findPathTo(to);
            this.creep.memory.moveCoords = moveCoords;
        }

        if (this.creep.memory.path) {
            this.creep.moveByPath(this.creep.memory.path);
        }
    }

    setJob(job) {
        this.creep.memory.job = job;
    }

    getJob(job) {
        return this.creep.memory.job;
    }

    isJob(job) {
        return this.creep.memory.job === job;
    }

    say(msg, pub = true) {
        this.creep.say(msg, pub);
    }
}

module.exports = XCreep;
