export function asc(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

export function desc(a, b) {
  return a === b ? 0 : a > b ? -1 : 1;
}

export function sequence(array = [], sequence = [], value = (item) => item) {
  const end = [];

  return [
    ...array
      .filter((v) => {
        if (sequence.indexOf(value(v)) === -1) {
          end.push(v);
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const ai = sequence.indexOf(value(a));
        const bi = sequence.indexOf(value(b));

        return ai === -1 ? 1 : ai > bi ? 1 : -1;
      }),

    ...end,
  ];
}
