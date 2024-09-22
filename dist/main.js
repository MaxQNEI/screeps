(() => {
  // src/lib/creep/Creep.fn.js
  function Creep(creep) {
    return {};
  }

  // src/index.js
  module.exports.loop = function loop() {
    for (const nameRoom in Game.rooms) {
      Creep({
        name: "Universal",
        room: Game.rooms[nameRoom],
        body: [WORK, CARRY, MOVE]
      });
    }
  }
})();
