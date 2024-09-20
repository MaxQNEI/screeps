console.log("Load at", new Date().toString());

const XGame = require("./XGame");

const xGame = new XGame();
xGame.update();

module.exports.loop = function loop() {
    xGame.spawnHarvesters();
};
