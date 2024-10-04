import { asc } from "../../../lib/sort.js";
import Props from "./Props.js";

export default class CreepMessage extends Props {
  static BODY_TO_EMOJI = {
    [WORK]: "🙌",
    [CARRY]: "🎒",
    [MOVE]: "🦿",
  };

  log(...msg) {
    const TTL = "";
    // this.creep?.ticksToLive >= 0 ? `/<span style="color: deepslate;">${this.creep?.ticksToLive}</span>` : "";
    // this.creep?.ticksToLive >= 0 ? ` (TTL:${this.creep?.ticksToLive})` : "";
    // this.creep?.ticksToLive >= 0 ? ` (❤️${((this.creep?.ticksToLive / 1500) * 100).toFixed(2)}%)` : "";

    const I = [];

    I.push(
      [
        //
        // `❤️${((this.creep?.ticksToLive / 1500) * 100).toFixed(2)}%`.padEnd(8, " "),
        `⏱️${((this.creep?.ticksToLive / 1500) * 100).toFixed(2)}%`.padEnd(8, " "),

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

    Memory.log.push([
      //
      // `<span style="color: yellowgreen; font-style: italic;">${this.creep?.name || this.parameters.name}</span>${TTL}`,
      `[${this.creep.room.name}] ${this.creep.name || this.parameters.name}${TTL}`,
      ...msg,
      ...I,
    ]);
  }

  status(emoji) {
    this.memory.statuses = (this.memory.statuses ?? []).filter(({ e }) => e !== emoji);
    this.memory.statuses.push({ e: emoji, t: Game.time });
    this.memory.statuses = this.memory.statuses.sort(({ t: a }, { t: b }) => asc(a, b));
  }
}
