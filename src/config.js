const Config = {
  Room: {
    Creeps: {
      ForceSpawnIfCreepsLessThan: 3,
      MaximumSpawningTicksBetweenSpawns: 1500,
      AutoRespawnByTicksRemainingPercent: 0.1,

      CountByRole: {
        RoleWorker: 4,
        RoleBuilder: 2,
        RoleManager: 2,
        RoleTower: 2,
      },
    },

    Roads: {
      RateToBuild: 100,
      RateUpByCreep: 1,
      RateDownByTick: 0.0005,
    },
  },
};

export default Config;
