const { randOf } = require("rand");

module.exports = function Upgrader(name) {
    const FN_QUEUE = [
        //
        _transferToSpawnIfSpawnLower200,
        _buildNearConstructionSite,
        _updateControllerWhenFullCapacity,
        _harvestWhenFreeCapacity,
    ];

    let creep = Game.creeps[name];

    function _forceHarvestLocker() {
        return !!creep.memory.forceHarvest;
    }

    function _isFullEnergy() {
        return creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
    }

    function _isHaveEnergy() {
        return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    }

    function _harvestWhenFreeCapacity() {
        if (_isFullEnergy()) {
            creep.memory.forceHarvest = false;
            return false;
        }

        creep.memory.forceHarvest = true;

        const sourceId =
            creep.memory.sourceId || randOf(creep.room.find(FIND_SOURCES)).id;

        creep.memory.sourceId = sourceId;

        const to = Game.getObjectById(creep.memory.sourceId);

        if (creep.harvest(to) === ERR_NOT_IN_RANGE) {
            creep.moveTo(to);
            // _movePath(to);
            _say("Move");
        } else {
            _say("Harvest");
        }

        return true;
    }

    function _transferToSpawnIfSpawnLower200() {
        if (!_isHaveEnergy() || _forceHarvestLocker()) {
            return false;
        }

        const to = Game.spawns["Spawn1"];

        if (to.store.getUsedCapacity(RESOURCE_ENERGY) >= 200) {
            return false;
        }

        if (creep.transfer(to, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(to);
            // _movePath(to);
            _say("Move");
        } else {
            _say("Transfer");
        }

        return true;
    }

    function _buildNearConstructionSite() {
        if (!_isHaveEnergy() || _forceHarvestLocker()) {
            return false;
        }

        const constructionSites = Game.rooms.sim.find(FIND_CONSTRUCTION_SITES);
        const to = constructionSites[0];

        if (creep.build(to) === ERR_NOT_IN_RANGE) {
            creep.moveTo(to);
            // _movePath(to);
            _say("Move");
        } else {
            _say("Harvest");
        }

        return true;
    }

    function _updateControllerWhenFullCapacity() {
        if (!_isHaveEnergy() || _forceHarvestLocker()) {
            return false;
        }

        const to = creep.room.controller;

        if (creep.upgradeController(to) === ERR_NOT_IN_RANGE) {
            creep.moveTo(to);
            // _movePath(to);
            _say("Move");
        } else {
            _say("UpgradeController");
        }

        return true;
    }

    function _movePath(to) {
        const path = Game.rooms.sim.findPath(creep, to);
        creep.moveByPath(path);
    }

    function _say(msg) {
        return;
        creep.say(msg, true);
    }

    return {
        work: function work() {
            _say("Work");

            if (!creep) {
                console.log(`Upgrader: "${name}" is`, creep);
                return false;
            }

            for (const fn of FN_QUEUE) {
                if (fn()) {
                    return true;
                }
            }

            _say("End");
            return null;
        },
    };
};
