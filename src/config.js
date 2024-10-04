import * as Constants from "../lib/Constants.js";
const { CREEP_LIFE_TIME } = Constants;

const Config = {
  Room: {
    Creeps: {
      AutoRespawnByTicksRemainingPercent: CREEP_LIFE_TIME / 0.1,

      CountByRole: {
        RoleWorker: 3,
        RoleBuilder: 5,
        RoleManager: 3,
      },
    },

    Roads: {
      RateToBuild: 100,
      RateUpByCreep: 1,
      RateDownByTick: 0.005,
    },
  },
};

export default Config;
