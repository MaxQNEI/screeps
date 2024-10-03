import { asc, desc } from "../../../lib/sort";

export default function CalcCreepBody(energy = 300, ratios = { [WORK]: 1, [CARRY]: 0.5, [MOVE]: 0.1 }) {
  const names = Object.keys(ratios);

  let result = [];

  let _energy = energy;

  // ------------------------------------------------------------------------ //

  for (const name of names) {
    result.push(name);
    _energy -= BODYPART_COST[name];
  }

  if (_energy < 0) {
    return false;
  }

  {
    let _available = [];
    let _ratios = {};
    let _places = MAX_CREEP_SIZE;

    while (true) {
      _energy = energy - result.reduce((pv, cv) => pv + BODYPART_COST[cv], 0);
      _available = names.filter((name) => BODYPART_COST[name] <= _energy);
      _places = MAX_CREEP_SIZE - result.length;
      _ratios = {};

      if (_places === 0) {
        // When out of places
        break;
      } else if (_available.length === 0) {
        // When not available by energy
        break;
      } else if (_places < 0) {
        // Remove by lower ratio
        while (_places < 0) {
          const _toRemove = names
            .map((name) => ({
              name,
              count: result.filter((_name) => _name === name).length,
              ratio: ratios[name],
            }))
            .filter(({ count }) => count > 1)
            .sort(({ ratio: a }, { ratio: b }) => asc(a, b))[0].name;

          const _toRemoveIndex = result.indexOf(_toRemove);
          result = result.filter((name, index, array) => index !== _toRemoveIndex);

          _places = MAX_CREEP_SIZE - result.length;
        }

        break;
      }

      // Assign rations by available of energy
      for (const _name of _available) {
        _ratios[_name] = ratios[_name];
      }

      // Calc
      const add = {};
      for (const name of _available) {
        add[name] = Math.min(
          1,
          Math.floor(
            ((_energy / BODYPART_COST[name]) *
              (_available //
                .filter((_name) => _name !== name)
                .reduce((pv, _name) => pv + _ratios[_name], 0) *
                1000 *
                _ratios[name])) /
              1000,
          ),
        );
      }

      if (Object.values(add).filter((v) => v > 0).length === 0) {
        // When every is 0 add with higher ratio
        const higherRatio = Object.entries(add).sort(([_1, a], [_2, b]) => desc(a, b))[0];
        const [name, _] = higherRatio;
        result.push(name);
      } else {
        // Add
        for (const name in add) {
          add[name] > 0 && result.push(...new Array(add[name]).fill(name));
        }
      }
    }
  }

  // ------------------------------------------------------------------------ //

  return result.sort(asc);
}
