console.log("".padStart(40, "="));

import Creep from "./lib/creep/Creep";

export default function loop() {
    // Every room
    for (const nameRoom in Game.rooms) {
        // create universal unit
        new Creep({
            name: "Universal",
            room: Game.rooms[nameRoom],
            body: [WORK, CARRY, MOVE],
        }).live();
    }
}
