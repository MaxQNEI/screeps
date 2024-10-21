const Config = {
  Room: {
    Creeps: {
      ForceSpawnIfCreepsLessThan: 3,
      MaximumSpawningTicksBetweenSpawns: 1500,
      AutoRespawnByRemainingTicks: 50,

      CountByRole: {
        RoleWorker: 4,
        RoleBuilder: 6,
        RoleManager: 2,
        RoleTower: 2,
      },
    },

    Roads: {
      RateToBuild: 100,
      RateUpByCreep: 1,
      RateDownByTick: 0.05,
    },

    Towers: {
      MinRequiredEnergy: 500,
      MinEnergyRepair: 500,
    },
  },
};

export default Config;
