console.log("Load at", new Date().toString());

const XGame = require("./XGame");

const xGame = new XGame();

module.exports.loop = function loop() {
    xGame.update();
    xGame.spawnHarvesters();
    xGame.creeps((creep) => creep.work().move());
};
