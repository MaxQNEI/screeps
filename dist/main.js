(() => {
  // src/index.js
  var CASES = {
    HARVEST_TO_SPAWN: "harvest to spawn",
    HARVEST_TO_BUILD: "harvest to build",
    BUILD_THE_NEAREST: "build the nearest"
  };
  function Friend(cases = [HARVEST_TO_SPAWN]) {
  }
  module.exports.loop = function loop() {
    Friend([
      CASES.HARVEST_TO_SPAWN,
      CASES.HARVEST_TO_BUILD,
      CASES.BUILD_THE_NEAREST
    ]);
  }
})();
