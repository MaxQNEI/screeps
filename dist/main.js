(() => {
  // src/lib/creep/Creep.fn.js
  function Creep(options = { name: "Bunny", room: Room, body: [] }) {
    if (!Game.creeps[unit.name]) {
      return spawn();
    }
    return {
      work: () => {
      }
    };
    function spawn() {
    }
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
