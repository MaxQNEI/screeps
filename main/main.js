console.log("Load at", new Date().toString());

const XRooms = require("./Rooms");

const _rooms = new XRooms();
_rooms.update();

module.exports.loop = function loop() {};
