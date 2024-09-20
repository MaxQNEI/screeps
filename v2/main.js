console.log("Load at", new Date().toString());

const XGame = require("./XGame");

const xGame = new XGame();

module.exports.loop = function loop() {
    console.log(`---- TICK ----`.padEnd(80, "-"));
    xGame.update();
    xGame.spawnHarvesters();
    xGame.creeps((creep) => creep.work());
};
