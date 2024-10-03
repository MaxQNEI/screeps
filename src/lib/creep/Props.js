export const PropCreepParameters = {
  name: "Bunny",
  room: Room,

  body: {},
  job: "",
  jobs: [],
};

export const PropCreepMemory = {
  body: {},
  job: "",
  jobGroupIndex: 0,
  jobs: [],
};

export const PropCreepCreep = {
  name: "Bunny",
  memory: PropCreepMemory,
  build: (target) => {},
  harvest: (target, resourceType) => {},
  moveTo: (target) => {},
  pickup: (target, resourceType) => {},
  transfer: (target, resourceType, amount) => {},
  upgrade: (target) => {},
};

export default class Props {
  parameters = PropCreepParameters;
  creep = PropCreepCreep;
  memory = PropCreepMemory;
  orders = [];

  setParameters(parameters) {
    this.parameters = parameters;
    this.setCreep(Game.creeps[this.parameters.name]);
    return this;
  }

  setCreep(creep) {
    this.creep = creep;
    this.memory = this.creep?.memory;
    return this;
  }
}
