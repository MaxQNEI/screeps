import CreepJob from "./CreepJob";

export default class Creep extends CreepJob {
  constructor(options = this.options) {
    super();

    this.setOptions(options);
  }

  live() {
    if (!this.spawn()) {
      return;
    }

    if (!this.job()) {
      return;
    }
  }
}
