export default function Garbage() {
  if (Game.time % CREEP_LIFE_TIME === 0) {
    let remove = 0;
    for (const name in Memory.creeps) {
      if (Game.creeps[name] == null) {
        delete Memory.creeps[name];
        remove++;
      }
    }

    if (remove > 0) {
      Game.notify(`Removed Memory.creeps: ${remove}`);
    }
  }
}
