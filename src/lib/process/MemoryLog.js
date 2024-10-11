import table from "../../../lib/table.js";

let Time = null;

export default function MemoryLog() {
  Memory.MLS = Memory.MLS ?? false;
  Memory.MLS = Memory.MLS ?? false;

  const show = Memory.MLS || Memory.MLSO;

  if (!show) {
    Memory.log = [];
    return;
  }

  // First start
  if (Time === null) {
    // First clear
    Time = Game.time;
    Memory.log = [];
  } else {
    // Second - write out/clear

    Time = null;

    if (show && Memory.log.length > 0) {
      const _table = [["Memory.log[]"]];

      for (const msg of Memory.log) {
        _table.push([...msg]);
      }

      table(_table);
    }

    Memory.log = [];

    if (Memory.MLSO) {
      Memory.MLSO = false;
      console.log(`Memory.MLSO is done.`);
    }
  }
}
