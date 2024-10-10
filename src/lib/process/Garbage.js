export default function Garbage() {
  const before = JSON.stringify(Memory).length / 1024;

  if (Game.time % CREEP_LIFE_TIME === 0) {
    Memory.log.push(["Garbage() Memory size before:", `${before.toFixed(2)}KB`]);

    let remove = 0;
    for (const name in Memory.creeps) {
      if (Game.creeps[name] == null) {
        delete Memory.creeps[name];
        remove++;
      }
    }

    if (remove > 0) {
      const after = JSON.stringify(Memory).length / 1024;
      Memory.log.push(["", `-${(before - after).toFixed(2)}KB`], []);
      Game.notify(`Removed Memory.creeps: ${remove} (-${(before - after).toFixed(2)}KB)`);
    } else {
      Memory.log.push([]);
    }
  } else {
    Memory.log.push(
      [
        "Garbage() Memory size:",
        `${before.toFixed(2)}KB`,
        `Memory.creeps cleanup will be through ${CREEP_LIFE_TIME - (Game.time % CREEP_LIFE_TIME)} ticks`,
      ],
      [],
    );
  }
}
