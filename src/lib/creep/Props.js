const options = {
  name: "Bunny",
  room: Room,

  body: {},
  job: "",
  jobs: [],
};

const memory = {
  body: {},
  job: "",
  jobs: [],
};

const creep = {
  name: "Bunny",
  memory: memory,
  build: (target) => {},
  harvest: (target, resourceType) => {},
  moveTo: (target) => {},
  pickup: (target, resourceType) => {},
  transfer: (target, resourceType, amount) => {},
  upgrade: (target) => {},
};

export default class Props {
  options = options;
  creep = creep;
  memory = memory;
  orders = [];

  setOptions(options) {
    this.options = options;
    this.setCreep();
  }

  setCreep(creep = Game.creeps[this.options.name]) {
    this.creep = creep;
    this.memory = this.creep?.memory;
  }
}
