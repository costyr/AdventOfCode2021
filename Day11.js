const util = require('./Util.js');

function IsComputed(aComputed, aX, aY) {
  for (let i = 0; i < aComputed.length; i++)
    if (aComputed[i].x == aX && aComputed[i].y == aY)
      return true;
  return false;
}

function PrintOctopus(aOctopuses) {
  for (let i = 0; i < aOctopuses.length; i++) {
    let line = '';
    for (let j = 0; j < aOctopuses[i].length; j++) {
      if (aOctopuses[i][j] == 0)
        line += ' ';
      else
        line += aOctopuses[i][j];
    }
    console.log(line);
  }
}

const neighboursTransform = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function FlashOctopus(aOctopuses, aX, aY, flashed) {

  let queue = [{ x: aX, y: aY }];
  let total = 0;
  while (queue.length > 0) {
    let pt = queue.shift();

    for (let i = 0; i < neighboursTransform.length; i++) {
      let x = pt.x + neighboursTransform[i][0];
      let y = pt.y + neighboursTransform[i][1];

      if (x >= 0 && x < aOctopuses[aY].length && y >= 0 && y < aOctopuses.length) {

        if (IsComputed(flashed, x, y))
          continue;

        aOctopuses[y][x] += 1;

        if (aOctopuses[y][x] > 9) {
          queue.push({ x: x, y: y });
          aOctopuses[y][x] = 0;
          total++;
          flashed.push({ x: x, y: y });
        }
      }
    }
  }
  return total;
}

function CountFlashes(aOctopuses) {
  let total = 0;
  let flashed = [];
  for (let i = 0; i < aOctopuses.length; i++)
    for (let j = 0; j < aOctopuses[i].length; j++) {
      if (IsComputed(flashed, j, i))
        continue;

      aOctopuses[i][j]++;
      if (aOctopuses[i][j] > 9) {
        aOctopuses[i][j] = 0;
        flashed.push({ x: j, y: i });
        total += FlashOctopus(aOctopuses, j, i, flashed);
        total += 1;
      }
    }

  return total;
}

function Analize(aOctopuses, aStepsCount) {
  let total = 0;
  let firstTotalFlash = -1;
  for (let i = 0; i < aStepsCount; i++) {
    let gg = CountFlashes(aOctopuses);

    if (i < 100)
      total += gg;

    if ((firstTotalFlash == -1) && (gg == aOctopuses.length * aOctopuses.length))
      firstTotalFlash = i + 1;
  }
  return { part1: total, part2: firstTotalFlash };
}

let octopuses = util.MapInput('./Day11Input.txt', (aElem) => {
  return aElem.split('').map(a => { return parseInt(a); });
}, '\r\n');

let ret = Analize(octopuses, 1000);

console.log(ret.part1);
console.log(ret.part2);
