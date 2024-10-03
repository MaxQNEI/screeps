import Props from "./Props";

export default class CreepMessage extends Props {
  says = [];

  log(...msg) {
    const TTL = "";
    // this.creep?.ticksToLive >= 0 ? `/<span style="color: deepslate;">${this.creep?.ticksToLive}</span>` : "";
    // this.creep?.ticksToLive >= 0 ? ` (TTL:${this.creep?.ticksToLive})` : "";
    // this.creep?.ticksToLive >= 0 ? ` (❤️${((this.creep?.ticksToLive / 1500) * 100).toFixed(2)}%)` : "";

    const I = [];

    I.push(
      [
        //
        `❤️${((this.creep?.ticksToLive / 1500) * 100).toFixed(2)}%`,
        `⚡${((this.creep.store.getUsedCapacity(RESOURCE_ENERGY) / this.creep.store.getCapacity(RESOURCE_ENERGY)) * 100).toFixed(2)}%`,
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

  say(msg) {
    !this.says.includes(msg) && this.says.push(msg);
  }
}
