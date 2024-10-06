Array.prototype.flat =
  Array.prototype.flat ??
  function flat(depth = Infinity) {
    const flat = [];

    (function recursion(array, d = 0) {
      if (d >= depth) {
        return;
      }

      for (const item of array) {
        if (Array.isArray(item)) {
          recursion(item, d + 1);
        } else {
          flat.push(item);
        }
      }
    })(this);

    return flat;
  };
