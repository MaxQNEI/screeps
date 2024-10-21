import CreepJob from "./CreepJob.js";
import CreepSpawn from "./CreepSpawn.js";

export default class CreepMove extends CreepSpawn {
  static DIRECTION_TO_TEXT = {
    [TOP]: "TOP",
    [TOP_RIGHT]: "TOP_RIGHT",
    [RIGHT]: "RIGHT",
    [BOTTOM_RIGHT]: "BOTTOM_RIGHT",
    [BOTTOM]: "BOTTOM",
    [BOTTOM_LEFT]: "BOTTOM_LEFT",
    [LEFT]: "LEFT",
    [TOP_LEFT]: "TOP_LEFT",
  };

  move(target, next = true) {
    let direction;

    if (Memory.ResetPath) {
      delete this.memory.myPath;
    }

    if (!this.memory.myPath || this.memory.myPath?.targetId !== target.id) {
      const path = this.creep.pos.findPathTo(target, { ignoreCreeps: false, plainCost: 2, swampCost: 10 });
      this.memory.myPath = { path, targetId: target.id };
    }

    if (this.memory.myPath?.path?.length > 0) {
      const { x: sX, y: sY } = this.memory.myPath.path[0];
      // const { x: eX, y: eY } = this.memory.myPath.path[this.memory.myPath.path.length - 1];

      if (sX === this.creep.pos.x && sY === this.creep.pos.y) {
        this.memory.myPath.path = this.memory.myPath.path.slice(1);
        // this.creep.say(`${this.memory.myPath.path.length}`);
      }

      if (this.memory.myPath.path.length > 0) {
        direction = this.memory.myPath.path[0].direction;
      }
    }

    if (direction) {
      const result = this.creep.move(direction);

      return result;
    } else {
      delete this.memory.myPath;

      if (next) {
        this.move(target, false);
        this.creep.say("🚙❓");
      } else {
        this.creep.say("🚙😠");
      }
    }
  }

  moveSimple(target) {
    this.creep.moveTo(target, {
      visualizePathStyle: {
        fill: "transparent",
        stroke: "yellowgreen",
        lineStyle: "dashed",
        strokeWidth: 0.05,
        opacity: 1,
      },
    });

    this.status("🚙");
  }
}
