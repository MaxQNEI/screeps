Date.prototype.diff = function diff(to) {
  return to instanceof Date ? to - this : new Date(to) - this;
};
