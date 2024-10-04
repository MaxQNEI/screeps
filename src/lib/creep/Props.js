export const PropCreepParameters = {
  name: "Bunny",
  room: Room, // Screeps Room

  bodyRatios: {},
};

export const PropCreepMemory = {
  bodyRatios: {},
  job: "",
  jobGroupIndex: 0,
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
