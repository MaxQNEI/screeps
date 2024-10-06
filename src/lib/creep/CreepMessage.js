import { asc } from "../../../lib/sort.js";
import Props from "./Props.js";

export default class CreepMessage extends Props {
  static BODY_TO_EMOJI = {
    [WORK]: "🙌",
    [CARRY]: "🎒",
    [MOVE]: "🦿",
  };

  log(...msg) {
    if (!Memory.MemoryLogShow) {
      return;
    }

    const TTL = "";

    const I = [];

    I.push(
      [
        //
        `⏱️${((this.creep?.ticksToLive / CREEP_LIFE_TIME) * 100).toFixed(2)}%`.padEnd(8, " "),

        `⚡${((this.creep.store.getUsedCapacity(RESOURCE_ENERGY) / this.creep.store.getCapacity(RESOURCE_ENERGY)) * 100).toFixed(2)}%`.padEnd(
          8,
          " ",
        ),

        [
          this.creep.body
            .map(({ type }) => type)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((name) => {
              const count = this.creep.body.filter(({ type: _name }) => _name === name).length;

              return `${CreepMessage.BODY_TO_EMOJI[name]}${`x${count}`}`;
            })
            .join(" "),

          `💰${this.creep.body.reduce((pv, { type }) => pv + BODYPART_COST[type], 0)}`,
        ].join(" = "),
      ].join(" | "),
    );

    let first = false;
    for (const m of msg) {
      if (!first) {
        let statuses = null;

        if (this.memory?.statuses?.length > 0) {
          this.memory.statuses = this.memory.statuses.filter(({ stopShow }) => stopShow > Game.time);
          statuses = this.memory.statuses.map(({ emoji }) => emoji).join("");
        }

        if (Memory.StatusesShow && Game.time % 2 === 0) {
          this.creep.say(statuses);
        }

        const out = [
          //
          `[${this.creep.room.name}] ${this.creep.name || this.parameters.name}${TTL}`,
          m,
          ...I,
          // statuses,
        ];

        Memory.log.push(out);

        first = true;
      } else {
        Memory.log.push(["", m]);
      }

      first = true;
    }
  }

  status(emoji, stopShow = 6) {
    this.memory.statuses = (this.memory.statuses ?? []).filter(({ emoji }) => emoji !== emoji);
    this.memory.statuses.push({ emoji, stopShow: Game.time + stopShow });
    this.memory.statuses = this.memory.statuses.sort(({ stopShow: a }, { stopShow: b }) => asc(a, b));
  }
}
