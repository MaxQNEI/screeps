import Props from "./Props";

export default class CreepMessage extends Props {
  log(...msg) {
    const TTL = this.creep?.ticksToLive >= 0 ? `/${this.creep?.ticksToLive}` : "";
    Memory.log.push([`[${this.creep?.name || this.options.name}${TTL}]`, ...msg].join(" "));
  }
}
