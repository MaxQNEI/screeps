const LIMITS = {
    Harvester: 2,
    Upgrader: 2,
};

const CREEP_BODY = {
    WORK,
    MOVE,
    CARRY,
    ATTACK,
    RANGED_ATTACK,
    HEAL,
    TOUGH,
    CLAIM,
};

const CREEP_ROLES = {
    Harvester: [
        //
        CREEP_BODY.WORK,
        CREEP_BODY.CARRY,
        CREEP_BODY.MOVE,
    ],

    Upgrader: [
        //
        CREEP_BODY.WORK,
        CREEP_BODY.CARRY,
        CREEP_BODY.MOVE,
    ],
};

module.exports = {
    LIMITS,
    CREEP_BODY,
    CREEP_ROLES,
};
