const util = require('./Util.js');

const neighboursTransform = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function IsComputed(aComputed, aX, aY) {
  for (let i = 0; i < aComputed.length; i++)
    if (aComputed[i].x == aX && aComputed[i].y == aY)
      return true;
  return false;
}

function ComputeBasinSize(aMap, aX, aY) {
  let basinsDepths = [aMap[aY][aX]];

  let computed = [];
  let queue = [{ x: aX, y: aY }];
  while (queue.length > 0) {
    let pt = queue.shift();

    for (let k = 0; k < neighboursTransform.length; k++) {
      let x = pt.x + neighboursTransform[k][0];
      let y = pt.y + neighboursTransform[k][1];

      if (x >= 0 && x < aMap[aY].length && y >= 0 && y < aMap.length) {
        if (IsComputed(computed, x, y) || (aMap[y][x] == 9))
          continue;

        if (!IsComputed(queue, x, y)) {
          queue.push({ x: x, y: y });
          basinsDepths.push(aMap[y][x]);
        }
      }
    }

    computed.push(pt);
  }

  return basinsDepths.length;
}

function Analize(aMap) {
  let total = 0;
  let basinSizes = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let isMin = true;
      for (let k = 0; k < neighboursTransform.length; k++) {
        let x = j + neighboursTransform[k][0];
        let y = i + neighboursTransform[k][1];

        if (x >= 0 && x < aMap[i].length && y >= 0 && y < aMap.length) {
          let nn = aMap[y][x];

          if (nn <= aMap[i][j]) {
            isMin = false;
            break;
          }
        }
      }

      if (isMin) {
        total += aMap[i][j] + 1;
        basinSizes.push(ComputeBasinSize(aMap, j, i));
      }
    }

  basinSizes.sort((a, b) => { return b - a; });
  return { part1: total, part2: basinSizes[0] * basinSizes[1] * basinSizes[2] };
}

let map = util.MapInput('./Day9Input.txt', (aElem) => {
  return aElem.split('').map(a => parseInt(a));
}, '\r\n');

let ret = Analize(map);

console.log(ret.part1);
console.log(ret.part2);
