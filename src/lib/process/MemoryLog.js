import table from "../../../lib/table.js";

let Time = null;

export default function MemoryLog() {
  Memory.MemoryLogShow = Memory.MemoryLogShow ?? true;

  // First start
  if (Time === null) {
    // First clear
    Time = Game.time;
    Memory.log = [];
  } else {
    // Second - write out/clear

    Time = null;

    if (Memory.MemoryLogShow && Memory.log.length > 0) {
      const _table = [["Memory.log[]"]];

      for (const msg of Memory.log) {
        _table.push([...msg]);
      }

      table(_table);
    }

    Memory.log = [];
  }
}
