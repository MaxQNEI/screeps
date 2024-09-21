Date.prototype.diff = function diff(to) {
    const diff = to instanceof Date ? to - this : new Date(to) - this;

    return `${diff}ms`;
};
