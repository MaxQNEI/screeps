console.log("Load at", new Date().toString());

const XCreep = require("./XCreep");
const XGame = require("./XGame");

const xGame = new XGame();
xGame.update();

module.exports.loop = function loop() {
    xGame.spawnHarvesters();

    const xCreep = new XCreep();
    xCreep.useByName("Harvester1");
    console.log(xCreep.role);
};
